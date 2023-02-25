import { Request, Response, Router } from "express";
import { connectMysqlPool } from "../db/dbSetup";
import { RowDataPacket } from "mysql2";

const cardRoute = Router();

cardRoute.get("/allCards/:set_id", async (req: Request, res: Response) => {
	const { set_id } = req.params;

	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const selectQuery = 
            "SELECT * FROM cards " +
            `WHERE set_id = ${set_id}`;

		connection.execute(selectQuery)
			.then(result => res.status(200).send(result[0]))
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

cardRoute.post("/addCard", async (req: Request, res: Response) => {
	const { set_id, term, definition, numCards } = req.body.data;

	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const insertQuery =
            "INSERT INTO cards (term, definition, set_id) " +
            `VALUES ("${ term }", "${ definition }", ${ set_id }) `;

		const updateQuery = 
            "UPDATE card_sets " +
            `SET num_cards = ${ numCards } ` +
            `WHERE set_id = ${ set_id }`;

		const selectQuery = "SELECT LAST_INSERT_ID() AS inserted_id";

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
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
		pool.end();
	}
});

cardRoute.delete("/deleteCard", async (req: Request, res: Response) => {
	const { card_id, set_id, numCards } = req.body;

	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const deleteQuery = `DELETE FROM cards WHERE card_id = ${ card_id }`;

		const updateQuery = 
            "UPDATE card_sets " +
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
		console.log(err);

		res.status(503);
	} finally {
		connection.release();
		pool.end();
	}
});

cardRoute.put("/updateCard", async (req: Request, res: Response) => {
	const { card_id, term, definition } = req.body.data;

	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const updateQuery = 
            "UPDATE cards " +
            `SET term = "${ term }", definition = "${ definition }" ` +
            `WHERE card_id = ${ card_id }`;

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

export default cardRoute;