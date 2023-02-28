import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CardType } from "../pages/CardSetPage/CardSetPage";
import FlashcardsPage from "../pages/FlashcardsPage/FlashcardsPage";

let document: HTMLElement;
let user: UserEvent;

const mockCardSet: CardType[] = [
	{
		card_id: 1,
		term: "Term 1",
		definition: "Definition 1",
		set_id: 1,
	},
	{
		card_id: 2,
		term: "Term 2",
		definition: "Definition 2",
		set_id: 1,
	},
	{
		card_id: 3,
		term: "Term 3",
		definition: "Definition 3",
		set_id: 1,
	}
];

const customRender = (
	<MemoryRouter initialEntries={[{ pathname: "/Test Set/1/flashcard", state: { cardSet: mockCardSet } }]}>
		<Routes>
			<Route path="/:cardSetName/:cardSetId/flashcard" element={ <FlashcardsPage /> }></Route>
		</Routes>
	</MemoryRouter>
);

beforeEach(() => {
	document = render(customRender).container;
	user = userEvent.setup();
});

test("Flashcard renders", async () => {
	const term = screen.queryByText(/Term 1/i);
	const term2 = screen.queryByText(/Term 2/i);
	const term3 = screen.queryByText(/Term 3/i);
	const leftButton = screen.getByTitle(/previous-card/i);
	const rightButton = screen.getByTitle(/next-card/i);
	
	expect(term || term2 || term3).toBeInTheDocument();
	expect(leftButton).toBeInTheDocument();
	expect(rightButton).toBeInTheDocument();
});

test("Flashcard flips", async () => {
	const card = document.querySelector(".flashcard");
	const definitionContainer = screen.queryByText(/Definition 1/i)?.parentNode;
	const definitionContainer2 = screen.queryByText(/Definition 2/i)?.parentNode;
	const definitionContainer3 = screen.queryByText(/Definition 3/i)?.parentNode;

	expect(definitionContainer || definitionContainer2 || definitionContainer3).toHaveClass("hide-text");

	await user.click(card);

	await waitFor(() => {
		expect(definitionContainer || definitionContainer2 || definitionContainer3).toHaveClass("definition");
	});
});

test("Flashcard goes to next card", async () => {
	const nextButton = screen.getByTitle("next-card");
	let term = screen.queryByText(/Term 1/i);
	let term2 = screen.queryByText(/Term 2/i);
	let term3 = screen.queryByText(/Term 3/i);

	let num: number;
	if (term) num = 1;
	if (term2) num = 2;
	if (term3) num = 3;

	await user.click(nextButton);

	switch(num) {
		case 1:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term).toBeNull();
				expect(term2 || term3).toBeInTheDocument();
			}); 
			break;
		case 2:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);

				expect(term2).toBeNull();
				expect(term || term3).toBeInTheDocument();
			}); 
			break;
		case 3:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term3).toBeNull();
				expect(term || term2).toBeInTheDocument();
			}); 
			break;
	}
});

test("Flashcard goes to previous card", async () => {
	const previousButton = screen.getByTitle("previous-card");
	let term = screen.queryByText(/Term 1/i);
	let term2 = screen.queryByText(/Term 2/i);
	let term3 = screen.queryByText(/Term 3/i);

	let num: number;
	if (term) num = 1;
	if (term2) num = 2;
	if (term3) num = 3;

	await user.click(previousButton);

	switch(num) {
		case 1:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term).toBeNull();
				expect(term2 || term3).toBeInTheDocument();
			}); 
			break;
		case 2:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);

				expect(term2).toBeNull();
				expect(term || term3).toBeInTheDocument();
			}); 
			break;
		case 3:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term3).toBeNull();
				expect(term || term2).toBeInTheDocument();
			}); 
			break;
	} 
});

test("Flashcard goes next and previous using keys", async () => {
	let term = screen.queryByText(/Term 1/i);
	let term2 = screen.queryByText(/Term 2/i);
	let term3 = screen.queryByText(/Term 3/i);

	let num: number;
	if (term) num = 1;
	if (term2) num = 2;
	if (term3) num = 3;

	await user.keyboard("{ArrowLeft}");

	switch(num) {
		case 1:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term).toBeNull();
				expect(term2 || term3).toBeInTheDocument();
			}); 
			break;
		case 2:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);

				expect(term2).toBeNull();
				expect(term || term3).toBeInTheDocument();
			}); 
			break;
		case 3:
			await waitFor(() => {
				term = screen.queryByText(/Term 1/i);
				term2 = screen.queryByText(/Term 2/i);
				term3 = screen.queryByText(/Term 3/i);
		
				expect(term3).toBeNull();
				expect(term || term2).toBeInTheDocument();
			}); 
			break;
	} 
});
