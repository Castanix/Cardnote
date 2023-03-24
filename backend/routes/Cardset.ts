import { Request, Response, Router } from "express";
import { RowDataPacket } from "mysql2";
import { promisedPool } from "../server";

const cardsetRoute = Router();


cardsetRoute.get("/allSets", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const user = test ? { username: "public" } : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const selectQuery = `SELECT *, num_cards AS numCards FROM card_sets${ suffix } WHERE username = "${ user.username }"`;

		connection.execute(selectQuery)
			.then(result => {


				res.status(200).send(result[0]);
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardsetRoute.get("/oneSetDescription/:setId", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { setId } = req.params;
	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const existsQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ setId })`;

		const exists = await connection.execute(existsQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Set does not exist" });
					return false;
				}

				if (Object.values(data[0])[0].username !== user) {
					res.status(403).send({ error: "You do not have permission" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!exists) return;

		const selectQuery = `SELECT description FROM card_sets${ suffix } WHERE set_id = ${ setId }`;

		connection.execute(selectQuery)
			.then(result => {
				const data = result[0] as RowDataPacket;

				res.status(200).send({ description: data[0].description });
			})
			.catch(err => {
				throw new Error(err);
			});

	} catch (err) {
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardsetRoute.post("/addCardSet", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const user = test ? { username: "public" } : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const insertQuery =
			`INSERT INTO card_sets${ suffix } (name, description, username) ` +
			`VALUES ("Add Name", "Add Description", "${ user.username }")`;
		
		const selectQuery = "SELECT LAST_INSERT_ID() AS inserted_id";

		await connection.execute(insertQuery)
			.then(() => {
				connection.execute(selectQuery)
					.then(result => {
						const data = result[0] as RowDataPacket;
						res.status(201).send({ inserted_id: data[0].inserted_id });
					})
					.catch(err => {
						throw new Error(err);
					});
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardsetRoute.delete("/deleteCardSet", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { set_id } = req.body;

	if (!(set_id)) {
		res.status(400).send({ error: "Data is missing fields" });
		return;
	}

	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const selectQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id })`;

		const exists = await connection.execute(selectQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Set does not exist" });
					return false;
				}

				if (Object.values(data[0])[0].username !== user) {
					res.status(403).send({ error: "You do not have permission" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!exists) return;

		const deleteSubQuery = `DELETE FROM cards${ suffix } WHERE set_id=${ set_id }`;
		const deleteQuery = `DELETE FROM card_sets${ suffix } WHERE set_id=${ set_id }`;

		await connection.execute(deleteSubQuery)
			.then(async () => {
				await connection.execute(deleteQuery)
					.then(() => {
						res.sendStatus(204);
					})
					.catch(err => {
						throw new Error(err);
					});
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardsetRoute.put("/updateCardSet", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { set_id, name, description } = req.body.data;

	if (!(set_id && name && description)) {
		res.status(400).send({ error: "Data is missing fields" });
		return;
	}

	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const selectQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id })`;

		const exists = await connection.execute(selectQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Set does not exist" });
					return false;
				}

				if (Object.values(data[0])[0].username !== user) {
					res.status(403).send({ error: "You do not have permission" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!exists) return;

		const updateQuery = 
			`UPDATE card_sets${ suffix } ` +
			`SET name = "${ name }", description = "${ description }" ` +
			`WHERE set_id = ${ set_id }`;

		await connection.execute(updateQuery)
			.then(() => {
				res.sendStatus(204);
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
	}
});


export default cardsetRoute;