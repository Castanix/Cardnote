import axios from "axios";
import { queryClient } from "../../../App";


const axiosDeleteCardSet = async (set_id: number) => {
	return await axios.delete(`${ process.env.REACT_APP_SERVER_URI }/cardset/deleteCardSet`, {
		method: "delete",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			set_id,
		},
	})
		.then(result => result.status)
		.catch(err => {
			throw new Error(err);
		});
};

const DeleteCardSet = async (set_id: number) => {
	const status = await axiosDeleteCardSet(set_id);
	if (status === 204) queryClient.invalidateQueries("getCardSets");

	return status;
};

export default DeleteCardSet;