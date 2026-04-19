import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
const blankPlan = { name:'', totalDays: 30 };
export default function AutoFollowup() {
  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(false);
  const [planModal, setPlanModal] = useState(null);
  const [form, setForm] = useState(blankPlan);
  const [steps, setSteps] = useState([{ dayOfPlan:1, timeOfDay:'08:00', contactMethod:'text' }]);
  const load = () => api.get('/action-plans').then(r => setPlans(r.data));
  useEffect(() => { load(); }, []);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const setStep = (i, k, v) => setSteps(ss => ss.map((s,idx) => idx===i ? {...s,[k]:v} : s));
  const addStep = () => setSteps(ss => [...ss, { dayOfPlan: ss.length+1, timeOfDay:'08:00', contactMethod:'text' }]);
  const removeStep = i => setSteps(ss => ss.filter((_,idx) => idx!==i));
  const save = async e => { e.preventDefault(); await api.post('/action-plans', { ...form, steps }); setModal(false); setForm(blankPlan); setSteps([{ dayOfPlan:1, timeOfDay:'08:00', contactMethod:'text' }]); load(); };
  const deletePlan = async id => { await api.delete('/action-plans/'+id); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Auto Followup</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Plan</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase">
            <th className="text-left p-4">Plan Name</th><th className="text-left p-4">Steps</th>
            <th className="text-left p-4">Enrolled</th><th className="p-4"></th>
          </tr></thead>
          <tbody>{plans.map(p => (
            <tr key={p.id} className="border-b border-gray-50">
              <td className="p-4 text-orange-500 font-medium cursor-pointer hover:underline" onClick={() => setPlanModal(p)}>{p.name}</td>
              <td className="p-4 text-gray-500">{p.steps?.length || 0} steps · {p.totalDays} days</td>
              <td className="p-4 text-gray-500">{p._count?.enrollments || 0} contacts</td>
              <td className="p-4 text-right"><button onClick={() => deletePlan(p.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button></td>
            </tr>
          ))}</tbody>
        </table>
        {!plans.length && <div className="p-8 text-center text-gray-400">No followup plans yet</div>}
      </div>
      {modal && (
        <Modal title="Create Followup Plan" onClose={() => { setModal(false); }}>
          <form onSubmit={save} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Plan Name *</label>
              <input required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Total Days</label>
              <input type="number" value={form.totalDays} onChange={set('totalDays')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-600">Steps</label>
                <button type="button" onClick={addStep} className="text-xs text-orange-500 hover:underline">+ Add Step</button>
              </div>
              <div className="space-y-2">
                {steps.map((s,i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <span className="text-xs text-gray-400 w-12">Step {i+1}</span>
                    <input type="number" value={s.dayOfPlan} onChange={e => setStep(i,'dayOfPlan',+e.target.value)} placeholder="Day" className="w-16 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none" />
                    <input type="time" value={s.timeOfDay} onChange={e => setStep(i,'timeOfDay',e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none" />
                    <select value={s.contactMethod} onChange={e => setStep(i,'contactMethod',e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none">
                      <option value="text">Text</option><option value="email">Email</option></select>
                    {steps.length > 1 && <button type="button" onClick={() => removeStep(i)} className="text-red-400 text-sm ml-auto">×</button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Create Plan</button>
            </div>
          </form>
        </Modal>
      )}
      {planModal && (
        <Modal title={planModal.name} onClose={() => setPlanModal(null)}>
          <div className="space-y-2">
            {planModal.steps?.map((s,i) => (
              <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 text-sm">
                <span className="text-gray-400 w-12 text-xs">Step {i+1}</span>
                <span className="text-gray-600">Day {s.dayOfPlan}</span>
                <span className="text-gray-400">{s.timeOfDay}</span>
                <span className={"px-2 py-0.5 rounded-full text-xs " + (s.contactMethod==='text'?'bg-blue-100 text-blue-700':'bg-purple-100 text-purple-700')}>{s.contactMethod}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
