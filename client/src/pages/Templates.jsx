import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
const blank = { name:'', type:'mail', mailingType:'Letter', subject:'', body:'' };
export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [tab, setTab] = useState('mail');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const load = () => api.get('/templates', { params: { type: tab } }).then(r => setTemplates(r.data));
  useEffect(() => { load(); }, [tab]);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const save = async e => { e.preventDefault(); await api.post('/templates', { ...form, type: tab }); setModal(false); setForm(blank); load(); };
  const del = async id => { await api.delete('/templates/'+id); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Templates</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Template</button>
      </div>
      <div className="flex gap-2 mb-4">
        {['mail','email','text'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={"px-4 py-2 rounded-lg text-sm capitalize font-medium " + (tab===t?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-500')}>{t}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase">
            <th className="text-left p-4">Name</th>
            {tab==='mail' && <th className="text-left p-4">Mailing Type</th>}
            {tab!=='mail' && <th className="text-left p-4">Subject</th>}
            <th className="text-left p-4">Last Edited</th><th className="p-4"></th>
          </tr></thead>
          <tbody>{templates.map(t => (
            <tr key={t.id} className="border-b border-gray-50">
              <td className="p-4 text-orange-500 font-medium">{t.name}</td>
              {tab==='mail' && <td className="p-4 text-gray-500">{t.mailingType || '—'}</td>}
              {tab!=='mail' && <td className="p-4 text-gray-500">{t.subject || '—'}</td>}
              <td className="p-4 text-gray-400">{new Date(t.updatedAt).toLocaleDateString()}</td>
              <td className="p-4 text-right"><button onClick={() => del(t.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button></td>
            </tr>
          ))}</tbody>
        </table>
        {!templates.length && <div className="p-8 text-center text-gray-400">No {tab} templates yet</div>}
      </div>
      {modal && (
        <Modal title="Add Template" onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
              <input required value={form.name} onChange={set('name')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            {tab==='mail' && <div><label className="block text-xs font-medium text-gray-600 mb-1">Mailing Type</label>
              <select value={form.mailingType} onChange={set('mailingType')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option>Letter</option><option>6x9 Postcard</option><option>4x6 Postcard</option></select></div>}
            {tab!=='mail' && <div><label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
              <input value={form.subject} onChange={set('subject')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>}
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Body</label>
              <textarea value={form.body} onChange={set('body')} rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => { setModal(false); setForm(blank); }} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Save Template</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
