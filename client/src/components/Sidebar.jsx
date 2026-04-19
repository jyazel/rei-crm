import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

const nav = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Campaigns', path: '/campaigns', icon: '📬' },
  { label: 'Inboxes', path: '/inboxes', icon: '📥' },
  { label: 'Tasks', path: '/tasks', icon: '✅' },
];
const dbNav = [
  { label: 'Properties', path: '/properties', icon: '🏠' },
  { label: 'Contacts', path: '/contacts', icon: '👥' },
];
const cfgNav = [
  { label: 'Auto Followup', path: '/auto-followup', icon: '🔄' },
  { label: 'Templates', path: '/templates', icon: '📄' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/boards').then(r => setBoards(r.data)).catch(() => {});
  }, []);

  const logout = () => { localStorage.clear(); navigate('/login'); };

  const linkClass = ({ isActive }) =>
    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ' +
    (isActive ? 'bg-orange-100 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100');

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <span className="font-semibold text-gray-800">REI CRM</span>
        </div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto space-y-0.5">
        {nav.map(n => <NavLink key={n.path} to={n.path} className={linkClass}><span>{n.icon}</span>{n.label}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Boards</div>
        {boards.map(b => <NavLink key={b.id} to={'/boards/' + b.id} className={linkClass}><span>📋</span>{b.name}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Database</div>
        {dbNav.map(n => <NavLink key={n.path} to={n.path} className={linkClass}><span>{n.icon}</span>{n.label}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configure</div>
        {cfgNav.map(n => <NavLink key={n.path} to={n.path} className={linkClass}><span>{n.icon}</span>{n.label}</NavLink>)}
      </nav>
      <div className="p-2 border-t border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  );
}
