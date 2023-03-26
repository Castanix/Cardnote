import React, { useEffect, useState } from "react";
import { Alert, Badge, Input, ListGroup, ListGroupItem, Tooltip } from "reactstrap";
import { BsPlusCircle } from "react-icons/bs";
import CardSetListItem from "./CardSetListItem";
import CardSetListPagination from "./CardSetListPagination";

import "./CardSetList.css";
import PostCardSet from "./axios/PostCardSet";

export type CardSetType = {
	set_id: number,
	name: string,
	description?: string,
	numCards: number,
};


/* Function to delay the search filter for sets to prevent overloading with re-renders */
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
* List component containing all card sets.
* It is the main component rendered for the CardSetListPage.tsx.
*/
const CardSetList = ({ data }: { data: CardSetType[] }) => {
	const [searchedSets, setSearchedSets] = useState<CardSetType[]>(data);
	const [searchValue, setSearchValue] = useState<string>("");
	const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
	const [alertCount, setAlertCount] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(1);
	const debounceQuery = getDebounceQuery(searchValue ?? "");
	

	/* Use effects */
	useEffect(() => {
		// Reset all list states before debounceQuery triggers to prevent unwanted displays
		setPageNumber(1);
		setSearchedSets(data);
		if (debounceQuery.length > 0) {
			setSearchedSets(data.filter(set => 
				set.name.toLowerCase().includes(debounceQuery) 
				|| set.description.toLowerCase().includes(debounceQuery)
			));
		}
	}, [debounceQuery, data]);

	useEffect(() => {
		const timeout = setTimeout(() => setAlertCount(0), 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, [alertCount]);


	/* Component functions */
	const toggle = () => setIsTooltipOpen(!isTooltipOpen);

	const addSetHandler = async () => {
		const inserted_id = await PostCardSet();

		if (inserted_id) {
			setAlertCount(alertCount + 1);
		} else console.log("Error adding card set");
	};


	/* Rendered component */
	return (
		<section className="card-set-list">
			
			<Alert isOpen={ alertCount > 0 } style={{ position: "absolute", width: "100%", top: "2rem" }}>
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
					onChange={ e => {
						setSearchValue(e.target.value);
					} }
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
					<ListGroupItem key={ set.set_id }>
						<CardSetListItem set={ set } cardSets={ data } />
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