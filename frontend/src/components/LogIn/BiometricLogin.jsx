import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaEye, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function BiometricLogin() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startEyeScan = async () => {
    setIsScanning(true);
    setError('');
    setScanSuccess(false);

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Front-facing camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate eye scan process (in production, this would use actual biometric recognition)
      setTimeout(() => {
        // Simulate successful scan
        const success = Math.random() > 0.3; // 70% success rate for demo

        if (success) {
          setScanSuccess(true);
          // Stop camera
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
          }

          // Navigate after successful scan
          setTimeout(() => {
            navigate('/user/landing');
          }, 1500);
        } else {
          setError('Eye scan failed. Please try again.');
          stopScan();
        }
        setIsScanning(false);
      }, 3000); // Simulate 3 second scan

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please grant camera permissions.');
      setIsScanning(false);
      
      // Fallback: simulate scan without camera
      if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
        setError('Camera not available. Using simulation mode...');
        setTimeout(() => {
          setScanSuccess(true);
          setTimeout(() => {
            navigate('/user/landing');
          }, 1500);
        }, 2000);
      }
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="text-center mt-4">
      <div className="flex justify-center items-center mb-4">
        <div className="bg-slate-500 w-[40%] h-[2px]"></div>
        <p className="text-2xl font-bold mx-4">or</p>
        <div className="bg-slate-500 w-[40%] h-[2px]"></div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 border border-red-300">
          {error}
        </div>
      )}

      {scanSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-green-100 text-green-700 border border-green-300">
          <FaCheckCircle className="inline mr-2" />
          Eye scan successful! Logging you in...
        </div>
      )}

      {!isScanning && !scanSuccess && (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaEye size={48} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-700/70 mb-4">
            Use eye scan for secure biometric login
          </p>
          <button
            type="button"
            onClick={startEyeScan}
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700 transition flex items-center justify-center space-x-2"
          >
            <FaCamera />
            <span>Start Eye Scan</span>
          </button>
        </div>
      )}

      {isScanning && !scanSuccess && (
        <div className="space-y-4">
          <div className="relative w-full max-w-xs mx-auto">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-xl border-2 border-emerald-400"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 border-4 border-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-emerald-700/70">
            Please look directly at the camera...
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <button
            type="button"
            onClick={stopScan}
            className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-white hover:bg-red-700 transition"
          >
            Cancel Scan
          </button>
        </div>
      )}
    </div>
  );
}

export default BiometricLogin;














