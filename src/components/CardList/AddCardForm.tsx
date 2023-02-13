import React, { useState } from "react";
import { Form, Row, Col, FormGroup, Label, Input, Accordion, AccordionHeader, AccordionBody, AccordionItem, Button } from "reactstrap";
import { CardType } from "../../pages/CardSetPage/CardSetPage";

const AddCardForm = ({ cardSet, setCardSet }: { cardSet: CardType[], setCardSet: React.Dispatch<React.SetStateAction<CardType[]>>}) => {
	const [open, setOpen] = useState<string>("1");
	const [termValue, setTermValue] = useState<string>();
	const [definitionValue, setDefinitionValue] = useState<string>();

	const toggle = () => {
		if (open === "1") {
			setOpen("");
		} else {
			setOpen("1");
		}
	};

	const addCardHandler = () => {
		if (termValue && definitionValue) {
			setCardSet([...cardSet,
				{
					_id: (cardSet.length + 1).toString(),
					term: termValue,
					definition: definitionValue,
				}
			]);
		}
	};

	return (
		<Accordion open={open}>
			<AccordionItem>
				<AccordionHeader targetId="1" onClick={() => toggle()}>Add card</AccordionHeader>
				<AccordionBody accordionId="1">
					<Form>
						<Row>
							<Col md={6}>
								<FormGroup className="divider-block">
									<div>
										<Label for="cardTerm">
											Term: 
										</Label>
										<Input 
											id="cardTerm" 
											name="cardTerm" 
											placeholder="Enter Term"
											value={termValue}
											onChange={(e) => setTermValue(e.target.value)}
										/>
									</div>
									<Button onClick={addCardHandler}>Add card</Button>
								</FormGroup>
							</Col>
							<Col md={6}>
								<FormGroup>
									<Label for="cardDefinition">
										Definition: 
									</Label>
									<Input 
										id="cardDefinition" 
										name="cardDefinition" 
										type="textarea" 
										placeholder="Enter Definition"
										value={definitionValue}
										onChange={(e) => setDefinitionValue(e.target.value)}
									/>
								</FormGroup>
							</Col>
						</Row>
					</Form>
				</AccordionBody>
			</AccordionItem>
		</Accordion>
	);
};

export default AddCardForm;