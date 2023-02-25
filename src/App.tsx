import "./App.css";
import React from "react";
import CardSetListPage from "./pages/CardSetListPage/CardSetListPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CardSetPage from "./pages/CardSetPage/CardSetPage";
import FlashcardsPage from "./pages/FlashcardsPage/FlashcardsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

export const queryClient = new QueryClient(
	{ 
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			}
		} 
	}
);

const App = () => {	
	return (
		<div className="App">
			<BrowserRouter>
				<QueryClientProvider client={ queryClient }>
					<Routes>
						<Route path="/" element={ <CardSetListPage /> } />
						<Route path="/:cardSetName/:cardSetId" element={ <CardSetPage /> } />
						<Route path="/:cardSetName/:cardSetId/flashcard" element={ <FlashcardsPage /> } />
					</Routes>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;
