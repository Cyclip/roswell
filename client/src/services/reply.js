import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;


export const replyToComment = async (postId, parentCommentId, reply, token) => {
    const data = {
        postId: postId,
        parentCommentId: parentCommentId,
        reply: reply
    };

    const config = { headers: { Authorization: `Bearer ${token}` }};

    const response = await axios.post(`${BASE}/reply/create`, data, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
};