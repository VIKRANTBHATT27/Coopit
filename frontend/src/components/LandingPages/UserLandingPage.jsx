import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, translations } from '../../context/LanguageContext';
import { FaUser, FaCalendarAlt, FaHistory, FaBars, FaTimes, FaHome, FaSignOutAlt, FaGlobe } from 'react-icons/fa';
import AIChatbot from './userComponents/AIChatbot';
import VoiceTranslation from './userComponents/VoiceTranslation';
import EmergencyButton from './userComponents/EmergencyButton';
import GovernmentAlerts from './userComponents/GovernmentAlerts';
import MedicalHistory from './userComponents/MedicalHistory';
import Appointments from './userComponents/Appointments';
import { useNavigate } from 'react-router-dom';

function UserLandingPage() {
  const { darkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const navigate = useNavigate();

  const t = (key) => translations[language]?.[key] || key;

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-green-50 to-orange-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-md ${darkMode ? 'text-white hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'} md:hidden`}
              >
                {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <h1 className={`ml-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>
                {t('Digital Health Records')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 text-white hover:bg-slate-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <FaGlobe />
                  <span className="hidden sm:inline">{language === 'english' ? 'English' : 'हिंदी'}</span>
                </button>
                {showLanguageDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowLanguageDropdown(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-20 ${
                      darkMode ? 'bg-slate-800' : 'bg-white'
                    } border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                      <button
                        onClick={() => {
                          setLanguage('english');
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-t-lg transition-colors ${
                          language === 'english'
                            ? darkMode
                              ? 'bg-blue-700 text-white'
                              : 'bg-blue-600 text-white'
                            : darkMode
                            ? 'text-gray-300 hover:bg-slate-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('hindi');
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-b-lg transition-colors ${
                          language === 'hindi'
                            ? darkMode
                              ? 'bg-blue-700 text-white'
                              : 'bg-blue-600 text-white'
                            : darkMode
                            ? 'text-gray-300 hover:bg-slate-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        हिंदी
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">{t('Logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed md:static md:translate-x-0 inset-y-0 left-0 z-30 w-64 ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          } shadow-lg transition-transform duration-300 ease-in-out md:transition-none pt-16`}
        >
          <nav className="p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'home'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaHome />
              <span>{t('Home')}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('appointments');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'appointments'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaCalendarAlt />
              <span>{t('Appointments')}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('medical-history');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'medical-history'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaHistory />
              <span>{t('Medical History')}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('account');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'account'
                  ? darkMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaUser />
              <span>{t('Account')}</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Government Alerts */}
          {activeTab === 'home' && <GovernmentAlerts />}

          {/* Emergency Button - Only on home */}
          {activeTab === 'home' && <EmergencyButton />}

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                  <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {t('Welcome to Your Health Portal')}
                  </h2>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('Access your medical records, schedule appointments, and get health assistance all in one place.')}
                  </p>
                </div>
                
                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-blue-50'} rounded-xl shadow-md p-6 transition-all transform hover:scale-105`}
                  >
                    <FaCalendarAlt className={`text-4xl mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {t('Book Appointment')}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('Schedule your next consultation')}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('medical-history')}
                    className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-green-50'} rounded-xl shadow-md p-6 transition-all transform hover:scale-105`}
                  >
                    <FaHistory className={`text-4xl mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {t('Medical History')}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('View past reports and records')}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-purple-50'} rounded-xl shadow-md p-6 transition-all transform hover:scale-105`}
                  >
                    <FaUser className={`text-4xl mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {t('Account Settings')}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {t('Manage your profile')}
                    </p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && <Appointments />}
            {activeTab === 'medical-history' && <MedicalHistory />}
            {activeTab === 'account' && (
              <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('Account Settings')}
                </h2>
                <button
                  onClick={() => setActiveTab('medical-history')}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-blue-700 text-white hover:bg-blue-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {t('View Medical History')}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Components */}
      <AIChatbot />
      <VoiceTranslation />
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default UserLandingPage;
