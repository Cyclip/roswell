import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

export const getProfile = async(user) => {
    const response = await axios.get(`${BASE}/profile/${user}`)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}