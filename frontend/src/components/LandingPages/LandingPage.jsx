import React, { useState, useEffect } from "react";
import { FaUserCircle, FaTable, FaMapMarkedAlt } from 'react-icons/fa';
import { patientService } from "../../services/serviceFile";
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../theme/ThemeToggle';
import Dashboard from '../dashboard/Dashboard';
import Records from '../records/Records';
import Maps from '../maps/Maps';
import { useId } from "react";
import { useNavigate } from "react-router-dom";



function LandingPage({ role}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { darkMode } = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logoutSession = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.href = '/';
    }, 700);
  }

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await patientService.getAllPatients();
        setPatients(result.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const addPatientFunc = () => {
    navigate('/nurse/add-patient');
  }
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ease-in-out ${darkMode ? 'dark bg-slate-900' : 'bg-emerald-50'}`}>
      <nav className={`transition-colors duration-300 ease-in-out ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} shadow-sm border-b transition-colors duration-200`}>
        <div className="max-w-9xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className={`text-xl font-semibold transition-colors duration-300 ease-in-out ${darkMode ? 'text-emerald-100' : 'text-emerald-800'} `}>
                Digital Health Records
              </h1>
            </div>
            <div className="flex justify-center space-x-8 items-center w-[50%]">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `) 
                    : (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                <FaUserCircle className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'records' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `)
                    :  (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                <FaTable className="mr-2" />
                Records
              </button>
              {/* <button
                onClick={() => setActiveTab('maps')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'maps' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `)
                    :  (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                <FaMapMarkedAlt className="mr-2" />
                Maps
              </button> */}

              <button
                className={`bg-emerald-600 py-2 px-4 rounded-xl transition-rounded duration-300 text-white font-medium ${darkMode ? 'hover:bg-emerald-500 ' : 'hover:bg-emerald-700'} cursor-pointer relative left-7 mx-5`}
                onClick={addPatientFunc}
              >
                Add Patient
              </button>
              <button
                className={`bg-emerald-600 py-2 px-4  hover:rounded-xl transition-rounded duration-300 text-white font-medium ${darkMode ? 'hover:bg-emerald-500 ' : 'hover:bg-emerald-700'} cursor-pointer relative left-7 mx-5`}
                onClick={logoutSession}
              >
                Logout
              </button>

              <div className="absolute right-12">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'dashboard' && <Dashboard patients={patients} />}
        {activeTab === 'records' && <Records patients={patients} />}
      </main>
    </div>
  );
} 

export default LandingPage;
