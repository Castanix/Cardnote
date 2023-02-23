import "./App.css";
import React from "react";
import CardSetListPage from "./pages/CardSetListPage/CardSetListPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CardSetPage from "./pages/CardSetPage/CardSetPage";
import FlashcardsPage from "./pages/FlashcardsPage/FlashcardsPage";

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={ <CardSetListPage /> } />
					<Route path="/:cardSetId" element={ <CardSetPage /> } />
					<Route path="/:cardSetId/flashcard" element={ <FlashcardsPage /> } />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
