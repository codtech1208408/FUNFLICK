import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Bell,
  Users,
  Sparkles,
  Film,
  Crown,
  Banknote,
  CreditCard,
  Clock,
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [approvedList, setApprovedList] = useState<Record<string, string>>({});

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovedList((prev) => ({ ...prev, [id]: action }));
  };

  const kpis = [
    { label: 'Users', val: '12,540', icon: Users, color: 'bg-sky-500/15 text-sky-400' },
    { label: 'Creators', val: '1,830', icon: Sparkles, color: 'bg-orange-500/15 text-orange-400' },
    { label: 'Videos', val: '48,920', icon: Film, color: 'bg-purple-500/15 text-purple-400' },
    { label: 'Subscriptions', val: '25,430', icon: Crown, color: 'bg-rose-500/15 text-rose-400' },
    { label: 'Total Revenue', val: '₹12,45,320', icon: Banknote, color: 'bg-emerald-500/15 text-emerald-400' },
    { label: 'Creator Payments', val: '₹8,60,000', icon: CreditCard, color: 'bg-amber-500/15 text-amber-400' },
    { label: 'Pending Approvals', val: '320', icon: Clock, color: 'bg-amber-500/15 text-amber-300' },
    { label: 'Reported Content', val: '145', icon: AlertTriangle, color: 'bg-rose-500/15 text-rose-400' },
  ];

  return (
    <div className="w-full h-full bg-[#090a0f] text-white flex flex-col p-4 space-y-4 select-none overflow-y-auto no-scrollbar">
      {/* Top Bar (Screen 12: < Admin Panel and Notification Bell) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="p-1 -ml-1 text-slate-300 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-bold text-white">Admin Panel</h1>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="relative p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1 ring-2 ring-[#090a0f]" />
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>


      {/* 8 KPI Cards in 2 Columns Grid (Screen 12) */}
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-[#151824] p-3 rounded-2xl border border-white/5 flex items-center gap-2.5 shadow-sm"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9.5px] text-slate-400 font-semibold leading-tight truncate">{kpi.label}</p>
                <p className="text-xs font-black text-white mt-0.5 truncate">{kpi.val}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Videos for Approval Section (Screen 12) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-tight">Recent Videos for Approval</h3>
          <Link to="/admin/moderation" className="text-[10px] font-bold text-rose-400 hover:text-rose-300">
            See All &gt;
          </Link>
        </div>

        {/* Video Card with Approve / Reject */}
        <div className="flex items-center justify-between bg-[#151824] p-2.5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80"
              alt=""
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">Comedy Viral Video</h4>
              <p className="text-[10px] text-slate-400 truncate">by raju_creator</p>
              <span className="text-[9px] text-slate-500">2 hours ago</span>
            </div>
          </div>

          {/* Direct Action Buttons */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {approvedList['vid-1'] === 'approved' ? (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full">
                Approved ✓
              </span>
            ) : approvedList['vid-1'] === 'rejected' ? (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-3 py-1 rounded-full">
                Rejected ✗
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleAction('vid-1', 'approved')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition active:scale-95 shadow-xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction('vid-1', 'rejected')}
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition active:scale-95 shadow-xs"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

