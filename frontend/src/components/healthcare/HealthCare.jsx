import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

function HealthCare() {
  const { darkMode } = useTheme();

  // Mock data - Replace with actual API calls
  const [healthData] = useState({
    diseaseTrends: {
      weekly: [
        { week: 'Week 1', waterborne: 12, vectorBorne: 8, respiratory: 5 },
        { week: 'Week 2', waterborne: 15, vectorBorne: 10, respiratory: 7 },
        { week: 'Week 3', waterborne: 18, vectorBorne: 12, respiratory: 6 },
        { week: 'Week 4', waterborne: 14, vectorBorne: 9, respiratory: 8 },
      ],
      diseaseTypes: [
        { name: 'Waterborne', count: 59, color: '#3b82f6' },
        { name: 'Vector-Borne', count: 39, color: '#ef4444' },
        { name: 'Respiratory', count: 26, color: '#10b981' },
      ],
    },
    symptoms: [
      { symptom: 'Fever', count: 45, percentage: 36 },
      { symptom: 'Diarrhea', count: 38, percentage: 30 },
      { symptom: 'Rashes', count: 22, percentage: 18 },
      { symptom: 'Cough', count: 32, percentage: 26 },
      { symptom: 'Headache', count: 28, percentage: 22 },
    ],
    vaccination: {
      tetanus: 72,
      hepatitis: 68,
      typhoid: 65,
      cholera: 58,
    },
    areaProfile: {
      housing: {
        overcrowdingIndex: 78,
        cleanWater: 65,
        toiletAccess: 58,
      },
      food: {
        vendors: 12,
        nutritionalQuality: 62,
      },
      healthcare: {
        nearestPHC: '2.5 km',
        mobileVan: 'Weekly',
        ashaCoverage: 75,
      },
    },
    alerts: [
      { type: 'Urgent', area: 'Thiruvananthapuram', message: 'High disease cluster detected', priority: 'High' },
      { type: 'Warning', area: 'Kochi', message: 'Sanitation needed', priority: 'Medium' },
      { type: 'Info', area: 'Kozhikode', message: 'Migration surge detected', priority: 'Low' },
    ],
    sdgMetrics: {
      healthWellbeing: 68,
      targets: [
        { target: 'Reduce communicable diseases', progress: 72 },
        { target: 'Improve vaccination coverage', progress: 66 },
        { target: 'Enhance healthcare access', progress: 65 },
      ],
    },
  });

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-emerald-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6 border ${darkMode ? 'border-slate-700' : 'border-emerald-100'}`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Health Care Analytics
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Disease trends, symptoms tracking, and health insights
          </p>
        </div>

        {/* Disease Trends */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Disease Trends
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Case Count */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Weekly Case Count
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthData.diseaseTrends.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="week" stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="waterborne" fill="#3b82f6" name="Waterborne" />
                  <Bar dataKey="vectorBorne" fill="#ef4444" name="Vector-Borne" />
                  <Bar dataKey="respiratory" fill="#10b981" name="Respiratory" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Disease Types Distribution */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Disease Type Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthData.diseaseTrends.diseaseTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {healthData.diseaseTrends.diseaseTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Symptoms Tracker */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Symptoms Tracker
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthData.symptoms.map((symptom, index) => (
              <div 
                key={index}
                className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-4 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    {symptom.symptom}
                  </h3>
                  <span className={`text-2xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {symptom.count}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${COLORS[index % COLORS.length]}`}
                    style={{ width: `${symptom.percentage}%` }}
                  ></div>
                </div>
                <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {symptom.percentage}% of cases
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vaccination Status */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Vaccination Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(healthData.vaccination).map(([vaccine, percentage], index) => (
              <div 
                key={index}
                className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}
              >
                <h3 className={`font-semibold mb-3 capitalize ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                  {vaccine}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`text-xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surrounding Area Profile */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Surrounding Area Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Housing Conditions */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Housing Conditions
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Overcrowding Index</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {healthData.areaProfile.housing.overcrowdingIndex}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${healthData.areaProfile.housing.overcrowdingIndex}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Clean Water Access</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {healthData.areaProfile.housing.cleanWater}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${healthData.areaProfile.housing.cleanWater}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Toilet Access</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {healthData.areaProfile.housing.toiletAccess}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${healthData.areaProfile.housing.toiletAccess}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Food Access */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Food Access
              </h3>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Local Food Vendors</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {healthData.areaProfile.food.vendors}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nutritional Quality</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {healthData.areaProfile.food.nutritionalQuality}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${healthData.areaProfile.food.nutritionalQuality}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Healthcare Access */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Healthcare Access
              </h3>
              <div className="space-y-3">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nearest PHC/CHC</p>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {healthData.areaProfile.healthcare.nearestPHC}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Mobile Health Van</p>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {healthData.areaProfile.healthcare.mobileVan}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>ASHA Worker Coverage</span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                      {healthData.areaProfile.healthcare.ashaCoverage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${healthData.areaProfile.healthcare.ashaCoverage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Predictive Risk */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Alerts & Predictive Risk
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {healthData.alerts.map((alert, index) => {
              const bgColor = 
                alert.priority === 'High' ? (darkMode ? 'bg-red-900' : 'bg-red-50') :
                alert.priority === 'Medium' ? (darkMode ? 'bg-yellow-900' : 'bg-yellow-50') :
                (darkMode ? 'bg-blue-900' : 'bg-blue-50');
              const borderColor = 
                alert.priority === 'High' ? (darkMode ? 'border-red-700' : 'border-red-200') :
                alert.priority === 'Medium' ? (darkMode ? 'border-yellow-700' : 'border-yellow-200') :
                (darkMode ? 'border-blue-700' : 'border-blue-200');
              const textColor = 
                alert.priority === 'High' ? (darkMode ? 'text-red-300' : 'text-red-800') :
                alert.priority === 'Medium' ? (darkMode ? 'text-yellow-300' : 'text-yellow-800') :
                (darkMode ? 'text-blue-300' : 'text-blue-800');
              
              return (
                <div 
                  key={index}
                  className={`${bgColor} rounded-lg p-4 border ${borderColor}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${textColor}`}>
                      {alert.type}
                    </span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {alert.area}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {alert.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports & SDG Metrics */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
              Reports & SDG Metrics
            </h2>
            <div className="flex gap-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Export PDF
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600' 
                    : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SDG 3 Dashboard */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                SDG 3: Good Health & Well-being
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Overall Progress</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                    {healthData.sdgMetrics.healthWellbeing}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div 
                    className="bg-emerald-500 h-4 rounded-full"
                    style={{ width: `${healthData.sdgMetrics.healthWellbeing}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                {healthData.sdgMetrics.targets.map((target, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {target.target}
                      </span>
                      <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                        {target.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-400 h-2 rounded-full"
                        style={{ width: `${target.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-lg p-6 border ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Quick Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Cases This Month</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Active Alerts</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Avg. Vaccination Rate</span>
                  <span className={`text-xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>66%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthCare;


















