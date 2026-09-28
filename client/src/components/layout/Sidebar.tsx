import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Flame,
  Compass,
  Bookmark,
  Heart,
  History,
  Crown,
  Sparkles,
  Video,
  ShieldCheck,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'Home Feed', icon: Home, exact: true },
    { to: '/reels', label: 'Reels & Shorts', icon: Flame },
    { to: '/explore', label: 'Explore & Search', icon: Compass },
    { to: '/subscriptions', label: 'VIP Fan Subscriptions', icon: Crown },
    { to: '/saved', label: 'Saved Videos', icon: Bookmark, authRequired: true },
    { to: '/liked', label: 'Liked Content', icon: Heart, authRequired: true },
    { to: '/history', label: 'Watch History', icon: History, authRequired: true },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 p-4 glass-panel border-r border-white/5 bg-[#090a0f]/60 backdrop-blur-lg justify-between overflow-y-auto">
      <div className="space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/10 text-white border border-rose-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Creator & Admin Portals */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Portals</p>

          {user?.role === 'CREATOR' || user?.role === 'ADMIN' ? (
            <NavLink
              to="/creator/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-purple-400 hover:bg-purple-500/10'
                }`
              }
            >
              <Video className="w-4 h-4" />
              <span>Creator Studio</span>
            </NavLink>
          ) : (
            <NavLink
              to="/creator-apply"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply for Creator</span>
            </NavLink>
          )}

          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`
              }
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Hub</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* User Status Card */}
      {user && (
        <div className="pt-4 border-t border-white/10">
          <NavLink
            to={`/profile/${user.username}`}
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition"
          >
            <img
              src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.profile?.fullName || user.username}</p>
              <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
            </div>
          </NavLink>
        </div>
      )}
    </aside>
  );
};
