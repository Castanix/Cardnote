import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Navbar, NavbarBrand, NavbarText, Toast, ToastBody, ToastHeader } from "reactstrap";

import "./Topbar.css";
import Login from "./axios/Login";

const Topbar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const loggedUser = sessionStorage.getItem("username");

	const resetStates = () => {
		setUsername("");
		setPassword("");
	};

	const loginHandler = () => {
		if (!loggedUser) resetStates();

		setIsOpen(!isOpen);
	};

	const clearSession = () => {
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("username");

		location.reload();
	};

	return (
		<Navbar color="dark" dark={ true } fixed="top">
			<NavbarBrand>
				<h1 style={{ color: "white", fontSize: "2rem" }}>
					Cardnote
				</h1>
			</NavbarBrand>

			<NavbarText 
				className="login-button"
				title="Currently only available to admin"
				onClick={ loginHandler }
			>
				{ loggedUser ?? "Login" }
			</NavbarText>

			<Toast className="authentication-toast" isOpen={ isOpen }>
				<ToastHeader 
					toggle={ loginHandler }
				>
					{ loggedUser ? "Logout" : "Login" }
				</ToastHeader>

				<ToastBody>
					{
						loggedUser
							? <></>
							: <Form>
								<FormGroup>
									<Label for="username">
										Username
									</Label>
									<Input bsSize="sm" onChange={ (e) => setUsername(e.target.value) } />
								</FormGroup>
								<FormGroup>
									<Label for="password">
										Password
									</Label>
									<Input bsSize="sm" type="password" onChange={ (e) => setPassword(e.target.value) } />
								</FormGroup>
							</Form>
					}
					<Button onClick={ () => loggedUser ? clearSession() : Login({ username, password }) }>Confirm</Button>
				</ToastBody>
			</Toast>
		</Navbar>
	);
};

export default Topbar;