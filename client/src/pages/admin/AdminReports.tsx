import React, { useState, useEffect } from 'react';
import { Flag, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (reportId: string, action: 'RESOLVED' | 'DISMISSED') => {
    try {
      await api.post(`/admin/reports/${reportId}/resolve`, {
        status: action,
        actionTaken: action === 'RESOLVED' ? 'Action taken against content' : 'Dismissed as false report'
      });
      fetchReports();
    } catch (err) {
      alert('Failed to update report');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Reported Content Review</h1>
        <p className="text-xs text-slate-400">Handle user complaints regarding inappropriate comedy content or harassment.</p>
      </div>

      <div className="bg-[#151824] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f111a] text-slate-400 border-b border-white/5 uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Reporter</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No active user reports filed.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3.5 px-4 font-bold text-white">@{r.reporter?.username}</td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{r.targetType}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{r.reason}</td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-400 truncate">{r.details || 'No details'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {r.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResolve(r.id, 'DISMISSED')}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg text-[10px] font-semibold transition"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleResolve(r.id, 'RESOLVED')}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition shadow-md"
                          >
                            Resolve / Block
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
