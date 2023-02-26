import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import AddCardForm from "../../components/CardList/AddCardForm";
import CardList from "../../components/CardList/CardList";

import "./CardSetPage.css";
import GetCards from "./axios/GetCards";

export type CardType = {
	card_id: number,
	term: string,
	definition: string,
	set_id: number,
};


/* Page component */
const CardSetPage = () => {
	const { cardSetName, cardSetId } = useParams();	

	const { data, loading, error } = GetCards(Number(cardSetId));

	if (loading) {return <div>Loading</div>;}
	if (error) {return <div>Error</div>;}

	return (
		<main className="page-margin">
			<Card className="card-set-page">
				<CardHeader><Link to="/">{ "<- " }<span className="hoverable-link">Back to home</span></Link></CardHeader>
				<div className="divider-block">
					<CardBody className="title-body">
						<div>
							<CardTitle tag="h2">
								{ cardSetName }
							</CardTitle>
							{/* <CardSubtitle tag="h6">
								Description
							</CardSubtitle> */}
						</div>
						<div className="flashcard-button">
							<Link to={ `/${ cardSetName }/${ cardSetId }/flashcard` } state={{ cardSet: data }}><Button outline color="primary">Flashcards</Button></Link>
						</div>
					</CardBody>
					<CardBody className="add-card-body">
						<AddCardForm cardSetId={ Number(cardSetId) } cardSet={ data } />
					</CardBody>
					<CardBody className="card-list-body">
						<CardList cardSet={ data } />
					</CardBody>
				</div>
			</Card>
		</main>
	);
};

export default CardSetPage;