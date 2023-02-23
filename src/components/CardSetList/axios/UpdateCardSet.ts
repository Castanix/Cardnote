import axios from "axios";
import { queryClient } from "../../../App";
import { EditCardSetType } from "../CardSetListItem";


const axiosUpdateCardSet = async (updatedSet: EditCardSetType) => {
	const { set_id, name, description } = updatedSet;

	return await axios.put(`${process.env.REACT_APP_SERVER_URI}/cardset/updateCardSet`, {
		method: "put",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			set_id,
			name,
			description,
		},
	})
		.then(result => result.status)
		.catch(err => {
			throw new Error(err);
		});
};

const UpdateCardSet = async (updatedSet: EditCardSetType) => {
	const data = await axiosUpdateCardSet(updatedSet);
	if (data) queryClient.invalidateQueries("getCardSets");

	return data;
};

export default UpdateCardSet;