import React, { useState } from 'react';
import { FaFileMedical, FaPrescriptionBottle, FaVial, FaAllergies, FaFilter, FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage, translations } from '../../../context/LanguageContext';

function MedicalHistory() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  // Mock data - replace with API call
  const medicalRecords = [
    {
      id: 1,
      type: 'report',
      titleKey: 'Blood Test Report',
      date: '2024-02-15',
      doctor: 'Dr. Sharma',
      descriptionKey: 'Complete blood count and lipid profile',
      file: 'blood_test_2024_02_15.pdf'
    },
    {
      id: 2,
      type: 'prescription',
      titleKey: 'Prescription for Fever',
      date: '2024-01-20',
      doctor: 'Dr. Patel',
      descriptionKey: 'Medication for viral fever',
      medications: ['Paracetamol 500mg', 'Azithromycin 500mg']
    },
    {
      id: 3,
      type: 'lab',
      titleKey: 'X-Ray Report',
      date: '2024-01-10',
      doctor: 'Dr. Kumar',
      descriptionKey: 'Chest X-Ray examination',
      file: 'xray_2024_01_10.pdf'
    },
    {
      id: 4,
      type: 'allergy',
      titleKey: 'Known Allergies',
      date: '2023-12-01',
      doctor: 'Dr. Reddy',
      descriptionKey: 'Documented allergies',
      allergies: ['Penicillin', 'Dust Mites']
    }
  ];

  const doctors = ['Dr. Sharma', 'Dr. Patel', 'Dr. Kumar', 'Dr. Reddy'];
  const years = ['2024', '2023', '2022', '2021'];

  const getIcon = (type) => {
    switch (type) {
      case 'report':
        return FaFileMedical;
      case 'prescription':
        return FaPrescriptionBottle;
      case 'lab':
        return FaVial;
      case 'allergy':
        return FaAllergies;
      default:
        return FaFileMedical;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case 'report':
        return darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-100 border-blue-300';
      case 'prescription':
        return darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-100 border-green-300';
      case 'lab':
        return darkMode ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-100 border-purple-300';
      case 'allergy':
        return darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-300';
      default:
        return darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300';
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    if (selectedFilter !== 'all' && record.type !== selectedFilter) return false;
    if (yearFilter !== 'all' && !record.date.startsWith(yearFilter)) return false;
    if (doctorFilter !== 'all' && record.doctor !== doctorFilter) return false;
    return true;
  });

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('Medical History')}
        </h2>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('Filters:')}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('Type')}
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">{t('All Types')}</option>
              <option value="report">{t('Reports')}</option>
              <option value="prescription">{t('Prescriptions')}</option>
              <option value="lab">{t('Lab Results')}</option>
              <option value="allergy">{t('Allergies')}</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaCalendarAlt className="inline mr-1" />
              {t('Year')}
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">{t('All Years')}</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Doctor Filter */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaUserMd className="inline mr-1" />
              {t('Doctor')}
            </label>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">{t('All Doctors')}</option>
              {doctors.map(doctor => (
                <option key={doctor} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <FaFileMedical size={48} className="mx-auto mb-4 opacity-50" />
          <p>{t('No medical records found matching your filters.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map(record => {
            const IconComponent = getIcon(record.type);
            return (
              <div
                key={record.id}
                className={`p-5 rounded-xl border-2 ${getColorClass(record.type)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-black/20' : 'bg-white/50'}`}>
                    <IconComponent
                      size={24}
                      className={darkMode ? 'text-white' : 'text-gray-700'}
                    />
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {record.date}
                  </span>
                </div>
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {t(record.titleKey)}
                </h3>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t(record.descriptionKey)}
                </p>
                <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <FaUserMd className="mr-2" />
                  {record.doctor}
                </div>
                {record.medications && (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('Medications:')}
                    </p>
                    <ul className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {record.medications.map((med, idx) => (
                        <li key={idx}>• {med}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.allergies && (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t('Allergies:')}
                    </p>
                    <ul className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {record.allergies.map((allergy, idx) => (
                        <li key={idx}>• {allergy}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {record.file && (
                  <button
                    className={`mt-3 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {t('View File')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MedicalHistory;








