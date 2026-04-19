import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault(); setErr('');
    try {
      const r = await api.post('/auth/login', form);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      navigate('/dashboard');
    } catch { setErr('Invalid email or password'); }
  };
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
          <span className="text-xl font-semibold text-gray-800">REI CRM</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>
        {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">Sign in</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">No account? <Link to="/register" className="text-orange-500 hover:underline">Register</Link></p>
      </div>
    </div>
  );
}
