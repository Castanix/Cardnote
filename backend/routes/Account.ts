import { Request, Response, Router } from "express";
import { promisedPool } from "../server";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../middlewares/authorization";


const accountRoute = Router();


accountRoute.post("/login", async (req: Request, res: Response) => {
	const { test } = req.headers;
	const suffix = test ? "_test" : "";

	const { username, password } = req.body.data;

	if (!(username && password)) {
		res.status(401).send({ error: "Credentials missing" });
		return;
	}

	const connection = await (await promisedPool).getConnection();

	try {
		const selectQuery = `SELECT password_hash FROM accounts${ suffix } WHERE username = "${ username }"`;

		connection.execute(selectQuery)
			.then(async (result) => {
				const data = result[0] as RowDataPacket;
				const valid = await bcrypt.compare(password, data[0].password_hash);

				if (!valid) {
					res.status(401).send("Invalid credentials");
					return;
				}

				res.status(200).send({ username, accessToken: generateAccessToken(username) });
			})
			.catch((err: string) => {
				throw new Error(err);
			});
	} catch (err) {
		console.error("Login failed");
	}

});


export default accountRoute;