import React, { useEffect, useState } from "react";
import { Alert, Badge, Input, ListGroup, ListGroupItem, Tooltip } from "reactstrap";
import { BsPlusCircle } from "react-icons/bs";
import CardSetListItem from "./CardSetListItem";
import CardSetListPagination from "./CardSetListPagination";

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
		description: "Set description 1",
		numCards: 6
	},
	{
		_id: "id2",
		name: "Test Set 2",
		description: "Set description 2",
		numCards: 8
	},
	{
		_id: "id3",
		name: "Test Set 3",
		description: "Set description 3",
		numCards: 3
	},
	{
		_id: "id4",
		name: "Test Set 4",
		description: "Set description 4",
		numCards: 3
	},
	{
		_id: "id5",
		name: "Test Set 5",
		description: "Set description 5",
		numCards: 4
	},
	{
		_id: "id6",
		name: "Test Set 6",
		description: "Set description 6",
		numCards: 3
	},
	{
		_id: "id7",
		name: "Test Set 7",
		description: "Set description 7",
		numCards: 0
	},
	{
		_id: "id8",
		name: "Test Set 8",
		description: "Set description 8",
		numCards: 2
	},
	{
		_id: "id9",
		name: "Test Set 9",
		description: "Set description 9",
		numCards: 30
	},
	{
		_id: "id10",
		name: "Test Set 10",
		description: "Set description 10",
		numCards: 0
	},
	{
		_id: "id11",
		name: "Test Set 11",
		description: "Set description 11",
		numCards: 2
	},
	{
		_id: "id12",
		name: "Test Set 12",
		description: "Set description 12",
		numCards: 30
	},
	{
		_id: "id13",
		name: "Test Set 13",
		description: "Set description 13",
		numCards: 0
	},
	{
		_id: "id14",
		name: "Test Set 14",
		description: "Set description 14",
		numCards: 2
	},
	{
		_id: "id15",
		name: "Test Set 15",
		description: "Set description 15",
		numCards: 30
	},
	{
		_id: "id16",
		name: "Test Set 16",
		description: "Set description 16",
		numCards: 0
	},
	{
		_id: "id17",
		name: "Test Set 17",
		description: "Set description 17",
		numCards: 2
	},
	{
		_id: "id18",
		name: "Test Set 18",
		description: "Set description 18",
		numCards: 30
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

/*
* List component containing all card set data.
* It is the main component rendered for the landing page.
*/
const CardSetList = () => {
	const [cardSets, setCardSets] = useState<CardSetType[]>(mockList);
	const [searchedSets, setSearchedSets] = useState<CardSetType[]>(cardSets);
	const [searchValue, setSearchValue] = useState<string>("");
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
	const [alertCount, setAlertCount] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const debounceQuery = getDebounceQuery(searchValue ?? "");
	
	/* Use effects */
	useEffect(() => {
		// Reset all list states before debounceQuery triggers to prevent unwanted displays
		setPageNumber(1);
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

	/* Component functions */
	const toggle = () => setIsTooltipOpen(!isTooltipOpen);

	const addSetHandler = () => {
		setCardSets([
			{
				_id: `id${ cardSets.length+1 }`,
				name: "Add name", 
				description: "Add description", 
				numCards: 0
			}, ...cardSets]);
		setAlertCount(alertCount + 1);
	};

	/* Rendered component */
	return (
		<section className="card-set-list">
			
			<Alert isOpen={ alertCount > 0 } style={{ position: "absolute", width: "100%", top: 0 }}>
				<div className="divider-inline">
					A new set has been added! 
					<Badge>
						{ alertCount }
					</Badge>
				</div>
			</Alert>
			<div className="searchbar">
				<Input 
					placeholder="Search set" 
					value={ searchValue } 
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
					onClick={ addSetHandler }
				>
					<BsPlusCircle style={{ fontSize: "4rem" }} />
					<Tooltip
						placement="bottom"
						isOpen={ isTooltipOpen }
						target="add-set-button"
						toggle={ toggle }
					>Add set</Tooltip>
				</ListGroupItem>
				{ searchedSets.slice((pageNumber-1)*4, pageNumber*4).map(set =>
					<ListGroupItem key={set._id}>
						<CardSetListItem set={set} cardSets={cardSets} setCardSets={setCardSets} />
					</ListGroupItem>)
				}
			</ListGroup>
			<div style={{ width: "fit-content", margin: "auto" }}>
				<CardSetListPagination setCount={ searchedSets.length } pageNumber={ pageNumber } setPageNumber={ setPageNumber } />
			</div>
		</section>
	);
};

export default CardSetList;