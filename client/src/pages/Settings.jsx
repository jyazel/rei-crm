import { useEffect, useState } from 'react';
export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('account');
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="flex gap-2 mb-6">
        {['account','team','integrations'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={"px-4 py-2 rounded-lg text-sm capitalize " + (tab===t?'bg-orange-500 text-white':'bg-white border border-gray-200 text-gray-500')}>{t}</button>
        ))}
      </div>
      {tab==='account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-medium text-gray-700 mb-4">User Details</h2>
            <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mb-4">
              {(user.firstName?.[0] || '?').toUpperCase()}
            </div>
            <div className="text-gray-800 font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
            <div className="text-gray-400 text-sm mt-1">{user.role}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-medium text-gray-700 mb-4">Company Details</h2>
            <div className="text-sm text-gray-500">Team ID: {user.teamId}</div>
          </div>
        </div>
      )}
      {tab==='team' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-medium text-gray-700 mb-2">Team Members</h2>
          <p className="text-sm text-gray-400">Team management coming soon.</p>
        </div>
      )}
      {tab==='integrations' && (
        <div className="space-y-3">
          {['HubSpot','Zapier','REI Landlist'].map(name => (
            <div key={name} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-700">{name}</div>
                <div className="text-sm text-gray-400">Not connected</div>
              </div>
              <button className="border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50">Connect</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
