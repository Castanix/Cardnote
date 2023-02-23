import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import apiRouter from "./api";
dotenv.config({ path: __dirname+"/../.env" });

const app = express();
app.use(cors());

const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", apiRouter);


app.listen(port, () => console.log(`Server listening on port ${port}`));
// connectMysqlPool()
// 	.then(() => {
// 		app.listen(port, () => console.log(`Server listening on port ${port}`));
// 	})
// 	.catch((err: Error) => {
// 		console.error(err);
// 	});

export default app;
