import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        username: '',
        token: '',
        profilePicture: '',
    });

    // const [user, setUser] = useState({
    //     isLoggedIn: true,
    //     username: 'test',
    //     token: 'test',
    //     profilePicture: 'test',
    // });
    const setIsLoggedIn = (isLoggedIn) => setUser({ ...user, isLoggedIn: isLoggedIn })
    const setUsername = (username) => setUser({ ...user, username: username })
    const setToken = (token) => setUser({ ...user, token: token })
    const setProfilePicture = (profilePicture) => setUser({ ...user, profilePicture: profilePicture })

    const login = (username, token, profilePicture) => {
        setUser({ ...user, isLoggedIn: true, username: username, token: token, profilePicture: profilePicture });
    }

    const logout = () => {
        setUser({ ...user, isLoggedIn: false, username: '', token: '', profilePicture: '' });
    }
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
        { children }
        </UserContext.Provider>
    );
}

export default UserContext;