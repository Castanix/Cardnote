import "./App.css";
import React from "react";
import CardSetListPage from "./pages/CardSetListPage/CardSetListPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CardSetPage from "./pages/CardSetPage/CardSetPage";

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<CardSetListPage />} />
					<Route path="/:cardSetId" element={<CardSetPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
