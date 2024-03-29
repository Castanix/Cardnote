import supertest from "supertest";
import "@testing-library/jest-dom";

import dotenv from "dotenv";
import { connectMysqlPool, setupDB } from "../db/dbSetup";
dotenv.config({ path: __dirname+"/../.env" });

const request = supertest;
const baseURL = "http://localhost:8000";

const dummySetReq = {
	name: "Name",
	description: "Description",
	num_cards: 0,
	set_id: 1,
	username: "public",
};

afterEach(async () => {
	const pool = await connectMysqlPool();
	const connection = await pool.getConnection();

	try {
		const dropQuery = "DROP TABLE IF EXISTS cards_test";
		const dropQuery2 = "DROP TABLE IF EXISTS card_sets_test";
		const dropQuery3 = "DROP TABLE IF EXISTS accounts_test";

		await connection.execute(dropQuery)
			.catch(err => {
				throw new Error(err);
			});
		await connection.execute(dropQuery2)
			.catch(err => {
				throw new Error(err);
			});
		await connection.execute(dropQuery3)
			.catch(err => {
				throw new Error(err);
			});
	} catch (err) {
		console.error(err);
	} finally {
		connection.release();
		await pool.end();
	}
});


describe("GET tests", () => {
	beforeEach(async () => {
		await setupDB(true);

		await request(baseURL)
			.post("/api/cardset/addCardSet")
			.set({ test: true })
			.send({ data: dummySetReq });
	}, 30000);


	test("Getting card sets", async () => {
		const response = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
    
		expect(response.statusCode).toBe(200);
		expect(response.body.error).toBe(undefined);
		expect(response.body).toStrictEqual([{ set_id: 1, name: "Add Name", description: "Add Description", numCards: 0, num_cards: 0, username: "public" }]);
	});

	test("Get one card set description", async () => {
		const response = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/oneSetDescription/1")
			.set({ test: true });
    
		expect(response.statusCode).toBe(200);
		expect(response.body.error).toBe(undefined);
		expect(response.body).toStrictEqual({ description: "Add Description" });
	});

	test("Get non-existing card set description", async () => {
		const response = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/oneSetDescription/2")
			.set({ test: true });
    
		expect(response.statusCode).toBe(404);
		expect(response.body.error).toBe("Set does not exist");
	});
});


describe("POST tests", () => {
	beforeEach(async () => {
		await setupDB(true);
	}, 30000);

	test("Adding card sets", async () => {
		let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });

		expect(getResponse.body).toStrictEqual([]);

		const postResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.post("/cardset/addCardSet")
			.set({ test: true })
			.send({ data: dummySetReq });
    
		expect(postResponse.statusCode).toBe(201);
		expect(postResponse.body.error).toBe(undefined);
		expect(postResponse.body).toStrictEqual({ inserted_id: 1 });

		getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
        
		expect(getResponse.body).toStrictEqual([{ set_id: 1, name: "Add Name", description: "Add Description", numCards: 0, num_cards: 0, username: "public" }]);
	});
});


describe("DELETE tests", () => {
	beforeEach(async () => {
		await setupDB(true);

		await request(baseURL)
			.post("/api/cardset/addCardSet")
			.set({ test: true })
			.send({ data: dummySetReq });
	}, 30000);

	test("Delete set", async () => {
		let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
        
		expect(getResponse.body).toStrictEqual([{ set_id: 1, name: "Add Name", description: "Add Description", numCards: 0, num_cards: 0, username: "public" }]);

		const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.delete("/cardset/deleteCardSet")
			.set({ test: true })
			.send(dummySetReq);
    
		expect(deleteResponse.statusCode).toBe(204);
		expect(deleteResponse.body.error).toBe(undefined);

		getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
        
		expect(getResponse.body).toStrictEqual([]);
	});

	test("Delete cardset with missing data in req", async () => {
		const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.delete("/cardset/deleteCardSet")
			.set({ test: true })
			.send({});
    
		expect(deleteResponse.statusCode).toBe(400);
		expect(deleteResponse.body.error).toBe("Data is missing fields");
	});

	test("Delete non-existing set", async () => {
		const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.delete("/cardset/deleteCardSet")
			.set({ test: true })
			.send({ ...dummySetReq, set_id: 2 });
    
		expect(deleteResponse.statusCode).toBe(404);
		expect(deleteResponse.body.error).toBe("Set does not exist");
	});


	// Only need to be tested once because invalid bearer tokens get blocked in authorization middleware
	test("Delete unowned set", async () => {
		const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.delete("/cardset/deleteCardSet")
			.set({ test: true, authorization: "Bearer notpublic" })
			.send(dummySetReq);
    
		expect(deleteResponse.statusCode).toBe(401);
		expect(deleteResponse.body.error).toBe("Invalid token");
	});
});


describe("UPDATE tests", () => {
	beforeEach(async () => {
		await setupDB(true);

		await request(baseURL)
			.post("/api/cardset/addCardSet")
			.set({ test: true })
			.send({ data: dummySetReq });
	}, 30000);

	test("Update card set", async () => {
		let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
        
		expect(getResponse.body).toStrictEqual([{ set_id: 1, name: "Add Name", description: "Add Description", numCards: 0, num_cards: 0, username: "public" }]);

		const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.put("/cardset/updateCardSet")
			.set({ test: true })
			.send({ data: { set_id: 1, name: "Updated Name", description: "Updated Description" } });
    
		expect(updateResponse.statusCode).toBe(204);
		expect(updateResponse.body.error).toBe(undefined);

		getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.get("/cardset/allSets")
			.set({ test: true });
        
		expect(getResponse.body).toStrictEqual([{ set_id: 1, name: "Updated Name", description: "Updated Description", numCards: 0, num_cards: 0, username: "public" }]);
	});

	test("Update card set with missing data in req", async () => {
		const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.put("/cardset/updateCardSet")
			.set({ test: true })
			.send({ data: {} });
    
		expect(updateResponse.statusCode).toBe(400);
		expect(updateResponse.body.error).toBe("Data is missing fields");
	});

	test("Update non-existing card set", async () => {
		const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
			.put("/cardset/updateCardSet")
			.set({ test: true })
			.send({ data: { ...dummySetReq, set_id: 2 } });
    
		expect(updateResponse.statusCode).toBe(404);
		expect(updateResponse.body.error).toBe("Set does not exist");
	});
});