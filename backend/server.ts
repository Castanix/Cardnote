import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import apiRouter from "./api";
import { connectMysqlPool } from "./db/dbSetup";
import { PoolConnection } from "mysql2/promise";

dotenv.config({ path: __dirname+"/../.env" });

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);

let connectionPool: PoolConnection;

const promisedPool = connectMysqlPool();

const newConnectionPool = async () => {
    connectionPool = await Promise.resolve(promisedPool)
        .then((result) => {
            return result.getConnection();
        });
};

export const getConnection = async () => {
    await newConnectionPool();

    return connectionPool;
};

Promise.resolve(promisedPool)
	.then(async () => {
		app.listen(port, () => console.log(`Server listening on port ${port}`));
	})
	.catch((err: Error) => {
		console.error(err);
	});

export default app;
