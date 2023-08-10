import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

export const getFeed = async (page, limit, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.get(`${BASE}/feed?page=${page || 0}&limit=${limit || 10}`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}