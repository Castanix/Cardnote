import "./App.css";
import React from "react";
import Landing from "./pages/Landing/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CardSetPage from "./pages/CardSetPage/CardSetPage";

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/:cardSetId" element={<CardSetPage />} />
				</Routes>
			</BrowserRouter>
			
		</div>
	);
};

export default App;
