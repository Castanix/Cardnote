import axios from "axios";
import { useQuery } from "react-query";


const axiosGetSetDescription = async (set_id: number) => {
	return await axios.get(`${ process.env.REACT_APP_SERVER_URI }/cardset/oneSet/${ set_id }`, {
		method: "get",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		}
	})
		.then(result => result.data)
		.catch(err => {
			console.error(err);
		});
};

const GetSetDescription = (set_id: number) => {
	const { data, isLoading, isError } = useQuery({ queryKey: ["getSetDescription", set_id], queryFn: () => axiosGetSetDescription(set_id), staleTime: 300000 });

	return {
		cardSetDescription: data,
		loadingSet: isLoading,
		errorSet: isError
	};
};

export default GetSetDescription;