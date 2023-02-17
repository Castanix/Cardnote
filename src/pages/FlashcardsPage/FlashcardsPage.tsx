import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader } from "reactstrap";
import Flashcard from "../../components/Flashcard/Flashcard";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

import "./FlashcardsPage.css";

const FlashcardsPage = () => {
	const { cardSet } = useLocation().state;
	const { cardSetId } = useParams();

	const [cardIndex, setCardIndex] = useState<number>(0);

	const handleLeft = () => {
		if (cardIndex === 0) setCardIndex(cardSet.length - 1);
		else setCardIndex(cardIndex - 1);
	};

	const handleRight = () => {
		if (cardIndex === cardSet.length - 1) setCardIndex(0);
		else setCardIndex(cardIndex + 1);
	};

	return (
		<main className="page-margin">
			{ cardSet 
				? <Card>
					<CardHeader><Link to={ `/${ cardSetId }` }>{ "<- " }<span className="hoverable-link">Back to cards</span></Link></CardHeader>
					<CardBody className="flashcard-container">
						<BsCaretLeftFill className="swap-card-button" onClick={ handleLeft } />
						<Flashcard card={ cardSet[cardIndex] } />
						<BsCaretRightFill className="swap-card-button" onClick={ handleRight } />
					</CardBody>
				</Card>
				: <div>Request has expired. Please return to <Link to={ `/${ cardSetId }` }>cards</Link></div>
			}
		</main>
	);
};

export default FlashcardsPage;