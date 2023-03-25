import { Request, Response, Router } from "express";
import { RowDataPacket } from "mysql2";
import { promisedPool } from "../server";

const cardRoute = Router();

cardRoute.get("/allCards/:set_id", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { set_id } = req.params;
	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		let selectQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id } AND username = "${ user }")`;

		const exists = await connection.execute(selectQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Card set does not exist" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!exists) return;

		selectQuery = 
            `SELECT * FROM cards${ suffix } ` +
            `WHERE set_id = ${set_id}`;

		connection.execute(selectQuery)
			.then(result => {
				res.status(200).send(result[0]);
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.error(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardRoute.post("/addCard", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { set_id, term, definition, numCards } = req.body.data;

	if (!(set_id && term.trim().length > 0 && definition.trim().length > 0 && numCards)) {
		res.status(400).send({ error: "Data is missing fields" });
		return;
	}

	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		let selectQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id } AND username = "${ user }")`;

		const exists = await connection.execute(selectQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Card set does not exist" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!exists) return;

		const insertQuery =
            `INSERT INTO cards${ suffix } (term, definition, set_id) ` +
            `VALUES ("${ (term as string).trim() }", "${ (definition as string).trim() }", ${ set_id }) `;

		const updateQuery = 
            `UPDATE card_sets${ suffix } ` +
            `SET num_cards = ${ numCards } ` +
            `WHERE set_id = ${ set_id }`;
		
		selectQuery = "SELECT LAST_INSERT_ID() AS inserted_id";

		await connection.execute(insertQuery)
			.then(async () => {
				await connection.execute(updateQuery)
					.catch(err => {
						throw new Error(err);
					});

				await connection.execute(selectQuery)
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
		console.error(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardRoute.delete("/deleteCard", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { card_id, set_id, numCards } = req.body;

	if (!(card_id && set_id && typeof(numCards) === "number")) {
		res.status(400).send({ error: "Data is missing fields" });
		return;
	}

	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const selectSetQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id } AND username = "${ user }")`;
		const selectCardQuery = `SELECT EXISTS(SELECT * FROM cards${ suffix } WHERE card_id = ${ card_id })`;

		const setExists = await connection.execute(selectSetQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Card set does not exist" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});
		
		const cardExists = await connection.execute(selectCardQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Card does not exist" });
					return false;
				}
				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!(setExists && cardExists)) return;

		const deleteQuery = `DELETE FROM cards${ suffix } WHERE card_id = ${ card_id }`;

		const updateQuery = 
            `UPDATE card_sets${ suffix } ` +
            `SET num_cards = ${ numCards } ` +
            `WHERE set_id = ${ set_id }`;

		await connection.execute(deleteQuery)
			.then(async () => {
				await connection.execute(updateQuery)
					.then(() => res.sendStatus(204))
					.catch(err => {
						throw new Error(err);
					});
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.error(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

cardRoute.put("/updateCard", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { card_id, term, definition, set_id } = req.body.data;

	if (!(card_id && term && definition && set_id)) {
		res.status(400).send({ error: "Data is missing fields" });
		return;
	}

	const user = test ? "public" : req.body.user;

	const connection = await (await promisedPool).getConnection();

	try {
		const selectSetQuery = `SELECT EXISTS(SELECT * FROM card_sets${ suffix } WHERE set_id = ${ set_id } AND username = "${ user }")`;
		const selectCardQuery = `SELECT EXISTS(SELECT * FROM cards${ suffix } WHERE card_id = ${ card_id })`;

		const setExists = await connection.execute(selectSetQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Set does not exist" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		const cardExists = await connection.execute(selectCardQuery)
			.then(result => {
				const data = result[0] as RowDataPacket[];
				if (Object.values(data[0])[0] <= 0) {
					res.status(404).send({ error: "Card does not exist" });
					return false;
				}

				return true;
			})
			.catch(err => {
				throw new Error(err);
			});

		if (!(setExists && cardExists)) return;

		const updateQuery = 
            `UPDATE cards${ suffix } ` +
            `SET term = "${ (term as string).trim() }", definition = "${ (definition as string).trim() }" ` +
            `WHERE card_id = ${ card_id }`;

		await connection.execute(updateQuery)
			.then(() => {
				res.sendStatus(204);
			})
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.error(err);

		res.status(503);
	} finally {
		connection.release();
	}
});

export default cardRoute;