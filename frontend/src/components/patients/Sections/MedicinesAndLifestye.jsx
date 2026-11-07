import React, { useState } from 'react'
import { Heart, Pill, FileText } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';


import {Calendar} from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function MedicinesAndLifestye({ form, handleChange }) {
  const { darkMode } = useTheme();
  
  const [value, onChange] = useState(new Date());

  const labelClass = `block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;
  const inputClass = `w-full p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
  darkMode 
      ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-slate-700' 
      : 'bg-white border-gray-200 text-slate-800 placeholder-gray-400 hover:border-gray-300'
  }`;

  return (
    <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                      <Pill className="w-4 h-4 inline mr-2" />
                      Past Medications
                    </label>
                    <input
                      name="pastMedications"
                      value={form.pastMedications}
                      onChange={handleChange}
                      placeholder="DrugA, DrugB, DrugC"
                      className={inputClass}
                    />
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                      <Pill className="w-4 h-4 inline mr-2" />
                      Current Medications
                    </label>
                    <input
                      name="currentMedications"
                      value={form.currentMedications}
                      onChange={handleChange}
                      placeholder="DrugX, DrugY"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className={labelClass}>
                    <Heart className="w-4 h-4 inline mr-2" />
                    Lifestyle
                  </label>
                  <input
                    name="lifestyle"
                    value={form.lifestyle}
                    onChange={handleChange}
                    placeholder="Smoking, exercise habits, diet, etc."
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Last Checkup Date
                    </label>
                    <input
                      name="lastCheckup"
                      type="date"
                      value={form.lastCheckup}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                      <FileText className="w-4 h-4 inline mr-2" />
                      Treatment Notes
                    </label>
                    <input
                      name="treatment"
                      value={form.treatment}
                      onChange={handleChange}
                      placeholder="Current treatment plan"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
  )
}

export default MedicinesAndLifestye