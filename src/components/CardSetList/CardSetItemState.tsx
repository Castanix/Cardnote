import React, { useState } from "react";
import { ListGroupItemHeading, ListGroupItemText, Button, Input, Toast, ToastBody, ToastHeader, Badge } from "reactstrap";
import { CardSetType } from "./CardSetList";

const CardSetItemState = ({ id, cardSets, setCardSets }: { id: string, cardSets: CardSetType[], setCardSets: React.Dispatch<React.SetStateAction<CardSetType[]>> }) => {
	const setIndex = cardSets.findIndex(set => set._id === id);
	const set = cardSets[setIndex];
	const [editable, setEditable] = useState<boolean>(false);
	const [nameValue, setNameValue] = useState<string>(set ? set.name : "");
	const [deleteShow, setDeleteShow] = useState<boolean>(false);
	const [descriptionValue, setDescriptionValue] = useState<string>(set ? set.description : "");

	return set
		? <div className="card-set-list-items">
			<div>
				<ListGroupItemHeading>
					<div className="divider-inline">
						{ editable 
							? <Input 
								value={nameValue} 
								onChange={e => setNameValue(e.target.value)}
							/>
							: set.name
						}
						<Badge>
							{set.numCards} cards in set
						</Badge>
					</div>
				</ListGroupItemHeading>

				{ set.description 
					? <ListGroupItemText>
						{ editable 
							? <Input
								value={descriptionValue}
								onChange={e => setDescriptionValue(e.target.value)}
							/> 
							: set.description
						}
					</ListGroupItemText> 
					: null
				}
			</div>
			
			<div style={{ textAlign: "center" }}>
				<div className="divider-inline">
					<Button
						size="sm"
						color="secondary"
						outline
						onClick={() => {
							if (editable) {
								const newSet = [...cardSets];
								set.name = nameValue;
								set.description = descriptionValue;
								newSet[setIndex] = set;
								setCardSets(newSet);
								setEditable(false);
							} else {
								setEditable(true);
							}
						}}
					>{editable ? "Confirm edit" : "Edit Set"}</Button>
					<Button
						size="sm"
						color="secondary"
						outline
						style={{ display: editable ? "inline" : "none" }}
						onClick={() => setEditable(false)}
					>Cancel edit</Button>
					<Button
						size="sm"
						color="danger"
						outline
						onClick={() => setDeleteShow(!deleteShow)}
					>Delete Set</Button>
				</div>
				<Toast isOpen={deleteShow} style={{position: "absolute", right: 0, zIndex: 1}}>
					<ToastHeader 
						icon="warning" 
						toggle={() => setDeleteShow(false)}
					>Confirm delete?</ToastHeader>
					<ToastBody>
						<div className="divider-inline">
							<Button 
								onClick={() => {
									setCardSets(cardSets.filter(setFilter => setFilter !== set));
									setDeleteShow(false);
								}}
							>Ok</Button>
							<Button
								onClick={() => setDeleteShow(false)}
							>Cancel</Button>
						</div>
					</ToastBody>
				</Toast>
			</div>
		</div>
		: null;
};

export default CardSetItemState;