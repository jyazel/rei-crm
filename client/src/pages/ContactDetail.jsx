import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';
const CATEGORIES = ['None','Buyer','Seller','Attorney','Banker','Contractor','Developer','Funder','Municipal Officer','Notary','Photographer','Real Estate Agent','Surveyor','Title Agent','Other'];
export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const load = () => api.get('/contacts/' + id).then(r => { setContact(r.data); setForm(r.data); });
  useEffect(() => { load(); }, [id]);
  const set = k => e => setForm(f => ({...f, [k]: e.target.type==='checkbox'?e.target.checked:e.target.value}));
  const save = async e => { e.preventDefault(); await api.put('/contacts/'+id, form); setEditing(false); load(); };
  if (!contact) return <div className="p-8 text-gray-400">Loading...</div>;
  return (
    <div className="p-6 max-w-4xl">
      <button onClick={() => navigate('/contacts')} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← Back to Contacts</button>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
            {(contact.firstName?.[0] || contact.fullName?.[0] || '?').toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{contact.fullName}</h1>
            <div className="text-sm text-gray-400">{contact.category !== 'None' ? contact.category : 'No category'}</div>
          </div>
        </div>
        <button onClick={() => setEditing(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Edit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-medium text-gray-700 mb-3 text-sm">Contact Info</h3>
          {contact.phonePrimary && <div className="text-sm text-gray-600 mb-1">Phone: <span className="text-orange-500">{contact.phonePrimary}</span></div>}
          {contact.phoneSecondary && <div className="text-sm text-gray-600 mb-1">Phone 2: <span className="text-orange-500">{contact.phoneSecondary}</span></div>}
          {contact.email && <div className="text-sm text-gray-600 mb-1">Email: <span className="text-orange-500">{contact.email}</span></div>}
          {contact.address && <div className="text-sm text-gray-600">{contact.address}, {contact.city}, {contact.state} {contact.zip}</div>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="font-medium text-gray-700 mb-3 text-sm">Deals ({contact.deals?.length || 0})</h3>
          {contact.deals?.length ? contact.deals.map(dc => (
            <div key={dc.deal.id} onClick={() => navigate('/deals/'+dc.deal.id)} className="text-sm text-orange-500 cursor-pointer hover:underline mb-1">{dc.deal.title} <span className="text-gray-400">— {dc.deal.stage?.name}</span></div>
          )) : <p className="text-sm text-gray-400">No deals yet</p>}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-medium text-gray-700 mb-3 text-sm">Properties ({contact.properties?.length || 0})</h3>
        {contact.properties?.length ? contact.properties.map(p => (
          <div key={p.id} onClick={() => navigate('/properties/'+p.id)} className="text-sm text-orange-500 cursor-pointer hover:underline mb-1">{p.address || p.apn}</div>
        )) : <p className="text-sm text-gray-400">No properties</p>}
      </div>
      {editing && (
        <Modal title="Edit Contact" onClose={() => setEditing(false)}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input value={form.fullName||''} onChange={set('fullName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">First</label><input value={form.firstName||''} onChange={set('firstName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Last</label><input value={form.lastName||''} onChange={set('lastName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={form.email||''} onChange={set('email')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Phone Primary</label><input value={form.phonePrimary||''} onChange={set('phonePrimary')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Phone Secondary</label><input value={form.phoneSecondary||''} onChange={set('phoneSecondary')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Address</label><input value={form.address||''} onChange={set('address')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2">
              <input value={form.city||''} onChange={set('city')} placeholder="City" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.state||''} onChange={set('state')} placeholder="ST" className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.zip||''} onChange={set('zip')} placeholder="Zip" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category||'None'} onChange={set('category')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={!!form.doNotMail} onChange={set('doNotMail')} /><label className="text-sm text-gray-600">Do Not Mail</label></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description||''} onChange={set('description')} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
