import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'english';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

// Translation mappings
export const translations = {
  english: {
    // Header
    'Digital Health Records': 'Digital Health Records',
    'Logout': 'Logout',
    
    // Sidebar
    'Home': 'Home',
    'Appointments': 'Appointments',
    'Medical History': 'Medical History',
    'Account': 'Account',
    'Account Settings': 'Account Settings',
    
    // Home Page
    'Welcome to Your Health Portal': 'Welcome to Your Health Portal',
    'Access your medical records, schedule appointments, and get health assistance all in one place.': 'Access your medical records, schedule appointments, and get health assistance all in one place.',
    'Book Appointment': 'Book Appointment',
    'Schedule your next consultation': 'Schedule your next consultation',
    // 'Medical History': 'Medical History',
    'View past reports and records': 'View past reports and records',
    // 'Account Settings': 'Account Settings',
    'Manage your profile': 'Manage your profile',
    'View Medical History': 'View Medical History',
    
    // Government Alerts
    'Free Health Camp': 'Free Health Camp',
    'Free health checkup camp on 15th March 2024 at Community Center': 'Free health checkup camp on 15th March 2024 at Community Center',
    'Vaccination Drive': 'Vaccination Drive',
    'COVID-19 booster dose available at all government hospitals': 'COVID-19 booster dose available at all government hospitals',
    'New Health Scheme': 'New Health Scheme',
    'Ayushman Bharat scheme extended to cover more beneficiaries': 'Ayushman Bharat scheme extended to cover more beneficiaries',
    'Dental Health Camp': 'Dental Health Camp',
    'Free dental checkup and treatment camp on 20th March': 'Free dental checkup and treatment camp on 20th March',
    'Date:': 'Date:',
    
    // Emergency Button
    'EMERGENCY': 'EMERGENCY',
    'HELP': 'HELP',
    'Emergency Help': 'Emergency Help',
    'Are you sure this is an emergency? This will search for nearby hospitals and connect you with emergency services.': 'Are you sure this is an emergency? This will search for nearby hospitals and connect you with emergency services.',
    'Cancel': 'Cancel',
    'Yes, I Need Help': 'Yes, I Need Help',
    'Nearby Hospitals': 'Nearby Hospitals',
    'Searching for nearby hospitals...': 'Searching for nearby hospitals...',
    'Distance:': 'Distance:',
    'Call Hospital Now': 'Call Hospital Now',
    'Note:': 'Note:',
    'In a real emergency, please call 108 (ambulance) or 102 (medical emergency) immediately.': 'In a real emergency, please call 108 (ambulance) or 102 (medical emergency) immediately.',
    
    // Medical History
    'Filters:': 'Filters:',
    'Type': 'Type',
    'All Types': 'All Types',
    'Reports': 'Reports',
    'Prescriptions': 'Prescriptions',
    'Lab Results': 'Lab Results',
    'Allergies': 'Allergies',
    'Year': 'Year',
    'All Years': 'All Years',
    'Doctor': 'Doctor',
    'All Doctors': 'All Doctors',
    'No medical records found matching your filters.': 'No medical records found matching your filters.',
    'Medications:': 'Medications:',
    'Allergies:': 'Allergies:',
    'View File': 'View File',
    'Blood Test Report': 'Blood Test Report',
    'Complete blood count and lipid profile': 'Complete blood count and lipid profile',
    'Prescription for Fever': 'Prescription for Fever',
    'Medication for viral fever': 'Medication for viral fever',
    'X-Ray Report': 'X-Ray Report',
    'Chest X-Ray examination': 'Chest X-Ray examination',
    'Known Allergies': 'Known Allergies',
    'Documented allergies': 'Documented allergies',
    
    // Appointments
    'Book Appointment': 'Book Appointment',
    'Book New Appointment': 'Book New Appointment',
    'Appointment Type': 'Appointment Type',
    'Online Consultation': 'Online Consultation',
    'Offline Visit': 'Offline Visit',
    'Select Doctor': 'Select Doctor',
    'Choose a doctor...': 'Choose a doctor...',
    'Select Date': 'Select Date',
    'Choose a date...': 'Choose a date...',
    'Select Time': 'Select Time',
    'Confirm Booking': 'Confirm Booking',
    'My Appointments': 'My Appointments',
    'No appointments booked yet. Book your first appointment above.': 'No appointments booked yet. Book your first appointment above.',
    'Online': 'Online',
    'Offline': 'Offline',
    'confirmed': 'confirmed',
  },
  hindi: {
    // Header
    'Digital Health Records': 'डिजिटल स्वास्थ्य रिकॉर्ड',
    'Logout': 'लॉगआउट',
    
    // Sidebar
    'Home': 'होम',
    'Appointments': 'अपॉइंटमेंट',
    'Medical History': 'चिकित्सा इतिहास',
    'Account': 'खाता',
    'Account Settings': 'खाता सेटिंग्स',
    
    // Home Page
    'Welcome to Your Health Portal': 'आपके स्वास्थ्य पोर्टल में आपका स्वागत है',
    'Access your medical records, schedule appointments, and get health assistance all in one place.': 'अपने चिकित्सा रिकॉर्ड तक पहुंचें, अपॉइंटमेंट शेड्यूल करें, और एक ही स्थान पर स्वास्थ्य सहायता प्राप्त करें।',
    'Book Appointment': 'अपॉइंटमेंट बुक करें',
    'Schedule your next consultation': 'अपनी अगली परामर्श तिथि निर्धारित करें',
    'Medical History': 'चिकित्सा इतिहास',
    'View past reports and records': 'पिछली रिपोर्ट और रिकॉर्ड देखें',
    'Account Settings': 'खाता सेटिंग्स',
    'Manage your profile': 'अपनी प्रोफ़ाइल प्रबंधित करें',
    'View Medical History': 'चिकित्सा इतिहास देखें',
    
    // Government Alerts
    'Free Health Camp': 'मुफ्त स्वास्थ्य शिविर',
    'Free health checkup camp on 15th March 2024 at Community Center': '15 मार्च 2024 को सामुदायिक केंद्र पर मुफ्त स्वास्थ्य जांच शिविर',
    'Vaccination Drive': 'टीकाकरण अभियान',
    'COVID-19 booster dose available at all government hospitals': 'सभी सरकारी अस्पतालों में COVID-19 बूस्टर खुराक उपलब्ध',
    'New Health Scheme': 'नई स्वास्थ्य योजना',
    'Ayushman Bharat scheme extended to cover more beneficiaries': 'अधिक लाभार्थियों को कवर करने के लिए आयुष्मान भारत योजना का विस्तार',
    'Dental Health Camp': 'दंत स्वास्थ्य शिविर',
    'Free dental checkup and treatment camp on 20th March': '20 मार्च को मुफ्त दंत जांच और उपचार शिविर',
    'Date:': 'तारीख:',
    
    // Emergency Button
    'EMERGENCY': 'आपातकाल',
    'HELP': 'मदद',
    'Emergency Help': 'आपातकालीन मदद',
    'Are you sure this is an emergency? This will search for nearby hospitals and connect you with emergency services.': 'क्या आप सुनिश्चित हैं कि यह आपातकाल है? यह आस-पास के अस्पताल खोजेगा और आपको आपातकालीन सेवाओं से जोड़ेगा।',
    'Cancel': 'रद्द करें',
    'Yes, I Need Help': 'हां, मुझे मदद चाहिए',
    'Nearby Hospitals': 'आस-पास के अस्पताल',
    'Searching for nearby hospitals...': 'आस-पास के अस्पताल खोज रहे हैं...',
    'Distance:': 'दूरी:',
    'Call Hospital Now': 'अभी अस्पताल को कॉल करें',
    'Note:': 'नोट:',
    'In a real emergency, please call 108 (ambulance) or 102 (medical emergency) immediately.': 'वास्तविक आपातकाल में, कृपया तुरंत 108 (एम्बुलेंस) या 102 (चिकित्सा आपातकाल) पर कॉल करें।',
    
    // Medical History
    'Filters:': 'फिल्टर:',
    'Type': 'प्रकार',
    'All Types': 'सभी प्रकार',
    'Reports': 'रिपोर्ट',
    'Prescriptions': 'पर्चे',
    'Lab Results': 'लैब परिणाम',
    'Allergies': 'एलर्जी',
    'Year': 'वर्ष',
    'All Years': 'सभी वर्ष',
    'Doctor': 'डॉक्टर',
    'All Doctors': 'सभी डॉक्टर',
    'No medical records found matching your filters.': 'आपके फिल्टर से मेल खाने वाला कोई चिकित्सा रिकॉर्ड नहीं मिला।',
    'Medications:': 'दवाएं:',
    'Allergies:': 'एलर्जी:',
    'View File': 'फ़ाइल देखें',
    'Blood Test Report': 'रक्त परीक्षण रिपोर्ट',
    'Complete blood count and lipid profile': 'पूर्ण रक्त गणना और लिपिड प्रोफाइल',
    'Prescription for Fever': 'बुखार के लिए पर्चे',
    'Medication for viral fever': 'वायरल बुखार के लिए दवा',
    'X-Ray Report': 'एक्स-रे रिपोर्ट',
    'Chest X-Ray examination': 'छाती एक्स-रे परीक्षा',
    'Known Allergies': 'ज्ञात एलर्जी',
    'Documented allergies': 'दस्तावेजीकृत एलर्जी',
    
    // Appointments
    'Book Appointment': 'अपॉइंटमेंट बुक करें',
    'Book New Appointment': 'नया अपॉइंटमेंट बुक करें',
    'Appointment Type': 'अपॉइंटमेंट प्रकार',
    'Online Consultation': 'ऑनलाइन परामर्श',
    'Offline Visit': 'ऑफलाइन विज़िट',
    'Select Doctor': 'डॉक्टर चुनें',
    'Choose a doctor...': 'एक डॉक्टर चुनें...',
    'Select Date': 'तारीख चुनें',
    'Choose a date...': 'एक तारीख चुनें...',
    'Select Time': 'समय चुनें',
    'Confirm Booking': 'बुकिंग पुष्टि करें',
    'My Appointments': 'मेरे अपॉइंटमेंट',
    'No appointments booked yet. Book your first appointment above.': 'अभी तक कोई अपॉइंटमेंट बुक नहीं किया गया है। ऊपर अपना पहला अपॉइंटमेंट बुक करें।',
    'Online': 'ऑनलाइन',
    'Offline': 'ऑफलाइन',
    'confirmed': 'पुष्टि की गई',
  }
};







