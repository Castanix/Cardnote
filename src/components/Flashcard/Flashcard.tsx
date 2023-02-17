import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

import "./Flashcard.css";

const Flashcard = ({ card }: { card: CardType }) => {
	const [isFlip, setIsFlip] = useState<boolean>();
	const [showDefinition, setShowDefinition] = useState<boolean>(false);

	useEffect(() => {
		setIsFlip(undefined);
		setShowDefinition(false);
	}, [card]);
	
	useEffect(() => {
		const timeout = setTimeout(() => setShowDefinition(isFlip), 150);

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