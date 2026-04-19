import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';
const blank = { name:'', mailType:'USPS First Class', printType:'Color', doubleSided:false, dailySendCount:250, returnAddress:'' };
export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const navigate = useNavigate();
  const load = () => api.get('/campaigns').then(r => setCampaigns(r.data));
  useEffect(() => { load(); }, []);
  const set = k => e => setForm(f => ({...f, [k]: e.target.type==='checkbox'?e.target.checked:e.target.value}));
  const save = async e => { e.preventDefault(); await api.post('/campaigns', form); setModal(false); setForm(blank); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Campaigns</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Campaign</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
            <th className="text-left p-4">Name</th><th className="text-left p-4">Date</th>
            <th className="text-right p-4">Records</th><th className="text-right p-4">Deals</th>
            <th className="text-right p-4">Amount Spent</th><th className="text-right p-4">Status</th>
          </tr></thead>
          <tbody>{campaigns.map(c => (
            <tr key={c.id} onClick={() => navigate('/campaigns/'+c.id)} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
              <td className="p-4 text-orange-500 font-medium">{c.name}</td>
              <td className="p-4 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
              <td className="p-4 text-right text-gray-500">{c._count?.records ?? 0}</td>
              <td className="p-4 text-right text-gray-500">{c._count?.deals ?? 0}</td>
              <td className="p-4 text-right text-gray-500">${c.amountSpent?.toFixed(2)}</td>
              <td className="p-4 text-right"><span className={"text-xs px-2 py-1 rounded-full " + (c.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500')}>{c.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
        {!campaigns.length && <div className="p-8 text-center text-gray-400">No campaigns yet</div>}
      </div>
      {modal && (
        <Modal title="Add Campaign" onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Campaign Name *</label>
              <input required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Mail Type</label>
              <select value={form.mailType} onChange={set('mailType')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option>USPS First Class</option><option>USPS Standard</option></select></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Print Type</label>
              <select value={form.printType} onChange={set('printType')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option>Color</option><option>Black & White</option></select></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={form.doubleSided} onChange={set('doubleSided')} /><label className="text-sm text-gray-600">Double sided</label></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Daily Send Count</label>
              <input type="number" value={form.dailySendCount} onChange={set('dailySendCount')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Return Address</label>
              <textarea value={form.returnAddress} onChange={set('returnAddress')} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => { setModal(false); setForm(blank); }} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Create Campaign</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
