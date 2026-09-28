import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, Video, ArrowRight, Flame, Compass, Lock } from 'lucide-react';
import { FunFlickLogo } from '../../components/common/FunFlickLogo';
import { useAuth } from '../../contexts/AuthContext';

export const WelcomeGatewayPage: React.FC = () => {
  const { quickLoginAs } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleUserLogin = () => {
    navigate('/login?role=USER');
  };

  const handleInfluencerLogin = () => {
    navigate('/login?role=CREATOR');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-center items-center px-6 py-8 pt-[env(safe-area-inset-top,32px)] pb-[env(safe-area-inset-bottom,40px)] bg-[#090a0f] text-slate-100 relative overflow-y-auto no-scrollbar select-none animate-fade-in">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md my-auto flex flex-col items-center space-y-8 z-10 py-4">
        {/* Top Brand Hero */}
        <div className="flex flex-col items-center text-center space-y-3 z-10">
          <FunFlickLogo size="lg" showWordmark={true} />
          <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed">
            The ultimate social platform for comedy, vertical reels & creator monetization.
          </p>
        </div>

        {/* Center Action Gateway Cards */}
        <div className="w-full space-y-4 z-10">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Choose How You Want to Enter
          </p>

        {/* 1. User / Viewer Login Button */}
        <button
          onClick={handleUserLogin}
          disabled={!!loadingRole}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white flex items-center justify-between shadow-xl shadow-rose-500/25 transition-all transform active:scale-95 group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">User Login</h3>
              <p className="text-[11px] text-rose-100 opacity-90">
                Watch comedy reels, like, comment & support creators
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {loadingRole === 'USER' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            )}
          </div>
        </button>

        {/* 2. Influencer / Creator Login Button */}
        <button
          onClick={handleInfluencerLogin}
          disabled={!!loadingRole}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-between shadow-xl shadow-purple-600/25 transition-all transform active:scale-95 group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold leading-tight">Influencer & Creator Login</h3>
                <span className="text-[9px] font-extrabold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full uppercase">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-purple-100 opacity-90">
                Upload sketches, view analytics & earn fan revenue
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {loadingRole === 'CREATOR' ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            )}
          </div>
        </button>

        {/* Guest Browse Option */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white font-semibold flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Browse as Guest</span>
          </button>

          <span className="text-slate-600">•</span>

          <button
            onClick={() => navigate('/login')}
            className="text-xs text-slate-400 hover:text-rose-400 font-semibold flex items-center gap-1.5 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Custom Password Login</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
};
