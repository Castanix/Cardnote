import { Request, Response, Router } from "express";
import { connectMysqlPool } from "../db/dbSetup";
import { RowDataPacket } from "mysql2";

const cardsetRoute = Router();


cardsetRoute.get("/allSets", async (req: Request, res: Response) => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const query = "SELECT *, num_cards AS numCards FROM card_sets";

		connection.execute(query)
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
		pool.end();
	}
});

cardsetRoute.post("/addCardSet", async (req: Request, res: Response) => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const { name, description } = req.body.data;

		const insertQuery =
			"INSERT INTO card_sets (name, description) " +
			`VALUES ("${ name }", "${ description }")`;
		
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
		pool.end();
	}
});

cardsetRoute.delete("/deleteCardSet", async (req: Request, res: Response) => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const { set_id } = req.body;

		const deleteQuery = `DELETE FROM card_sets WHERE set_id=${set_id}`;

		await connection.execute(deleteQuery)
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
		pool.end();
	}
});

cardsetRoute.put("/updateCardSet", async (req: Request, res: Response) => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const { set_id, name, description } = req.body.data;

		const updateQuery = 
			"UPDATE card_sets " +
			`SET name = "${name}", description = "${description}" ` +
			`WHERE set_id = ${set_id}`;

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
		pool.end();
	}
});



export default cardsetRoute;