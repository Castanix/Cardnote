import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import Flashcard from "../../components/Flashcard/Flashcard";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";

import "./FlashcardsPage.css";
import { CardType } from "../CardSetPage/CardSetPage";


/* Functions */
const shuffleSet = (cardSet: CardType[]) => {
	let currIndex = cardSet.length, randomIndex;

	while (currIndex > 0) {
		randomIndex = Math.floor(Math.random() * currIndex);
		currIndex--;

		[cardSet[currIndex], cardSet[randomIndex]] = [cardSet[randomIndex], cardSet[currIndex]];
	}

	return cardSet;
};


/* Page component */
const FlashcardsPage = () => {
	const { cardSet } = useLocation().state;
	const { cardSetName, cardSetId } = useParams();

	const randomizedSet = useMemo(() => shuffleSet(cardSet), [cardSet]);
	const [flashcardSet, setFlashcardSet] = useState<CardType[]>(randomizedSet);
	const [cardIndex, setCardIndex] = useState<number>(0);
	const [currCard, setCurrCard] = useState<CardType>(flashcardSet[cardIndex]);


	useEffect(() => {
		setCurrCard(flashcardSet[cardIndex]);
	}, [cardIndex]);

	/* Use effects */
	useEffect(() => {
		// Add keyboard event and handler for arrow keys to scroll cards
		const keyPressEvent = (e: KeyboardEvent) => {
			handleKeyPress(e); 
		};

		const handleKeyPress = (e: KeyboardEvent) => {
			switch(e.code) {
			case "ArrowLeft":
				handleLeft();
				break;
			case "ArrowRight":
				handleRight();
				break;
			}
		};

		document.addEventListener("keydown", keyPressEvent);

		return () => {
			document.removeEventListener("keydown", keyPressEvent);
		};
	}, [cardIndex, flashcardSet]);


	/* Page handlers */
	const handleLeft = () => {
		if (cardIndex === 0) setCardIndex(flashcardSet.length - 1);
		else setCardIndex(cardIndex - 1);

		const flashcardEl = document.querySelector(".flashcard");

		// TODO: Discover better way to set entry animations when scrolling to new card from a flipped card.
		setTimeout(() => flashcardEl.classList.add("entercard-left"), 1);
	};

	const handleRight = () => {
		if (cardIndex === flashcardSet.length - 1) setCardIndex(0);
		else setCardIndex(cardIndex + 1);

		const flashcardEl = document.querySelector(".flashcard");

		// TODO: Discover better way to set entry animations when scrolling to new card from a flipped card.
		setTimeout(() => flashcardEl.classList.add("entercard-right"), 1);
	};

	const handleRandomize = () => {
		setFlashcardSet(shuffleSet(cardSet));
		setCardIndex(0);
		setCurrCard(flashcardSet[0]);
	};


	/* Rendered component */
	return (
		<main className="page-margin">
			{ flashcardSet.length > 0
				? <Card>
					<CardHeader><Link to={ `/${ cardSetName }/${ cardSetId }` }>{ "<- " }<span className="hoverable-link">Back to cards</span></Link></CardHeader>
					<CardBody className="flashcard-container">
						<BsCaretLeftFill title="previous-card" className="swap-card-button pc left-button" onClick={ handleLeft } />
						<Flashcard card={ currCard } />
						<BsCaretRightFill title="next-card" className="swap-card-button pc right-button" onClick={ handleRight } />
					</CardBody>
					<div className="swap-card-container-mobile">
						<BsCaretLeftFill title="previous-card" className="swap-card-button left-button" onClick={ handleLeft } />
						<BsCaretRightFill title="next-card" className="swap-card-button right-button" onClick={ handleRight } />
					</div>
					<CardFooter>
						<Button onClick={handleRandomize}>Randomize Set</Button>
					</CardFooter>
				</Card>
				: <div>Either request has expired or no cards in set. Please return to <Link to={ `/${ cardSetName }/${ cardSetId }` }><u>cards</u></Link></div>
			}
		</main>
	);
};

export default FlashcardsPage;