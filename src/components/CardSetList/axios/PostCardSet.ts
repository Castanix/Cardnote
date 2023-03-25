import axios from "axios";
import { queryClient } from "../../../App";

type PostCardSetResType = {
	inserted_id: number,
};


const axiosPostCardSet = async () => {
	const accessToken = sessionStorage.getItem("accessToken") ?? "public";

	return await axios.post(`${ process.env.REACT_APP_SERVER_URI }/cardset/addCardSet`, {
		method: "post",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ accessToken }`,
		},
	})
		.then(result => result.data)
		.catch(err => {
			throw new Error(err);
		});
};

const PostCardSet = async () => {
	const data: PostCardSetResType = await axiosPostCardSet();
	if (data) queryClient.invalidateQueries("getCardSets");

	return data.inserted_id;
};

export default PostCardSet;