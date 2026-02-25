import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeDB } from './init.js';
import Patient from './models/patient.js';
import Doctor from './models/doctorSchema.js';
import twilio from 'twilio';
import connectDB from './init.js';
import connectMongoDB from './connection.js';

const app = express();

// Load environment variables
dotenv.config();

connectMongoDB(`${process.env.DB_URL}/Minor_Project`)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log("CONNECTION FAILED!!", err));


// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use(express.static("public"));


// Initialize Google Gemini AI (with fallback API key)
const getGeminiModel = () => {
  // Use API key from environment or fallback to the provided key
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-flash - recommended model with best balance of speed and cost
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

const router = express.Router();

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map(); // Map<mobile, { otp: string, expiresAt: number }>

// OTP expiration time (5 minutes)
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

// Add middleware before routes
app.use(express.json());
app.use(cors());

// Mount the router
app.use('/api', router);  // Add this line to mount the router


// Initialize database when server starts
initializeDB()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');

    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
  });

// const client = new MongoClient("mongodb://localhost:27017");
// await client.connect();
// console.log("Connected to MongoDB");


// ==================== GET ROUTES ====================

// Get all patients data
router.get('/patients', async (req, res) => {
  try {
    const patients = await DATA.find();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error fetching patients data',
      message: err.message
    });
  }
});

// Add these new routes
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('patients');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

router.get('/doctors/:id/patients', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('patients');
    res.json(doctor.patients);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching doctor patients' });
  }
});

// Get a specific patient by ID
router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error fetching patient data',
      message: err.message
    });
  }
});

// Get a specific patient by email
router.get('/patients/email/:email', async (req, res) => {
  try {
    const patient = await DATA.findOne({ email: req.params.email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error fetching patient data',
      message: err.message
    });
  }
});

let otp;

router.post('/sendOtp', (req, res) => {
  otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);

  const { phoneNo } = req.body;

  const accountSid = process.env.OTP_ACCOUNT_SID;
  const authToken =  process.env.OTP_AUTH_TOKEN;

  const client = twilio(accountSid, authToken);

  async function messageFunc() {
    const msg = await client.messages.create({
      body: 'trial msg for otp on friday afternoon is => ' + otp,
      messagingServiceSid: process.env.OTP_MESSAGE_SERVICE_SID,
      from: process.env.OTP_MSG_FROM_NUMBER,
      to: "+91" + String(phoneNo),
    })

    console.log(msg);
  }

  try {
    messageFunc();
    res.status(200).json({
      success: true,
      message: 'otp send successfully',
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error adding report',
      message: err.message
    });
  };
});
// ==================== POST ROUTES ====================

// AI Chat endpoint
router.post('/ai/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Create system prompt for health assistant
    const systemPrompt = `You are a helpful and friendly AI Health Assistant. Your role is to provide general health information, answer questions about health and wellness, and assist users with their health-related queries. 

Important Guidelines:
- Be empathetic and supportive
- Provide accurate, evidence-based information
- Remind users that you are an AI assistant and not a replacement for professional medical advice
- Encourage users to consult with healthcare providers for diagnosis, treatment, or medical emergencies
- Keep responses concise and easy to understand
- Be respectful and maintain privacy

User's question: ${message}`;

    // Build conversation context
    let conversationContext = systemPrompt;

    // Add conversation history if available (last 5 messages for context)
    if (conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      conversationContext += '\n\nPrevious conversation:\n';
      recentHistory.forEach((msg, idx) => {
        conversationContext += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      conversationContext += `\nUser's current question: ${message}`;
    }

    // Generate response using Gemini
    const model = getGeminiModel();
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const aiResponse = response.text();

    res.status(200).json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing AI request',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Create a new patient (for saving new chats/data)
router.post('/patientsAddToDB', async (req, res) => {
  try {
    // let newPatient = new DATA();
    const newPatient = req.body?.DATA;
    console.log(req.body?.DATA);
    // newPatient = { ...newPatient, ...req.body };
    // newPatient._doc = { ...newPatient._doc, ...req.body };  
    const result = await DATA.insertOne(newPatient);
    // console.log(newPatient);
    // const savedPatient = await newPatient.save();

    res.status(201).json({
      success: true,
      message: 'New patient created successfully',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error creating patient',
      message: err.message
    });
  }
});

// Add a new report to an existing patient
router.post('/patients/:id/reports', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    patient.reports.push(req.body);
    const updatedPatient = await patient.save();

    res.status(200).json({
      success: true,
      message: 'Report added successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error adding report',
      message: err.message
    });
  }
});

// POST route for user email verification
router.post('/verify-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await DATA.findOne({ email: email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST route to doctor email verification
router.post('/verify-doctor-email', async (req, res) => {
  try {
    const { email } = req.body;
    const doctor = await Doctor.findOne({ email: email });

    if (doctor) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new file to an existing patient
router.post('/patients/:id/files', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    patient.files.push(req.body);
    const updatedPatient = await patient.save();

    res.status(200).json({
      success: true,
      message: 'File added successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error adding file',
      message: err.message
    });
  }
});

// POST route to add a new vaccination or treatment (medicine) entry to an existing patient
router.post('/patients/:id/vaccinationsAndTreatment', async (req, res) => {
  console.log("reaching backend");
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Extracting medicine entry from request body.
    // It should match structure of userSchema vaccinationsAndTreatment:
    // { medicine: String, for: String, benefit: String, timing: String }
    const { medicine, for: indication, benefit, timing } = req.body;

    if (!medicine) {
      return res.status(400).json({
        success: false,
        error: 'Medicine field is required'
      });
    }

    const newEntry = {
      medicine,
      for: indication,
      benefit,
      timing
    };

    // Push to vaccinationsAndTreatment
    patient.vaccinationsAndTreatment.push(newEntry);
    const updatedPatient = await patient.save();

    res.status(201).json({
      success: true,
      message: 'Vaccination/Treatment added successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Error adding vaccination/treatment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: error.message || 'An unexpected error occurred while adding the treatment'
    });
  }
});


// ==================== CHECK OTP ROUTE ====================
router.post('/checkOtp', async (req, res) => {
  try {
    const { oneTimePassword } = req.body;
    console.log(oneTimePassword);
    console.log(`otp is: ${otp}`);
    // Verify OTP
    if (otp == oneTimePassword) {
      res.status(200).json({ valid: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({
        valid: false,
        error: 'Invalid OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      valid: false,
      error: 'Server error while verifying OTP'
    });
  }
});

// ==================== PUT ROUTES ====================

// Update existing patient data (for saving existing chats)
router.put('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await DATA.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error updating patient',
      message: err.message
    });
  }
});

// Update patient health information
router.put('/patients/:id/health', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    patient.health = { ...patient.health, ...req.body };
    const updatedPatient = await patient.save();

    res.status(200).json({
      success: true,
      message: 'Health information updated successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error updating health information',
      message: err.message
    });
  }
});

// ==================== PATCH ROUTES ====================

// Partially update patient data
router.patch('/patients/:id', async (req, res) => {
  try {
    const updatedPatient = await DATA.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error updating patient',
      message: err.message
    });
  }
});

// ==================== DELETE ROUTES ====================

// Delete a patient
router.delete('/patients/:id', async (req, res) => {
  try {
    const deletedPatient = await DATA.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
      data: deletedPatient
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error deleting patient',
      message: err.message
    });
  }
});

// Delete a specific report
router.delete('/patients/:id/reports/:reportId', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    patient.reports.id(req.params.reportId).deleteOne();
    const updatedPatient = await patient.save();

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error deleting report',
      message: err.message
    });
  }
});

// Delete a specific file
router.delete('/patients/:id/files/:fileId', async (req, res) => {
  try {
    const patient = await DATA.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    patient.files.id(req.params.fileId).deleteOne();
    const updatedPatient = await patient.save();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      data: updatedPatient
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: 'Error deleting file',
      message: err.message
    });
  }
});

export default router;


app.listen(process.env.PORT, () => console.log(`Backend is live on port ${process.env.PORT}`));