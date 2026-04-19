import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', teamName: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const submit = async e => {
    e.preventDefault(); setErr('');
    try {
      const r = await api.post('/auth/register', form);
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));
      navigate('/dashboard');
    } catch(ex) { setErr(ex.response?.data?.error || 'Registration failed'); }
  };
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
          <span className="text-xl font-semibold text-gray-800">REI CRM</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create account</h1>
        {err && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input required value={form.firstName} onChange={set('firstName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
            <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input required value={form.lastName} onChange={set('lastName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Company / Team name</label>
            <input value={form.teamName} onChange={set('teamName')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={set('password')} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" /></div>
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors mt-2">Create account</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">Have an account? <Link to="/login" className="text-orange-500 hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
