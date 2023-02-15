import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { BrowserRouter } from "react-router-dom";
import CardSetListPage from "../pages/CardSetListPage/CardSetListPage";

let document: HTMLElement;
let user: UserEvent;

beforeEach(() => {
	document = render(<CardSetListPage />, { wrapper: BrowserRouter }).container;
	user = userEvent.setup();
});

test("Render searchbar", () => {
	const searchbar = screen.getByPlaceholderText(/Search set/i);
	expect(searchbar).toBeInTheDocument();
});

test("Render add set button", () => {
	const addBtn = document.querySelector("#add-set-button");
	expect(addBtn).toBeInTheDocument();
});

test("Click add set button", async () => {
	const addBtn = document.querySelector("#add-set-button");

	expect(screen.queryByText(/Add name/i)).toBeNull();
	await userEvent.click(addBtn);
	expect(screen.getByText(/Add name/i)).toBeInTheDocument();

});

test("Render pagination", () => {
	const pagination = document.querySelector(".pagination");
	expect(pagination).toBeInTheDocument();

	// Pagination should be rendered on page 1 with first, previous disabled and page 1 active
	const paginationFirst = screen.getByTitle("first");
	const paginationPrev = screen.getByTitle("prev");
	const paginationOne = screen.getByTitle("page 1");
	const paginationNext = screen.getByTitle("next");
	const paginationLast = screen.getByTitle("last");

	expect(paginationFirst).toHaveClass("disabled");
	expect(paginationPrev).toHaveClass("disabled");
	expect(paginationOne).toHaveClass("active");

	expect(paginationNext).toBeInTheDocument();
	expect(paginationLast).toBeInTheDocument();
});

test("Change pages with pagination", async () => {
	const paginationTwo = screen.getByTitle("page 2");

	expect(paginationTwo).not.toHaveClass("active");
	await user.click(paginationTwo);
	expect(paginationTwo).toHaveClass("active");
});
