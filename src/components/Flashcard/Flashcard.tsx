import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

import "./Flashcard.css";

const Flashcard = ({ card }: { card: CardType }) => {
	const [isFlip, setIsFlip] = useState<boolean>();
	const [showDefinition, setShowDefinition] = useState<boolean>(false);

	useEffect(() => {
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
		setIsFlip(undefined);
		setShowDefinition(false);

		const flashcardEl = document.querySelector(".flashcard");
		const timeout = setTimeout(() => flashcardEl.classList.remove("entercard-left", "entercard-right"), 400);

		return () => {
			clearTimeout(timeout);
		};
	}, [card]);
	
	useEffect(() => {
		const timeout = setTimeout(() => setShowDefinition(isFlip ?? false), 150);

		return () => {
			clearTimeout(timeout);
		};
	}, [isFlip]);

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
					{ card.definition }
				</div>
			</CardBody>
		</Card>
	);
};

export default Flashcard;