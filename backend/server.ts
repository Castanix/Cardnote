import express from "express";
import { connectMysqlPool } from "./db/dbSetup";

import dotenv from "dotenv";
dotenv.config({ path: __dirname+"/../../.env" });

const app = express();

const port = process.env.PORT || 8000;


connectMysqlPool()
	.then(() => {
		app.listen(port, () => console.log(`Server listening on port ${port}`));
	})
	.catch((err: Error) => {
		console.error(err);
	});

export default app;