import React, { useMemo } from 'react'
import { User, Heart, Pill, FileText, } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

import { useDispatch, useSelector } from 'react-redux';
import { changeValue } from '../../../store/addPatientSlice';

const Tab = React.memo(function Tab({ section, idx, darkMode }) {

     // const { darkMode } = useTheme();
     const Icon = section.icon;

     const dispatch = useDispatch();
     const selectedTab = useSelector(state => state.form.selectedTab);

     return (
          <button
               type="button"
               onClick={() => dispatch( changeValue(idx) )}
               className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap transition-all duration-300 cursor-pointer  ${
               selectedTab === idx
                    ? (`bg-emerald-500 text-white rounded-lg transition-all ease-in-out duration-1000  scale-105 ${darkMode ? "shadow-sm shadow-white" : " shadow-md shadow-gray-500/60"} `)
                    : darkMode
                    ? ' text-slate-300 hover:bg-slate-700 hover:rounded-sm transition-color ease-linear duration-300 '
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-sm '
               }`}
          >
               <Icon className="w-4 h-4" />
               <span className="hidden sm:inline">{section.title}</span>
          </button>
     );
});

function Header({className}) {
     const { darkMode } = useTheme();
     
     const sections = useMemo(() => [
         { id: 0, title: 'Personal Information', icon: User },
         { id: 1, title: 'Medical History', icon: Heart },
         { id: 2, title: 'Medications & Lifestyle', icon: Pill },
         { id: 3, title: 'Location & Documents', icon: FileText }
     ], []);


  return (
     <div className={`rounded-b-2xl shadow-2xl p-4 ${darkMode ? 'bg-slate-900 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}  ${className}`}>
          <div className="flex items-center gap-5">
               <div className="p-3 rounded-2xl bg-emerald-500/10">
                    <User className="w-8 h-8 text-emerald-500" />
               </div>
               
               <div>     
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                         New Patient Registration
                    </h1>
                    
                    {/* <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                         Complete the form below to register a new patient
                    </p> */}
               </div>
          </div>

          {/* Progress Steps */}
          <div className="gap-6 mt-2 overflow-x-auto p-4 flex justify-center">
            {sections.map((section, idx) => (
               <Tab 
                    key={section.title} 
                    section={section} 
                    idx={idx} 
                    darkMode={darkMode}
               />
            ))}
          </div>
        </div>
  )
}

export default Header