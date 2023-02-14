import React, { useContext, useEffect, useState } from "react";
import { ListGroup, ListGroupItem, Button, Toast, ToastHeader, ToastBody, Input } from "reactstrap";
import { CardSetContext, CardType } from "../../pages/CardSetPage/CardSetPage";

const CardListItem = ({ card }: { card: CardType }) => {
	const { cardSet, setCardSet } = useContext(CardSetContext);
	const cardIndex = cardSet.findIndex(cardIndex => cardIndex._id === card._id);
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
	const deleteHandler = (isDelete: boolean) => {
		if (isDelete) setCardSet(cardSet.filter(cardFilter => cardFilter !== card));
		setDeleteShow(false);
	};

	const editCardHandler = (isEdit: boolean) => {
		if (isEdit && termValue && definitionValue) {
			const newCard = { _id: card._id, term: termValue, definition: definitionValue };
			const newCardSet = [...cardSet];
			newCardSet[cardIndex] = newCard;
			setCardSet(newCardSet);

			setCurrTerm(termValue);
			setCurrDefinition(definitionValue);
		}

		setEditable(false);
	};

	return (
		<ListGroup className="card-item divider-block" horizontal key={ card._id }>
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