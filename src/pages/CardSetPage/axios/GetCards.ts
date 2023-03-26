import axios from "axios";
import { useQuery } from "react-query";


const axiosGetCards = async (set_id: number) => {
	const accessToken = sessionStorage.getItem("accessToken") ?? "public";

	return await axios.get(`${ process.env.REACT_APP_SERVER_URI }/card/allCards/${ set_id }`, {
		method: "get",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${ accessToken }`,
		}
	})
		.then(result => result.data)
		.catch(err => {
			console.error(err);
		});
};

const GetCards = (set_id: number) => {
	const { data, isLoading, isError } = useQuery({ queryKey: ["getCards", set_id], queryFn: () => axiosGetCards(set_id), staleTime: 300000 });

	return {
		data,
		loading: isLoading,
		error: isError
	};
};

export default GetCards;