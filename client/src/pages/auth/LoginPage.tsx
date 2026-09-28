import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Smartphone, Lock, Eye, EyeOff, Check, User, Video, ShieldCheck, ArrowLeft } from 'lucide-react';
import { FunFlickLogo } from '../../components/common/FunFlickLogo';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const [isSignUp, setIsSignUp] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPageTitle = () => {
    if (isSignUp) return 'Create Account';
    if (roleParam === 'CREATOR') return 'Influencer & Creator Login';
    if (roleParam === 'ADMIN') return 'Admin Portal Login';
    return 'User Login';
  };

  const getPageSubtitle = () => {
    if (isSignUp) return 'Sign up to start watching, creating & sharing reels';
    if (roleParam === 'CREATOR') return 'Enter your creator credentials to access Creator Studio';
    if (roleParam === 'ADMIN') return 'Enter administrator credentials to access Admin Panel';
    return 'Enter your mobile/email & password to continue';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in both identifier and password.');
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        const username = identifier.includes('@') ? identifier.split('@')[0] : identifier;
        const res = await api.post('/auth/register', {
          fullName: fullName || username,
          username,
          email: identifier.includes('@') ? identifier : `${identifier}@funflick.com`,
          mobile: identifier.includes('@') ? undefined : `${countryCode}${identifier.replace(/\D/g, '')}`,
          password
        });
        if (res.data.success) {
          login(res.data.token, res.data.user);
          if (res.data.user.role === 'CREATOR') {
            navigate('/creator/dashboard');
          } else if (res.data.user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        const res = await api.post('/auth/login', { identifier, password });
        if (res.data.success) {
          login(res.data.token, res.data.user);
          if (res.data.user.role === 'CREATOR' || roleParam === 'CREATOR') {
            navigate('/creator/dashboard');
          } else if (res.data.user.role === 'ADMIN' || roleParam === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between px-6 py-6 pt-[env(safe-area-inset-top,24px)] pb-[env(safe-area-inset-bottom,32px)] bg-[#090a0f] text-slate-100 select-none overflow-y-auto no-scrollbar animate-fade-in">
      {/* Top Mini Brand Logo & Back Button */}
      <div className="flex items-center justify-between pt-1 max-w-md mx-auto w-full">
        <button
          onClick={() => navigate('/welcome')}
          className="p-1.5 rounded-full bg-[#151824] text-slate-400 hover:text-white border border-white/5 transition"
          title="Back to Welcome"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <FunFlickLogo size="sm" showWordmark={true} />
        <div className="w-7" />
      </div>

      {/* Main Form Section */}
      <div className="space-y-4 my-auto max-w-md mx-auto w-full py-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-white">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-400">
            {getPageSubtitle()}
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#151824] text-xs text-white placeholder-slate-400 px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* Mobile / Identifier Input with Visible Country Code */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#151824] rounded-2xl border border-white/10 px-2.5 py-3 text-xs text-white flex-shrink-0 focus-within:border-rose-500">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-xs text-white font-bold outline-none cursor-pointer pr-1"
              >
                <option value="+91" className="bg-[#151824] text-white">🇮🇳 +91</option>
                <option value="+1" className="bg-[#151824] text-white">🇺🇸 +1</option>
                <option value="+44" className="bg-[#151824] text-white">🇬🇧 +44</option>
                <option value="+971" className="bg-[#151824] text-white">🇦🇪 +971</option>
                <option value="+61" className="bg-[#151824] text-white">🇦🇺 +61</option>
                <option value="+65" className="bg-[#151824] text-white">🇸🇬 +65</option>
                <option value="+966" className="bg-[#151824] text-white">🇸🇦 +966</option>
                <option value="+49" className="bg-[#151824] text-white">🇩🇪 +49</option>
                <option value="+33" className="bg-[#151824] text-white">🇫🇷 +33</option>
              </select>
            </div>

            <div className="relative flex-1 flex items-center bg-[#151824] rounded-2xl border border-white/10 px-3.5 focus-within:border-rose-500">
              <Smartphone className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Mobile Number / Email"
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="relative flex items-center bg-[#151824] rounded-2xl border border-white/10 px-3.5 focus-within:border-rose-500">
              <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 py-3 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] pt-1 px-1">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#151824] border-white/20 text-rose-500 focus:ring-0"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Password reset instructions sent to your email/mobile.')}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Gradient Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs shadow-xl shadow-rose-500/25 transition-all active:scale-95 flex items-center justify-center tracking-wider uppercase mt-2"
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
      </div>

      {/* Bottom Switch: Sign Up / Login */}
      <div className="text-center text-xs text-slate-400 pt-3">
        {isSignUp ? (
          <span>
            Already have an account?{' '}
            <button onClick={() => setIsSignUp(false)} className="text-rose-400 font-bold hover:underline">
              Login
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{' '}
            <button onClick={() => setIsSignUp(true)} className="text-sky-400 font-bold hover:underline">
              Sign Up
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
