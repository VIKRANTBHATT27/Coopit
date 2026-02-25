import React, { useState } from 'react';
import { FaHospital, FaSyringe, FaFileMedical, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage, translations } from '../../../context/LanguageContext';

function GovernmentAlerts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  const alerts = [
    {
      id: 1,
      type: 'health-camp',
      title: 'Free Health Camp',
      message: 'Free health checkup camp on 15th March 2024 at Community Center',
      icon: FaHospital,
      color: 'light-blue',
      date: '2024-03-15'
    },
    {
      id: 2,
      type: 'vaccination',
      title: 'Vaccination Drive',
      message: 'COVID-19 booster dose available at all government hospitals',
      icon: FaSyringe,
      color: 'mint-green',
      date: '2024-03-10'
    },
    {
      id: 3,
      type: 'scheme',
      title: 'New Health Scheme',
      message: 'Ayushman Bharat scheme extended to cover more beneficiaries',
      icon: FaFileMedical,
      color: 'soft-yellow',
      date: '2024-03-05'
    },
    {
      id: 4,
      type: 'health-camp',
      title: 'Dental Health Camp',
      message: 'Free dental checkup and treatment camp on 20th March',
      icon: FaHospital,
      color: 'beige',
      date: '2024-03-20'
    }
  ];

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? visibleAlerts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === visibleAlerts.length - 1 ? 0 : prev + 1));
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
    if (currentIndex >= visibleAlerts.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  const currentAlert = visibleAlerts[currentIndex];
  const IconComponent = currentAlert.icon;

  const colorClasses = {
    'light-blue': darkMode 
      ? 'bg-blue-900/30 border-blue-700 text-blue-200' 
      : 'bg-blue-100 border-blue-300 text-blue-800',
    'mint-green': darkMode 
      ? 'bg-green-900/30 border-green-700 text-green-200' 
      : 'bg-green-100 border-green-300 text-green-800',
    'soft-yellow': darkMode 
      ? 'bg-yellow-900/30 border-yellow-700 text-yellow-200' 
      : 'bg-yellow-100 border-yellow-300 text-yellow-800',
    'beige': darkMode 
      ? 'bg-orange-900/30 border-orange-700 text-orange-200' 
      : 'bg-orange-100 border-orange-300 text-orange-800'
  };

  return (
    <div className={`relative mb-6 rounded-xl border-2 p-4 ${colorClasses[currentAlert.color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
            <IconComponent size={24} />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {t(currentAlert.title)}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t(currentAlert.message)}
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('Date:')} {currentAlert.date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {visibleAlerts.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-black/30 text-white' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
                aria-label="Previous alert"
              >
                <FaChevronLeft />
              </button>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentIndex + 1} / {visibleAlerts.length}
              </span>
              <button
                onClick={handleNext}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-black/30 text-white' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
                aria-label="Next alert"
              >
                <FaChevronRight />
              </button>
            </>
          )}
          <button
            onClick={() => handleDismiss(currentAlert.id)}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'hover:bg-black/30 text-white' 
                : 'hover:bg-white/50 text-gray-700'
            }`}
            aria-label="Dismiss alert"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      
      {/* Progress dots */}
      {visibleAlerts.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {visibleAlerts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? darkMode
                    ? 'bg-white w-6'
                    : 'bg-gray-700 w-6'
                  : darkMode
                  ? 'bg-white/30 w-2'
                  : 'bg-gray-400 w-2'
              }`}
              aria-label={`Go to alert ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GovernmentAlerts;








