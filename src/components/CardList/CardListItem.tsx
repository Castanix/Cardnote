import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Button, Toast, ToastHeader, ToastBody, Input } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";
import DeleteCard from "./axios/DeleteCard";
import UpdateCard from "./axios/UpdateCard";

export type DeleteCardType = {
	card_id: number,
	set_id: number,
	numCards: number,
};

export type UpdateCardType = {
	card_id: number,
	term: string,
	definition: string,
};


/*
* Item component for CardList.tsx. Keeps track of states for a singular card in the card set.
* 
* card: a singular card element in the cardSet
*/
const CardListItem = ({ card, cardSet }: { card: CardType, cardSet: CardType[] }) => {
	// const cardSet = useContext(CardSetContext);
	
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
		if (isEdit && termValue && definitionValue) {
			const updatedCard = { 
				card_id: card.card_id, 
				term: termValue, 
				definition: definitionValue 
			};

			const status = await UpdateCard(updatedCard);
			
			if (status === 204) {
				setCurrTerm(termValue);
				setCurrDefinition(definitionValue);
			} else console.error("Error updating card");			
		}

		setEditable(false);
	};


	/* Rendered component */
	return (
		<ListGroup className="card-item divider-block" horizontal key={ card.card_id }>
			<ListGroupItem className="card-term">
				{ editable 
					? <Input value={ termValue } onChange={ (e) => setTermValue(e.target.value) } />
					: currTerm
				}
			</ListGroupItem>
			<ListGroupItem className="card-definition">
				{ editable 
					? <Input value={ definitionValue } onChange={ (e) => setDefinitionValue(e.target.value) } />
					: currDefinition
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