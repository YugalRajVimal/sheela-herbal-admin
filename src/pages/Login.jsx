import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      if (!data.success) throw new Error(data.message || 'Login failed');
      if (data.user?.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return;
      }
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-800/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-green-800 to-green-900 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-700/50 rounded-2xl mb-4 border border-green-600/30">
              <Leaf size={28} className="text-yellow-400" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Sheela Herbal</h1>
            <p className="text-green-300 text-sm mt-1 font-medium tracking-wide">Admin Dashboard</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">Sign in to continue</h2>

            <div className="space-y-4">
              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="admin@sheelaherbal.com"
                    className={`form-input pl-9 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••••"
                    className={`form-input pl-9 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {loading ? <LoadingSpinner /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Restricted access — authorised personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
