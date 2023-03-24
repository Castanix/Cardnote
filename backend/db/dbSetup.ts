import { createPool, Pool } from "mysql2/promise";
import { exec } from "child_process";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
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

const createAccountsTable = (test?: boolean) =>
	`CREATE TABLE IF NOT EXISTS accounts${ test ? "_test" : "" }(` +
        "account_id INT NOT NULL AUTO_INCREMENT," +
        "username VARCHAR(32) NOT NULL UNIQUE," +
        "password_hash VARCHAR(64) NOT NULL," +
        "salt VARCHAR(32) NOT NULL," +
        "PRIMARY KEY (account_id)" +
    ")";

const createCardSetsTable = (test?: boolean) =>
	`CREATE TABLE IF NOT EXISTS card_sets${ test ? "_test" : "" }(` +
        "set_id INT NOT NULL AUTO_INCREMENT," +
        "name VARCHAR(255) NOT NULL," +
        "description VARCHAR(510) NULL," +
        "num_cards INT NOT NULL DEFAULT 0," +
		"username VARCHAR(32) NOT NULL," +
        "PRIMARY KEY (set_id)," +
		`FOREIGN KEY (username) REFERENCES accounts${ test ? "_test" : "" }(username)` +
    ")";

const createCardsTable = (test?: boolean) =>
	`CREATE TABLE IF NOT EXISTS cards${ test ? "_test" : "" }(` +
        "card_id INT NOT NULL AUTO_INCREMENT," +
        "term VARCHAR(510) NOT NULL," +
        "definition VARCHAR(2040) NOT NULL," +
        "set_id INT NOT NULL," +
        "PRIMARY KEY (card_id)," +
        `FOREIGN KEY (set_id) REFERENCES card_sets${ test ? "_test" : "" }(set_id)` +
    ")";


export const setupDB = async (test?: boolean) => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		// Unset foreign keys
		const unsetKeysQuery = "SET FOREIGN_KEY_CHECKS = 0";

		await connection.execute(unsetKeysQuery)
			.catch((err: string) => {
				throw new Error(err);
			});

		connection.unprepare(unsetKeysQuery);

		exec(
			// `mysql -u${process.env.DB_USER} -p"${process.env.DB_PASSWORD}" cardnote_db -s -e 'show tables' | sed -e 's/^/drop table /' -e 's/$/;/' > dropalltables.sql; ` +
			`mysql -u${process.env.DB_USER} -p"${process.env.DB_PASSWORD}" cardnote_db  < ./db/dropalltables.sql `,
			(error) => {
				if (error) {
					console.log("error");
					return;
				}
			});

		await new Promise(r => setTimeout(r, 2000));

		const accountsQuery = createAccountsTable(test);

		await connection.execute(accountsQuery)
			.catch((err: string) => {
				throw new Error(err);
			});
        
		connection.unprepare(createAccountsTable(test));

		const cardsetsQuery = createCardSetsTable(test);

		await connection.execute(cardsetsQuery)
			.catch((err: string) => {
				throw new Error(err);
			});
        
		connection.unprepare(createCardSetsTable(test));

		const cardsQuery = createCardsTable(test);
		await connection.execute(cardsQuery)
			.catch((err: string) => {
				throw new Error(err);
			});

		connection.unprepare(createCardsTable(test));

		// Create public account
		const insertPublicQuery = `INSERT INTO accounts${ test ? "_test" : "" } (username, password_hash, salt) VALUES ("public", "", "")`;

		await connection.execute(insertPublicQuery)
			.catch((err: string) => {
				throw new Error(err);
			});
		
		connection.unprepare(insertPublicQuery);

		// Create personal account
		const promise = new Promise(() => bcrypt.genSalt(10, (err, salt) => {
			if (err) throw err;

			bcrypt.hash(process.env.PERSONAL_PASSWORD as string, salt, async (err, hash) => {
				if (err) throw err;

				const insertPersonalQuery = `INSERT INTO accounts${ test ? "_test" : "" } (username, password_hash, salt) VALUES ("Castanix", "${ hash }", "${ salt }")`;

				await connection.execute(insertPersonalQuery)
					.catch((err: string) => {
						throw new Error(err);
					});
				
				connection.unprepare(insertPersonalQuery);
			});
		}));

		await promise;
		
	} catch (err) {
		console.log(err);
	} finally {
		connection.release();
	}

	await pool.end();
};
