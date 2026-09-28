import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface ReportModalProps {
  targetId: string;
  targetType: 'VIDEO' | 'POST' | 'COMMENT' | 'USER';
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ targetId, targetType, isOpen, onClose }) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('INAPPROPRIATE');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to report content');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/social/report', {
        targetType,
        targetId,
        reason,
        details
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-[#151824] rounded-3xl border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" /> Report Content
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              ✓
            </div>
            <p className="text-sm font-bold text-white">Report Submitted</p>
            <p className="text-xs text-slate-400">Our safety & moderation team will review this shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#0f111a] text-xs text-white p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
              >
                <option value="INAPPROPRIATE">Inappropriate / Explicit Content</option>
                <option value="HARASSMENT">Harassment or Bullying</option>
                <option value="SPAM">Spam or Misleading Info</option>
                <option value="COPYRIGHT">Copyright Infringement</option>
                <option value="DANGEROUS">Dangerous Stunts / Self-Harm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Additional Details (Optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what violates community safety standards..."
                rows={3}
                className="w-full bg-[#0f111a] text-xs text-white p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-red-600/20 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Report to Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
