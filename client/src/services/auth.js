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

    return response.data;
}

export const register = async (username, email, password) => {
    const data = {
        username: username,
        email: email,
        password: password
    };

    const response = await axios.post(`${BASE}/auth/register`, data)
    .catch((error) => {
        console.log(error);
        return error.response;
    });

    return response.data;
}

// check if a token is valid (unexpired & unmanipulated)
export const checkToken = async (username, token) => {
    const data = {
        username: username,
        token: token
    };

    const response = await axios.post(`${BASE}/auth/checkToken`, data)
    .catch((error) => {
        console.log(error);
        return error.response;
    });

    return response.data;
}

export const getPunishment = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};
    
    const response = await axios.post(`${BASE}/auth/punishment`, {}, config)
    .then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}