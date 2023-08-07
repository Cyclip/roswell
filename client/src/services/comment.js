import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

export const submitComment = async (id, comment, token) => {
    const data = {
        comment: comment,
        postId: id
    };
    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.post(`${BASE}/comment/create`, data, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}


export const getComments = async (id, page, limit) => {
    const response = await axios.get(`${BASE}/comment/get/${id}?page=${page || 1}&limit=${limit || 10}`)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}


export const likeComment = async (commentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};
    
    const response = await axios.post(`${BASE}/comment/like/${commentId}`, {}, config)
    .then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}


export const unlikeComment = async (commentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }};
    
    const response = await axios.post(`${BASE}/comment/unlike/${commentId}`, {}, config)
    .then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

export const isLiked = (likes, id) => {
    try {
        return likes.findIndex((i) => i._id === id) >= 0;
    } catch(err) {
        console.log("error checking if comment liked", err, likes, id);
    }
}