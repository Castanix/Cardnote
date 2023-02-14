import React, { createContext, ReactNode, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "reactstrap";
import AddCardForm from "../../components/CardList/AddCardForm";
import CardList from "../../components/CardList/CardList";

import "./CardSetPage.css";

export type CardType = {
	_id: string,
	term: string,
	definition: string,
};

type CardSetContextType = {
	cardSet: CardType[],
	setCardSet: React.Dispatch<React.SetStateAction<CardType[]>>
};


const mockedList: CardType[] = [
	{
		_id: "1",
		term: "Card 1",
		definition: "Definition 1",
	},
	{
		_id: "2",
		term: "Card 2",
		definition: "Definition 2",
	},
	{
		_id: "3",
		term: "Card 3",
		definition: "Definition 3",
	},
	{
		_id: "4",
		term: "Card 4",
		definition: "Definition 4",
	},
	{
		_id: "5",
		term: "Card 5",
		definition: "Definition 5",
	},
	{
		_id: "6",
		term: "Card 6",
		definition: "Definition 6",
	},
	{
		_id: "7",
		term: "Card 7",
		definition: "Definition 7",
	},
];

export const CardSetContext = createContext<CardSetContextType | null>(null);

const CardSetContextProvider = ({ children }: { children: ReactNode }) => {
	const [cardSet, setCardSet] = useState<CardType[]>(mockedList);

	return (
		<CardSetContext.Provider value={{ cardSet, setCardSet }}>
			{ children }
		</CardSetContext.Provider>
	);
};

const CardSetPage = () => {
	const { cardSetId } = useParams();	

	return (
		<main className="page-margin">
			<Card className="card-set-page">
				<CardHeader><Link to="/">{ "<- " }<span className="hoverable-link">Back to home</span></Link></CardHeader>
				<div className="divider-block">
					<CardBody className="title-body">
						<div>
							<CardTitle tag="h2">
								{ cardSetId }
							</CardTitle>
							<CardSubtitle tag="h6">
								Description
							</CardSubtitle>
						</div>
						<div className="flashcard-button">
							<Button outline color="primary">Flashcards</Button>
						</div>
					</CardBody>
					<CardSetContextProvider>
						<CardBody className="add-card-body">
							<AddCardForm />
						</CardBody>
						<CardBody className="card-list-body">
							<CardList />
						</CardBody>
					</CardSetContextProvider>
				</div>
			</Card>
		</main>
	);
};

export default CardSetPage;