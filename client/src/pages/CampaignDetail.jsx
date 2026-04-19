import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [page, setPage] = useState(1);
  const load = () => api.get('/campaigns/'+id, { params: { page } }).then(r => setCampaign(r.data));
  useEffect(() => { load(); }, [id, page]);
  if (!campaign) return <div className="p-8 text-gray-400">Loading...</div>;
  const pages = Math.ceil((campaign.recordsTotal||0) / 20);
  return (
    <div className="p-6">
      <button onClick={() => navigate('/campaigns')} className="text-sm text-gray-400 hover:text-gray-600 mb-4">← Back to Campaigns</button>
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 w-64 flex-shrink-0">
          <h2 className="font-bold text-orange-500 text-lg mb-4">{campaign.name}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Amount spent</span><span className="font-medium">${campaign.amountSpent?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Records</span><span className="font-medium">{campaign.recordsTotal}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className={"text-xs px-2 py-0.5 rounded-full "+(campaign.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500')}>{campaign.status}</span></div>
            <hr className="border-gray-100" />
            <div className="flex justify-between"><span className="text-gray-400">Mail type</span><span>{campaign.mailType}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Print type</span><span>{campaign.printType}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Daily count</span><span>{campaign.dailySendCount}</span></div>
            {campaign.returnAddress && <div><div className="text-gray-400 mb-1">Return address</div><div className="text-xs">{campaign.returnAddress}</div></div>}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 text-sm font-medium text-gray-700">Records ({campaign.recordsTotal})</div>
          <div className="divide-y divide-gray-50">
            {campaign.records?.map(r => (
              <div key={r.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-700 cursor-pointer hover:text-orange-500" onClick={() => r.contact && navigate('/contacts/'+r.contact.id)}>{r.contact?.fullName || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{r.contact?.address || ''} {r.property?.address && '— ' + r.property.address}</div>
                </div>
                {r.code && <span className="text-xs border border-gray-200 px-2 py-0.5 rounded">Code: {r.code}</span>}
                <span className={"text-xs px-2 py-1 rounded-full "+(r.status==='mailed'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500')}>{r.status}</span>
              </div>
            ))}
          </div>
          {pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="text-sm text-gray-500 disabled:opacity-30">Prev</button>
              <span className="text-sm text-gray-400">Page {page} of {pages}</span>
              <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)} className="text-sm text-gray-500 disabled:opacity-30">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
