import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

export const login = async (username, password) => {
    const data = {
        username: username,
        password: password
    };

    const response = await axios.post(`${BASE}/auth/login`, data)
    .catch((error) => {
        console.log(error);
        return error.response;
    });

    console.log(response);

    return response.data;
}