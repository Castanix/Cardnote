import React, { useEffect, useState } from "react";
import { ListGroupItemHeading, ListGroupItemText, Button, Input, Toast, ToastBody, ToastHeader, Badge } from "reactstrap";
import { CardSetType } from "./CardSetList";
import { Link } from "react-router-dom";
import DeleteCardSet from "./axios/DeleteCardSet";
import UpdateCardSet from "./axios/UpdateCardSet";


export type EditCardSetType = {
	set_id: number,
	name: string,
	description: string,
};


/*
* Set item component for CardSetList. Contains state of each item in the list including editing and deleting
*
* set: a singular set element in the array of cardSets
* cardSets: contains overall set list data
* setCardSets: State dispatch function for cardSets
*/
const CardSetListItem = ({ set, cardSets }: { set: CardSetType, cardSets: CardSetType[] }) => {
	const setIndex = cardSets.findIndex(setIndex => setIndex.set_id === set.set_id);
	const [editable, setEditable] = useState<boolean>(false);
	const [deleteShow, setDeleteShow] = useState<boolean>(false);


	/* Editable input values */
	const [nameValue, setNameValue] = useState<string>(set.name);
	const [descriptionValue, setDescriptionValue] = useState<string>(set.description);


	/* Currently displayed values in render */
	const [currName, setCurrName] = useState<string>(set.name);
	const [currDescription, setCurrDescription] = useState<string>(set.description);

	
	/* Use effects */
	useEffect(() => {
		setNameValue(currName);
		setDescriptionValue(currDescription);
	}, [currName, currDescription, editable]);


	/* Component functions */
	const editCardSetHandler = async (isEdit: boolean) => {
		// Check if edit has been confirmed, if name value exists, and if a change has occurred
		if (isEdit && nameValue && !(nameValue === currName && descriptionValue === currDescription)) {
			const status = await UpdateCardSet({ set_id: cardSets[setIndex].set_id, name: nameValue, description: descriptionValue });

			if (status === 204) {
				const newCardSets = [...cardSets];
				const newSet = { set_id: set.set_id, name: nameValue, description: descriptionValue, numCards: set.numCards };
				newCardSets[setIndex] = newSet;
	
				setCurrName(nameValue);
				setCurrDescription(descriptionValue);
			} else console.log("Error updating card set");
		}

		setEditable(false);
	};

	const deleteHandler = async (isDelete: boolean) => {
		if (isDelete) {
			const status = await DeleteCardSet(cardSets[setIndex].set_id);

			if (status !== 204) console.log("Error deleting set");
		}
		setDeleteShow(false);
	};

	const showDeleteHandler = async () => {
		if (set.numCards === 0) {
			const status = await DeleteCardSet(cardSets[setIndex].set_id);

			if (status !== 204) console.log("Error deleting card set");
		}
		else setDeleteShow(!deleteShow);
	};


	/* Rendered component */
	return set
		? <div className="card-set-list-items">
			<div className="card-set-info">
				<ListGroupItemHeading>
					{ editable 
						? <Input 
							value={ nameValue } 
							maxLength={ 255 }
							onChange={ e => setNameValue(e.target.value) }
						/>
						: <div className="divider-inline">
							<Link to={ `/${ set.name }/${ set.set_id }` } title={ `Navigate to ${ set.name }` }>
								<span className="hoverable-link">{ currName }</span>
							</Link>
							<Badge>
								{ set.numCards } cards in set
							</Badge>
						</div>
					}
				</ListGroupItemHeading>

				{ editable
					? <Input
						value={ descriptionValue }
						maxLength={ 510 }
						onChange={ e => setDescriptionValue(e.target.value) }
					/>
					: <ListGroupItemText>
						{ set.description
							? currDescription
							: null
						}
					</ListGroupItemText>
				}
			</div>
			
			<div className="card-set-toolbar" style={{ textAlign: "center" }}>
				<div className="divider-block divider-inline">
					{ editable
						? <div className="divider-inline">
							<Button size="sm" outline onClick={ () => editCardSetHandler(true) }>Confirm edit</Button>
							<Button size="sm" outline onClick={ () => editCardSetHandler(false) }>Cancel edit</Button>
						</div>
						: <Button size="sm" outline onClick={ () => setEditable(true) }>Edit Set</Button>
					}
					<Button
						size="sm"
						color="danger"
						outline
						onClick={ showDeleteHandler }
					>Delete Set</Button>
				</div>

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
			</div>
		</div>
		: null;
};

export default CardSetListItem;