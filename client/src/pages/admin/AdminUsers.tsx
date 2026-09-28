import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Ban, CheckCircle, Search } from 'lucide-react';
import api from '../../services/api';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', { params: { search: search || undefined } });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${userId}`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Platform User Directory</h1>
          <p className="text-xs text-slate-400">Manage user accounts, roles, and safety suspension status.</p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search username or email..."
            className="w-full bg-[#151824] text-xs text-white pl-9 pr-3 py-2 rounded-full border border-white/10 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-[#151824] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f111a] text-slate-400 border-b border-white/5 uppercase text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Videos</th>
                <th className="py-3.5 px-4">Followers</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={u.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">@{u.username}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-white/10 px-2.5 py-1 rounded-full uppercase">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{u._count?.videos || 0}</td>
                  <td className="py-3.5 px-4 font-semibold">{u._count?.followers || 0}</td>
                  <td className="py-3.5 px-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
