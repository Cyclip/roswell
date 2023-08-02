import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

/*
body example:
{
    "type": "Content",
    "title": "Post Title",
    "content": "Post Content"
    "image": "Post Image"
}

You should additionally pass the token in the Authorization header
*/
export const createPost = async (type, title, content, image, token) => {
    const data = {
        type: type,
        title: title,
        content: content,
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