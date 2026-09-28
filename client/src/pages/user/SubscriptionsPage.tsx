import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle2, ShieldCheck, User, ChevronLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { SubscribeModal } from '../../components/subscription/SubscribeModal';

export const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionsData = async () => {
    try {
      setLoading(true);
      const [plansRes, mySubsRes] = await Promise.all([
        api.get('/subscriptions/plans'),
        user ? api.get('/subscriptions/my-subscriptions') : Promise.resolve({ data: { data: [] } })
      ]);

      if (plansRes.data.success) setPlans(plansRes.data.data);
      if (mySubsRes.data.success) setMySubscriptions(mySubsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsData();
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar pb-8 bg-white text-slate-900 select-none">
      {/* Top Header Bar with Back Button */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-sm font-extrabold text-slate-900">VIP Subscriptions</h2>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-amber-500/15 via-rose-500/15 to-purple-500/15 p-6 rounded-3xl border border-amber-500/30 text-center space-y-2.5 relative overflow-hidden shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
            <Crown className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-lg font-black text-slate-900">FunFlick VIP Fan Subscriptions</h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Support your favorite comedy creators directly. Get exclusive bloopers, VIP badges next to your comments, and early video drops.
          </p>
        </div>

      {/* Active Subscriptions Section */}
      {user && mySubscriptions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> My Active VIP Passes ({mySubscriptions.length})
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {mySubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-[#151824] p-3 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={sub.creator?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${sub.plan?.name}`}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{sub.plan?.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">@{sub.creator?.handle || 'Creator'}</p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full text-center">
                  Expires {new Date(sub.expiresAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans Grid: 2 boxes per row */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-500" /> Explore Creator VIP Passes
        </h2>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {plans.map((plan) => {
              let perks: string[] = ['Ad-free reels', 'VIP Chat Badge', 'Early Video Drops'];
              try {
                if (plan.perksJson) perks = JSON.parse(plan.perksJson);
              } catch (e) {}

              return (
                <div
                  key={plan.id}
                  className="bg-[#151824] rounded-2xl border border-white/10 p-3.5 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-lg transition-all group"
                >
                  <div className="space-y-2.5">
                    {/* Creator Info */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={plan.creator?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${plan.name}`}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/30 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition leading-tight truncate">
                          {plan.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate">@{plan.creator?.handle || 'creator'}</p>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-[10px] text-slate-300 leading-snug line-clamp-2">
                      {plan.description || 'Unlock exclusive bloopers & member perks.'}
                    </p>

                    {/* Perks List */}
                    <div className="space-y-1 pt-1.5 border-t border-white/5">
                      {perks.slice(0, 2).map((perk, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-300 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          <span className="truncate">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="pt-3 mt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-white">₹{Math.round((plan.priceCents || 9900) / 100)}</span>
                      <span className="text-[9px] text-slate-400">/ mo</span>
                    </div>

                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-[11px] font-bold rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all text-center"
                    >
                      Join VIP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>

      {selectedPlan && (
        <SubscribeModal
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={fetchSubscriptionsData}
        />
      )}
    </div>
  );
};
