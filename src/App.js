import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import UsersListPage from './UsersListPage';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("authToken") ? children : <Navigate to="/"/>;
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/users" element={<PrivateRoute><UsersListPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
