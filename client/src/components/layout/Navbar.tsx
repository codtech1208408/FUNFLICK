import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  Video,
  LogOut,
  User as UserIcon,
  Crown,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { FunFlickLogo } from '../common/FunFlickLogo';

export const Navbar: React.FC = () => {
  const { user, logout, quickLoginAs } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#090a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <FunFlickLogo size="md" />
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comedy skits, reels, creators, #hashtags..."
              className="w-full bg-[#151824] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-white/10 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>
        </form>

        {/* Action Controls & Profile Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#151824] px-2 py-1 rounded-full border border-white/10 text-xs">
            <span className="text-slate-400 font-medium px-1">Switch:</span>
            <button
              onClick={() => quickLoginAs('USER')}
              className={`px-2 py-0.5 rounded-full font-medium transition ${
                user?.role === 'USER' ? 'bg-rose-500 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              User
            </button>
            <button
              onClick={() => quickLoginAs('CREATOR')}
              className={`px-2 py-0.5 rounded-full font-medium transition ${
                user?.role === 'CREATOR' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Creator
            </button>
            <button
              onClick={() => quickLoginAs('ADMIN')}
              className={`px-2 py-0.5 rounded-full font-medium transition ${
                user?.role === 'ADMIN' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {user ? (
            <>
              {/* Creator Studio Shortcut Button */}
              {user.role === 'CREATOR' || user.role === 'ADMIN' ? (
                <Link
                  to="/creator/dashboard"
                  className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md shadow-purple-500/20 transition-transform active:scale-95"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Creator Studio</span>
                </Link>
              ) : (
                <Link
                  to="/creator-apply"
                  className="hidden sm:flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold px-3 py-1.5 rounded-full transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Become Creator</span>
                </Link>
              )}

              {/* Admin Panel Shortcut Button */}
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3 py-1.5 rounded-full transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Notifications Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white relative transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-dropdown rounded-2xl shadow-2xl p-4 z-50 border border-white/10 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllAsRead()}
                          className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No notifications yet. You're all caught up!
                        </div>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => !n.isRead && markAsRead(n.id)}
                            className={`py-3 px-2 flex items-start gap-3 rounded-xl transition cursor-pointer ${
                              n.isRead ? 'opacity-70 hover:bg-white/5' : 'bg-rose-500/10 hover:bg-rose-500/15'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border border-white/10">
                              {n.actor?.profile?.avatarUrl ? (
                                <img
                                  src={n.actor.profile.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Sparkles className="w-4 h-4 text-rose-400 m-2" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {!n.isRead && <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 flex-shrink-0" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition border border-white/10"
                >
                  <img
                    src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40"
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-2xl p-2 z-50 border border-white/10 animate-fade-in">
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.profile?.fullName || user.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/10 text-rose-400 uppercase">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10 rounded-xl transition"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      {(user.role === 'CREATOR' || user.role === 'ADMIN') && (
                        <Link
                          to="/creator/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-purple-300 hover:bg-purple-500/10 rounded-xl transition"
                        >
                          <Video className="w-4 h-4 text-purple-400" />
                          <span>Creator Studio</span>
                        </Link>
                      )}

                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/subscriptions"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-amber-300 hover:bg-amber-500/10 rounded-xl transition"
                      >
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>VIP Passes & Subscriptions</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-full transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full shadow-lg shadow-rose-500/25 transition-transform active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
