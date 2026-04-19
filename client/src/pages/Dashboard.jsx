import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import api from '../api';
export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/dashboard').then(r => setData(r.data)).catch(() => {}); }, []);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <span className="text-sm text-gray-400">Past 30 days</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Deals added" value={data?.summary?.dealsAdded ?? 0} />
        <StatCard label="Offers made" value={data?.summary?.offersMade ?? 0} />
        <StatCard label="Properties purchased" value={data?.summary?.propertiesPurchased ?? 0} />
        <StatCard label="Properties sold" value={data?.summary?.propertiesSold ?? 0} />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-semibold text-gray-700 mb-4">Communication Report</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total conversations" value={data?.communication?.totalConversations ?? 0} />
          <StatCard label="Calls made" value={data?.communication?.callsMade ?? 0} />
          <StatCard label="Calls missed" value={data?.communication?.callsMissed ?? 0} />
          <StatCard label="Texts sent" value={data?.communication?.textsSent ?? 0} />
          <StatCard label="Emails sent" value={data?.communication?.emailsSent ?? 0} />
          <StatCard label="Talk time" value={data?.communication?.talkTime ? Math.round(data.communication.talkTime/60)+'m' : '0m'} />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Campaign Performance</h2>
        {data?.campaigns?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left pb-2">Campaign</th>
                <th className="text-right pb-2">Records</th>
                <th className="text-right pb-2">Deals</th>
                <th className="text-right pb-2">Amount Spent</th>
                <th className="text-right pb-2">Response Rate</th>
              </tr></thead>
              <tbody>{data.campaigns.map((c,i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2 text-gray-700">{c.name}</td>
                  <td className="py-2 text-right text-gray-500">{c._count?.records ?? 0}</td>
                  <td className="py-2 text-right text-gray-500">{c._count?.deals ?? 0}</td>
                  <td className="py-2 text-right text-gray-500">${c.amountSpent?.toFixed(2) ?? '0.00'}</td>
                  <td className="py-2 text-right text-gray-500">{c.responseRate?.toFixed(2) ?? '0.00'}%</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="text-gray-400 text-sm text-center py-8">No campaigns yet</p>}
      </div>
    </div>
  );
}
