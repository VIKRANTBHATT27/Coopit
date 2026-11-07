import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

// Modified handleClick to take patient
const handleClick = (e, patient, setFlag, setSelectedPatient) => {
  e.preventDefault();
  setSelectedPatient(patient);
  setFlag(true);
}

function Records({ patients }) {
  console.log(`Inside Records :: `, patients[0]);
  const { darkMode } = useTheme();
  const [flag, setFlag] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  return (
    <div className="p-6 h-full w-full">
      {flag && selectedPatient &&
        <ProfileModal 
          flag={flag} 
          setFlag={setFlag}
          patient={selectedPatient}
          className={`transition-opacity duration-500 ease-in-out
            ${flag ? 'opacity-100 scale-100' : 'opacity-0 scale-5'}`} 
        />
      }
      <div className="mb-4 flex gap-4">
        <input 
          type="text" 
          placeholder="Search patients..." 
          className="px-4 py-2 rounded-lg border border-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <select className="px-4 py-2 rounded-lg border border-emerald-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <option>Filter by disease</option>
          <option>Diabetes</option>
          <option>Hypertension</option>
          <option>Asthma</option>
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-emerald-200">
          <thead className="bg-emerald-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-50 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-50 uppercase tracking-wider">Disease</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-50 uppercase tracking-wider">Last Checkup</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-50 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-emerald-100">
            {patients.map(patient => (
              <tr key={patient.name}>
                <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.health?.conditions?.join(', ')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{patient.lastCheckup}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={(e) => handleClick(e, patient, setFlag, setSelectedPatient)} 
                    className={`text-emerald-600 hover:text-emerald-800`}
                  >View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Records;