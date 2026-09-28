import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, Heart, Users, Coins, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const StudioDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="w-full h-full bg-[#090a0f] text-white flex flex-col p-4 pb-20 space-y-4 select-none overflow-y-auto no-scrollbar">
      {/* Top Bar (Screen 9) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 -ml-1 text-slate-300 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-bold text-white">Creator Dashboard</h1>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition flex items-center gap-1 text-[10px] font-bold"
          title="Log Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>


      {/* Creator Profile Chip (Screen 9: Pavani Official, Verified Creator) */}
      <div className="flex items-center justify-between bg-[#151824] p-3 rounded-2xl border border-white/5 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt=""
            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500/40 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">pavani_official</span>
              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] flex items-center justify-center font-bold text-white">
                ✓
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              Verified Creator
            </span>
          </div>
        </div>

        {/* Time Selector Dropdown (Screen 9) */}
        <div className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 border border-white/10 cursor-pointer transition">
          <span>{timeRange}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>

      {/* 4 KPI Metrics Grid (Screen 9: Total Views, Total Likes, Subscribers, Estimated Earnings) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Total Views */}
        <div className="bg-[#151824] p-3.5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-semibold text-slate-300">Total Views</span>
            <div className="w-6 h-6 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-white tracking-tight">12.5M</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            ↑ 12%
          </span>
        </div>

        {/* Total Likes */}
        <div className="bg-[#151824] p-3.5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-semibold text-slate-300">Total Likes</span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
            </div>
          </div>
          <p className="text-lg font-black text-white tracking-tight">856K</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            ↑ 8%
          </span>
        </div>

        {/* Subscribers */}
        <div className="bg-[#151824] p-3.5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-semibold text-slate-300">Subscribers</span>
            <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-white tracking-tight">24.3K</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            ↑ 15%
          </span>
        </div>

        {/* Estimated Earnings */}
        <div className="bg-[#151824] p-3.5 rounded-2xl border border-white/5 space-y-1 relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10.5px] font-semibold text-slate-300">Estimated Earnings</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-lg font-black text-white tracking-tight">₹45,320</p>
          <span className="text-[10px] text-emerald-400 font-bold block">
            ↑ 10%
          </span>
        </div>
      </div>
    </div>
  );
};

