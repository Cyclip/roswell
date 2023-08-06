import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;


export const createPost = async (type, title, content, image, token) => {
    const data = {
        type: type,
        title: title,
        body: content,
        image: image
    };
    
    // include token in the header
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(`${BASE}/post/create`, data, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

export const getPost = async (id) => {
    const postResponse = await axios.get(`${BASE}/post/get/${id}`)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    // get

    return postResponse;
}

export const likePost = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(`${BASE}/post/like/${id}`, {}, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

export const isLiked = (post, id) => {
    return post.interactions.likes.includes(id);
}

export const savePost = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(`${BASE}/post/save/${id}`, {}, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

export const isSaved = async (post, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(`${BASE}/post/isSaved/${post}`, {}, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

export const submitComment = async (id, comment, token) => {
    const data = {
        comment: comment,
        postId: id
    };
    
    // include token in the header
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

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