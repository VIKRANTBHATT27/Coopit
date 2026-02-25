import React, { useState } from 'react'
import bgImage from '../../images/bg-img-doctor.png'
import { useNavigate } from "react-router-dom";
import { FaUserDoctor } from 'react-icons/fa6';
import { FaUserNurse } from 'react-icons/fa6';
import { RiAdminLine } from 'react-icons/ri';
import { FaUser, FaQrcode, FaFingerprint, FaCamera } from "react-icons/fa";
import QrCodeLogin from './QrCodeLogin';
import BiometricLogin from './BiometricLogin';
import { patientService } from '../../services/serviceFile';
import { doctorService } from '../../services/serviceFile';


function LogIn({ role, setRole }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeState, setHomeState] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState('email'); // 'email', 'qr', 'biometric'

  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignUp) {
      {console.log(`selectedRole: ${selectedRole}`);}
      setRole(selectedRole);
      
      console.log("email", email);
      console.log("password", password);

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields.");
        return;
      }

      if (!emailPattern.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (password.length < 4) {
        setError("Password must be at least 4 characters long.");
        return;
      }

      switch (selectedRole) {
        case "user":
          try {
            const exists = await patientService.verifyEmail(email);
            
            if (exists || result) {
              setLoading(true);
              console.log('Email exists in database');

              setTimeout(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                  navigate(`/${selectedRole}/landing`);
                }, 800);
              }, 1500);
            } else {
              setError("Email not found. Please sign up.");
            }
          } catch (error) {
            setError("Error verifying email. Please try again.");
            console.error('Error:', error);
          }      
          break;
        case "nurse":
          try {
            const exists = await doctorService.verifyDoctorEmail(email);

            if (exists) {
              setLoading(true);
              console.log('Email exists in database');

              setTimeout(() => {
                setLoading(false);
                setSuccess(true);

                setTimeout(() => {
                  navigate(`/${selectedRole}/landing`);
                }, 800);
              }, 1500);
            }
          } catch (error) {
            setError("Error verifying email. Please try again.");
            console.error('Error:', error);
          }
          break;

        case "Authorization":
          try {
            setTimeout(() => {
              navigate(`/${selectedRole}/landing`);
            }, 800);  
          } catch (error) {
            setError("Error verifying email. Please try again.");
            console.error('Error:', error);
          }
          break;

        default:
          break;
      }
    } else {
      e.preventDefault();
      // console.log('Form submitted');
      // setError("Invalid email or password. Please try again."); // ❌ show erro
    }
  };

  const createAccount = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phone || !password || !confirmPassword || !homeState) {
      setError("Please fill in all fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Store preferred language in localStorage
    localStorage.setItem('userLanguage', preferredLanguage);
    
    setLoading(true);
    setError("");
    
    // Simulate account creation (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess(false);
        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setHomeState("");
      }, 1500);
    }, 1500);
  }

  const roles = [
    { id: 'nurse', label: 'Nurse' },
    { id: 'user', label: 'User' },
    { id: 'Authorization', label: 'Authorized' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center ">

      <img src={bgImage} alt="background-image-user" className='w-fit h-screen object-cover absolute right-[50vw] top-0' />
      
      <div className="w-full max-w-md bg-white/70 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-sm ml-10">
        <div className="p-4">
          <div className="mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-emerald-600">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-emerald-900">
              {isSignUp ? 'Create Account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-emerald-700/70">
              {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
            </p>
          </div>

          <form className="space-y-4" 
          >
            <div className="flex justify-center">
              {roles.map((role) => (
                <button
                  type='button'
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-7 py-4 border text-md font-medium transition-colors duration-200 flexbox items-center justify-center rounded-sm ml-2
                    ${selectedRole === role.id
                      ? 'bg-green-700 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                >
                  {role.id === 'nurse' ? (<p className='flex justify-center items-center'><FaUserNurse size={32} /></p>) : ''}
                  {role.id === 'user' ? (<p className='flex justify-center items-center'><FaUser size={32} /></p>) : ''}
                  {role.id === 'Authorization' ? (<p className='flex justify-center items-center'><RiAdminLine size={32} /></p>) : ''}
                  {role.label}
                </button>
              ))}
            </div>

            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-emerald-900/90">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                  />
                </div>
                <div>
                  <label htmlFor="homeState" className="mb-1 block text-sm font-medium text-emerald-900/90">Home State</label>
                  <input
                    id="homeState"
                    type="text"
                    placeholder="Maharashtra"
                    value={homeState}
                    onChange={(e) => setHomeState(e.target.value)}
                    className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                  />
                </div>
                <div>
                  <label htmlFor="preferredLanguage" className="mb-1 block text-sm font-medium text-emerald-900/90">Preferred Language</label>
                  <select
                    id="preferredLanguage"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="gu">ગુજરાતી (Gujarati)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
              </>
            )}

            {(!isSignUp && (selectedRole !== 'user' || loginMethod === 'email')) && (
              <div>
                <label htmlFor="email" className=" block text-sm font-medium text-emerald-900/90">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
            )}
            {isSignUp && (
              <div>
                <label htmlFor="email" className=" block text-sm font-medium text-emerald-900/90">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="phone" className=" block text-sm font-medium text-emerald-900/90">Phone Number</label>
                <input 
                  id="phone"
                  type="text"
                  placeholder="+91 123-456-7890" 
                  className="appearance-none w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            )}

            {(!isSignUp && (selectedRole !== 'user' || loginMethod === 'email')) && (
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-emerald-900/90">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
            )}
            {isSignUp && (
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-emerald-900/90">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-emerald-900/90">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white/60 px-4 py-2.5 text-emerald-900 placeholder-emerald-700/40 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
                />
              </div>
            )}

            {error && (
              <div className="text-center text-sm text-red-700/70">
                {error}
              </div>
            )}

          {/* Login Methods for User Role */}
          {selectedRole === 'user' && !isSignUp && (
            <div className="space-y-4">
              {/* Login Method Selector */}
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    loginMethod === 'email'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/60 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <FaUser className="inline mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('qr')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    loginMethod === 'qr'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/60 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <FaQrcode className="inline mr-2" />
                  OTP Code
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('biometric')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    loginMethod === 'biometric'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/60 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <FaFingerprint className="inline mr-2" />
                  Biometric
                </button>
              </div>

              {/* Login Method Content */}
              {loginMethod === 'qr' && <QrCodeLogin />}
              {loginMethod === 'biometric' && <BiometricLogin />}
            </div>
          )}

          {isSignUp ? (
            <button
            type="submit"
            disabled={loading || success}
              className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center justify-center relative"
            onClick={createAccount}
            >
              {loading ? (
              // 🔄 Loading spinner in center
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : success ? (
              // ✅ Tick in center
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="white"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              ) : (
              "Create Account"
            )} </button>
          ) : (selectedRole !== 'user' || loginMethod === 'email') && ( <button
              type="submit"
              disabled={loading || success}
                className="mt-2 w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center justify-center relative"
              onClick={handleSubmit}
              >
                {loading ? (
                // 🔄 Loading spinner in center
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                // ✅ Tick in center
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="white"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                "Sign in"
              )}
            </button>)}
          </form>


          <div className="mt-6 text-center text-sm text-emerald-700/70">
            {isSignUp ? (
              <>
                <span>Already have an account?</span>{' '}
                <button 
                  onClick={() => setIsSignUp(false)}
                  className="font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                <span>Don&apos;t have an account?</span>{' '}
                <button 
                  onClick={() => setIsSignUp(true)}
                  className="font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2 cursor-pointer -mt-3"
                >
                  Create one
                </button>
              </>
            )}
          </div>
        </div>
        
      </div>
      
    </div>
  )
}

export default LogIn