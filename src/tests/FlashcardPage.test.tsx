// import { render, screen, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import userEvent from "@testing-library/user-event";
// import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
// import React from "react";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import { CardType } from "../pages/CardSetPage/CardSetPage";
// import FlashcardsPage from "../pages/FlashcardsPage/FlashcardsPage";

// let document: HTMLElement;
// let user: UserEvent;

// const mockCardSet: CardType[] = [
// 	{
// 		_id: "1",
// 		term: "Term 1",
// 		definition: "Definition 1",
// 	},
// 	{
// 		_id: "2",
// 		term: "Term 2",
// 		definition: "Definition 2",
// 	},
// 	{
// 		_id: "3",
// 		term: "Term 3",
// 		definition: "Definition 3",
// 	}
// ];

// const customRender = (
// 	<MemoryRouter initialEntries={[{ pathname: "/Test Set/flashcard", state: { cardSet: mockCardSet } }]}>
// 		<Routes>
// 			<Route path="/:cardSetId/flashcard" element={ <FlashcardsPage /> }></Route>
// 		</Routes>
// 	</MemoryRouter>
// );

// beforeEach(() => {
// 	document = render(customRender).container;
// 	user = userEvent.setup();
// });

// test("Flashcard renders", () => {
// 	const term = screen.getByText(/Term 1/i);
// 	const leftButton = screen.getByTitle(/previous-card/i);
// 	const rightButton = screen.getByTitle(/next-card/i);

// 	expect(term).toBeInTheDocument();
// 	expect(leftButton).toBeInTheDocument();
// 	expect(rightButton).toBeInTheDocument();
// });

// test("Flashcard flips", async () => {
// 	const card = document.querySelector(".flashcard");
// 	const definitionContainer = screen.getByText(/Definition 1/i).parentNode;

// 	expect(definitionContainer).toHaveClass("hide-text");

// 	await user.click(card);

// 	waitFor(() => {
// 		expect(definitionContainer).toHaveClass("definition");
// 	});
// });

// test("Flashcard goes to next card", async () => {
// 	const nextButton = screen.getByTitle("next-card");
// 	const term = screen.getByText(/Term 1/i);

// 	expect(term).toBeInTheDocument();

// 	await user.click(nextButton);

// 	waitFor(() => {
// 		expect(term).not.toBeInTheDocument();

// 		const term2 = screen.getByText(/Term 2/i);

// 		expect(term2).toBeInTheDocument();
// 	});  
// });

// test("Flashcard goes to previous card", async () => {
// 	const previousButton = screen.getByTitle("previous-card");
// 	const term = screen.getByText(/Term 1/i);

// 	expect(term).toBeInTheDocument();

// 	await user.click(previousButton);

// 	waitFor(() => {
// 		expect(term).not.toBeInTheDocument();

// 		const term3 = screen.getByText(/Term 3/i);

// 		expect(term3).toBeInTheDocument();
// 	});  
// });

// test("Flashcard goes next and previous using keys", async () => {
// 	const term = screen.getByText(/Term 1/i);

// 	expect(term).toBeInTheDocument();

// 	await user.keyboard("ArrowLeft");

// 	waitFor(async () => {
// 		expect(term).not.toBeInTheDocument();

// 		const term2 = screen.getByText(/Term 2/i);

// 		expect(term2).toBeInTheDocument();

// 		await user.keyboard("ArrowRight");

// 		waitFor(() => {
// 			expect(term2).not.toBeInTheDocument();

// 			expect(term).toBeInTheDocument();
// 		});
// 	});
// });
