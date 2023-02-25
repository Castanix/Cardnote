import axios from "axios";
import { useQuery } from "react-query";

const axiosGetCardSets = async () => {
	return await axios.get(`${ process.env.REACT_APP_SERVER_URI }/cardset/allSets`, {
		method: "get",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		}
	})
		.then(result => result.data)
		.catch(err => {
			throw new Error(err);
		});
};

const GetCardSets = () => {
	const { data, isLoading, isError } = useQuery({ queryKey: "getCardSets", queryFn: () => axiosGetCardSets(), staleTime: 300000 });

	return {
		data,
		loading: isLoading,
		error: isError,
	};
};

export default GetCardSets;