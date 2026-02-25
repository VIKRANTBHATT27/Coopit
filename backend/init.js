import mongoose, { get } from 'mongoose';
import DATA from "./models/patient.js";
import Doctor from './models/doctorSchema.js';

const connectDB = async () => {
  try {
    await mongoose.connect("");
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Sample data to populate database
const allUsers = [
  {
    "name": "Siddharth Menon",
    "email": "siddharth.menon@outlook.in",

    // Retaining the original asynchronous structure for fetching the picture URL
    "pic": await (async () => {
      try {
        const res = await fetch("https://randomuser.me/api/?gender=male"); // Note: Gender should be 'male' for Siddharth, but retaining the original logic for code integrity
        const data = await res.json();
        return data?.results?.[0]?.picture?.large ?? "https://via.placeholder.com/150";
      } catch (err) {
        console.error("Failed to fetch random user image:", err);
        return "https://via.placeholder.com/150";
      }
    })(),

    "birthplace": "Ernakulam, Kerala",
    "pasthealth": "Diagnosed with mild hypertension (high blood pressure) 8 years ago. No major hospitalizations.",
    "pastMedications": ["Amlodipine (discontinued)"],
    "currentMedications": "Lisinopril 5mg (Daily)",
    "allergies": "Seasonal pollen (mild rhinitis)",
    "lifestyle": "Non-smoker, socially drinks (occasional), follows a South Indian diet with limited processed foods.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Lisinopril",
        "for": "Hypertension (High BP)",
        "benefit": "Maintains blood pressure within target range.",
        "timing": "Once daily, morning"
      },
      {
        "medicine": "Annual Flu Shot",
        "for": "Influenza prevention",
        "benefit": "Reduces severity of seasonal illness.",
        "timing": "Annually (last shot: Oct 2024)"
      }
    ],

    "analysis": [
      {
        "date": new Date("2025-01-15").toLocaleDateString(),
        "description": "Routine blood pressure check.",
        "result": "128/84 mmHg. Stable.",
      },
      {
        "date": new Date("2024-12-01").toLocaleDateString(),
        "description": "Comprehensive metabolic panel.",
        "result": "All markers within normal range.",
      }
    ],

    "health": {
      "age": 48,
      "bloodType": "A-",
      "conditions": ["Hypertension", "Mild Rhinitis"]
    },

    "reports": [
      {
        "date": new Date("2025-01-15").toLocaleDateString(),
        "description": "Cardiology Consultation Summary",
        "result": "BP controlled, continue current medication. Follow up in 6 months."
      },
      {
        "date": new Date("2024-10-01").toLocaleDateString(),
        "description": "Full Lipid Panel (Cholesterol)",
        "result": "Total Cholesterol: 185 mg/dL (Acceptable)."
      }
    ],

    "files": [
      {
        "filename": "cardio_consult_2025.pdf",
        "filepath": "/uploads/smenon/cardio_consult_2025.pdf",
        "uploadDate": new Date("2025-01-16").toLocaleDateString()
      },
      {
        "filename": "lab_report_lipids_2024.pdf",
        "filepath": "/uploads/smenon/lab_report_lipids_2024.pdf",
        "uploadDate": new Date("2024-10-02").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2025-01-15").toLocaleDateString(),
    nextCheckup: new Date("2025-07-15").toLocaleDateString(),
    locationContext: "Ernakulam (Kochi Urban, High Density)",
    longitude: 76.2891,
    latitude: 9.9984,
  },
  {
    "name": "Amit Verma",
    "email": "amit.verma@gmail.com",

    // Retaining the original asynchronous structure for fetching the picture URL
    "pic": await (async () => {
      try {
        const res = await fetch("https://randomuser.me/api/?gender=male");
        const data = await res.json();
        return data?.results?.[0]?.picture?.large ?? "https://via.placeholder.com/150";
      } catch (err) {
        console.error("Failed to fetch random user image:", err);
        return "https://via.placeholder.com/150";
      }
    })(),

    "birthplace": "Kollam, Kerala",
    "pasthealth": "Diagnosed with essential hypertension (Stage 1) two years ago. No history of cardiac events or stroke.",
    "pastMedications": ["Hydrochlorothiazide (discontinued due to side effects)"],
    "currentMedications": "Losartan 50mg (Once daily)",
    "allergies": "No known drug or food allergies.",
    "lifestyle": "Occasional smoker (actively trying to quit), regular walking exercise (4 times a week), standard diet.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Losartan",
        "for": "Essential Hypertension",
        "benefit": "Angiotensin Receptor Blocker (ARB) controlling blood pressure.",
        "timing": "Once daily, evening"
      },
      {
        "medicine": "Tetanus Booster",
        "for": "Tetanus Prevention",
        "benefit": "Up-to-date immunity for field work safety.",
        "timing": "Last administered: May 2023"
      }
    ],

    "analysis": [
      {
        "date": new Date("2025-01-20").toLocaleDateString(),
        "description": "Routine blood pressure check.",
        "result": "135/88 mmHg. Slightly elevated, adjustment to dosage may be required.",
      },
      {
        "date": new Date("2024-11-05").toLocaleDateString(),
        "description": "Electrolyte panel.",
        "result": "Sodium and Potassium levels are normal.",
      }
    ],

    "health": {
      "age": 52, // Age adjusted to fit hypertension profile
      "bloodType": "O+",
      "conditions": ["Hypertension (Controlled)", "Mild Gout (intermittent)"]
    },

    "reports": [
      {
        "date": new Date("2024-10-15").toLocaleDateString(),
        "description": "Blood pressure monitoring",
        "result": "Stable"
      },
      {
        "date": new Date("2024-09-01").toLocaleDateString(),
        "description": "Annual Physical Examination",
        "result": "Overall good, advised dietary modifications for BP."
      }
    ],

    "files": [
      {
        "filename": "bp_report.pdf",
        "filepath": "/uploads/amit/bp_report.pdf",
        "uploadDate": new Date("2024-10-15").toLocaleDateString()
      },
      {
        "filename": "full_physical_2024.pdf",
        "filepath": "/uploads/amit/full_physical_2024.pdf",
        "uploadDate": new Date("2024-09-02").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2025-01-20").toLocaleDateString(),
    nextCheckup: new Date("2025-04-20").toLocaleDateString(),
    locationContext: "Kollam (Coastal Fishing Village)",
    longitude: 76.6027,
    latitude: 8.8951,
  },
  {
    "name": "Priya Kapoor",
    "email": "priya.kapoor@gmail.com",

    // Retaining the original asynchronous structure for fetching the picture URL
    "pic": await (async () => {
      try {
        const res = await fetch("https://randomuser.me/api/?gender=female");
        const data = await res.json();
        return data?.results?.[0]?.picture?.large ?? "https://via.placeholder.com/150";
      } catch (err) {
        console.error("Failed to fetch random user image:", err);
        return "https://via.placeholder.com/150";
      }
    })(),

    "birthplace": "Thrissur, Kerala",
    "pasthealth": "No significant medical history. Routine vaccinations up-to-date.",
    "pastMedications": ["None"],
    "currentMedications": "Folic acid supplement (as needed)",
    "allergies": "No known drug or food allergies.",
    "lifestyle": "Non-smoker, non-drinker, maintains an active lifestyle (yoga and running), follows a balanced diet.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Hepatitis B Vaccine",
        "for": "Viral Hepatitis Prevention",
        "benefit": "Provides immunity against Hepatitis B virus.",
        "timing": "Completed three-dose primary series (last dose: 2018)"
      },
      {
        "medicine": "Typhoid Vaccine",
        "for": "Typhoid Fever Prevention",
        "benefit": "Protects against Salmonella typhi.",
        "timing": "Booster administered: June 2024"
      }
    ],

    "analysis": [
      {
        "date": new Date("2025-01-05").toLocaleDateString(),
        "description": "Routine blood pressure and vital signs check.",
        "result": "BP 110/70 mmHg, Pulse 68 bpm. Excellent.",
      },
      {
        "date": new Date("2024-11-10").toLocaleDateString(),
        "description": "Body Mass Index (BMI) assessment.",
        "result": "BMI 21.5 (Healthy weight range).",
      }
    ],

    "health": {
      "age": 28,
      "bloodType": "A-",
      "conditions": ["None known"] // Explicitly stating no known chronic conditions
    },

    "reports": [
      {
        "date": new Date("2024-09-22").toLocaleDateString(),
        "description": "Full body check-up (Hematology & Biochemistry)",
        "result": "All parameters within normal clinical range. Excellent health."
      },
      {
        "date": new Date("2024-03-15").toLocaleDateString(),
        "description": "Gynecological check-up (Routine screening)",
        "result": "Normal findings."
      }
    ],

    "files": [
      {
        "filename": "health_summary_2024.pdf",
        "filepath": "/uploads/priya/health_summary_2024.pdf",
        "uploadDate": new Date("2024-09-22").toLocaleDateString()
      },
      {
        "filename": "vaccination_record.pdf",
        "filepath": "/uploads/priya/vaccination_record.pdf",
        "uploadDate": new Date("2024-07-01").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-10").toLocaleDateString(),
    nextCheckup: new Date("2025-11-01").toLocaleDateString(),
    locationContext: "Thrissur (Inland Residential Area)",
    longitude: 76.2144,
    latitude: 10.5276,
  },
  {
    "name": "Rahul Mehta",
    "email": "rahul.mehta@gmail.com",

    // Retaining the original asynchronous structure for fetching the picture URL
    "pic": await (async () => {
      try {
        const res = await fetch("https://randomuser.me/api/?gender=male");
        const data = await res.json();
        return data?.results?.[0]?.picture?.large ?? "https://via.placeholder.com/150";
      } catch (err) {
        console.error("Failed to fetch random user image:", err);
        return "https://via.placeholder.com/150";
      }
    })(),

    "birthplace": "Malappuram, Kerala",
    "pasthealth": "Diagnosed with Type 2 Diabetes Mellitus 5 years ago. Recently experienced elevated cholesterol levels requiring medication.",
    "pastMedications": ["Metformin 500mg (initial dosage)"],
    "currentMedications": "Metformin 1000mg (Twice Daily) and Atorvastatin 20mg (Daily)",
    "allergies": "Penicillin (rash)",
    "lifestyle": "Sedentary job (IT professional). Trying to incorporate daily brisk walking. Struggles with diet compliance (frequent sugar intake).",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Metformin",
        "for": "Type 2 Diabetes",
        "benefit": "Decreases hepatic glucose production and improves insulin sensitivity.",
        "timing": "Morning and Evening, with meals"
      },
      {
        "medicine": "Atorvastatin",
        "for": "Hypercholesterolemia",
        "benefit": "Lowers LDL ('bad') cholesterol levels.",
        "timing": "Once daily, bedtime"
      }
    ],

    "analysis": [
      {
        "date": new Date("2025-01-05").toLocaleDateString(),
        "description": "HbA1c test (3-month blood sugar average).",
        "result": "7.8% (Above target of <7.0%).",
      },
      {
        "date": new Date("2024-11-20").toLocaleDateString(),
        "description": "Lipid Profile Test.",
        "result": "LDL 135 mg/dL (High Risk). Medication effectiveness review required.",
      }
    ],

    "health": {
      "age": 35,
      "bloodType": "AB+",
      "conditions": ["Type 2 Diabetes Mellitus", "Hypercholesterolemia (High Cholesterol)"]
    },

    "reports": [
      {
        "date": new Date("2024-08-10").toLocaleDateString(),
        "description": "Cholesterol test",
        "result": "Total Cholesterol 220 mg/dL. Statins initiated."
      },
      {
        "date": new Date("2024-07-01").toLocaleDateString(),
        "description": "Diabetes follow-up",
        "result": "Needs medication adjustment. Metformin dosage increased."
      },
      {
        "date": new Date("2024-06-01").toLocaleDateString(),
        "description": "Foot Exam (Diabetic screening)",
        "result": "Normal sensation; good circulation."
      }
    ],

    "files": [
      {
        "filename": "cholesterol_report_2024_08.pdf",
        "filepath": "/uploads/rahul/cholesterol_report.pdf",
        "uploadDate": new Date("2024-08-10").toLocaleDateString()
      },
      {
        "filename": "HbA1c_report_2025_01.pdf",
        "filepath": "/uploads/rahul/diabetes_latest_hba1c.pdf",
        "uploadDate": new Date("2025-01-05").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2025-01-05").toLocaleDateString(),
    nextCheckup: new Date("2025-03-05").toLocaleDateString(),
    locationContext: "Malappuram (Semi-Rural Farming Area)",
    longitude: 76.0792,
    latitude: 11.0772,
  },
  {
    "name": "Sneha Joshi",
    "email": "sneha.joshi@gmail.com",

    "pic": await (async () => {
      // Retaining original pic logic
      try {
        const res = await fetch("https://randomuser.me/api/?gender=female");
        const data = await res.json();
        return data?.results?.[0]?.picture?.large ?? "https://via.placeholder.com/150";
      } catch (err) {
        console.error("Failed to fetch random user image:", err);
        return "https://via.placeholder.com/150";
      }
    })(),

    "birthplace": "Kottayam, Kerala",
    "pasthealth": "History of frequent fatigue. Diagnosed with mild iron-deficiency anemia in 2024.",
    "pastMedications": ["None"],
    "currentMedications": "Ferrous Sulphate 325mg (Daily)",
    "allergies": "Seasonal dust (mild)",
    "lifestyle": "Vegetarian diet (potential low iron intake), moderate activity level (commuting, light housework).",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Ferrous Sulphate",
        "for": "Iron-deficiency Anemia",
        "benefit": "Increases hemoglobin and red blood cell production.",
        "timing": "Once daily, after meal"
      },
      {
        "medicine": "B12 Supplement",
        "for": "Nutritional support",
        "benefit": "Aids in red blood cell formation.",
        "timing": "Weekly"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-20").toLocaleDateString(),
        "description": "Follow-up Hemoglobin check.",
        "result": "Hb 11.5 g/dL. Responding well to therapy. Continue treatment for 3 more months.",
      },
      {
        "date": new Date("2024-08-15").toLocaleDateString(),
        "description": "Ferritin Level check.",
        "result": "Low, confirming iron deficiency etiology.",
      }
    ],

    "health": {
      "age": 29,
      "bloodType": "O-",
      "conditions": ["Mild Iron-Deficiency Anemia"]
    },

    "reports": [
      {
        "date": new Date("2024-07-15").toLocaleDateString(),
        "description": "Complete blood count (CBC)",
        "result": "Mild anemia detected (Hb 10.8 g/dL)."
      },
      {
        "date": new Date("2024-01-05").toLocaleDateString(),
        "description": "Routine Annual Physical",
        "result": "Normal, except for noted fatigue."
      }
    ],

    "files": [
      {
        "filename": "cbc_report_2024_07.pdf",
        "filepath": "/uploads/sneha/cbc_report_2024_07.pdf",
        "uploadDate": new Date("2024-07-15").toLocaleDateString()
      },
      {
        "filename": "follow_up_hgb_2024_11.pdf",
        "filepath": "/uploads/sneha/follow_up_hgb_2024_11.pdf",
        "uploadDate": new Date("2024-11-20").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-20").toLocaleDateString(),
    nextCheckup: new Date("2025-02-20").toLocaleDateString(),
    locationContext: "Kottayam (Kuttanad Backwater Zone)",
    longitude: 76.5132,
    latitude: 9.5916,
  },
  {
    "name": "Ahmed Khan",
    "email": "ahmed.khan@outlook.com",

    "pic": "https://randomuser.me/api/portraits/men/30.jpg", // Retaining the direct URL

    "birthplace": "Alappuzha, Kerala",
    "pasthealth": "Childhood onset asthma, managed effectively since age 15. No emergency department visits in the last five years.",
    "pastMedications": ["Theophylline (discontinued)"],
    "currentMedications": "Salbutamol Inhaler (PRN) and Budesonide Inhaler (Daily)",
    "allergies": "Dust mites, humidity (mild trigger).",
    "lifestyle": "Active swimmer, non-smoker. Requires controlled environment, uses air purifier at home.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Budesonide (Corticosteroid)",
        "for": "Asthma Control",
        "benefit": "Reduces chronic airway inflammation (preventative).",
        "timing": "Twice daily"
      },
      {
        "medicine": "Salbutamol (Reliever)",
        "for": "Acute Bronchospasm",
        "benefit": "Quick relief for sudden shortness of breath.",
        "timing": "As needed (PRN)"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-01").toLocaleDateString(),
        "description": "Peak Flow Monitoring (Monthly check)",
        "result": "Peak flow 550 L/min. Stable and Green Zone.",
      },
      {
        "date": new Date("2024-10-05").toLocaleDateString(),
        "description": "Pulmonary Function Test (PFT) - Spirometry.",
        "result": "FEV1 90% of predicted. Normal baseline, good control."
      }
    ],

    "health": {
      "age": 28,
      "bloodType": "O+",
      "conditions": ["Controlled Persistent Asthma", "Dust Mite Allergy"]
    },

    "reports": [
      {
        "date": new Date("2024-10-05").toLocaleDateString(),
        "description": "Pulmonary Function Test (PFT)",
        "result": "Normal baseline, good control"
      },
      {
        "date": new Date("2024-03-10").toLocaleDateString(),
        "description": "Allergy Panel",
        "result": "Mild allergy to dust mites and mold spores."
      }
    ],

    "files": [
      {
        "filename": "pft_report_2024_10.pdf",
        "filepath": "/uploads/ahmed/pft_report_2024_10.pdf",
        "uploadDate": new Date("2024-10-06").toLocaleDateString()
      },
      {
        "filename": "allergy_panel_results_2024_03.pdf",
        "filepath": "/uploads/ahmed/allergy_panel_results_2024_03.pdf",
        "uploadDate": new Date("2024-03-11").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-01").toLocaleDateString(),
    nextCheckup: new Date("2025-05-01").toLocaleDateString(),
    locationContext: "Alappuzha (Low-Lying Waterway Access)",
    longitude: 76.3275,
    latitude: 9.4981,
  },
  {
    "name": "Sofia Rossi",
    "email": "sofia.rossi@gmail.com",
    "pic": "https://randomuser.me/api/portraits/women/78.jpg",

    "birthplace": "Rome, Italy",
    "pasthealth": "History of postmenopausal osteoporosis. Recent diagnosis of Primary Open-Angle Glaucoma requiring continuous medication.",
    "pastMedications": ["Alendronate (weekly)"],
    "currentMedications": "Latanoprost 0.005% eye drops (Nightly) and Calcium/Vitamin D supplements (Daily)",
    "allergies": "Sulfa drugs (mild rash)",
    "lifestyle": "Retired. Low activity level. Requires assistance for heavy lifting. Follows Mediterranean diet guidelines.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Latanoprost",
        "for": "Glaucoma (IOP reduction)",
        "benefit": "Maintains intraocular pressure to prevent vision loss.",
        "timing": "One drop, affected eye, every night"
      },
      {
        "medicine": "Pneumococcal Vaccine (Pneumovax)",
        "for": "Pneumonia Prevention",
        "benefit": "Protection against serious bacterial infections.",
        "timing": "Last administered: Nov 2023"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-05").toLocaleDateString(),
        "description": "Follow-up Bone Density T-Score.",
        "result": "Lumbar Spine T-score -2.1. Stable, non-fracture risk zone.",
      },
      {
        "date": new Date("2024-04-12").toLocaleDateString(),
        "description": "Visual Field Test (Glaucoma).",
        "result": "Peripheral field loss stable, no progression since previous exam.",
      }
    ],

    "health": {
      "age": 68,
      "bloodType": "B+",
      "conditions": ["Osteoporosis", "Primary Open-Angle Glaucoma"]
    },

    "reports": [
      {
        "date": new Date("2024-10-25").toLocaleDateString(),
        "description": "DEXA Scan (Bone Densitometry)",
        "result": "Stable bone density, continue supplements"
      },
      {
        "date": new Date("2024-04-12").toLocaleDateString(),
        "description": "Ophthalmology Checkup (IOP)",
        "result": "Intraocular pressure within target range (14 mmHg)."
      }
    ],

    "files": [
      {
        "filename": "dexa_scan_2024_Q4.pdf",
        "filepath": "/uploads/sofia/dexa_scan_2024.pdf",
        "uploadDate": new Date("2024-10-26").toLocaleDateString()
      },
      {
        "filename": "glaucoma_treatment_plan.pdf",
        "filepath": "/uploads/sofia/glaucoma_followup_april.pdf",
        "uploadDate": new Date("2024-04-13").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-05").toLocaleDateString(),
    nextCheckup: new Date("2025-03-05").toLocaleDateString(),
    locationContext: "Thiruvananthapuram (Capital City Suburb)",
    longitude: 76.9535,
    latitude: 8.5139,
  },
  {
    "name": "David Lee",
    "email": "david.lee@gmx.com",
    "pic": "https://randomuser.me/api/portraits/men/8.jpg",

    "birthplace": "Seoul, South Korea",
    "pasthealth": "History of Type 1 Hypertension since his late 30s. Also has a positive Quantiferon test indicating **Latent Tuberculosis Infection (LTBI)**, though non-contagious.",
    "pastMedications": ["Atenolol (discontinued due to side effects)"],
    "currentMedications": "Lisinopril/Hydrochlorothiazide (Lisinopril-HCTZ) 10/12.5mg (Daily)",
    "allergies": "No known allergies.",
    "lifestyle": "Works long hours (IT consultant). High-stress level. Uses nicotine patches (active effort to quit smoking). Prefers convenience foods.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Lisinopril-HCTZ",
        "for": "Hypertension (BP management)",
        "benefit": "Combination therapy for diuretic and ACE inhibition effects.",
        "timing": "Once daily, morning"
      },
      {
        "medicine": "TB Screening (Quantiferon)",
        "for": "Latent TB Infection (LTBI)",
        "benefit": "Regular monitoring required due to LTBI status.",
        "timing": "Last test: Jan 2025 (Annual)"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-01").toLocaleDateString(),
        "description": "Blood Pressure Monitoring (Home log review).",
        "result": "Average BP 155/95 mmHg. **Uncontrolled hypertension**. Medication compliance issue suspected."
      },
      {
        "date": new Date("2024-01-15").toLocaleDateString(),
        "description": "Echocardiogram.",
        "result": "Normal heart structure and function, but showing early signs of Left Ventricular Hypertrophy (LVH) due to high BP."
      }
    ],

    "health": {
      "age": 41,
      "bloodType": "A+",
      "conditions": ["Uncontrolled Hypertension (High BP)", "Latent Tuberculosis Infection (LTBI)"]
    },

    "reports": [
      {
        "date": new Date("2024-10-01").toLocaleDateString(),
        "description": "Blood Pressure Monitoring Summary",
        "result": "Readings are consistently high, medication change advised"
      },
      {
        "date": new Date("2024-01-15").toLocaleDateString(),
        "description": "Echocardiogram",
        "result": "Normal heart structure and function, with mild LVH."
      },
      {
        "date": new Date("2024-01-05").toLocaleDateString(),
        "description": "Quantiferon TB Gold Test",
        "result": "Positive (LTBI)"
      }
    ],

    "files": [
      {
        "filename": "bp_log_nov_2024.pdf",
        "filepath": "/uploads/david/bp_log_october.pdf",
        "uploadDate": new Date("2024-11-02").toLocaleDateString()
      },
      {
        "filename": "echo_report_jan_2024.pdf",
        "filepath": "/uploads/david/echo_report_jan.pdf",
        "uploadDate": new Date("2024-01-16")
      },
      {
        "filename": "tb_screening_report.pdf",
        "filepath": "/uploads/david/tb_screening_report.pdf",
        "uploadDate": new Date("2024-01-06").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-01").toLocaleDateString(),
    nextCheckup: new Date("2025-01-30").toLocaleDateString(),
    locationContext: "Kozhikode (Calicut Port Area, High Stress)",
    longitude: 75.7725,
    latitude: 11.2588,
  },
  {
    "name": "Maria Garcia",
    "email": "maria.garcia@hotmail.com",
    "pic": "https://randomuser.me/api/portraits/women/15.jpg",

    "birthplace": "Madrid, Spain",
    "pasthealth": "History of chronic episodic migraines since her early twenties, often triggered by stress and weather changes. No history of stroke or TIA.",
    "pastMedications": ["Sumatriptan (Acute treatment)"],
    "currentMedications": "Propranolol 40mg (Preventative) and Rizatriptan (Acute/Rescue)",
    "allergies": "No known allergies.",
    "lifestyle": "Translator/Remote worker. Follows a strict sleep and meal schedule to minimize migraine triggers. Low alcohol and caffeine consumption.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Propranolol",
        "for": "Migraine Prevention",
        "benefit": "Beta-blocker used to reduce the frequency and severity of migraine attacks.",
        "timing": "Twice daily, morning and evening"
      },
      {
        "medicine": "Tetanus, Diphtheria, Pertussis (Tdap)",
        "for": "Routine Adult Immunization",
        "benefit": "Maintained immunity.",
        "timing": "Booster administered: June 2024"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-01").toLocaleDateString(),
        "description": "Migraine Frequency Log Review (3 months).",
        "result": "Migraine days reduced from 10 to 6 per month since starting Propranolol.",
      },
      {
        "date": new Date("2024-05-20").toLocaleDateString(),
        "description": "MRI Brain Scan (Structural).",
        "result": "Normal findings; ruled out secondary causes of headaches."
      }
    ],

    "health": {
      "age": 30,
      "bloodType": "O-",
      "conditions": ["Chronic Episodic Migraine", "Photophobia (Light sensitivity)"]
    },

    "reports": [
      {
        "date": new Date("2024-11-01").toLocaleDateString(),
        "description": "Neurology Consultation (Preventative care)",
        "result": "Started new preventative medication (Propranolol) for better control."
      },
      {
        "date": new Date("2024-05-20").toLocaleDateString(),
        "description": "MRI Brain Scan",
        "result": "Normal, ruled out structural issues."
      }
    ],

    "files": [
      {
        "filename": "neuro_consult_nov_2024.pdf",
        "filepath": "/uploads/maria/neuro_consult_nov.pdf",
        "uploadDate": new Date("2024-11-01").toLocaleDateString()
      },
      {
        "filename": "mri_brain_scan_may_2024.pdf",
        "filepath": "/uploads/maria/mri_brain_scan.pdf",
        "uploadDate": new Date("2024-05-21").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-01").toLocaleDateString(),
    nextCheckup: new Date("2025-02-01").toLocaleDateString(),
    locationContext: "Wayanad (Highland/Hilly Region)",
    longitude: 76.1311,
    latitude: 11.6917,
  },
  {
    "name": "Kenji Tanaka",
    "email": "kenji.tanaka@corp.jp",
    "pic": "https://randomuser.me/api/portraits/men/63.jpg",

    "birthplace": "Osaka, Japan",
    "pasthealth": "Diagnosed with Stage 3 Chronic Kidney Disease (CKD) five years ago, secondary to long-standing hypertension. Also managed for recurrent gout flares.",
    "pastMedications": ["NSAIDs (avoided now due to kidney risk)"],
    "currentMedications": "Allopurinol 100mg (Daily for Gout), Furosemide 20mg (Diuretic, PRN for fluid retention), Calcium Acetate (Phosphate Binder)",
    "allergies": "No known allergies.",
    "lifestyle": "Retired senior engineer. Strict low-sodium, low-protein, and low-purine diet adherence is required. Requires mobility assistance for long distances.",

    "vaccinationsAndTreatment": [
      {
        "medicine": "Allopurinol",
        "for": "Gout/Hyperuricemia",
        "benefit": "Reduces uric acid production to prevent gout attacks.",
        "timing": "Once daily"
      },
      {
        "medicine": "Erythropoietin (EPO) Injection",
        "for": "Anemia (CKD-related)",
        "benefit": "Stimulates red blood cell production.",
        "timing": "Monthly (administered by local clinic)"
      },
      {
        "medicine": "Hepatitis B Vaccine",
        "for": "Viral Protection (Critical for CKD)",
        "benefit": "Immunization required due to weakened renal status.",
        "timing": "Completed series"
      }
    ],

    "analysis": [
      {
        "date": new Date("2024-11-01").toLocaleDateString(),
        "description": "Routine Renal Function Check (eGFR).",
        "result": "eGFR 42 mL/min/1.73m². Remains in stable Stage 3 CKD; close monitoring required."
      },
      {
        "date": new Date("2024-09-05").toLocaleDateString(),
        "description": "Comprehensive Metabolic Panel (CMP).",
        "result": "Creatinine stable, eGFR maintained. Phosphate levels well controlled with binder."
      }
    ],

    "health": {
      "age": 75,
      "bloodType": "AB-",
      "conditions": ["Chronic Kidney Disease (Stage 3)", "Gout (Controlled)"]
    },

    "reports": [
      {
        "date": new Date("2024-09-05").toLocaleDateString(),
        "description": "Comprehensive Metabolic Panel (CMP)",
        "result": "Creatinine stable, eGFR maintained."
      },
      {
        "date": new Date("2024-08-01").toLocaleDateString(),
        "description": "Uric Acid Test",
        "result": "Uric Acid 7.2 mg/dL. Slightly elevated, diet modification suggested."
      },
      {
        "date": new Date("2024-03-10").toLocaleDateString(),
        "description": "Diabetic Foot Exam (Neuropathy Check)",
        "result": "Sensation intact; no peripheral neuropathy detected."
      }
    ],

    "files": [
      {
        "filename": "cmp_september_2024.pdf",
        "filepath": "/uploads/kenji/cmp_september_2024.pdf",
        "uploadDate": new Date("2024-09-06").toLocaleDateString()
      },
      {
        "filename": "uric_acid_test_august.pdf",
        "filepath": "/uploads/kenji/uric_acid_test_august.pdf",
        "uploadDate": new Date("2024-08-02").toLocaleDateString()
      },
      {
        "filename": "epo_injection_record_2024_10.pdf",
        "filepath": "/uploads/kenji/epo_injection_record.pdf",
        "uploadDate": new Date("2024-10-15").toLocaleDateString()
      }
    ],
    lastCheckup: new Date("2024-11-01").toLocaleDateString(),
    nextCheckup: new Date("2025-02-01").toLocaleDateString(),
    locationContext: "Thrissur (Coastal/Urban Area)",
    longitude: 76.1969,
    latitude: 10.5186,
  }
];

const allDoctors = [
  {
    name: "Dr. Suresh Kumar",
    email: "suresh.kumar@yahoo.com",
    pic: "https://img.freepik.com/free-photo/portrait-smiling",
    specialization: "dermatology",
    experience: 10,
    patients: [],
    department: "Skin Care",
    availability: {
      days: ["Friday", "Saturday", "Sunday"],
      hours: "10:00 AM - 4:00 PM"
    }
  },
  {
    name: "Dr. Arun Kumar",
    email: "arun.kumar@hospital.com",
    pic: "https://randomuser.me/api/portraits/men/1.jpg",
    specialization: "Cardiology",
    experience: 15,
    patients: [], // Will be populated after insertion
    department: "Cardiac Care",
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      hours: "9:00 AM - 5:00 PM"
    }
  },
  {
    name: "Dr. Priya Singh",
    email: "priya.singh@hospital.com",
    pic: "https://randomuser.me/api/portraits/women/1.jpg",
    specialization: "Pediatrics",
    experience: 8,
    patients: [],
    department: "Child Care",
    availability: {
      days: ["Tuesday", "Thursday"],
      hours: "10:00 AM - 4:00 PM"
    }
  }
  // Add more doctors...
];

// Initialize database with sample data (only if collection is empty)
export const initializeDB = async () => {
  try {
    await connectDB();
    const insertedUsers = await DATA.insertMany(allUsers);
    console.log(insertedUsers);
    console.log('✅ Sample user data inserted');

    // Get some random user IDs to assign to doctors
    const userIds = insertedUsers.map(user => user._id);

    // Assign random patients to doctors
    allDoctors.forEach(doctor => {
      doctor.patients = userIds.slice(0, 2); // Assign first 2 users to each doctor
    });

    // Insert doctors into Doctor collection
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      await Doctor.insertMany(allDoctors);
      console.log('✅ Sample doctor data inserted');
    }
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  }
};


export default connectDB;