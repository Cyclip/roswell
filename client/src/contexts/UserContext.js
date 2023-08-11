import React, { createContext, useState, useEffect } from 'react';
import { checkToken } from '../services/auth';
import { toast } from 'react-hot-toast';

export const UserContext = createContext();

const defaultUser = {
  isLoggedIn: false,
  id: '',
  username: '',
  token: '',
  profilePicture: '',
  email: '',
  role: '',
  punishment: null,
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Get user data from local storage (if available)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      let parsed = JSON.parse(storedUser);
      if (!parsed.isLoggedIn) {
        parsed = defaultUser;
      } else {
        // Check if token is valid
        checkToken(parsed.username, parsed.token).then((response) => {
          if (!response.success) {
            parsed = defaultUser;

            toast.error("Your session has expired. Please log in again.");
          } else {
            // Update user data
            parsed = {
              ...parsed,
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              profilePicture: response.user.profilePicture,
              role: response.user.role,
              punishment: response.user.punishment
            };
          }
        });
      }

      return parsed;
    } else {
      return defaultUser;
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

  const login = (username, token, profilePicture, id) => {
    setUser({ ...user, isLoggedIn: true, username, token, profilePicture, id, });
  };

  const logout = () => {
    setUser({ ...user, isLoggedIn: false, username: '', token: '', profilePicture: '', id: '' });
  };

  return (
    <UserContext.Provider value={{ user, setUser, setIsLoggedIn, setUsername, setToken, setProfilePicture, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserContext;