import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaHospital, FaPhone, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage, translations } from '../../../context/LanguageContext';

function EmergencyButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  const handleEmergencyClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    
    // Simulate API call to find nearby hospitals
    // In production, this would use geolocation and a hospital finder API
    setTimeout(() => {
      const mockHospitals = [
        {
          id: 1,
          name: 'City General Hospital',
          distance: '2.5 km',
          phone: '+91 1234567890',
          address: '123 Main Street, City'
        },
        {
          id: 2,
          name: 'Emergency Medical Center',
          distance: '4.1 km',
          phone: '+91 9876543210',
          address: '456 Health Avenue, City'
        },
        {
          id: 3,
          name: 'Regional Hospital',
          distance: '5.8 km',
          phone: '+91 1122334455',
          address: '789 Medical Road, City'
        }
      ];
      setHospitals(mockHospitals);
      setLoading(false);
      setShowHospitals(true);
    }, 1500);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleCloseHospitals = () => {
    setShowHospitals(false);
    setHospitals([]);
  };

  return (
    <>
      {/* Emergency Button */}
      <div className="flex justify-center my-8">
        <button
          onClick={handleEmergencyClick}
          className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex flex-col items-center justify-center transition-all transform hover:scale-110 animate-pulse"
          aria-label="Emergency Help"
        >
          <FaExclamationTriangle size={48} />
          <span className="mt-2 font-bold text-sm">{t('EMERGENCY')}</span>
          <span className="text-xs">{t('HELP')}</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FaExclamationTriangle className="text-red-600 text-3xl" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('Emergency Help')}
                </h3>
              </div>
              <button
                onClick={handleCancel}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('Are you sure this is an emergency? This will search for nearby hospitals and connect you with emergency services.')}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                {t('Yes, I Need Help')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospitals List Modal */}
      {showHospitals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full p-6 mt-20 mb-20`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaHospital className="text-blue-600 text-3xl" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t('Nearby Hospitals')}
                </h3>
              </div>
              <button
                onClick={handleCloseHospitals}
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('Searching for nearby hospitals...')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className={`p-4 rounded-lg border-2 ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {hospital.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {hospital.address}
                        </p>
                        <p className={`text-sm font-semibold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {t('Distance:')} {hospital.distance}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCallHospital(hospital.phone)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <FaPhone />
                      <span>{t('Call Hospital Now')}</span>
                      <span className="text-sm">({hospital.phone})</span>
                    </button>
                  </div>
                ))}
                <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-yellow-50'} border-2 border-yellow-400`}>
                  <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    <strong>{t('Note:')}</strong> {t('In a real emergency, please call 108 (ambulance) or 102 (medical emergency) immediately.')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;








