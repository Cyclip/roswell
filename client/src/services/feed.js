import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

const LIMIT = 10;

export const getFeed = async (page, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.get(`${BASE}/feed?page=${page || 0}&limit=${LIMIT}`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}


export const getRecentPosts = async () => {
    const response = await axios.get(`${BASE}/feed/recent`)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}