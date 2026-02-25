import React, { useState } from 'react'
import { User, Mail, MapPin, Calendar } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

import ErrorBoundary from '../ErrorBoundary';


// import {Calendar} from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import PickDate from '../MinorComponents/DatePickerComponent/PickDate';
import StateandCityPicker from '../MinorComponents/StateAndCityPicker/StateandCityPicker';
// import StateAndCityPicker from "../MinorComponents/StateAndCityPicker/"

function PersonalInfo({ form, handleChange }) {
     const { darkMode } = useTheme();

     // const [val, onChange] = useState(new Date());
     // console.log(val);

     
     // const [value, setValue] = React.useState(null);
     // console.log(value);

     const labelClass = `block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;
     const inputClass = `w-full p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
     darkMode 
          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-slate-700' 
          : 'bg-white border-gray-200 text-slate-800 placeholder-gray-400 hover:border-gray-300'
     }`;
     
  return (
     <div className="space-y-6 animate-fadeIn flex flex-row justify-around">      
          <div className="grid grid-row-1 md:grid-row-2 w-md gap-6">
          
               <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                         <User className="w-4 h-4 inline mr-2" />
                         Full Name *
                    </label>
          
                    <input
                         name="name"
                         value={form.name}
                         onChange={handleChange}
                         required
                         placeholder="Enter patient's full name"
                         className={inputClass}
                    />
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                         <Mail className="w-4 h-4 inline mr-2" />
                         Email Address *
                    </label>
               
                    <input
                         name="email"
                         type="email"
                         value={form.email}
                         onChange={handleChange}
                         required
                         placeholder="patient@example.com"
                         className={inputClass}
                    />
               </div>

               <div className="">
                    <label className={labelClass}>
                         <MapPin className="w-4 h-4 inline mr-2" />
                         Birth Place
                    </label>
                    {/* <input
                         name="birthPlace"
                         value={form.birthPlace}
                         onChange={handleChange}
                         placeholder="City, Country"
                         className={inputClass}
                    /> */}
                    <StateandCityPicker className={`${inputClass} transform transition-all duration-300 hover:scale-[1.02]`} />
               </div>
          </div>

          <div className=''>
               <div className="flex flex-col justify-baseline items-center px-6 h-fit">
                    <label className={`${labelClass}`}>
                         <Calendar className="w-4 h-4 inline mr-2" />
                         Date of Birth
                    </label>
                    <PickDate inputClass={inputClass}/>
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02] mt-16">
                    <label className={labelClass}>
                         <User className="w-4 h-4 inline mr-2" />
                         Height
                    </label>
          
                    <input
                         name="name"
                         value={form.name}
                         onChange={handleChange}
                         required
                         placeholder="Enter patient's full name"
                         className={inputClass}
                    />
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02] mt-8">
                    <label className={labelClass}>
                         <User className="w-4 h-4 inline mr-2" />
                         Weight
                    </label>
          
                    <input
                         name="name"
                         value={form.name}
                         onChange={handleChange}
                         required
                         placeholder="Enter patient's full name"
                         className={inputClass}
                    />
               </div>
          </div>
     </div>
  )
}

export default PersonalInfo