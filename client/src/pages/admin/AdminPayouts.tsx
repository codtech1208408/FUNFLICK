import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, DollarSign } from 'lucide-react';
import api from '../../services/api';

export const AdminPayouts: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/payouts');
      if (res.data.success) {
        setPayouts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleProcess = async (payoutId: string) => {
    try {
      const res = await api.post(`/admin/payouts/${payoutId}/process`, {
        status: 'PAID',
        transactionRef: `TXN-DISBURSE-${Date.now()}`
      });
      if (res.data.success) {
        alert('Payout marked as paid and creator credited.');
        fetchPayouts();
      }
    } catch (err) {
      alert('Failed to process payout');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Creator Payout Disbursements</h1>
        <p className="text-xs text-slate-400">Review creator withdrawal requests and approve banking transfers.</p>
      </div>

      <div className="bg-[#151824] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f111a] text-slate-400 border-b border-white/5 uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">Requested Amount</th>
                <th className="py-3.5 px-4">Payout Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No payout requests in ledger.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">@{p.creator?.user?.username}</p>
                      <p className="text-[11px] text-slate-400">{p.creator?.displayName}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                      ${(p.amountCents / 100).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{p.payoutMethod}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === 'PENDING' && (
                        <button
                          onClick={() => handleProcess(p.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition shadow-md"
                        >
                          Disburse Funds
                        </button>
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
