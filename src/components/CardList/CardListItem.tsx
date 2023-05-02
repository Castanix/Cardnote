import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Button, Toast, ToastHeader, ToastBody, Input } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";
import DeleteCard from "./axios/DeleteCard";
import UpdateCard from "./axios/UpdateCard";
import ReactMarkdown from "react-markdown";
import SimpleMdeReact from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";

export type DeleteCardType = {
	card_id: number,
	set_id: number,
	numCards: number,
};

export type UpdateCardType = {
	card_id: number,
	term: string,
	definition: string,
	set_id: number,
};


const testIsMobile = () => {
	if (typeof window === "undefined") return true;
	return window.innerWidth < 600;
};


/* Custom hook for checking if window size is mobile on resize */
const useIsMobileSize = () => {
	const [isMobileSize, setIsMobileSize] = useState<boolean>(testIsMobile());

	useEffect(() => {
		if (typeof window === "undefined") return;

		const autoResize = () => {
			setIsMobileSize(testIsMobile());
		};

		window.addEventListener("resize", autoResize);

		// Return a function to disconnect the event listener
		return () => window.removeEventListener("resize", autoResize);
	}, []);

	return isMobileSize;
};


/*
* Item component for CardList.tsx. Keeps track of states for a singular card in the card set.
* 
* card: a singular card element in the cardSet
*/
const CardListItem = ({ card, cardSet }: { card: CardType, cardSet: CardType[] }) => {
	const cardIndex = cardSet.findIndex(cardIndex => cardIndex.card_id === card.card_id);
	const [deleteShow, setDeleteShow] = useState<boolean>(false);
	const [editable, setEditable] = useState<boolean>(false);
	const [termValue, setTermValue] = useState<string>(card.term);
	const [definitionValue, setDefinitionValue] = useState<string>(card.definition);


	/* Currently displayed values in render */
	const [currTerm, setCurrTerm] = useState<string>(card.term);
	const [currDefinition, setCurrDefinition] = useState<string>(card.definition);


	/* Use effects */
	useEffect(() => {
		setTermValue(currTerm);
		setDefinitionValue(currDefinition);
	}, [currTerm, currDefinition, editable]);


	/* Component functions */
	const deleteHandler = async (isDelete: boolean) => {
		if (isDelete) {
			const { card_id, set_id } = cardSet[cardIndex];

			const deletedCard = {
				card_id,
				set_id,
				numCards: cardSet.length - 1,
			};

			const status = await DeleteCard(deletedCard);

			if (status !== 204) {
				console.log("Error deleting card");
			}
		}
		setDeleteShow(false);
	};

	const editCardHandler = async (isEdit: boolean) => {
		// Check if edit has been confirmed, if term and definition value exists, and if a change has occurred
		if (isEdit && termValue.trim().length > 0 && definitionValue.trim().length > 0
			&& !(termValue.trim() === currTerm && definitionValue.trim() === currDefinition)) {
			const updatedCard = { 
				card_id: card.card_id, 
				term: termValue, 
				definition: definitionValue,
				set_id: card.set_id,
			};

			const status = await UpdateCard(updatedCard);
			
			if (status === 204) {
				setCurrTerm(termValue.trim());
				setCurrDefinition(definitionValue.trim());
			} else console.error("Error updating card");			
		}

		setEditable(false);
	};


	/* Rendered component */
	return (
		<ListGroup className="card-item divider-block" horizontal={ useIsMobileSize() ? false : true } key={ card.card_id }>
			<ListGroupItem className="card-term">
				{ editable 
					? <Input value={ termValue } onChange={ (e) => setTermValue(e.target.value) } />
					: currTerm
				}
			</ListGroupItem>
			<ListGroupItem className="card-definition">
				{ editable 
					? <SimpleMdeReact value={ definitionValue } onChange={ (e) => setDefinitionValue(e) } />
					: <ReactMarkdown>{ currDefinition }</ReactMarkdown>
				}
			</ListGroupItem>
			<ListGroupItem className="card-toolbar divider-block">
				{ editable
					? <div className="divider-block">
						<Button outline onClick={ () => editCardHandler(true) }>Confirm</Button>
						<Button outline onClick={ () => editCardHandler(false) }>Cancel</Button>
					</div>
					: <Button outline onClick={ () => setEditable(true) }>Edit</Button>
				}
				<Button 
					outline 
					color="danger"
					onClick={ () => setDeleteShow(true) }
				>Delete</Button>
			</ListGroupItem>

			<Toast isOpen={ deleteShow } style={{ position: "absolute", right: 0, zIndex: 1 }}>
				<ToastHeader 
					icon="warning" 
					toggle={ () => deleteHandler(false) }
				>Confirm delete?</ToastHeader>
				<ToastBody>
					<div className="divider-inline">
						<Button 
							onClick={ () => deleteHandler(true) }
						>Ok</Button>
						<Button
							onClick={ () => deleteHandler(false) }
						>Cancel</Button>
					</div>
				</ToastBody>
			</Toast>
		</ListGroup>
	);
};

export default CardListItem;