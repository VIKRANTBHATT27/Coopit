import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { patientService } from '../../services/serviceFile';

function Dashboard() {
  const { darkMode } = useTheme();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const result = await patientService.getAllPatients();
        setPatients(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);
  
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  
  // console.log(patients);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {patients.map(patient =>  (
        <div key={patient._id} className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <img 
            src={patient.pic} 
            alt={patient.name} 
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-emerald-100 ' : 'text-emerald-900'}  text-center`}>{patient.name}</h3>
          <div className={`mt-2 space-y-2 ${darkMode ? 'text-emerald-200' : 'text-emerald-700'} `}>
            <p>Age: {patient.health?.age}</p>
            <p>Condition: {patient.health?.conditions?.join(', ')}</p>
            <p>Last Checkup: {patient.lastCheckup}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;