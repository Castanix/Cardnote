import axios from "axios";
import { queryClient } from "../../../App";


type AccountType = {
	username: string,
	password: string,
};

const axiosLogin = async (credentials: AccountType) => {
	const { username, password } = credentials;

	return await axios.post(`${ process.env.REACT_APP_SERVER_URI }/account/login`, {
		method: "post",
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		},
		data: {
			username,
			password
		}
	})
		.then(result => result.data)
		.catch(err => {
			throw new Error(err);
		});
};

const Login = async (credentials: AccountType) => {
	const data = await axiosLogin(credentials);

	if (data) {
		queryClient.invalidateQueries("getCardSets");
		queryClient.invalidateQueries("getCards");

		sessionStorage.setItem("accessToken", data.accessToken);
		sessionStorage.setItem("username", data.username);
		location.reload();
	}
};

export default Login;