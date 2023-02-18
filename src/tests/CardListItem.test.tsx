import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import CardListItem from "../components/CardList/CardListItem";
import { CardSetContextProvider, CardType } from "../pages/CardSetPage/CardSetPage";

let document: HTMLElement;
let user: UserEvent;

const mockedCard: CardType =
	{
		_id: "1",
		term: "Card 1",
		definition: "Definition 1",
	};

const Wrapper = () => {
	const [cardSet, setCardSet] = useState<CardType[]>([]);

	return (
		<CardSetContextProvider value={{ cardSet, setCardSet }}>
			<CardListItem card={mockedCard} />
		</CardSetContextProvider>
	);
};

beforeEach(() => {
	document = render(<Wrapper />).container;
	user = userEvent.setup();
});

test("Edit card", async () => {
	let term = screen.getByText(/Card 1/i);
	let definition = screen.getByText(/Definition 1/i);
	const editButton = screen.getByText(/Edit/i);

	expect(editButton).toBeInTheDocument();
	expect(term).toBeInTheDocument();
	expect(definition).toBeInTheDocument();

	await user.click(editButton);

	expect(editButton).not.toBeInTheDocument();

	const inputs = document.querySelectorAll(".form-control");
	const termInput = inputs[0];
	const definitionInput = inputs[1];
	const confirmButton = screen.getByText(/Confirm/i);

	await user.clear(termInput);
	await user.type(termInput, "New Card");
	await user.clear(definitionInput);
	await user.type(definitionInput, "New Definition");

	await user.click(confirmButton);

	term = screen.getByText(/New Card/i);
	definition = screen.getByText(/New Definition/i);

	expect(term).toBeInTheDocument();
	expect(definition).toBeInTheDocument();
});

test("Cancel edit on card", async () => {
	const term = screen.getByText(/Card 1/i);
	const definition = screen.getByText(/Definition 1/i);
	const editButton = screen.getByText(/Edit/i);

	expect(term).toBeInTheDocument();
	expect(definition).toBeInTheDocument();

	await user.click(editButton);

	const inputs = document.querySelectorAll(".form-control");
	const termInput = inputs[0];
	const definitionInput = inputs[1];
	const cancelButton = screen.getByText(/Cancel/i);

	await user.clear(termInput);
	await user.type(termInput, "New Card");
	await user.clear(definitionInput);
	await user.type(definitionInput, "New Definition");

	await user.click(cancelButton);

	expect(term).toBeInTheDocument();
	expect(definition).toBeInTheDocument();
});

test("Delete toast renders", async () => {
	const card = document.querySelector(".card-item");

	expect(card).toBeInTheDocument();

	const deleteButton = screen.getByText(/Delete/i);

	await user.click(deleteButton);

	const toastHeader = screen.getByText(/Confirm delete/i);

	expect(toastHeader).toBeInTheDocument();
});

