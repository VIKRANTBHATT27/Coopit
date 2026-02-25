import ThemeToggle from '../theme/ThemeToggle';
import React, { lazy, Suspense, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { doctorService } from '../../services/serviceFile';
// import DatePicker from "react-datepicker";

import { User, Mail, MapPin, Heart, Pill, FileText, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

import "react-datepicker/dist/react-datepicker.css";

import {Calendar} from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Header from './Header/Header';


import { useSelector } from 'react-redux';

import { DotPulse } from 'ldrs/react'
import 'ldrs/react/DotPulse.css'

// Default values shown

import PersonalInfo from "./Sections/PersonalInfo.jsx";
import MedicalHistory from "./Sections/MedicalHistory.jsx";
import MedicinesAndLifestye from "./Sections/MedicinesAndLifestye.jsx";
import LocationDocs from "./Sections/LocationDocs.jsx";

import PickDate from './MinorComponents/DatePickerComponent/PickDate.jsx';



// type ValuePiece = Date | null;

// type Value = ValuePiece | [ValuePiece, ValuePiece];

function AddPatient() {
  
  const selectedTab = useSelector(state => state.form.selectedTab);

  // const PersonalInfo = lazy(() => import ('./Sections/PersonalInfo'));
  // const MedicalHistory = lazy(() => import('./Sections/MedicalHistory'));
  // const MedicinesAndLifestye = lazy(() => import('./Sections/MedicinesAndLifestye'));
  // const LocationDocs = lazy(() => import('./Sections/LocationDocs'));
  
  const sections = [
    { id: 0, title: 'Personal Information', Component: PersonalInfo },
    { id: 1, title: 'Medical History', Component: MedicalHistory },
    { id: 2, title: 'Medications & Lifestyle', Component: MedicinesAndLifestye },
    { id: 3, title: 'Location & Documents', Component: LocationDocs }
  ];

  // const ActiveSection = sections[selectedTab] ? sections[selectedTab].Component : PersonalInfo;
  const ActiveSection = sections[selectedTab].Component;

  const { darkMode } = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    dob: '',
    birthPlace: '',
    bloodType: '',
    disease: '',
    pastHealth: '',
    pastMedications: '',
    currentMedications: '',
    allergies: '',
    lifestyle: '',
    lastCheckup: '',
    treatment: '',
    location: '',
    longitude: '',
    latitude: ''
  });

  // const [reportsFiles, setReportsFiles] = useState([]);
  // const [otherFiles, setOtherFiles] = useState([]);
  // const [vaccinationFiles, setVaccinationFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeSection, setActiveSection] = useState(0);

  // const [startDate, setStartDate] = useState(new Date());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleFiles = (setter) => (e) => {
  //   setter(Array.from(e.target.files));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("try block for adding new patient is working fine!");

      const response = await doctorService.addNewPatient(form);

      if (response) console.log(response);

      setLoading(false);
      alert('Patient added successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to add patient. Please check your connection and try again.');
      setLoading(false);
    }
  };




  // const inputClass = `w-full p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
  //   darkMode 
  //     ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-slate-700' 
  //     : 'bg-white border-gray-200 text-slate-800 placeholder-gray-400 hover:border-gray-300'
  // }`;

  // const labelClass = `block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;


  
  return (
    <div className={`min-h-screen w-full flex flex-col items-center ${darkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}>
      <div className="w-5xl mx-auto flex flex-col items-center">

        <Header className="absolute w-7xl" />

        <form onSubmit={handleSubmit}>
          <div className={`rounded-xl shadow-2xl mt-48 p-8 w-5xl ${darkMode ? 'bg-slate-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
            
            {/* <Suspense fallback={
              <div className='p-6'>
                <DotPulse size="40" speed="1.2" color="black" />
              </div>
            }> */}
              <ActiveSection form={form} handleChange={handleChange} />
            {/* </Suspense> */}

            

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-start gap-3 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-700">
              <div className="flex gap-4 flex-1">
                {selectedTab > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveSection(selectedTab - 1)}
                    className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                      darkMode
                        ? 'bg-slate-700 text-white hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                )}
                
                {selectedTab < sections.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveSection(selectedTab + 1)}
                    className="px-6 py-3 rounded-lg cursor-pointer font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-all  duration-300 hover:scale-105 shadow-lg"
                  >
                    Next Section
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`px-6 py-3 rounded-lg cursor-pointer font-medium transition-all duration-300 ${
                    darkMode
                      ? 'border-2 border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>

                {selectedTab === sections.length - 1 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding Patient...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 cursor-pointer" />
                        Add Patient
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
      
      <div className="absolute right-12 top-7">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default AddPatient;