import React from "react";
import CardSetList from "../../components/CardSetList/CardSetList";
import GetCardSets from "./axios/GetCardSets";

const CardSetListPage = () => {
	const { data, loading, error } = GetCardSets();

	if (loading) return <div>Loading</div>;
	if (error) return <div>Error</div>;
	
	return (
		<main className="page-margin">
			<CardSetList data={ data } />
		</main>
	);
};

export default CardSetListPage;