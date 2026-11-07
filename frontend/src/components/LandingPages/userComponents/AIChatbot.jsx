import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaMicrophone, FaVolumeUp, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI health assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLanguage, setUserLanguage] = useState(localStorage.getItem('userLanguage') || 'en');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const { darkMode } = useTheme();

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = userLanguage === 'en' ? 'en-US' : 'hi-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [userLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim() || isLoading) return;

  const userMessage = { type: 'user', text, timestamp: new Date() };
  setMessages(prev => [...prev, userMessage]);
  setInputText('');
  setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        type: msg.type,
        text: msg.text
      }));

      // Call backend AI endpoint
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: text,
        conversationHistory: conversationHistory
      });

      if (response.data.success) {
        const botResponse = {
          type: 'bot',
          text: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        
        // Auto-speak bot response if voice mode is enabled
        if (isSpeaking) {
          speakText(botResponse.text);
        }
      } else {
        throw new Error(response.data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorMessage = {
        type: 'bot',
        text: error.response?.data?.message || error.message || 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = userLanguage === 'en' ? 'en-US' : 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  const toggleVoiceMode = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking && messages.length > 0) {
      speakText(messages[messages.length - 1].text);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 transition-all transform hover:scale-110 ${
          darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label="Open AI Chatbot"
      >
        <FaRobot size={28} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-96 h-[500px] rounded-xl shadow-2xl z-50 flex flex-col ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          } border-2 border-blue-500`}
        >
          {/* Chat Header */}
          <div
            className={`flex items-center justify-between p-4 rounded-t-xl ${
              darkMode ? 'bg-slate-700' : 'bg-blue-600'
            } text-white`}
          >
            <div className="flex items-center space-x-2">
              <FaRobot />
              <span className="font-semibold">AI Health Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-slate-700 text-gray-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[75%] rounded-lg p-3 ${
                  darkMode ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : darkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Voice Input"
              >
                <FaMicrophone />
              </button>
              <button
                onClick={toggleVoiceMode}
                className={`p-2 rounded-full transition-colors ${
                  isSpeaking
                    ? 'bg-green-500 text-white'
                    : darkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Voice Output"
              >
                <FaVolumeUp />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className={`p-3 rounded-lg ${
                  isLoading || !inputText.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;








