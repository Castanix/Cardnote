import React, { useState } from "react";
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

const CardSetPage = () => {
	const { cardSetId } = useParams();
	const [ cardSet, setCardSet ] = useState<CardType[]>(mockedList);

	return (
		<main className="page-margin">
			<Card>
				<CardHeader><Link to="/">{"<- "}<u>Back to home</u></Link></CardHeader>
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
						<Button>Start flashcards</Button>
					</CardBody>
					<CardBody className="add-card-body">
						<AddCardForm cardSet={cardSet} setCardSet={setCardSet} />
					</CardBody>
					<CardBody className="card-list-body">
						<CardList cardSet={cardSet} />
					</CardBody>
				</div>
			</Card>
		</main>
	);
};

export default CardSetPage;