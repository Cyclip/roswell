import axios from 'axios';

const BASE = process.env.REACT_APP_BASE_API;

// get all notifications
export const getNotifications = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.get(`${BASE}/notif`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
};

// get unread notifications
export const getUnreadNotifications = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.get(`${BASE}/notif/unread`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
};

// get notification by id
export const getNotificationById = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.get(`${BASE}/notif/${id}`, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}

// read notification
export const readNotification = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const response = await axios.put(`${BASE}/notif/${id}`, {}, config)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });

    return response;
}