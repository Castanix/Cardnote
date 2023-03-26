import axios from "axios";
import { DeleteCardType } from "../CardListItem";
import { queryClient } from "../../../App";

const axiosDeleteCard = async (deletedCard: DeleteCardType) => {
	const { card_id, set_id, numCards } = deletedCard;
	const accessToken = sessionStorage.getItem("accessToken") ?? "public";

	return await axios(`${ process.env.REACT_APP_SERVER_URI }/card/deleteCard`, {
		method: "delete",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ accessToken }`,
		},
		data: {
			card_id,
			set_id,
			numCards,
		},
	})
		.then(result => result.status)
		.catch(err => {
			console.error(err);
		});
};

const DeleteCard = async (deletedCard: DeleteCardType) => {
	const status = await axiosDeleteCard(deletedCard);

	if (status === 204) {
		queryClient.invalidateQueries("getCards");
		queryClient.invalidateQueries("getCardSets");
	}

	return status;
};

export default DeleteCard;