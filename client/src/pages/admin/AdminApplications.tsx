import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, XCircle, Sparkles, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export const AdminApplications: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/applications');
      if (res.data.success) {
        setApps(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleReview = async (appId: string, action: 'APPROVE' | 'REJECT') => {
    let reason = '';
    if (action === 'REJECT') {
      const input = prompt('Please specify why this application was rejected:');
      if (input === null) return;
      reason = input.trim();
    }

    try {
      const res = await api.post(`/admin/applications/${appId}/review`, { action, reason });
      if (res.data.success) {
        alert(res.data.message);
        fetchApps();
      }
    } catch (err) {
      alert('Review action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Creator Partner Applications</h1>
        <p className="text-xs text-slate-400">Review pending creator onboarding submissions and grant Creator Studio access.</p>
      </div>

      <div className="bg-[#151824] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : apps.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <UserCheck className="w-10 h-10 mx-auto text-emerald-400" />
            <p className="text-sm font-bold text-white mt-2">No creator applications</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f111a] text-slate-400 border-b border-white/5 uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Creator Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Bio / Pitch</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {apps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">@{app.user?.username}</p>
                      <p className="text-[11px] text-slate-400">{app.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-purple-300">{app.creatorName}</td>
                    <td className="py-3.5 px-4">{app.category}</td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-300 line-clamp-2">{app.bio}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : app.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {app.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReview(app.id, 'REJECT')}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition text-[11px] font-bold"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleReview(app.id, 'APPROVE')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition text-[11px] font-bold shadow-md"
                          >
                            Approve Creator
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
