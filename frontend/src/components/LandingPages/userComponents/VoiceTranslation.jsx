import React, { useState, useEffect, useRef } from 'react';
import { FaLanguage, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

function VoiceTranslation() {
  const [isActive, setIsActive] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [userLanguage, setUserLanguage] = useState(localStorage.getItem('userLanguage') || 'en');
  const { darkMode } = useTheme();
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (isActive) {
      // Enable text selection mode
      document.body.style.cursor = 'text';
      const handleMouseUp = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text) {
          setSelectedText(text);
        }
      };
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.body.style.cursor = 'default';
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isActive]);

  const speakText = (text) => {
    if (synthRef.current && text) {
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userLanguage === 'en' ? 'en-US' : 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      synthRef.current.speak(utterance);
    }
  };

  const handleTranslate = () => {
    if (selectedText) {
      speakText(selectedText);
      setIsActive(false);
      setSelectedText('');
    } else {
      setIsActive(!isActive);
      if (!isActive) {
        alert('Click and drag to select text on the screen, then click Translate again to hear it.');
      }
    }
  };

  return (
    <>
      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        className={`fixed bottom-6 right-28 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition-all transform hover:scale-110 ${
          isActive
            ? 'bg-orange-500 hover:bg-orange-600'
            : darkMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
        aria-label="Voice Translation"
        title="Select text and translate to speech"
      >
        <FaLanguage size={24} />
      </button>

      {/* Translation Indicator */}
      {isActive && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-orange-100 text-orange-800'
          } border-2 border-orange-500`}
        >
          <div className="flex items-center space-x-2">
            <FaLanguage />
            <span className="font-semibold">Text Selection Mode Active</span>
            <button
              onClick={() => setIsActive(false)}
              className="ml-4 hover:bg-white/20 rounded-full p-1"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <p className="text-sm mt-1">Select any text on the screen to hear it read aloud</p>
        </div>
      )}

      {/* Selected Text Preview */}
      {selectedText && (
        <div
          className={`fixed bottom-32 right-6 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
            darkMode ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'
          } border-2 border-green-500`}
        >
          <div className="flex items-start justify-between mb-2">
            <span className="font-semibold text-sm">Selected Text:</span>
            <button
              onClick={() => {
                setSelectedText('');
                setIsActive(false);
              }}
              className="hover:bg-white/20 rounded-full p-1"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <p className="text-sm mb-3">{selectedText}</p>
          <button
            onClick={() => speakText(selectedText)}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Speak This Text
          </button>
        </div>
      )}
    </>
  );
}

export default VoiceTranslation;

