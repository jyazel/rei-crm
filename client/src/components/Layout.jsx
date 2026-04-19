import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-[#faf9f7]"><Outlet /></main>
    </div>
  );
}
