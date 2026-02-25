import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const patientService = {
  getAllPatients: async () => {
    // try {
      const response = await axios.get(`${API_URL}/patients`);
      // console.log(response);
      return response.data;
    // } catch (error) {
    //   throw error;
    // }
  },

  getPatientById: async (id) => {
    // try {
      const response = await axios.get(`${API_URL}/patients/${id}`);
      return response.data;
    // } catch (error) {
    //   throw error;
    // }
  },

  verifyEmail: async (email) => {
    // try {
      const response = await axios.post(`${API_URL}/verify-email`, { email });
      return response.data.exists;
    // } catch (error) {
    //   throw error;
    // }
  },

  addNewMedicine: async (id, { medicine, for: indication, benefit, timing }) => {
    // try {
      const result = await axios.post(`${API_URL}/patients/${id}/vaccinationsAndTreatment`, { medicine, for: indication, benefit, timing });
      return result.data;
    // } catch (error) {
    //   throw error;
    // }
  } 
};

export const doctorService = {
  verifyDoctorEmail: async (email) => {
    // try {
      const response = await axios.post(`${API_URL}/verify-doctor-email`, { email });
      return response.data.exists;
    // } catch (error) {
    //   throw error;
    // }
  },

  getAllDoctors: async () => {
      // try {
          const response = await axios.get(`${API_URL}/doctors`);
          return response.data;
      // } catch (error) {
      //     throw error;
      // }
  },

  getDoctorPatients: async (doctorId) => {
      // try {
          const response = await axios.get(`${API_URL}/doctors/${doctorId}/patients`);
          return response.data;
      // } catch (error) {
      //     throw error;
      // }
  },

  addNewPatient: async (DATA) => {
    // try {
      console.log(DATA);
      const response = await axios.post(`${API_URL}/patientsAddToDB`, { DATA: DATA });
      console.log();
      console.log(response);
      return response.data;
    // } catch (error) {
    //   throw error;
    // }
  }
}

export const OtpService = {
  sendOtp: async (phoneNo) => {
    // try {
      const response = await axios.post(`${API_URL}/sendOtp`, { phoneNo: phoneNo });
      return response.data.success;
    // } catch (error) {
    //   throw error;
    // }
  },
  checkOtp: async (oneTimePassword) => {
    // try {
      const response = await axios.post(`${API_URL}/checkOtp`, { oneTimePassword: oneTimePassword });
      return response.data.valid === true;
    // } catch (error) {
    //   throw error;
    // }
  }
};