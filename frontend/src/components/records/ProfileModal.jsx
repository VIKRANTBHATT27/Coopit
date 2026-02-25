import React from 'react'
import { ImCross } from "react-icons/im";
import { patientService } from '../../services/serviceFile';

const handleClick = (e, flag, setFlag) => {
     if (e && typeof e.preventDefault === 'function') e.preventDefault();
     setFlag(false);
}

function ProfileModal({ flag, setFlag, patient }) {
  if (!patient) return null;

  const [activeTab, setActiveTab] = React.useState(0);
  const [doctorNote, setDoctorNote] = React.useState('');
  const [addedTreatments, setAddedTreatments] = React.useState([]);
  const [pendingRx, setPendingRx] = React.useState({ medicine: '', for: '', benefit: '', timing: '' });
  const [feedback, setFeedback] = React.useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const conditions = patient.health?.conditions || (patient.disease ? [patient.disease] : []);
  const primaryDisease = (conditions[0] || '').toLowerCase();

  const photoSrc = patient.pic || patient.photo || 'https://via.placeholder.com/400x400.png?text=No+Photo';

  const medicalHistory = {
    birthplace: patient.birthplace || '—',
    pastHealth: patient.pasthealth || '—',
    currentMedication: patient.currentMedications || patient.treatment || '—',
    allergies: patient.allergies || '—',
    lifestyle: patient.lifestyle || '—'
  };

  const userReports = Array.isArray(patient.reports) ? patient.reports : [];
  const diseaseReports = userReports.length
    ? userReports.filter(r => {
        const related = (r.related || '').toString().toLowerCase();
        return primaryDisease ? related.includes(primaryDisease) : true;
      })
    : [];

  const fallbackReportsByDisease = () => {
    if (!primaryDisease) return [];
    if (primaryDisease.includes('diab')) {
      return [
        { type: 'HbA1c', date: "27/03/2025", result: 'worse', related: 'Diabetes' },
        { type: 'Fasting Glucose', date: '7/08/2024', result: 'cured', related: 'Diabetes' },
      ];
    }
    if (primaryDisease.includes('hyperten')) {
      return [
        { type: 'BP Monitoring',date: "27/03/2025", result: 'worse', related: 'Hypertension' },
        { type: 'Lipid Profile',  date: '7/08/2024', result: 'cured', related: 'Hypertension' },
      ];
    }
    if (primaryDisease.includes('asthma')) {
      return [
        { type: 'Spirometry', date: "27/03/2025", result: 'worse', related: 'Asthma' },
        { type: 'Peak Flow',  date: '7/08/2024', result: 'cured', related: 'Asthma' },
      ];
    }
    return [];
  };

  const reportsAndTests = diseaseReports.length ? diseaseReports : fallbackReportsByDisease();

  const userTreatments = Array.isArray(patient.vaccinationsAndTreatment)
    ? patient.vaccinationsAndTreatment
    : Array.isArray(patient.treatments)
      ? patient.treatments
      : [];

  const fallbackTreatmentsByDisease = () => {
    if (!primaryDisease) return [];
    if (primaryDisease.includes('diab')) {
      return [
        { medicine: 'Insulin', for: 'Glycemic control', benefit: 'Regulates blood sugar', timing: 'As prescribed' },
        { medicine: 'Metformin', for: 'Type 2 diabetes', benefit: 'Reduces hepatic glucose output', timing: 'With meals' },
      ];
    }
    if (primaryDisease.includes('hyperten')) {
      return [
        { medicine: 'ACE inhibitor', for: 'Blood pressure control', benefit: 'Vasodilation', timing: 'Daily' },
        { medicine: 'Lifestyle changes', for: 'BP management', benefit: 'Lower BP and risk', timing: 'Ongoing' },
      ];
    }
    if (primaryDisease.includes('asthma')) {
      return [
        { medicine: 'Inhaled corticosteroid', for: 'Inflammation', benefit: 'Reduces airway swelling', timing: 'Daily' },
        { medicine: 'Albuterol inhaler', for: 'Bronchospasm', benefit: 'Quick relief', timing: 'PRN' },
      ];
    }
    return [];
  };

  const vaccinationsAndTreatment = userTreatments.length ? userTreatments : fallbackTreatmentsByDisease();
  const displayedTreatments = [...vaccinationsAndTreatment, ...addedTreatments];

  const analysis = Array.isArray(patient.analysis) ? patient.analysis : [];

  const tabList = [
    { name: 'Medical History' },
    { name: 'Reports & Tests' },
    { name: 'Treatment' },
    { name: 'Analysis' }
  ];

  const lastCheckupDate = (userReports[0] && userReports[0].date) || '—';

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${flag ? '' : 'pointer-events-none'}
      `}
      aria-hidden={!flag}
    >
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${flag ? 'opacity-100' : 'opacity-0'}`} onClick={(e) => handleClick(e, flag, setFlag)}></div>
      <div
        className={`relative bg-slate-800 text-amber-50 rounded-xl shadow-2xl overflow-hidden
        w-[90vw] h-[85vh] md:w-[80vw] md:h-[80vh]
        transition-all duration-300 ease-out
        ${flag ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
      >
        

        <div className="grid grid-cols-1 md:grid-cols-7 h-full">
          <div className="left bg-white text-black md:col-span-2 h-full p-4">
            <img
              src={photoSrc}
              className='rounded-xl mx-auto object-cover w-full max-w-[320px] h-[260px]'
              alt='patient'
            />
            <div className="details mt-5 space-y-2">
              <h4 className='text-xl md:text-2xl'><b>Name:</b> {patient.name || '—'}</h4>
              <p className='text-lg md:text-xl'><b>Disease:</b> {conditions.length ? conditions.join(', ') : '—'}</p>
              <p className='text-lg md:text-xl'><b>Last Checkup:</b> {lastCheckupDate}</p>
            </div>
          </div>

          <div className="right-section md:col-span-5 h-full flex flex-col text-left text-base p-5 relative">
            <div className="flex flex-wrap gap-4 border-b border-amber-200/50 pb-3 mb-4">
              {tabList.map((tab, idx) => (
                <button
                  key={idx}
                  className={`px-3 pb-2 text-base md:text-lg font-semibold transition
                    ${activeTab === idx ? 'text-white border-b-2 border-white' : 'text-amber-100 hover:text-white/80'}`}
                  onClick={() => setActiveTab(idx)}
                  type="button"
                >
                  {tab.name}
                </button>
              ))}
              <button
                type='button'
                onClick={(e) => handleClick(e, flag, setFlag)}
                className='absolute cursor-pointer right-4 top-4 text-2xl p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60 active:scale-95'
                aria-label='Close modal'
                title='Close'
              ><ImCross /></button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {activeTab === 0 && (
                <div className='space-y-2'>
                  <div><b>Birthplace:</b> {medicalHistory.birthplace}</div>
                  <div><b>Past Health Record:</b> {medicalHistory.pastHealth}</div>
                  <div><b>Current Medication:</b> {medicalHistory.currentMedication}</div>
                  <div><b>Allergies:</b> {medicalHistory.allergies}</div>
                  <div><b>Lifestyle:</b> {medicalHistory.lifestyle}</div>
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  {reportsAndTests.length ? (
                    <table className="min-w-full bg-white/5 text-white mb-5 rounded shadow text-sm">
                      <thead>
                        <tr>
                          <th className="py-2 px-3 font-medium text-left">Type</th>
                          <th className="py-2 px-3 font-medium text-left">Date</th>
                          <th className="py-2 px-3 font-medium text-left">Result</th>
                          <th className="py-2 px-3 font-medium text-left">Related To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportsAndTests.map((r, i) => (
                          <tr key={i} className='odd:bg-white/0 even:bg-white/5'>
                            <td className="py-1 px-3">{r.type || '—'}</td>
                            <td className="py-1 px-3">{r.date || '—'}</td>
                            <td className="py-1 px-3">{r.result || '—'}</td>
                            <td className="py-1 px-3">{r.related || (conditions[0] || '—')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className='text-amber-100'>No reports yet.</div>
                  )}
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  {displayedTreatments.length ? displayedTreatments.map((med, i) => (
                    <div key={i} className="mb-4 border border-amber-200/30 bg-white/5 rounded-lg p-3">
                      <div><b>Medicine:</b> {med.medicine || '—'}</div>
                      <div><b>For:</b> {med.for || '—'}</div>
                      <div><b>Benefit:</b> {med.benefit || '—'}</div>
                      <div><b>Dosage/Timing:</b> {med.timing || '—'}</div>
                    </div>
                  )) : (
                    <div className='text-amber-100'>No treatment recorded.</div>
                  )}
                </div>
              )}

              {activeTab === 3 && (
                <div>
                  {analysis.length ? analysis.map((entry, i) => (
                    <div key={i} className="mb-4 border-l-4 border-amber-300 pl-3">
                      <div><b>Date:</b> {entry.date || '—'}</div>
                      <div><b>Notes/Symptoms:</b> {entry.description || '—'}</div>
                      <div><b>Improvement/Condition:</b> {entry.result || '—'}</div>
                    </div>
                  )) : (
                    <div className='text-amber-100'>No analysis yet.</div>
                  )}
                </div>
              )}
            </div>

            <div className='mt-3 border-t border-amber-200/30 pt-3'>
              <label className='block mb-2 font-semibold'>Add prescription (local only):</label>
              
              <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
                <input
                  type='text'
                  value={pendingRx.medicine}
                  onChange={(e) => setPendingRx(v => ({ ...v, medicine: e.target.value }))}
                  placeholder='Medicine'
                  className='rounded-md bg-white/10 placeholder-white/60 text-white p-2 outline-none focus:ring-2 focus:ring-white/50'
                />
                <input
                  type='text'
                  value={pendingRx.for}
                  onChange={(e) => setPendingRx(v => ({ ...v, for: e.target.value }))}
                  placeholder='For (indication)'
                  className='rounded-md bg-white/10 placeholder-white/60 text-white p-2 outline-none focus:ring-2 focus:ring-white/50'
                />
                <input
                  type='text'
                  value={pendingRx.benefit}
                  onChange={(e) => setPendingRx(v => ({ ...v, benefit: e.target.value }))}
                  placeholder='Benefit'
                  className='rounded-md bg-white/10 placeholder-white/60 text-white p-2 outline-none focus:ring-2 focus:ring-white/50'
                />
                <input
                  type='text'
                  value={pendingRx.timing}
                  onChange={(e) => setPendingRx(v => ({ ...v, timing: e.target.value }))}
                  placeholder='Timing / dosage'
                  className='rounded-md bg-white/10 placeholder-white/60 text-white p-2 outline-none focus:ring-2 focus:ring-white/50'
                />
              </div>

              <div className='mt-2 flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!pendingRx.medicine.trim()) {
                        setFeedback({ type: 'error', message: 'Medicine name is required' });
                        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
                        return;
                      }

                      const patientId = patient?._id || patient?.id;
                      if (!patientId) {
                        setFeedback({ type: 'error', message: 'Patient ID is missing. Cannot save prescription.' });
                        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
                        return;
                      }

                      const trimmedRx = {
                        medicine: pendingRx.medicine.trim(),
                        for: (pendingRx.for || '').trim(),
                        benefit: (pendingRx.benefit || '').trim(),
                        timing: (pendingRx.timing || '').trim(),
                      };

                      console.log('Submitting prescription', {
                        patientId,
                        patientName: patient?.name,
                        prescription: trimmedRx,
                      });

                      setIsSubmitting(true);
                      setFeedback({ type: '', message: '' });

                      try {
                        const response = await patientService.addNewMedicine(patientId, trimmedRx);
                        console.log('Prescription saved successfully:', response);
                        
                        // Only update state on success
                        setAddedTreatments(list => [...list, trimmedRx]);
                        setPendingRx({ medicine: '', for: '', benefit: '', timing: '' });
                        setFeedback({ type: 'success', message: 'Prescription added successfully!' });
                        setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
                      } catch (error) {
                        console.error('Error saving prescription:', error);
                        const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to save prescription. Please try again.';
                        setFeedback({ type: 'error', message: errorMessage });
                        setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className='px-3 py-2 bg-white/15 hover:bg-white/25 rounded-md text-white font-semibold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                  >{isSubmitting ? 'Adding...' : 'Add to Treatment'}</button>
                </div>
                
                {feedback.message && (
                  <div className={`text-sm p-2 rounded-md ${
                    feedback.type === 'success' 
                      ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-200 border border-red-400/30'
                  }`}>
                    {feedback.message}
                  </div>
                )}
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal