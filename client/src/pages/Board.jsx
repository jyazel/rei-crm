import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import KanbanBoard from '../components/KanbanBoard';
import Modal from '../components/Modal';
const SOURCES = ['Other','Phone','Email','Campaign','Website','Craigslist','Facebook'];
const blank = { title:'', estimatedValue:'', source:'Other', priority:'None' };
export default function Board() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [modal, setModal] = useState(false);
  const [activeStage, setActiveStage] = useState(null);
  const [form, setForm] = useState(blank);
  const load = () => api.get('/boards/' + id).then(r => setBoard(r.data));
  useEffect(() => { load(); }, [id]);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const handleAddDeal = (stage) => { setActiveStage(stage); setModal(true); };
  const save = async e => {
    e.preventDefault();
    await api.post('/deals', { ...form, stageId: activeStage.id, estimatedValue: form.estimatedValue || null });
    setModal(false); setForm(blank); load();
  };
  const handleDragEnd = async result => {
    if (!result.destination || result.destination.droppableId === result.source.droppableId) return;
    await api.put('/deals/' + result.draggableId, { stageId: result.destination.droppableId });
    load();
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <h1 className="text-xl font-bold text-gray-800">{board?.name}</h1>
        <button onClick={() => { setActiveStage(board?.stages?.[0]); setModal(true); }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Deal</button>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard board={board} onDealClick={d => navigate('/deals/'+d.id)} onAddDeal={handleAddDeal} onDragEnd={handleDragEnd} />
      </div>
      {modal && (
        <Modal title={"Add Deal" + (activeStage ? " to " + activeStage.name : "")} onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Deal Title *</label>
              <input required value={form.title} onChange={set('title')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Estimated Value</label>
              <input type="number" value={form.estimatedValue} onChange={set('estimatedValue')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Stage</label>
              <select value={activeStage?.id} onChange={e => setActiveStage(board?.stages?.find(s => s.id === e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {board?.stages?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Source</label>
              <select value={form.source} onChange={set('source')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => { setModal(false); setForm(blank); }} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Add Deal</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
