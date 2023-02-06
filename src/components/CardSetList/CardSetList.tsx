import React, { useEffect, useState } from "react";
import { Alert, Badge, Input, ListGroup, ListGroupItem, Tooltip } from "reactstrap";
import { BsPlusCircle } from "react-icons/bs";
import CardSetItemState from "./CardSetItemState";

import "./CardSetList.css";


export type CardSetType = {
	_id: string,
	name: string,
	description?: string,
	numCards: number,
};

// Mocked sets data
const mockList: CardSetType[] = [
	{
		_id: "id1",
		name: "Test Set",
		description: "Set of null cards",
		numCards: 6
	},
	{
		_id: "id2",
		name: "Test Set 2",
		description: "Set of null cards",
		numCards: 8
	},
	{
		_id: "id3",
		name: "Test Set 3",
		description: "Set of null cards",
		numCards: 3
	},
];

// Delays the search filter for sets so application is not overloaded with re-renders
const getDebounceQuery = (value: string, time = 250) => {
	const [debounceValue, setDebounceValue] = useState<string>(value);

	useEffect(() => {
		const timeout = setTimeout(() => setDebounceValue(value), time);

		return () => {
			clearTimeout(timeout);
		};
	}, [value, time]);

	return debounceValue.toLowerCase();
};

const CardSetList = () => {
	const [cardSets, setCardSets] = useState<CardSetType[]>(mockList);
	const [searchedSets, setSearchedSets] = useState<CardSetType[]>(cardSets);
	const [searchValue, setSearchValue] = useState<string>("");
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
	const [alertCount, setAlertCount] = useState<number>(0);
	const debounceQuery = getDebounceQuery(searchValue ?? "");
	
	useEffect(() => {
		setSearchedSets(cardSets);
		if (debounceQuery.length > 0) {
			setSearchedSets(cardSets.filter(set => 
				set.name.toLowerCase().includes(debounceQuery) 
				|| set.description.toLowerCase().includes(debounceQuery)
			));
		}
	}, [debounceQuery, cardSets]);

	useEffect(() => {
		const timeout = setTimeout(() => setAlertCount(0), 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, [alertCount]);

	const toggle = () => setIsTooltipOpen(!isTooltipOpen);

	return (
		<section className="card-set-list">
			
			<Alert isOpen={alertCount > 0} style={{position: "absolute", width: "100%", top: 0}}>
				A new set has been added! 
				<Badge>
					{alertCount}
				</Badge>
			</Alert>
			<div className="searchbar">
				<Input 
					placeholder="Search set" 
					value={searchValue} 
					onChange={e => {
						setSearchValue(e.target.value);
					}}
				/>
			</div>
			
			<br />
			<ListGroup>
				<ListGroupItem
					id="add-set-button"
					action
					style={{ textAlign: "center" }}
					onClick={() => {
						setCardSets([
							{
								_id: `id${cardSets.length+1}`,
								name: "Add name", 
								description: "Add description", 
								numCards: 0
							}, ...cardSets]);
						setAlertCount(alertCount + 1);
					}}
				>
					<BsPlusCircle style={{ fontSize: "4rem" }} />
					<Tooltip
						placement="bottom"
						isOpen={isTooltipOpen}
						target="add-set-button"
						toggle={toggle}
					>Add set</Tooltip>
				</ListGroupItem>
				{searchedSets.map(set =>
					<ListGroupItem key={set._id}>
						<CardSetItemState id={set._id} cardSets={cardSets} setCardSets={setCardSets} />
					</ListGroupItem>	
				)}
			</ListGroup>
		</section>
	);
};

export default CardSetList;