export default function DealCard({ deal, onClick }) {
  const contact = deal.contacts?.[0]?.contact;
  const initials = contact ? ((contact.firstName || '')[0] || '') + ((contact.lastName || '')[0] || '') : '?';
  return (
    <div onClick={onClick} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
      <div className="font-medium text-gray-800 text-sm mb-2">{deal.title}</div>
      {contact && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-medium">{initials}</div>
          <span className="text-xs text-gray-500">{contact.fullName}</span>
        </div>
      )}
      {deal.estimatedValue && <div className="mt-2 text-xs font-medium text-green-600">${deal.estimatedValue.toLocaleString()}</div>}
    </div>
  );
}