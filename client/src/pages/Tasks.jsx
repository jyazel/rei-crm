import { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
const blank = { title:'', taskList:'', dueDate:'' };
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('todo');
  const [due, setDue] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blank);
  const load = () => api.get('/tasks', { params: { status, due } }).then(r => setTasks(r.data));
  useEffect(() => { load(); }, [status, due]);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const save = async e => { e.preventDefault(); await api.post('/tasks', form); setModal(false); setForm(blank); load(); };
  const complete = async task => { await api.put('/tasks/'+task.id, { completedAt: task.completedAt ? null : new Date() }); load(); };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button onClick={() => setModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Add Task</button>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['todo','done',''].map(s => <button key={s} onClick={() => setStatus(s)} className={"px-3 py-1.5 rounded-lg text-sm " + (status===s?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-500')}>{s==='todo'?'To Do':s==='done'?'Done':'All'}</button>)}
        <span className="w-px bg-gray-200 mx-1" />
        {['','overdue','today','week'].map(d => <button key={d} onClick={() => setDue(d)} className={"px-3 py-1.5 rounded-lg text-sm " + (due===d?'bg-gray-800 text-white':'bg-white border border-gray-200 text-gray-500')}>{d==='overdue'?'Overdue':d==='today'?'Today':d==='week'?'This week':'All time'}</button>)}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
            <th className="text-left p-4">Task</th><th className="text-left p-4">Deal</th>
            <th className="text-left p-4">Stage</th><th className="text-left p-4">Due</th>
            <th className="text-left p-4">Completed</th>
          </tr></thead>
          <tbody>{tasks.map(t => (
            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="p-4 flex items-center gap-2">
                <button onClick={() => complete(t)} className={"w-4 h-4 rounded border flex-shrink-0 " + (t.completedAt?'bg-green-500 border-green-500':'border-gray-300')} />
                <span className={t.completedAt?'line-through text-gray-400':'text-gray-700'}>{t.title}</span>
              </td>
              <td className="p-4 text-gray-500">{t.deal?.title || '—'}</td>
              <td className="p-4 text-gray-500">{t.deal?.stage?.name || '—'}</td>
              <td className="p-4 text-gray-500">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
              <td className="p-4 text-gray-500">{t.completedAt ? new Date(t.completedAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
        {!tasks.length && <div className="p-8 text-center text-gray-400">No tasks</div>}
      </div>
      {modal && (
        <Modal title="Add Task" onClose={() => { setModal(false); setForm(blank); }}>
          <form onSubmit={save} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Task Title *</label>
              <input required value={form.title} onChange={set('title')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Task List</label>
              <input value={form.taskList} onChange={set('taskList')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="datetime-local" value={form.dueDate} onChange={set('dueDate')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => { setModal(false); setForm(blank); }} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium">Add Task</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
