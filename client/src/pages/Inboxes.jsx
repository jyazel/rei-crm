import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
export default function Inboxes() {
  const [inboxes, setInboxes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { api.get('/inboxes').then(r => setInboxes(r.data)); }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inboxes</h1>
      <div className="space-y-3">
        {inboxes.map(inbox => (
          <div key={inbox.id} onClick={() => navigate('/inboxes/'+inbox.id)}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow">
            <div>
              <div className="font-medium text-gray-800">{inbox.name}</div>
              <div className="text-sm text-gray-400">{inbox._count?.conversations || 0} conversations</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">{inbox.silentMode ? 'Silent' : 'Active'}</span>
              <span className="text-gray-300">›</span>
            </div>
          </div>
        ))}
        {!inboxes.length && <div className="text-center text-gray-400 py-8">No inboxes</div>}
      </div>
    </div>
  );
}
