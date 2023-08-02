import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user data from local storage (if available)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return {
        isLoggedIn: false,
        username: '',
        token: '',
        profilePicture: '',
      };
    }
  });

  useEffect(() => {
    // Store user data in local storage whenever it changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const setIsLoggedIn = (isLoggedIn) => setUser({ ...user, isLoggedIn });
  const setUsername = (username) => setUser({ ...user, username });
  const setToken = (token) => setUser({ ...user, token });
  const setProfilePicture = (profilePicture) => setUser({ ...user, profilePicture });

  const login = (username, token, profilePicture) => {
    setUser({ ...user, isLoggedIn: true, username, token, profilePicture });
  };

  const logout = () => {
    setUser({ ...user, isLoggedIn: false, username: '', token: '', profilePicture: '' });
  };

  return (
    <UserContext.Provider value={{ user, setUser, setIsLoggedIn, setUsername, setToken, setProfilePicture, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserContext;