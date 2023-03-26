import axios from "axios";
import { AddCardType } from "../AddCardForm";
import { queryClient } from "../../../App";

type PostCardResType = {
	inserted_id: number
};

const axiosPostCard = async (postedCard: AddCardType) => {
	const { term, definition, numCards, set_id } = postedCard;
	const accessToken = sessionStorage.getItem("accessToken") ?? "public";
	console.log(accessToken);

	return await axios.post(`${ process.env.REACT_APP_SERVER_URI }/card/addCard`, {
		method: "post",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ accessToken }`,
		},
		data: {
			term,
			definition,
			numCards,
			set_id,
		},
	})
		.then(result => result.data)
		.catch(err => {
			console.error(err);
		});
};

const PostCard = async (postedCard: AddCardType) => {
	const data: PostCardResType = await axiosPostCard(postedCard);
	if (data) {
		queryClient.invalidateQueries("getCards");
		queryClient.invalidateQueries("getCardSets");
	}

	return data.inserted_id;
};

export default PostCard;