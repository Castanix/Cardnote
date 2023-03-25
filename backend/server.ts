import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import apiRouter from "./api";
import { connectMysqlPool } from "./db/dbSetup";
import { verifyToken } from "./middlewares/authorization";

dotenv.config({ path: __dirname+"/../.env" });

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(verifyToken);

app.use("/api", apiRouter);

export const promisedPool = connectMysqlPool();

Promise.resolve(promisedPool)
	.then(() => {
		app.listen(port, () => console.log(`Server listening on port ${ port }`));
	})
	.catch((err: Error) => {
		console.error(err);
	});

export default app;
