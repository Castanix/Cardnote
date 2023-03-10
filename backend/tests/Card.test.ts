import supertest from "supertest";
import "@testing-library/jest-dom";

import dotenv from "dotenv";
import { connectMysqlPool, setupDB } from "../db/dbSetup";
dotenv.config({ path: __dirname+"/../.env" });

const request = supertest;
const baseURL = "http://localhost:8000";

const dummySetReq = {
    name: "Set",
    description: "Description",
    num_cards: 0,
};

const dummyCardReq = {
    term: "Term",
    definition: "Definition",
    numCards: 1,
    set_id: 1,
    card_id: 1,
};

beforeAll(async () => {
    await setupDB(true);

    await request(baseURL)
            .post("/api/cardset/addCardSet")
            .set({ test: true })
            .send({ data: dummySetReq });
});

afterEach(async () => {
    const pool = await connectMysqlPool();
    const connection = await pool.getConnection();

    try {
        const truncQuery = "TRUNCATE TABLE cards_test";

        await connection.execute(truncQuery)
            .catch(err => {
                throw new Error(err);
            });
    } catch (err) {
        console.error(err);
    } finally {
        connection.release();
        await pool.end()
    };
});

afterAll(async () => {
    const pool = await connectMysqlPool();
    const connection = await pool.getConnection();

    try {
        const dropQuery = "DROP TABLE cards_test";
        const dropQuery2 = "DROP TABLE card_sets_test";

        await connection.execute(dropQuery)
            .catch(err => {
                throw new Error(err);
            });
        await connection.execute(dropQuery2)
            .catch(err => {
                throw new Error(err);
            });
    } catch (err) {
        console.error(err);
    } finally {
        connection.release();
        await pool.end()
    };
});


describe("GET tests", () => {
    beforeEach(async () => {
        await request(baseURL)
            .post("/api/card/addCard")
            .set({ test: true })
            .send({ data: dummyCardReq });
    }, 30000);

    test("Getting card set", async () => {
        const response = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
    
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(undefined);
        expect(response.body).toStrictEqual([{ card_id: 1, term: 'Term', definition: 'Definition', set_id: 1 }]);
    });

    test("Getting non-existent set", async () => {
        const response = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/2")
                                .set({ test: true });
    
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe("Card set does not exist");
    });
});


describe("POST tests", () => {
    // beforeEach(async () => {
    //     await request(baseURL)
    //         .post("/api/cardset/addCardSet")
    //         .set({ test: true })
    //         .send({ data: dummySetReq });
    // }, 30000);

    test("Add card to set", async () => {
        let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([]);

        const postResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .post("/card/addCard")
                                .set({ test: true })
                                .send({ data: dummyCardReq });
    
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.body.error).toBe(undefined);
        expect(postResponse.body).toStrictEqual({ inserted_id: 1 });

        getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([{ card_id: 1, term: 'Term', definition: 'Definition', set_id: 1 }]);
    });

    test("Add card with missing data in req", async () => {
        const postResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .post("/card/addCard")
                                .set({ test: true })
                                .send({ data: {} });
    
        expect(postResponse.statusCode).toBe(400);
        expect(postResponse.body.error).toBe("Data is missing fields");
    });

    test("Add card to non-existent set", async () => {
        const postResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .post("/card/addCard")
                                .set({ test: true })
                                .send({ data: { ...dummyCardReq, set_id: 2 } });
    
        expect(postResponse.statusCode).toBe(404);
        expect(postResponse.body.error).toBe("Card set does not exist");
    });
});


describe("DELETE tests", () => {
    beforeEach(async () => {
        await request(baseURL)
            .post("/api/card/addCard")
            .set({ test: true })
            .send({ data: dummyCardReq });
    }, 30000);

    test("Delete card from set", async () => {
        let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([{ card_id: 1, term: 'Term', definition: 'Definition', set_id: 1 }]);

        const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .delete("/card/deleteCard")
                                .set({ test: true })
                                .send(dummyCardReq);
    
        expect(deleteResponse.statusCode).toBe(204);
        expect(deleteResponse.body.error).toBe(undefined);

        getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([]);
    });

    test("Delete card with missing data in req", async () => {
        const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .delete("/card/deleteCard")
                                .set({ test: true })
                                .send({});
    
        expect(deleteResponse.statusCode).toBe(400);
        expect(deleteResponse.body.error).toBe("Data is missing fields");
    });

    test("Delete non-existing card", async () => {
        const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .delete("/card/deleteCard")
                                .set({ test: true })
                                .send({ ...dummyCardReq, card_id: 2 });
    
        expect(deleteResponse.statusCode).toBe(404);
        expect(deleteResponse.body.error).toBe("Card does not exist");
    });

    test("Delete card from non-existent set", async () => {
        const deleteResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .delete("/card/deleteCard")
                                .set({ test: true })
                                .send({ ...dummyCardReq, set_id: 2 });
    
        expect(deleteResponse.statusCode).toBe(404);
        expect(deleteResponse.body.error).toBe("Card set does not exist");
    });
});


describe("UPDATE tests", () => {
    beforeEach(async () => {
        await request(baseURL)
            .post("/api/card/addCard")
            .set({ test: true })
            .send({ data: dummyCardReq });
    }, 30000);

    test("Update card from set", async () => {
        let getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([{ card_id: 1, term: 'Term', definition: 'Definition', set_id: 1 }]);

        const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .put("/card/updateCard")
                                .set({ test: true })
                                .send({ data: { card_id: 1, term: 'Updated Term', definition: 'Updated Definition' } });
    
        expect(updateResponse.statusCode).toBe(204);
        expect(updateResponse.body.error).toBe(undefined);

        getResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .get("/card/allCards/1")
                                .set({ test: true });
        
        expect(getResponse.body).toStrictEqual([{ card_id: 1, term: 'Updated Term', definition: 'Updated Definition', set_id: 1 }]);
    });

    test("Update card with missing data in req", async () => {
        const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .put("/card/updateCard")
                                .set({ test: true })
                                .send({ data: {} });
    
        expect(updateResponse.statusCode).toBe(400);
        expect(updateResponse.body.error).toBe("Data is missing fields");
    });

    test("Update non-existing card", async () => {
        const updateResponse = await request(`${ process.env.REACT_APP_SERVER_URI }`)
                                .put("/card/updateCard")
                                .set({ test: true })
                                .send({ data: { ...dummyCardReq, card_id: 2 } });
    
        expect(updateResponse.statusCode).toBe(404);
        expect(updateResponse.body.error).toBe("Card does not exist");
    });
});
