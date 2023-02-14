import React, { useEffect, useState } from "react";
import { ListGroupItemHeading, ListGroupItemText, Button, Input, Toast, ToastBody, ToastHeader, Badge } from "reactstrap";
import { CardSetType } from "./CardSetList";
import { Link } from "react-router-dom";

/*
* Set item component for CardSetList. Contains state of each item in the list including editing and deleting
*
* _id: unique identifier of each item in the list, used here specifically to find index in cardSets
* cardSets: contains overall set list data
* setCardSets: State dispatch function for cardSets
*/
const CardSetListItem = ({ set, cardSets, setCardSets }: { set: CardSetType, cardSets: CardSetType[], setCardSets: React.Dispatch<React.SetStateAction<CardSetType[]>> }) => {
	const setIndex = cardSets.findIndex(setIndex => setIndex._id === set._id);
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
	const editCardSetHandler = (isEdit: boolean) => {
		if (isEdit && nameValue) {
			const newCardSets = [...cardSets];
			const newSet = { _id: set._id, name: nameValue, description: descriptionValue, numCards: set.numCards };
			newCardSets[setIndex] = newSet;
			setCardSets(newCardSets);

			setCurrName(nameValue);
			setCurrDescription(descriptionValue);
		}

		setEditable(false);
	};

	const deleteHandler = (isDelete: boolean) => {
		if (isDelete) setCardSets(cardSets.filter(setFilter => setFilter !== set));
		setDeleteShow(false);
	};

	const showDeleteHandler = () => {
		if (set.numCards === 0) setCardSets(cardSets.filter(setFilter => setFilter !== set));
		else setDeleteShow(!deleteShow);
	};

	/* Rendered component */
	return set
		? <div className="card-set-list-items">
			<div>
				<ListGroupItemHeading>
					{ editable 
						? <Input 
							value={nameValue} 
							onChange={ e => setNameValue(e.target.value) }
						/>
						: <div className="divider-inline">
							<Link to={ `/${set.name}` } title={ `Navigate to ${set.name}` }><span className="hoverable-link">{ currName }</span></Link>
							<Badge>
								{ set.numCards } cards in set
							</Badge>
						</div>
					}
				</ListGroupItemHeading>

				{ set.description 
					? <ListGroupItemText>
						{ editable 
							? <Input
								value={ descriptionValue }
								onChange={ e => setDescriptionValue(e.target.value) }
							/> 
							: currDescription
						}
					</ListGroupItemText> 
					: null
				}
			</div>
			
			<div style={{ textAlign: "center" }}>
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