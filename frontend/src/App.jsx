import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import LandingPage from "./components/LandingPages/LandingPage";
import Login from "./components/LogIn/LogIn";
import UserLandingPage from './components/LandingPages/UserLandingPage';
import AuthLandingPage from './components/LandingPages/AuthLandingPage';
import AddPatient from './components/patients/AddPatient';

function App() {
  const [ role, setRole ] = useState('user');
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login role={role} setRole={setRole} />} />
            <Route path={`/user/landing`} element={<UserLandingPage />} />
            <Route path={`/nurse/landing`} element={<LandingPage />} />
            <Route path="/nurse/add-patient" element={<AddPatient />} /> 
            <Route path={`/Authorization/landing`} element={<AuthLandingPage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;