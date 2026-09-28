import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Video, DollarSign, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const CreatorApplyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [creatorName, setCreatorName] = useState('');
  const [category, setCategory] = useState('Stand-up');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({ instagram: '', youtube: '', tiktok: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in before applying for creator access.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/creator/apply', {
        creatorName,
        category,
        bio,
        socialLinks
      });

      if (res.data.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar bg-[#090a0f] text-slate-100 select-none pb-8">
      {/* Top Header Bar with Back Button */}
      <div className="sticky top-0 z-30 bg-[#090a0f]/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-sm font-extrabold text-white">Creator Studio Application</h2>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> FunFlick Creator Partner Program
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Turn Your Comedy & Creativity into <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400">Real Earnings</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Join thousands of comedians, sketch artists, and content creators. Access YouTube-Studio-style tools, video analytics, fan subscriptions, and direct monetization.
          </p>
        </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#151824] p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Creator Studio Panel</h3>
          <p className="text-xs text-slate-400">Upload in HD, draft skits, track real-time analytics, views, and viewer completion rates.</p>
        </div>

        <div className="bg-[#151824] p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Fan VIP Subscriptions</h3>
          <p className="text-xs text-slate-400">Keep 80% of all monthly fan subscription revenue with transparent instant ledger tracking.</p>
        </div>

        <div className="bg-[#151824] p-5 rounded-3xl border border-white/10 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Verified Badge</h3>
          <p className="text-xs text-slate-400">Earn priority feed distribution and official verified creator status across FunFlick.</p>
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-[#151824] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl max-w-2xl mx-auto">
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">Application Received! 🎉</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our admin review team is inspecting your application. You will receive an in-app notification once approved with immediate Creator Studio access.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2.5 bg-rose-500 text-white text-xs font-bold rounded-full"
            >
              Back to Home Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-base font-bold text-white pb-3 border-b border-white/10">
              Creator Application Form
            </h2>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator / Channel Name</label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Sam Miller Comedy, The Laugh Lab"
                className="w-full bg-[#0f111a] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Comedy Genre</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0f111a] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
              >
                <option value="Stand-up">Stand-up Comedy</option>
                <option value="Sketches">Sketches & Skits</option>
                <option value="Memes & Edits">Memes & Viral Edits</option>
                <option value="Pranks & Street">Pranks & Street Humour</option>
                <option value="Parodies">Parodies & Voiceovers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Creator Bio & Pitch</label>
              <textarea
                required
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about the comedy content you create and your audience..."
                className="w-full bg-[#0f111a] text-xs text-white px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Existing Social Links (Optional)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Instagram Handle (e.g. @mycomedy)"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                  className="bg-[#0f111a] text-xs text-white px-4 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
                />
                <input
                  type="text"
                  placeholder="YouTube Channel Name"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                  className="bg-[#0f111a] text-xs text-white px-4 py-2.5 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting Application...' : 'Submit Application for Review'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
  );
};
