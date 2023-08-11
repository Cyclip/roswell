import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import NewPost from './pages/NewPost';
import ViewPost from './pages/ViewPost';
import Feed from './pages/Feed';
import BanMessage from './components/BanMessage';

import { Toaster } from "react-hot-toast";

import { UserProvider } from './contexts/UserContext';

import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <NavBar />
          <BanMessage />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/newpost" element={<NewPost />} />
            <Route path="/post/:id" element={<ViewPost />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
                fontFamily: "Nunito",
              },
            }}
          />
        </Router>
      </div>
    </UserProvider>
  );
};


export default App;
