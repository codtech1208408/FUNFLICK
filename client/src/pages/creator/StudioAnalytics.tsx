import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Eye, Heart, MessageCircle, Users } from 'lucide-react';
import api from '../../services/api';

export const StudioAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/creator/dashboard')
      .then((res) => {
        if (res.data.success) setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Channel Analytics & Audience Insights</h1>
        <p className="text-xs text-slate-400">Discover which comedy sketches drive the highest engagement and subscriptions.</p>
      </div>

      {/* Engagement Ratio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Audience Retention Rate</span>
          <p className="text-3xl font-black text-white">84.2%</p>
          <p className="text-[11px] text-emerald-400">High average watch completion on Reels</p>
        </div>

        <div className="bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Like-to-View Ratio</span>
          <p className="text-3xl font-black text-rose-500">12.8%</p>
          <p className="text-[11px] text-slate-400">Above industry social standard (8%)</p>
        </div>

        <div className="bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400">VIP Conversion Rate</span>
          <p className="text-3xl font-black text-amber-400">3.4%</p>
          <p className="text-[11px] text-slate-400">Viewers converted to paying VIP fans</p>
        </div>
      </div>

      {/* Visual Activity Bars (Responsive Pure CSS Graph) */}
      <div className="bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" /> 7-Day Traffic & Views Activity
        </h2>

        <div className="h-48 flex items-end justify-between gap-2 pt-8 px-2 border-b border-white/10">
          {[
            { day: 'Mon', views: '1.2k', height: '40%' },
            { day: 'Tue', views: '2.4k', height: '65%' },
            { day: 'Wed', views: '1.8k', height: '50%' },
            { day: 'Thu', views: '3.9k', height: '85%' },
            { day: 'Fri', views: '4.5k', height: '95%' },
            { day: 'Sat', views: '5.2k', height: '100%' },
            { day: 'Sun', views: '3.1k', height: '70%' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] text-purple-300 font-bold opacity-0 group-hover:opacity-100 transition">
                {bar.views}
              </span>
              <div
                style={{ height: bar.height }}
                className="w-full max-w-[36px] bg-gradient-to-t from-purple-600 to-rose-500 rounded-t-xl transition-all group-hover:scale-105"
              />
              <span className="text-[11px] text-slate-400 font-semibold">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
