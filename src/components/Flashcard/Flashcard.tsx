import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

import "./Flashcard.css";
import ReactMarkdown from "react-markdown";


/*
* Card component containing the state and render for a card
* It is the main component rendered for the FlashcardPage.tsx.
*
* card: contains the card data used for rendering
*/
const Flashcard = ({ card }: { card: CardType }) => {
	const [isFlip, setIsFlip] = useState<boolean>();
	const [showDefinition, setShowDefinition] = useState<boolean>(false);


	/* Use effects */
	useEffect(() => {
		// Add keyboard event and handler for arrow keys to flip card
		const keyPressEvent = (e: KeyboardEvent) => {
			handleKeyPress(e);
		};

		const handleKeyPress = (e: KeyboardEvent) => {
			switch(e.code) {
			case "ArrowUp":
			case "ArrowDown":
				setIsFlip(!isFlip);
				break;
			}
		};

		document.addEventListener("keydown", keyPressEvent);

		return () => {
			document.removeEventListener("keydown", keyPressEvent);
		};
	}, [isFlip]);

	useEffect(() => {
		// Reset states per new card prop and removes animation class after a set delay
		setIsFlip(undefined);
		setShowDefinition(false);

		const flashcardEl = document.querySelector(".flashcard");
		const timeout = setTimeout(() => flashcardEl.classList.remove("entercard-left", "entercard-right"), 400);

		return () => {
			clearTimeout(timeout);
		};
	}, [card]);
	
	useEffect(() => {
		// Set new state for 'showDefinition' after delay to allow flip animation to process
		const timeout = setTimeout(() => setShowDefinition(isFlip ?? false), 150);

		return () => {
			clearTimeout(timeout);
		};
	}, [isFlip]);


	/* Rendered component */
	return (
		<Card
			className={ `flashcard ${ isFlip === undefined
				? "" 
				: (isFlip ? "flip" : "flip-reverse" ) }`
			} 
			onClick={ () => setIsFlip(!isFlip ?? true) }
		>
			<CardBody className={ `card-text-container ${ showDefinition ? "hide-text" : "term" }`
			}>
				<div className="card-text">
					{ card.term }
				</div>
			</CardBody>
			<CardBody className={ `card-text-container ${ showDefinition ? "definition" : "hide-text" }`
			}>
				<div className="card-text">
					<ReactMarkdown>{ card.definition }</ReactMarkdown>
				</div>
			</CardBody>
		</Card>
	);
};

export default Flashcard;