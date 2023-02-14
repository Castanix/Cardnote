import React, { useContext, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Badge } from "reactstrap";
import { CardSetContext } from "../../pages/CardSetPage/CardSetPage";

import "./CardList.css";
import CardListItem from "./CardListItem";

const CardList = () => {
	const [open, setOpen] = useState<string>("1");
	const { cardSet } = useContext(CardSetContext);

	const toggle = () => {
		if (open === "1") {
			setOpen("");
		} else {
			setOpen("1");
		}
	};

	return (
		<div>
			{ cardSet.length 
				? <Accordion open={ open }>
					<AccordionItem>
						<AccordionHeader targetId="1" onClick={ () => toggle() }>
							<div>
								Card set <Badge>{ cardSet.length }</Badge>
							</div>
						</AccordionHeader>
						<AccordionBody accordionId="1">
							{ cardSet.map(card => <CardListItem key={card._id} card={card}/>) }
						</AccordionBody>
					</AccordionItem>
				</Accordion>
				: null
			}
		</div>
	);
};

export default CardList;