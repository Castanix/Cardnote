import React, { useContext, useState } from "react";
import { Form, Row, Col, FormGroup, Label, Input, Accordion, AccordionHeader, AccordionBody, AccordionItem, Button } from "reactstrap";
import { CardSetContext } from "../../pages/CardSetPage/CardSetPage";


/*
* Form component for adding cards to the card set.
* It one of the main components rendered for CardSetPage.tsx.
*/
const AddCardForm = () => {
	const { cardSet, setCardSet } = useContext(CardSetContext);

	const [open, setOpen] = useState<string>("1");
	const [termValue, setTermValue] = useState<string>("");
	const [definitionValue, setDefinitionValue] = useState<string>("");


	/* Component functions */
	const toggle = (accordionId: string) => {
		if (open === accordionId) {
			setOpen("");
		} else {
			setOpen(accordionId);
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

	
	/* Rendered component */
	return (
		<Accordion open={ open } {...{
			toggle: (accordionId: string) =>
				toggle(accordionId)
		}}>
			<AccordionItem>
				<AccordionHeader targetId="1">Add card</AccordionHeader>
				<AccordionBody accordionId="1">
					<Form>
						<Row>
							<Col md={ 6 }>
								<FormGroup className="divider-block">
									<div>
										<Label for="cardTerm">
											Term: 
										</Label>
										<Input 
											id="cardTerm" 
											name="cardTerm" 
											placeholder="Enter Term"
											value={ termValue }
											onChange={ (e) => setTermValue(e.target.value) }
										/>
									</div>
									<Button 
										onClick={ addCardHandler } 
										outline 
										color="primary"
									>Add card</Button>
								</FormGroup>
							</Col>
							<Col md={ 6 }>
								<FormGroup>
									<Label for="cardDefinition">
										Definition: 
									</Label>
									<Input 
										id="cardDefinition" 
										name="cardDefinition" 
										type="textarea" 
										placeholder="Enter Definition"
										value={ definitionValue }
										onChange={ (e) => setDefinitionValue(e.target.value) }
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