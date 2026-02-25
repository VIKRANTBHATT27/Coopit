import React, { useState } from 'react'
import { useTheme } from '../../../context/ThemeContext';
import { Heart, FileText, AlertCircle } from 'lucide-react';


function MedicalHistory({ form, handleChange }) {
     const { darkMode } = useTheme();

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
                         <Heart className="w-4 h-4 inline mr-2" />
                         Blood Type
                    </label>
                    <input
                         name="bloodType"
                         value={form.bloodType}
                         onChange={handleChange}
                         placeholder="e.g., A+, B-, O+"
                         className={inputClass}
                    />
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                         <AlertCircle className="w-4 h-4 inline mr-2" />
                         Current Condition / Disease
                    </label>
                    <input
                         name="disease"
                         value={form.disease}
                         onChange={handleChange}
                         placeholder="Primary diagnosis"
                         className={inputClass}
                    />
               </div>
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
                  <label className={labelClass}>
                    <FileText className="w-4 h-4 inline mr-2" />
                    Past Health Summary
                  </label>
                  <textarea
                    name="pastHealth"
                    value={form.pastHealth}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the patient's medical history, previous conditions, surgeries, etc."
                    className={inputClass}
                  />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.02]">
               <label className={labelClass}>
                    <AlertCircle className="w-4 h-4 inline mr-2" />
                    Allergies
               </label>
               <input
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="Food, medication, environmental allergies"
                    className={inputClass}
               />
          </div>
     </div>
  )
}

export default MedicalHistory