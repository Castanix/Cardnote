import React from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";
// import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { BrowserRouter } from "react-router-dom";
import CardSetListPage from "../pages/CardSetListPage/CardSetListPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { CardSetType } from "../components/CardSetList/CardSetList";
import { SetupServer, setupServer } from "msw/node";
import { rest } from "msw";

let document: HTMLElement;
// let user: UserEvent;


const data: CardSetType[] = [];

for (let i = 1; i <= 3; i++) {
	data.push(
		{
			set_id: i,
			name: "Test set",
			description: "Test description",
			numCards: 0,
		}
	);
}

const server: SetupServer = setupServer(
	rest.get(`${process.env.REACT_APP_SERVER_URI}/cardset/allSets`, (_, res, ctx) => {
		return res(ctx.status(200), ctx.json(data));
	}),

	rest.post(`${process.env.REACT_APP_SERVER_URI}/cardset/addCardSet`, (_, res, ctx) => {
		return res(ctx.status(201), ctx.json({ inserted_id: Math.random() }));
	})
);

	
beforeAll(() => server.listen());

afterEach(() => {
	server.resetHandlers();
	cleanup();
	jest.clearAllMocks();
	jest.clearAllTimers();
});

afterAll(() => server.close());

describe("loading state", () => {	
	beforeEach(() => {
		document = render(
			<QueryClientProvider client={ new QueryClient }>
				<CardSetListPage />
			</QueryClientProvider>, 
			{ wrapper: BrowserRouter }).container;
	});
	
	test("Loading state", async () => {
		const loading = screen.getByText(/Loading/i);
		expect(loading).toBeInTheDocument();
	
		await waitFor(() => {
			expect(loading).not.toBeInTheDocument();
		});
	}, 10000);
});


describe("page renders", () => {
	beforeEach(async () => {
		document = await act(async () => render(
			<QueryClientProvider client={ new QueryClient }>
				<CardSetListPage />
			</QueryClientProvider>, 
			{ wrapper: BrowserRouter }).container);
	});
	
	test("Render searchbar", () => {
		const searchbar = screen.getByPlaceholderText(/Search set/i);
		expect(searchbar).toBeInTheDocument();
	}, 10000);
	
	
	test("Render add set button", () => {
		const addBtn = document.querySelector("#add-set-button");
		expect(addBtn).toBeInTheDocument();
	}, 10000);

	test("Render list item", () => {
		const list = document.querySelectorAll(".card-set-list-items");

		expect(list.length).toBe(3);
	}, 10000);

	test("Render pagination", () => {
		const pagination = document.querySelector(".pagination");

		expect(pagination).toBeInTheDocument();
	}, 10000);
});

// describe("page actions", () => {
// 	beforeEach(async () => {
// 		document = await act(async () => render(
// 			<QueryClientProvider client={ new QueryClient }>
// 				<CardSetListPage />
// 			</QueryClientProvider>, 
// 			{ wrapper: BrowserRouter }).container);
// 		user = userEvent.setup();
// 	});

// 	test("Click add set button", async () => {
// 		const addBtn = document.querySelector("#add-set-button");
// 		let list = document.querySelectorAll(".card-set-list-items");

// 		expect(list.length).toBe(3);
// 		await userEvent.click(addBtn);

// 		await waitFor(() => {
// 			list = document.querySelectorAll(".card-set-list-items");
// 			expect(list.length).toBe(4);
// 		});
// 	}, 10000);

// 	test("Change pages with pagination", async () => {
// 		expect(screen.queryByTitle(/page 2/i)).toBeNull();

// 		const addBtn = document.querySelector("#add-set-button");
// 		await userEvent.click(addBtn);
// 		await userEvent.click(addBtn);

// 		await waitFor(async () => {
// 			const paginationTwo = screen.getByTitle(/page 2/i);
	
// 			expect(paginationTwo).toBeInTheDocument();
// 			expect(paginationTwo).not.toHaveClass("active");

// 			await user.click(paginationTwo);

// 			await waitFor(() => {
// 				expect(paginationTwo).toHaveClass("active");
// 			});
// 		});
// 	}, 10000);
// });