import React, { useState } from 'react'
import { MapPin, Upload } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';


function LocationDocs({ form, handleChange }) {
     const { darkMode } = useTheme();
     
     const labelClass = `block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`;
     const inputClass = `w-full p-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
     darkMode 
          ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-slate-700' 
          : 'bg-white border-gray-200 text-slate-800 placeholder-gray-400 hover:border-gray-300'
     }`;

     const [reportsFiles, setReportsFiles] = useState([]);
     const [otherFiles, setOtherFiles] = useState([]);
     const [vaccinationFiles, setVaccinationFiles] = useState([]);
     
     const handleFiles = (setter) => (e) => {
          setter(Array.from(e.target.files));
     };

     
  return (
     <div className="space-y-6 animate-fadeIn">
                
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-3 transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="City, address, or general location"
                      className={inputClass}
                    />
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>Longitude</label>
                    <input
                      name="longitude"
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={handleChange}
                      placeholder="e.g., -73.935242"
                      className={inputClass}
                    />
               </div>

               <div className="transform transition-all duration-300 hover:scale-[1.02]">
                    <label className={labelClass}>Latitude</label>
                    <input
                      name="latitude"
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={handleChange}
                      placeholder="e.g., 40.730610"
                      className={inputClass}
                    />
               </div>
          
          </div>

          {/* File Uploads */}
          <div className="space-y-4 pt-4">      
               <div className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-emerald-500 ${
               darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-300'
               }`}>
               
                    <label className={`${labelClass} mb-3`}>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Medical Reports {reportsFiles.length > 0 && `(${reportsFiles.length} files)`}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFiles(setReportsFiles)}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
               
               </div>

               <div className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-emerald-500 ${
               darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-300'
               }`}>
                    
                    <label className={`${labelClass} mb-3`}>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Other Documents {otherFiles.length > 0 && `(${otherFiles.length} files)`}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFiles(setOtherFiles)}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />

               </div>

               <div className={`p-6 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-emerald-500 ${
               darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-300'
               }`}>
               
                    <label className={`${labelClass} mb-3`}>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Vaccination & Treatment Records {vaccinationFiles.length > 0 && `(${vaccinationFiles.length} files)`}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFiles(setVaccinationFiles)}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                    />
               
               </div>
          </div>

     </div>
  )
}

export default LocationDocs