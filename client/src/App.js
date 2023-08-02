import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';

import { UserProvider } from './contexts/UserContext';

import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};


export default App;
