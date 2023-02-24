import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CardSetPage from "../pages/CardSetPage/CardSetPage";

let document: HTMLElement;
let user: UserEvent;

const customRender = (
	<MemoryRouter initialEntries={ ["/Test Set"] }>
		<Routes>
			<Route path="/:cardSetId" element={ <CardSetPage /> }></Route>
		</Routes>
	</MemoryRouter>
);

beforeEach(() => {
	document = render(customRender).container;
	user = userEvent.setup();
});

test("Page renders", () => {
	const title = screen.getByText(/Test Set/i);
	const description = screen.getByText(/Description/i);
	const addCard = screen.getAllByText(/Add card/i);
	const cardSet = screen.getByText(/Card set/i);
	const homeButton = screen.getByText(/Back to home/i);

	expect(title).toBeInTheDocument();
	expect(description).toBeInTheDocument();
	expect(addCard).toHaveLength(2);
	expect(cardSet).toBeInTheDocument();
	expect(homeButton).toBeInTheDocument();
});

test("Number of cards in set", () => {
	const numCards = document.querySelectorAll(".accordion-body")[1].childElementCount;

	expect(numCards).toBe(7);
});

test("Add new card to set", async () => {
	const termInput = screen.getByPlaceholderText(/Enter Term/i);
	const definitionInput = screen.getByPlaceholderText(/Enter Definition/i);
	const addButton = screen.getAllByText(/Add card/i)[1];

	await user.type(termInput, "Term");
	await user.type(definitionInput, "Definition");

	await user.click(addButton);

	const numCards = document.querySelectorAll(".accordion-body")[1].childElementCount;

	expect(numCards).toBe(8);
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
