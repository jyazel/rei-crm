import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
export default function InboxDetail() {
  const { id } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [tab, setTab] = useState('all');
  const loadConvs = () => api.get('/inboxes/'+id+'/conversations', { params: { tab } }).then(r => setConversations(r.data));
  useEffect(() => { loadConvs(); }, [id, tab]);
  const selectConv = async conv => {
    setSelected(conv);
    const r = await api.get('/inboxes/conversations/' + conv.id);
    setMessages(r.data.messages || []);
  };
  const send = async () => {
    if (!text.trim() || !selected) return;
    await api.post('/inboxes/conversations/'+selected.id+'/messages', { body: text, direction: 'outbound', type: 'text', status: 'sent' });
    setText(''); selectConv(selected);
  };
  const tabs = ['all','inbox','sent','unread'];
  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-1">
            {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={"flex-1 py-1 text-xs rounded capitalize " + (tab===t?'bg-orange-500 text-white':'text-gray-500 hover:bg-gray-100')}>{t}</button>)}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => selectConv(conv)}
              className={"p-4 cursor-pointer hover:bg-gray-50 " + (selected?.id===conv.id?'bg-orange-50 border-r-2 border-orange-500':'')}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-700">{conv.contact?.fullName || conv.phone || conv.email || 'Unknown'}</span>
                <span className="text-xs text-gray-400">{new Date(conv.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-gray-400 truncate">{conv.messages?.[0]?.body || 'No messages'}</div>
            </div>
          ))}
          {!conversations.length && <div className="p-8 text-center text-gray-400 text-sm">No conversations</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-white font-medium text-gray-700">
              {selected.contact?.fullName || selected.phone || 'Conversation'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={"flex " + (m.direction==='outbound'?'justify-end':'justify-start')}>
                  <div className={"max-w-sm px-4 py-2 rounded-2xl text-sm " + (m.direction==='outbound'?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-700')}>
                    {m.type !== 'text' && <div className="text-xs opacity-70 mb-1 capitalize">{m.type}</div>}
                    {m.body || (m.type==='call'?'Call — '+(m.duration||0)+'s':'')}
                    <div className="text-xs opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a text..." rows={2}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
              <button onClick={send} className="bg-orange-500 text-white px-4 rounded-lg text-sm font-medium self-end py-2">Send</button>
            </div>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>}
      </div>
    </div>
  );
}
