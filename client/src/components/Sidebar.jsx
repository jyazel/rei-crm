import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
const topNav = [
  { label: 'Dashboard', path: '/dashboard', icon: 'D' },
  { label: 'Campaigns', path: '/campaigns', icon: 'C' },
  { label: 'Inboxes', path: '/inboxes', icon: 'I' },
  { label: 'Tasks', path: '/tasks', icon: 'T' },
];
const dbNav = [
  { label: 'Properties', path: '/properties', icon: 'P' },
  { label: 'Contacts', path: '/contacts', icon: 'U' },
];
const cfgNav = [
  { label: 'Auto Followup', path: '/auto-followup', icon: 'F' },
  { label: 'Templates', path: '/templates', icon: 'E' },
  { label: 'Settings', path: '/settings', icon: 'S' },
];
const lc = ({ isActive }) => 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ' + (isActive ? 'bg-orange-100 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-100');
export default function Sidebar() {
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { api.get('/boards').then(r => setBoards(r.data)).catch(() => {}); }, []);
  const logout = () => { localStorage.clear(); navigate('/login'); };
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
          <span className="font-semibold text-gray-800">REI CRM</span>
        </div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto space-y-0.5">
        {topNav.map(n => <NavLink key={n.path} to={n.path} className={lc}><span className="w-4 text-center text-xs">{n.icon}</span>{n.label}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Boards</div>
        {boards.map(b => <NavLink key={b.id} to={'/boards/' + b.id} className={lc}><span className="w-4 text-center text-xs">B</span>{b.name}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Database</div>
        {dbNav.map(n => <NavLink key={n.path} to={n.path} className={lc}><span className="w-4 text-center text-xs">{n.icon}</span>{n.label}</NavLink>)}
        <div className="pt-3 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configure</div>
        {cfgNav.map(n => <NavLink key={n.path} to={n.path} className={lc}><span className="w-4 text-center text-xs">{n.icon}</span>{n.label}</NavLink>)}
      </nav>
      <div className="p-2 border-t border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">Sign out</button>
      </div>
    </aside>
  );
}
