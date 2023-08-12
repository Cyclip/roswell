import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

// get followers of user (id and token are optional)
export const getFollowers = async (token, id) => {
    // auth config only if token is provided
    const config = token ? { headers: { Authorization: `Bearer ${token}` }} : {};

    const response = await axios.get(`${BASE}/followers/${id || ''}`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

// get following of user (id and token are optional)
export const getFollowing = async (token, id) => {
    // auth config only if token is provided
    const config = token ? { headers: { Authorization: `Bearer ${token}` }} : {};

    const response = await axios.get(`${BASE}/followers/following/${id || ''}`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

// follow user
export const followUser = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.post(`${BASE}/followers/${id}`, {}, config)
    .then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

// unfollow user
export const unfollowUser = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.delete(`${BASE}/followers/${id}`, config)
    .then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}