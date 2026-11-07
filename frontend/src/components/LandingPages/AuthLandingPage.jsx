import React, { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../theme/ThemeToggle'
import Maps from '../maps/Maps'
import Analytics from '../analytics/Analytics'
import HealthCare from '../healthcare/HealthCare'

function AuthLandingPage() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('maps');

  const logoutSession = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.href = '/';
    }, 700);
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
                onClick={() => setActiveTab('maps')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'maps' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `)
                    :  (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                Maps
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'analytics' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `)
                    :  (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('health care')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'health care' 
                    ? (`border-b-2 border-emerald-700 ${darkMode ? 'text-emerald-400' : 'text-emerald-700'} `)
                    :  (`hover:text-emerald-700 ${darkMode ? 'text-emerald-300' : 'text-emerald-400 '}`)
                }`}
              >
                Health Care
              </button>

              <button
                className={`bg-emerald-600 py-2 px-4  hover:rounded-xl transition-rounded duration-300 text-white font-medium ${darkMode ? 'hover:bg-emerald-500 ' : 'hover:bg-emerald-700'} cursor-pointer relative left-7 mx-5`}
                onClick={logoutSession}
              >
                Logout
              </button>

              <div className="absolute right-18">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4">
        {activeTab === 'maps' && <Maps />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'health care' && <HealthCare />}
      </main>
    </div>
  )
}

export default AuthLandingPage