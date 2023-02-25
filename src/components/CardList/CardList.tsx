import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

import "./CardList.css";
import CardListItem from "./CardListItem";


/*
* List component containing all cards.
* It one of the main components rendered for CardSetPage.tsx.
*/
const CardList = ({ cardSet }: { cardSet: CardType[] }) => {
	const [open, setOpen] = useState<string>("1");


	/* Component functions */
	const toggle = (accordionId: string) => {
		if (open === accordionId) {
			setOpen("");
		} else {
			setOpen(accordionId);
		}
	};


	/* Rendered component */
	return (
		<div>
			{ cardSet.length 
				? <Accordion open={ open } {...{
					toggle: (accordionId: string) =>
						toggle(accordionId)
				}}>
					<AccordionItem>
						<AccordionHeader targetId="1">
							<div>
								Card set <Badge>{ cardSet.length }</Badge>
							</div>
						</AccordionHeader>
						<AccordionBody accordionId="1">
							{ cardSet.map(card => <CardListItem key={ card.card_id } card={ card } cardSet={ cardSet } />) }
						</AccordionBody>
					</AccordionItem>
				</Accordion>
				: null
			}
		</div>
	);
};

export default CardList;