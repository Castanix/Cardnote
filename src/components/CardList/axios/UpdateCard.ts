import axios from "axios";
import { UpdateCardType } from "../CardListItem";
import { queryClient } from "../../../App";

const axiosUpdateCard = async (updatedCard: UpdateCardType) => {
	const { card_id, term, definition, set_id } = updatedCard;
	const accessToken = sessionStorage.getItem("accessToken") ?? "public";

	return await axios.put(`${ process.env.REACT_APP_SERVER_URI }/card/updateCard`, {
		method: "put",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ accessToken }`,
		},
		data: {
			card_id,
			term,
			definition,
			set_id,
		},
	})
		.then(result => result.status)
		.catch(err => console.error(err));
};

const UpdateCard = async (updatedCard: UpdateCardType) => {
	const status = await axiosUpdateCard(updatedCard);

	if (status === 204) queryClient.invalidateQueries("getCards");

	return status;
};


export default UpdateCard;