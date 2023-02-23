import { createPool, Pool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ path: __dirname+"/../../.env" });

export const connectMysqlPool = async () => {
	const pool: Pool = createPool(
		{
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: "cardnote_db",
			waitForConnections: true,
			connectionLimit: 10,
			maxIdle: 8,
			idleTimeout: 60000,
			queueLimit: 0
		}
	);

	return pool;
};

const createCardSetsTable = 
    "CREATE TABLE IF NOT EXISTS card_sets(" +
        "set_id INT NOT NULL AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "description VARCHAR(510) NULL," +
        "num_cards INT NOT NULL DEFAULT 0," +
        "PRIMARY KEY (set_id)" +
    ")";

const createCardsTable = 
    "CREATE TABLE IF NOT EXISTS cards(" +
        "card_id INT NOT NULL AUTO_INCREMENT," +
        "term VARCHAR(510) NOT NULL," +
        "definition VARCHAR(2040) NOT NULL," +
        "set_id INT NOT NULL," +
        "PRIMARY KEY (card_id)," +
        "FOREIGN KEY (set_id) REFERENCES card_sets(set_id)" +
    ")";


const setupDB = async () => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		await connection.execute(createCardSetsTable)
			.catch((err: string) => {
				throw new Error(err);
			});
        
		connection.unprepare(createCardSetsTable);

		await connection.execute(createCardsTable)
			.catch((err: string) => {
				throw new Error(err);
			});

		connection.unprepare(createCardsTable);
	} catch (err) {
		console.log(err);
	} finally {
		connection.release();
	}

	await pool.end();
};

setupDB();
