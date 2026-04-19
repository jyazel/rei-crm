import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';

const CATEGORIES = ['None','Buyer','Seller','Attorney','Banker','Contractor','Developer','Funder','Municipal Officer','Notary','Photographer','Real Estate Agent','Surveyor','Title Agent','Other'];

const blank = { fullName:'', firstName:'', lastName:'', email:'', phonePrimary:'', phoneSecondary:'', address:'', city:'', state:'', zip:'', category:'None', doNotMail:false, description:'' };

export default function Contacts() {
  const [data, setData] = useState({ contacts:[], total:0, pages:1 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const navigate = useNavigate();

  const load = () => api.get('/contacts', { params: { search, category, page } }).then(r => setData(r.data));
  useEffect(() => { load(); }, [search, category, page]);

  const set = k => e => setForm(f => ({...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}));
  const save = async e => {
    e.preventDefault();
    await api.post('/contacts', form);
    setModal(false); setForm(blank); load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Contact</button>
      </div>
      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, phone..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Categories</option>
          {CATEGORIES.filter(c=>c!=='None').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="text-xs text-gray-400 mb-3">{data.total} contacts</div>
      <div className="space-y-2">
        {data.contacts.map(c => (
          <div key={c.id} onClick={() => navigate('/contacts/' + c.id)}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
              {(c.firstName?.[0] || c.fullName?.[0] || '?').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 text-sm">{c.fullName}</div>
              <div className="text-xs text-gray-400">{c.phonePrimary} {c.email && '· ' + c.email}</div>
            </div>
            {c.address && <div className="text-xs text-gray-400 hidden md:block">{c.city}, {c.state}</div>}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 text-sm text-gray-500 disabled:opacity-30">Prev</button>
        <span className="text-sm text-gray-400">Page {page} of {data.pages}</span>
        <button disabled={page>=data.pages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 text-sm text-gray-500 disabled:opacity-30">Next</button>
      </div>
      {modal && (
        <Modal title="Add Contact" onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input required value={form.fullName} onChange={set('fullName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">First</label>
                <input value={form.firstName} onChange={set('firstName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Last</label>
                <input value={form.lastName} onChange={set('lastName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Phone (Primary)</label>
                <input value={form.phonePrimary} onChange={set('phonePrimary')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Phone (Secondary)</label>
                <input value={form.phoneSecondary} onChange={set('phoneSecondary')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
              <input value={form.address} onChange={set('address')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                <input value={form.city} onChange={set('city')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="w-20"><label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                <input value={form.state} onChange={set('state')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="w-24"><label className="block text-xs font-medium text-gray-600 mb-1">Zip</label>
                <input value={form.zip} onChange={set('zip')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={set('category')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="dnm" checked={form.doNotMail} onChange={set('doNotMail')} />
              <label htmlFor="dnm" className="text-sm text-gray-600">Do Not Mail</label>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => { setModal(false); setForm(blank); }} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
