import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [note, setNote] = useState('');
  const load = () => api.get('/deals/' + id).then(r => setDeal(r.data));
  useEffect(() => { load(); }, [id]);
  const addNote = async () => { if (!note.trim()) return; await api.post('/deals/'+id+'/notes', { body: note }); setNote(''); load(); };
  if (!deal) return <div className="p-8 text-gray-400">Loading...</div>;
  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4">← Back</button>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-800">{deal.title}</h1>
          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: deal.stage?.color + '22', color: deal.stage?.color }}>{deal.stage?.name}</span>
        </div>
        <div className="flex gap-6 mt-3 text-sm text-gray-500">
          {deal.estimatedValue && <span>Value: <strong className="text-green-600">${deal.estimatedValue.toLocaleString()}</strong></span>}
          <span>Source: {deal.source}</span>
          <span>Board: {deal.stage?.board?.name}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-medium text-gray-700 mb-3 text-sm">Contacts ({deal.contacts?.length || 0})</h2>
        {deal.contacts?.map(dc => (
          <div key={dc.contact.id} onClick={() => navigate('/contacts/'+dc.contact.id)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-medium">
              {(dc.contact.firstName?.[0] || dc.contact.fullName?.[0] || '?').toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">{dc.contact.fullName}</div>
              <div className="text-xs text-gray-400">{dc.contact.phonePrimary}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-medium text-gray-700 mb-3 text-sm">Tasks ({deal.tasks?.length || 0})</h2>
        {deal.tasks?.length ? deal.tasks.map(t => (
          <div key={t.id} className="flex items-center gap-2 py-1 text-sm text-gray-600">
            <span className={"w-4 h-4 rounded border " + (t.completedAt ? 'bg-green-500 border-green-500' : 'border-gray-300')} />
            {t.title} {t.dueDate && <span className="text-xs text-gray-400">— Due {new Date(t.dueDate).toLocaleDateString()}</span>}
          </div>
        )) : <p className="text-sm text-gray-400">No tasks</p>}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-medium text-gray-700 mb-3 text-sm">Notes</h2>
        <div className="space-y-2 mb-3">
          {deal.notes?.map(n => (
            <div key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              {n.body}<div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={2}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          <button onClick={addNote} className="bg-orange-500 text-white px-4 rounded-lg text-sm font-medium self-end py-2">Save</button>
        </div>
      </div>
    </div>
  );
}
