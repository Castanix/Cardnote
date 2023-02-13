import React, { useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, ListGroup, ListGroupItem } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

import "./CardList.css";

const createCard = (card: CardType) => 
	<ListGroup className="card-item divider-block" horizontal key={card._id}>
		<ListGroupItem className="card-term">
			{card.term}
		</ListGroupItem>
		<ListGroupItem className="card-definition">
			{card.definition}
		</ListGroupItem>
	</ListGroup>;


const CardList = ({ cardSet }: { cardSet: CardType[] }) => {
	const [open, setOpen] = useState<string>("1");

	const toggle = () => {
		if (open === "1") {
			setOpen("");
		} else {
			setOpen("1");
		}
	};

	return (
		<Accordion open={open}>
			<AccordionItem>
				<AccordionHeader targetId="1" onClick={() => toggle()}>Card set</AccordionHeader>
				<AccordionBody accordionId="1">
					{cardSet.map(card => createCard(card))}
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default CardList;