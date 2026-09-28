import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChart3 } from 'lucide-react';

export const StudioEarnings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'subs'>('overview');

  const recentEarnings = [
    {
      id: 'e1',
      title: 'Comedy Video #102',
      date: 'Aug 20, 2024',
      amount: '₹5,000',
      status: 'Partially Paid',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'e2',
      title: 'Funny Moments',
      date: 'Aug 15, 2024',
      amount: '₹3,000',
      status: 'Paid',
      thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'e3',
      title: 'Travel Comedy',
      date: 'Aug 10, 2024',
      amount: '₹4,000',
      status: 'Paid',
      thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="w-full h-full bg-[#090a0f] text-white flex flex-col p-4 pb-20 space-y-4 select-none overflow-y-auto no-scrollbar">
      {/* Top Bar (Screen 11: < Earnings and Withdraw button) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/creator/dashboard')} className="p-1 -ml-1 text-slate-300 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-bold text-white">Earnings</h1>
        </div>

        <button
          onClick={() => alert('Withdrawal request initiated!')}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-md shadow-purple-500/20 active:scale-95 transition"
        >
          Withdraw
        </button>
      </div>

      {/* Tabs: Overview, Video Earnings, Subscriptions (Screen 11) */}
      <div className="flex items-center gap-2 bg-[#151824] p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'overview'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'video'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Video Earnings
        </button>

        <button
          onClick={() => setActiveTab('subs')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'subs'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Subscriptions
        </button>
      </div>

      {/* Total Earnings Hero Card (Screen 11) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-700 via-rose-600 to-amber-500 p-5 text-white shadow-xl shadow-rose-500/15 overflow-hidden">
        <div className="space-y-1 z-10 relative">
          <span className="text-[11px] font-semibold text-white/80">Total Earnings</span>
          <h2 className="text-2xl font-black tracking-tight text-white">₹1,25,430</h2>
        </div>

        {/* Bar chart icon overlay */}
        <div className="absolute right-4 bottom-4 text-white/30">
          <BarChart3 className="w-12 h-12" />
        </div>
      </div>

      {/* 2 Sub Metric Cards (Screen 11: Pending Earnings, Paid Earnings) */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Pending Earnings */}
        <div className="bg-[#151824] p-3 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[10px] text-slate-400 font-semibold">Pending Earnings</span>
          </div>
          <p className="text-sm font-extrabold text-white">₹25,000</p>
        </div>

        {/* Paid Earnings */}
        <div className="bg-[#151824] p-3 rounded-2xl border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-400 font-semibold">Paid Earnings</span>
          </div>
          <p className="text-sm font-extrabold text-white">₹1,00,430</p>
        </div>
      </div>

      {/* Recent Earnings Section (Screen 11) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white tracking-tight">Recent Earnings</h3>
          <button className="text-[10px] font-bold text-rose-400 hover:text-rose-300">
            See All &gt;
          </button>
        </div>

        {/* List items */}
        <div className="space-y-2">
          {recentEarnings.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-[#151824] p-2.5 rounded-2xl border border-white/5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.thumb}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[10px] text-slate-400">{item.date}</p>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-xs font-black text-emerald-400 block">{item.amount}</span>
                <span
                  className={`inline-block text-[8.5px] font-bold px-1.5 py-0.2 rounded-md ${
                    item.status === 'Paid'
                      ? 'text-emerald-300 bg-emerald-500/15'
                      : 'text-purple-300 bg-purple-500/15'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

