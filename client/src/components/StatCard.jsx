export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-800">{value ?? <span className="text-gray-300">No Data</span>}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}
