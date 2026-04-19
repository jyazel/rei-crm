import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  useEffect(() => { api.get('/properties/' + id).then(r => setProperty(r.data)); }, [id]);
  if (!property) return <div className="p-8 text-gray-400">Loading...</div>;
  return (
    <div className="p-6 max-w-3xl">
      <button onClick={() => navigate('/properties')} className="text-sm text-gray-400 hover:text-gray-600 mb-4">← Back to Properties</button>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h1 className="text-xl font-bold text-orange-500 mb-1">{property.address || 'No address'}{property.city ? ', ' + property.city + ', ' + property.state + ' ' + property.zip : ''}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          {property.sqft && <span>{property.sqft.toLocaleString()} sq ft</span>}
          {property.acreage && <span>{property.acreage} acres</span>}
          {property.bedrooms && <span>{property.bedrooms} beds</span>}
          {property.bathrooms && <span>{property.bathrooms} baths</span>}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {property.apn && <div>APN: <span className="font-medium">{property.apn}</span></div>}
          {property.county && <div>County: <span className="font-medium">{property.county}</span></div>}
          {property.owner && <div>Owner: <span className="font-medium text-orange-500 cursor-pointer hover:underline" onClick={() => navigate('/contacts/'+property.owner.id)}>{property.owner.fullName}</span></div>}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-medium text-gray-700 mb-3 text-sm">Campaign Records ({property.campaignRecords?.length || 0})</h2>
        {property.campaignRecords?.length ? property.campaignRecords.map(r => (
          <div key={r.id} className="text-sm text-gray-600 mb-2 flex items-center justify-between">
            <span>{r.campaign?.name}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{r.status}</span>
          </div>
        )) : <p className="text-sm text-gray-400">No campaign records</p>}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-medium text-gray-700 mb-3 text-sm">Deals ({property.deals?.length || 0})</h2>
        {property.deals?.length ? property.deals.map(dp => (
          <div key={dp.deal.id} onClick={() => navigate('/deals/'+dp.deal.id)} className="text-sm text-orange-500 cursor-pointer hover:underline mb-1">
            {dp.deal.title} — {dp.deal.stage?.name}
          </div>
        )) : <p className="text-sm text-gray-400">No deals</p>}
      </div>
    </div>
  );
}
