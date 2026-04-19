import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';
const blank = { county:'', apn:'', acreage:'', address:'', city:'', state:'', zip:'', bedrooms:'', bathrooms:'', floors:'', yearBuilt:'', sqft:'', legalDescription:'' };
export default function Properties() {
  const [data, setData] = useState({ properties:[], total:0, pages:1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const navigate = useNavigate();
  const load = () => api.get('/properties', { params: { search, page } }).then(r => setData(r.data));
  useEffect(() => { load(); }, [search, page]);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const save = async e => { e.preventDefault(); await api.post('/properties', { ...form, acreage: form.acreage||null, sqft: form.sqft||null, bedrooms: form.bedrooms||null, bathrooms: form.bathrooms||null }); setModal(false); setForm(blank); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Property</button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by APN, address..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
      </div>
      <div className="text-xs text-gray-400 mb-3">{data.total} properties</div>
      <div className="space-y-2">
        {data.properties.map(p => (
          <div key={p.id} onClick={() => navigate('/properties/'+p.id)}
            className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="font-medium text-gray-800 text-sm text-orange-500">{p.address ? p.address + (p.city ? ', ' + p.city + ', ' + p.state + ' ' + p.zip : '') : 'No address'}</div>
            <div className="flex gap-4 mt-1 text-xs text-gray-400">
              {p.sqft && <span>{p.sqft.toLocaleString()} sq ft</span>}
              {p.apn && <span>APN: {p.apn}</span>}
              {p.acreage && <span>{p.acreage} acres</span>}
              {p.owner && <span>Owner: {p.owner.fullName}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 text-sm text-gray-500 disabled:opacity-30">Prev</button>
        <span className="text-sm text-gray-400">Page {page} of {data.pages}</span>
        <button disabled={page>=data.pages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 text-sm text-gray-500 disabled:opacity-30">Next</button>
      </div>
      {modal && (
        <Modal title="Add Property" onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">County</label><input value={form.county} onChange={set('county')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">APN *</label><input value={form.apn} onChange={set('apn')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Acreage</label><input type="number" step="0.01" value={form.acreage} onChange={set('acreage')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Address (optional)</label><input value={form.address} onChange={set('address')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2">
              <input value={form.city} onChange={set('city')} placeholder="City" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.state} onChange={set('state')} placeholder="ST" className="w-16 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              <input value={form.zip} onChange={set('zip')} placeholder="Zip" className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Beds</label><input type="number" value={form.bedrooms} onChange={set('bedrooms')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Baths</label><input type="number" step="0.5" value={form.bathrooms} onChange={set('bathrooms')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
              <div className="flex-1"><label className="block text-xs font-medium text-gray-600 mb-1">Sq Ft</label><input type="number" value={form.sqft} onChange={set('sqft')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Legal Description</label>
              <textarea value={form.legalDescription} onChange={set('legalDescription')} rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /></div>
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
