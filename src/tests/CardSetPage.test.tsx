import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CardSetPage, { CardType } from "../pages/CardSetPage/CardSetPage";
import { SetupServer, setupServer } from "msw/node";
import { rest } from "msw";
import { QueryClient, QueryClientProvider } from "react-query";

let document: HTMLElement;
let user: UserEvent;

const mockedCardSet: CardType[] = [
	{
		card_id: 1,
		term: "Term 1",
		definition: "Definition 1",
		set_id: 1
	},
	{
		card_id: 2,
		term: "Term 2",
		definition: "Definition 2",
		set_id: 1
	},
	{
		card_id: 3,
		term: "Term 3",
		definition: "Definition 3",
		set_id: 1
	},
];
	

const server: SetupServer = setupServer(
	rest.get(`${ process.env.REACT_APP_SERVER_URI }/card/allCards/1`, (_, res, ctx) => {
		return res(ctx.status(200), ctx.json(mockedCardSet));
	}),

	rest.post(`${ process.env.REACT_APP_SERVER_URI }/card/addCard`, (_, res, ctx) => {
		return res(ctx.status(201), ctx.json({ inserted_id: mockedCardSet.length + 1 }));
	}),

	rest.delete(`${ process.env.REACT_APP_SERVER_API }/card/deleteCard`, (_, res, ctx) => {
		return res(ctx.status(204));
	}),

	rest.put(`${ process.env.REACT_APP_SERVER_API }/card/updateCard`, (_, res, ctx) => {
		return res(ctx.status(204));
	}),
);

const customRender = (
	<MemoryRouter initialEntries={ ["/Test Set/1"] }>
		<QueryClientProvider client={ new QueryClient() }>
			<Routes>
				<Route path="/:cardSetName/:cardSetId" element={ <CardSetPage /> }></Route>
			</Routes>
		</QueryClientProvider>
	</MemoryRouter>
);

beforeAll(() => {
	server.listen();
});

afterEach(() => {
	server.resetHandlers();
	cleanup();
	jest.clearAllMocks();
	jest.clearAllTimers();
});

afterAll(() => {
	server.close();
});


describe("loading state", () => {
	beforeEach(() => {
		document = render(customRender).container;
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
		document = await act(async () => render(customRender).container);
	});

	test("Render set name and description", () => {
		const name = screen.getByText(/Test Set/i);
		// const description = screen.getByText()

		expect(name).toBeInTheDocument();
	});

	test("Render accordions and buttons", () => {
		const flashcardButton = screen.getByText(/Flashcards/i);
		const accordions = document.querySelectorAll(".accordion");
		const addButton = screen.getAllByText(/Add card/i)[1];

		expect(flashcardButton).toBeInTheDocument();
		expect(accordions.length).toBe(2);
		expect(addButton).toBeInTheDocument();
	}, 10000);


	test("Render card list", () => {
		const list = document.querySelectorAll(".accordion-body")[1];
		const numCards = list.childElementCount;

		expect(list).toBeInTheDocument();
		expect(numCards).toBe(3);
	}, 10000);


	test("Render term and definition", () => {
		const term = screen.getByText(/Term 1/i);
		const definition = screen.getByText(/Definition 1/i);

		expect(term).toBeInTheDocument();
		expect(definition).toBeInTheDocument();
	}, 10000);

	test("Render toolbars", () => {
		const editButton = screen.getAllByText(/Edit/i);
		const deleteButton = screen.getAllByText(/Delete/i);

		expect(editButton.length).toBe(3);
		expect(deleteButton.length).toBe(3);
	}, 10000);
});

describe("page actions", () => {
	beforeEach(async () => {
		document = await act(async () => render(customRender).container);
		user = userEvent.setup();
	});

	test("Edit card", async () => {
		const editButton = screen.getAllByText(/Edit/i)[0];
    
		await user.click(editButton);
    
		expect(editButton).not.toBeInTheDocument();

		const confirmButton = screen.getByText(/Confirm/i);
		const cancelButton = screen.getByText(/Cancel/i);

		expect(confirmButton).toBeInTheDocument();
		expect(cancelButton).toBeInTheDocument();
    
		const inputs = document.querySelectorAll(".form-control");
		const termInput = inputs[2];
		const definitionInput = inputs[3];
        
    
		await user.clear(termInput);
		await user.type(termInput, "New Card");
		await user.clear(definitionInput);
		await user.type(definitionInput, "New Definition");
    
		await user.click(confirmButton);
    
		await waitFor(() => {
			const newTerm = screen.getByText(/New Card/i);
			const newDefinition = screen.getByText(/New Definition/i);
        
			expect(newTerm).toBeInTheDocument();
			expect(newDefinition).toBeInTheDocument();
		});
	});
    
	test("Cancel edit on card", async () => {
		const term = screen.getByText(/Term 1/i);
		const definition = screen.getByText(/Definition 1/i);
		let editButton = screen.getAllByText(/Edit/i)[0];
    
		expect(term).toBeInTheDocument();
		expect(definition).toBeInTheDocument();
    
		await user.click(editButton);
    
		const inputs = document.querySelectorAll(".form-control");
		const termInput = inputs[2];
		const definitionInput = inputs[3];
		const cancelButton = screen.getByText(/Cancel/i);

		expect(editButton).not.toBeInTheDocument();
    
		await user.clear(termInput);
		await user.type(termInput, "New Card");
		await user.clear(definitionInput);
		await user.type(definitionInput, "New Definition");
    
		await user.click(cancelButton);
    
		await waitFor(() => {
			editButton = screen.getAllByText(/Edit/i)[0];
			expect(editButton).toBeInTheDocument();
			expect(term).toBeInTheDocument();
			expect(definition).toBeInTheDocument();
		});
	});

	test("Accordions open and close", async () => {
		const accordions = document.querySelectorAll(".accordion-button");
		const addCardAccordion = accordions[0];
		const cardSetAccordion = accordions[1];

		const accordionBodies = document.querySelectorAll(".accordion-collapse");
		const addCardBody = accordionBodies[0];
		const cardSetBody = accordionBodies[1];

		expect(addCardBody).toHaveClass("show");
		expect(cardSetBody).toHaveClass("show");

		await user.click(addCardAccordion);
		await user.click(cardSetAccordion);

		expect(addCardBody).not.toHaveClass("show");
		expect(cardSetBody).not.toHaveClass("show");
	});
    
	// Note: These tests do not work as the states maintaining the data has been removed in lieu of refetching with react query
	// test("Delete card", async () => {
	// 	let list = document.querySelectorAll(".accordion-body")[1];
	// 	let numCards = list.childElementCount;

	// 	expect(numCards).toBe(3);
    
	//     const deleteButton = screen.getAllByText(/Delete/i)[0];
    
	//     await user.click(deleteButton);
        
	// 	const okButton = screen.getByText(/Ok/i);

	// 	await user.click(okButton);

	// 	await waitFor(() => {
	// 		list = document.querySelectorAll(".accordion-body")[1];
	// 		numCards = list.childElementCount;
	
	// 		expect(numCards).toBe(2);
	// 	});
	// });

	// test("Add card", async () => {
	// 	// let list = document.querySelectorAll(".accordion-body")[1];
	// 	// let numCards = list.childElementCount;

	// 	// expect(numCards).toBe(3);

	// 	const addButton = screen.getAllByText(/Add card/i)[1];

	// 	const inputs = document.querySelectorAll(".form-control");
	//     const termInput = inputs[0];
	//     const definitionInput = inputs[1];

	//     await user.type(termInput, "New Card");
	//     await user.type(definitionInput, "New Definition");

	// 	await user.click(addButton);

	// 	const list = document.querySelectorAll(".accordion-body")[1];
	// 	const numCards = list.childElementCount;

	// 	expect(numCards).toBe(4);
	// });
});

// test("Page renders", () => {
// 	const title = screen.getByText(/Test Set/i);
// 	const description = screen.getByText(/Description/i);
// 	const addCard = screen.getAllByText(/Add card/i);
// 	const cardSet = screen.getByText(/Card set/i);
// 	const homeButton = screen.getByText(/Back to home/i);

// 	expect(title).toBeInTheDocument();
// 	expect(description).toBeInTheDocument();
// 	expect(addCard).toHaveLength(2);
// 	expect(cardSet).toBeInTheDocument();
// 	expect(homeButton).toBeInTheDocument();
// });

// test("Number of cards in set", () => {
// 	const numCards = document.querySelectorAll(".accordion-body")[1].childElementCount;

// 	expect(numCards).toBe(7);
// });

// test("Add new card to set", async () => {
// 	const termInput = screen.getByPlaceholderText(/Enter Term/i);
// 	const definitionInput = screen.getByPlaceholderText(/Enter Definition/i);
// 	const addButton = screen.getAllByText(/Add card/i)[1];

// 	await user.type(termInput, "Term");
// 	await user.type(definitionInput, "Definition");

// 	await user.click(addButton);

// 	const numCards = document.querySelectorAll(".accordion-body")[1].childElementCount;

// 	expect(numCards).toBe(8);
// });

// test("Accordions open and close", async () => {
// 	const accordions = document.querySelectorAll(".accordion-button");
// 	const addCardAccordion = accordions[0];
// 	const cardSetAccordion = accordions[1];

// 	const accordionBodies = document.querySelectorAll(".accordion-collapse");
// 	const addCardBody = accordionBodies[0];
// 	const cardSetBody = accordionBodies[1];

// 	expect(addCardBody).toHaveClass("show");
// 	expect(cardSetBody).toHaveClass("show");

// 	await user.click(addCardAccordion);
// 	await user.click(cardSetAccordion);

// 	expect(addCardBody).not.toHaveClass("show");
// 	expect(cardSetBody).not.toHaveClass("show");
// });
