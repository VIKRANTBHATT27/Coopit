import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

function Analytics() {
  const { darkMode } = useTheme();

  // Mock data - Replace with actual API calls
  const [analyticsData, setAnalyticsData] = useState({
    totalMigrantsTracked: 1250,
    totalInfected: 87,
    highRiskAreas: [
      { name: 'Thiruvananthapuram', infected: 23, total: 145, riskLevel: 'High' },
      { name: 'Kochi', infected: 18, total: 198, riskLevel: 'High' },
      { name: 'Kozhikode', infected: 15, total: 167, riskLevel: 'Medium' },
      { name: 'Thrissur', infected: 12, total: 234, riskLevel: 'Medium' },
      { name: 'Kottayam', infected: 10, total: 189, riskLevel: 'Low' },
      { name: 'Alappuzha', infected: 9, total: 317, riskLevel: 'Low' },
    ],
    floodInsights: {
      waterStagnationIndex: [
        { area: 'Thiruvananthapuram', index: 85, status: 'Critical' },
        { area: 'Kochi', index: 72, status: 'High' },
        { area: 'Kozhikode', index: 68, status: 'High' },
        { area: 'Thrissur', index: 55, status: 'Medium' },
        { area: 'Kottayam', index: 45, status: 'Medium' },
        { area: 'Alappuzha', index: 38, status: 'Low' },
      ],
      drainageStatus: [
        { area: 'Thiruvananthapuram', functional: 45, nonFunctional: 55 },
        { area: 'Kochi', functional: 60, nonFunctional: 40 },
        { area: 'Kozhikode', functional: 58, nonFunctional: 42 },
        { area: 'Thrissur', functional: 72, nonFunctional: 28 },
        { area: 'Kottayam', functional: 68, nonFunctional: 32 },
        { area: 'Alappuzha', functional: 75, nonFunctional: 25 },
      ],
      wasteHotspots: [
        { area: 'Thiruvananthapuram', accumulation: 92, priority: 'Urgent' },
        { area: 'Kochi', accumulation: 78, priority: 'High' },
        { area: 'Kozhikode', accumulation: 65, priority: 'Medium' },
        { area: 'Thrissur', accumulation: 58, priority: 'Medium' },
        { area: 'Kottayam', accumulation: 52, priority: 'Low' },
        { area: 'Alappuzha', accumulation: 48, priority: 'Low' },
      ],
      mosquitoDensity: [
        { area: 'Thiruvananthapuram', density: 88, status: 'Very High' },
        { area: 'Kochi', density: 75, status: 'High' },
        { area: 'Kozhikode', density: 72, status: 'High' },
        { area: 'Thrissur', density: 62, status: 'Medium' },
        { area: 'Kottayam', density: 55, status: 'Medium' },
        { area: 'Alappuzha', density: 48, status: 'Low' },
      ],
    },
  });

  // Prepare data for pie chart (infected vs healthy)
  const infectionStatusData = [
    { name: 'Infected', value: analyticsData.totalInfected },
    { name: 'Healthy', value: analyticsData.totalMigrantsTracked - analyticsData.totalInfected },
  ];

  // Prepare data for risk area pie chart
  const riskAreaData = analyticsData.highRiskAreas.map(area => ({
    name: area.name,
    value: area.infected,
  }));

  // Colors for charts
  const COLORS = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];
  const INFECTION_COLORS = ['#ef4444', '#10b981'];

  // Calculate infection rate
  const infectionRate = ((analyticsData.totalInfected / analyticsData.totalMigrantsTracked) * 100).toFixed(2);

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-emerald-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-sm p-6 border ${darkMode ? 'border-slate-700' : 'border-emerald-100'}`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Analytics Dashboard
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Comprehensive insights into migrant worker health and flood-affected areas
          </p>
        </div>

        {/* Total Migrants Tracked Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Total Migrants Tracked
                </p>
                <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                  {analyticsData.totalMigrantsTracked.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                  Total Infected
                </p>
                <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                  {analyticsData.totalInfected}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {infectionRate}% infection rate
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  Healthy Migrants
                </p>
                <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                  {analyticsData.totalMigrantsTracked - analyticsData.totalInfected}
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {(100 - parseFloat(infectionRate)).toFixed(2)}% healthy
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-emerald-900' : 'bg-emerald-100'}`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Areas Section */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            High Risk Areas & Infected Migrant Workers
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Distribution by Area
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskAreaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskAreaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Infected vs Total by Area
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.highRiskAreas}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="infected" fill="#ef4444" name="Infected" />
                  <Bar dataKey="total" fill="#10b981" name="Total Tracked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Areas Table */}
          <div className="mt-6 overflow-x-auto">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
              Detailed Risk Area Breakdown
            </h3>
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-100'} border-b ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Area
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Total Migrants
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Infected
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Infection Rate
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.highRiskAreas.map((area, index) => {
                  const rate = ((area.infected / area.total) * 100).toFixed(2);
                  const riskColor = 
                    area.riskLevel === 'High' ? 'text-red-600' :
                    area.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600';
                  const riskBg = 
                    area.riskLevel === 'High' ? 'bg-red-100' :
                    area.riskLevel === 'Medium' ? 'bg-yellow-100' : 'bg-green-100';
                  const riskBgDark = 
                    area.riskLevel === 'High' ? 'bg-red-900' :
                    area.riskLevel === 'Medium' ? 'bg-yellow-900' : 'bg-green-900';
                  
                  return (
                    <tr 
                      key={index}
                      className={`border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-emerald-100 hover:bg-emerald-50'}`}
                    >
                      <td className={`px-4 py-3 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                        {area.name}
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {area.total}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                        {area.infected}
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {rate}%
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          darkMode 
                            ? `${riskBgDark} ${riskColor}` 
                            : `${riskBg} ${riskColor}`
                        }`}>
                          {area.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flood-Affected Area Insights */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'} rounded-xl shadow-sm p-6 border`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
            Flood-Affected Area Insights
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Water Stagnation Index */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Water Stagnation Index
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.floodInsights.waterStagnationIndex}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Bar dataKey="index" fill="#3b82f6" name="Stagnation Index">
                    {analyticsData.floodInsights.waterStagnationIndex.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.status === 'Critical' ? '#ef4444' : entry.status === 'High' ? '#f59e0b' : '#10b981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Drainage Status */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Drainage Status (%)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.floodInsights.drainageStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="functional" stackId="a" fill="#10b981" name="Functional" />
                  <Bar dataKey="nonFunctional" stackId="a" fill="#ef4444" name="Non-Functional" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waste Accumulation Hotspots */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Waste Accumulation Hotspots
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.floodInsights.wasteHotspots}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Bar dataKey="accumulation" fill="#8b5cf6" name="Accumulation Index">
                    {analyticsData.floodInsights.wasteHotspots.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.priority === 'Urgent' ? '#ef4444' : entry.priority === 'High' ? '#f59e0b' : '#10b981'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Mosquito Density */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                Mosquito Density (if available)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.floodInsights.mosquitoDensity}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e5e7eb'} />
                  <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <YAxis stroke={darkMode ? '#cbd5e1' : '#64748b'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      border: darkMode ? '1px solid #475569' : '1px solid #e5e7eb',
                      color: darkMode ? '#e2e8f0' : '#1e293b',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="density" 
                    stroke="#ec4899" 
                    strokeWidth={3}
                    name="Density Index"
                    dot={{ fill: '#ec4899', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Flood Insights Summary Table */}
          <div className="mt-6 overflow-x-auto">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
              Comprehensive Flood-Affected Area Summary
            </h3>
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'bg-slate-700' : 'bg-emerald-100'} border-b ${darkMode ? 'border-slate-600' : 'border-emerald-200'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Area
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Water Stagnation
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Drainage Functional
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Waste Accumulation
                  </th>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                    Mosquito Density
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.highRiskAreas.map((area, index) => {
                  const stagnation = analyticsData.floodInsights.waterStagnationIndex[index];
                  const drainage = analyticsData.floodInsights.drainageStatus[index];
                  const waste = analyticsData.floodInsights.wasteHotspots[index];
                  const mosquito = analyticsData.floodInsights.mosquitoDensity[index];
                  
                  return (
                    <tr 
                      key={index}
                      className={`border-b ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-emerald-100 hover:bg-emerald-50'}`}
                    >
                      <td className={`px-4 py-3 font-medium ${darkMode ? 'text-emerald-100' : 'text-emerald-900'}`}>
                        {area.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {stagnation?.index || 'N/A'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            stagnation?.status === 'Critical' 
                              ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
                              : stagnation?.status === 'High'
                              ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                              : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                          }`}>
                            {stagnation?.status || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {drainage?.functional || 'N/A'}%
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {waste?.accumulation || 'N/A'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            waste?.priority === 'Urgent'
                              ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
                              : waste?.priority === 'High'
                              ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                              : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                          }`}>
                            {waste?.priority || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {mosquito?.density || 'N/A'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            mosquito?.status === 'Very High' || mosquito?.status === 'High'
                              ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700')
                              : mosquito?.status === 'Medium'
                              ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700')
                              : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700')
                          }`}>
                            {mosquito?.status || 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
