import React, { useState } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaMapMarkerAlt, FaVideo, FaHospital, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage, translations } from '../../../context/LanguageContext';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState('online');
  const [showBooking, setShowBooking] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  // Mock data - replace with API call
  const doctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Sharma',
      specialization: 'General Physician',
      state: 'Maharashtra',
      city: 'Mumbai',
      availableDates: ['2024-03-15', '2024-03-16', '2024-03-17'],
      availableTimes: ['09:00', '10:00', '11:00', '14:00', '15:00']
    },
    {
      id: 2,
      name: 'Dr. Priya Patel',
      specialization: 'Cardiologist',
      state: 'Gujarat',
      city: 'Ahmedabad',
      availableDates: ['2024-03-18', '2024-03-19', '2024-03-20'],
      availableTimes: ['10:00', '11:00', '12:00', '16:00']
    },
    {
      id: 3,
      name: 'Dr. Amit Kumar',
      specialization: 'Dermatologist',
      state: 'Delhi',
      city: 'New Delhi',
      availableDates: ['2024-03-21', '2024-03-22'],
      availableTimes: ['09:00', '10:00', '14:00', '15:00', '16:00']
    }
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedDoctor) {
      alert('Please select a date and doctor');
      return;
    }
    
    const doctor = doctors.find(d => d.id === parseInt(selectedDoctor));
    if (doctor) {
      const newAppointment = {
        id: bookedAppointments.length + 1,
        doctor: doctor.name,
        specialization: doctor.specialization,
        date: selectedDate,
        type: appointmentType,
        status: 'confirmed'
      };
      setBookedAppointments([...bookedAppointments, newAppointment]);
      setShowBooking(false);
      setSelectedDate('');
      setSelectedDoctor('');
      alert('Appointment booked successfully!');
    }
  };

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('Appointments')}
        </h2>
        <button
          onClick={() => setShowBooking(!showBooking)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            darkMode
              ? 'bg-blue-700 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <FaCalendarAlt className="inline mr-2" />
          {t('Book Appointment')}
        </button>
      </div>

      {/* Booking Form */}
      {showBooking && (
        <div className={`mb-6 p-6 rounded-xl border-2 ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('Book New Appointment')}
          </h3>
          
          {/* Appointment Type */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('Appointment Type')}
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setAppointmentType('online')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  appointmentType === 'online'
                    ? darkMode
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaVideo className="inline mr-2" />
                {t('Online Consultation')}
              </button>
              <button
                onClick={() => setAppointmentType('offline')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  appointmentType === 'offline'
                    ? darkMode
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaHospital className="inline mr-2" />
                {t('Offline Visit')}
              </button>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaUserMd className="inline mr-1" />
              {t('Select Doctor')}
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-slate-600 border-slate-500 text-white'
                  : 'bg-white border-gray-300 text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">{t('Choose a doctor...')}</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization} ({doctor.city}, {doctor.state})
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          {selectedDoctor && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaCalendarAlt className="inline mr-1" />
                {t('Select Date')}
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-slate-600 border-slate-500 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">{t('Choose a date...')}</option>
                {selectedDoctor && doctors.find(d => d.id === parseInt(selectedDoctor))?.availableDates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time Selection */}
          {selectedDate && (
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaClock className="inline mr-1" />
                {t('Select Time')}
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {selectedDoctor && doctors.find(d => d.id === parseInt(selectedDoctor))?.availableTimes.map(time => (
                  <button
                    key={time}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      darkMode
                        ? 'bg-slate-600 text-white hover:bg-slate-500'
                        : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBookAppointment}
            disabled={!selectedDate || !selectedDoctor}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
              !selectedDate || !selectedDoctor
                ? darkMode
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {t('Confirm Booking')}
          </button>
        </div>
      )}

      {/* Booked Appointments List */}
      <div>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('My Appointments')}
        </h3>
        {bookedAppointments.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FaCalendarAlt size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t('No appointments booked yet. Book your first appointment above.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookedAppointments.map(appointment => (
              <div
                key={appointment.id}
                className={`p-5 rounded-xl border-2 ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaUserMd className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                      <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {appointment.doctor}
                      </h4>
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {appointment.specialization}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <FaCalendarAlt className="mr-2" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {appointment.type === 'online' ? (
                          <FaVideo className="mr-2" />
                        ) : (
                          <FaHospital className="mr-2" />
                        )}
                        {appointment.type === 'online' ? t('Online') : t('Offline')}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    <FaCheckCircle />
                    <span className="font-semibold">{t(appointment.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;








