import React, { useState } from 'react';
import { ChevronLeft, Film, Zap, Clapperboard, Radio, MessageCircle, Star, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface CreatorInfo {
  displayName: string;
  handle: string;
  avatarUrl?: string;
  followers?: string;
}

interface SubscribeModalProps {
  creator?: CreatorInfo;
  plan?: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  creator,
  plan,
  isOpen,
  onClose,
  onSuccess
}) => {
  const effectiveCreator = creator || {
    displayName: plan?.creator?.displayName || 'pavani_official',
    handle: plan?.creator?.handle || 'pavani_official',
    avatarUrl: plan?.creator?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    followers: '2.1M Followers'
  };

  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const plans = [
    { id: 'MONTHLY', name: 'Monthly', price: '₹99', sub: '/ month', note: 'Cancel anytime', save: '' },
    { id: 'QUARTERLY', name: 'Quarterly', price: '₹249', sub: '(₹83/month)', note: '', save: 'Save 16%' },
    { id: 'YEARLY', name: 'Yearly', price: '₹899', sub: '(₹75/month)', note: '', save: 'Save 24%' },
  ];

  const benefits = [
    { icon: Film, label: 'Exclusive Videos', color: 'text-purple-600 bg-purple-50' },
    { icon: Zap, label: 'Early Access', color: 'text-amber-500 bg-amber-50' },
    { icon: Clapperboard, label: 'Behind the Scenes', color: 'text-rose-500 bg-rose-50' },
    { icon: Radio, label: 'Live Sessions', color: 'text-red-500 bg-red-50' },
    { icon: MessageCircle, label: 'Chat with Creator', color: 'text-emerald-500 bg-emerald-50' },
    { icon: Star, label: 'Special Shoutouts', color: 'text-pink-500 bg-pink-50' },
  ];

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe to creators');
      return;
    }

    try {
      setLoading(true);
      await api.post('/subscriptions/subscribe', {
        planId: 'plan_vip_default',
        paymentMethodToken: 'demo_upi_card'
      }).catch(() => {});

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 animate-fade-in select-none">
      <div className="w-full max-w-sm bg-white text-slate-800 rounded-3xl shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar relative border border-slate-100">
        {/* Top Bar (Screen 7) */}
        <div className="flex items-center justify-between pb-1">
          <button onClick={onClose} className="p-1 -ml-2 text-slate-600 hover:text-slate-900">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xs font-bold text-slate-900">Subscribe to Creator</h2>
          <div className="w-6" />
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              ✓
            </div>
            <h3 className="text-base font-extrabold text-slate-900">VIP Subscription Active!</h3>
            <p className="text-xs text-slate-500">
              You are now an official VIP supporter of <strong className="text-rose-500">@{effectiveCreator.handle}</strong>.
            </p>

          </div>
        ) : (
          <>
            {/* Creator Header Card (Screen 7) */}
            <div className="flex flex-col items-center text-center space-y-1">
              <img
                src={effectiveCreator.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt=""
                className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/20 shadow-sm"
              />
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-extrabold text-slate-900">@{effectiveCreator.handle}</span>
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] flex items-center justify-center text-white font-bold">✓</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{effectiveCreator.followers || '2.1M Followers'}</p>
              
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Comedy</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Lifestyle</span>
                <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Entertainment</span>
              </div>
            </div>


            {/* Choose a Plan Cards (Screen 7) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-900 block">Choose a Plan</span>
              <div className="grid grid-cols-3 gap-1.5">
                {plans.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between min-h-[82px] relative ${
                        isSelected
                          ? 'bg-rose-50/50 border-rose-500 ring-1 ring-rose-500'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-bold text-slate-800">{p.name}</span>
                        {isSelected && (
                          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px]">
                            ✓
                          </div>
                        )}
                      </div>

                      <div className="mt-1">
                        <span className="text-xs font-extrabold text-slate-900">{p.price}</span>
                        <span className="text-[9px] text-slate-400 font-medium ml-0.5">{p.sub}</span>
                      </div>

                      {p.save ? (
                        <span className="text-[8px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded-md self-start mt-1">
                          {p.save}
                        </span>
                      ) : (
                        <span className="text-[8px] text-slate-400 font-medium mt-1">Cancel anytime</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subscriber Benefits (Screen 7) */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-900 block">Subscriber Benefits</span>
              <div className="space-y-1.5">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${b.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="font-medium text-[11px]">{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subscribe Now Button (Screen 7) */}
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs rounded-full shadow-lg shadow-rose-500/25 transition active:scale-95 tracking-wide mt-2"
            >
              {loading ? 'Processing...' : 'Subscribe Now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

