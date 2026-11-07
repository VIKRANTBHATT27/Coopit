import React, { useState } from "react";
import { OtpService } from '../../services/serviceFile';
import { useNavigate } from "react-router-dom";

const QrCodeLogin = () => {
  const [mobile, setMobile] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    
    if (!mobile || mobile.trim() === "") {
      setMessage("Please enter a mobile number");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const success = await OtpService.sendOtp(mobile);
      if (success) {
        setMessage("OTP sent successfully!");
        setMessageType("success");
        setOtpSent(true);
      } else {
        setMessage("Failed to send OTP. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to send OTP. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const checkOtp = async (e) => {
    e.preventDefault();
    
    if (!oneTimePassword || oneTimePassword.trim() === "") {
      setMessage("Please enter the OTP");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const isValid = await OtpService.checkOtp(oneTimePassword);
      if (isValid) {
        setMessage("OTP verified successfully!");
        setMessageType("success");
        // Clear OTP field after successful verification
        setOneTimePassword("");
        // You can add redirect or other logic here

        setTimeout(() => {
          navigate(`/user/landing`);
        }, 800);
      } else {
        setMessage("Invalid OTP. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to verify OTP. Please try again.";
      
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

 return (
   <div className="text-center -mt-[5px]">
     <div className="flex justify-center items-center">
          <div className="bg-slate-500 w-[40%] h-[2px] mb-6"></div>
          <p className="text-2xl font-bold mb-7 mx-4">or</p>
          <div className="bg-slate-500 w-[40%] h-[2px] mb-6"></div>
     </div>
     
     
     {message && (
       <div className={`mb-4 p-3 rounded-xl ${
         messageType === "success" 
           ? "bg-green-100 text-green-700 border border-green-300" 
           : "bg-red-100 text-red-700 border border-red-300"
       }`}>
         {message}
       </div>
     )}
     
     <input
        id="mobileNumber"
        type="tel"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        disabled={loading}
        className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
      />
      <button
        type="button"
        onClick={sendOtp}
        disabled={loading || otpSent}
        className="w-full mt-4 mb-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
      </button>
     <input
        id="pass"
        type="text"
        placeholder="Enter OTP"
        value={oneTimePassword}
        onChange={(e) => setOneTimePassword(e.target.value)}

        className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition disabled:opacity-50"
      />

      <button
        type="button"
        onClick={checkOtp}
        
        className="w-full mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {"Verify OTP"}
      </button>
   </div>
 );
};
export default QrCodeLogin;