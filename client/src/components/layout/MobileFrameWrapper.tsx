import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Plus,
  MessageSquare,
  User,
  LayoutDashboard,
  Film,
  BarChart2,
  Wallet,
  MoreHorizontal,
  Users,
  CreditCard,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
  hideNav?: boolean;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  children,
  theme = 'dark',
  hideNav = false
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState('9:41');

  // Live status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const path = location.pathname;
  const isCreatorRoute = path.startsWith('/creator');
  const isAdminRoute = path.startsWith('/admin');
  const isSplashOrAuth = path === '/login' || path === '/register' || path === '/welcome';
  const isLightPage = path === '/explore' || path.startsWith('/profile') || path === '/subscriptions';

  // Choose bg based on route
  const frameBg = isLightPage && !isCreatorRoute && !isAdminRoute ? 'bg-white text-slate-900' : 'bg-[#090a0f] text-slate-100';
  const statusBarColor = isLightPage && !isCreatorRoute && !isAdminRoute ? 'text-slate-900' : 'text-white';
  const statusIconColor = isLightPage && !isCreatorRoute && !isAdminRoute ? 'text-slate-700' : 'text-slate-300';
  const homeBarColor = isLightPage && !isCreatorRoute && !isAdminRoute ? 'bg-slate-300' : 'bg-white/30';

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-slate-100 flex items-center justify-center p-0 sm:p-4 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Pure Smartphone Device Frame */}
      <div
        id="app-mobile-frame"
        className={`relative w-full sm:max-w-[420px] h-screen sm:h-[860px] sm:max-h-[94vh] sm:rounded-[48px] sm:border-[10px] sm:border-[#1c2030] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(244,63,94,0.2)] sm:ring-1 sm:ring-white/20 ${frameBg} flex flex-col overflow-hidden transition-colors duration-200`}
      >
        {/* Smartphone Hardware Buttons Accents on sides */}
        <div className="hidden sm:block absolute -left-[14px] top-28 w-[4px] h-10 bg-slate-700 rounded-l-md pointer-events-none" />
        <div className="hidden sm:block absolute -left-[14px] top-44 w-[4px] h-12 bg-slate-700 rounded-l-md pointer-events-none" />
        <div className="hidden sm:block absolute -right-[14px] top-32 w-[4px] h-14 bg-slate-700 rounded-r-md pointer-events-none" />

        {/* Smartphone Status Bar & Dynamic Island */}
        <div className={`h-10 px-6 pt-1 flex items-center justify-between z-40 ${statusBarColor} flex-shrink-0 relative`}>
          <span className="text-[12px] font-bold tracking-tight">{currentTime}</span>

          {/* Dynamic Island / Camera Pill */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 h-5 w-24 bg-black rounded-full border border-white/10 flex items-center justify-end px-2 gap-1.5 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0a1128] border border-[#1e293b]" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Status Icons */}
          <div className={`flex items-center gap-1.5 ${statusIconColor}`}>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Inner Phone Screen Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* Docked In-Phone Bottom Navigation Bar (Instagram Style) */}
        {!hideNav && !isSplashOrAuth && (
          <div
            className={`h-14 px-2 flex items-center justify-around flex-shrink-0 z-30 ${
              isCreatorRoute || isAdminRoute
                ? 'bg-[#090a0f]/95 border-t border-white/10 text-slate-400'
                : 'bg-black border-t border-white/10 text-white shadow-lg'
            } backdrop-blur-xl`}
          >
            {/* 1. CREATOR NAV BAR (Screens 9, 10, 11) */}
            {isCreatorRoute ? (
              <>
                <NavLink
                  to="/creator/dashboard"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px]">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/creator/content"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Film className="w-5 h-5" />
                  <span className="text-[10px]">Videos</span>
                </NavLink>

                <NavLink
                  to="/creator/analytics"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <BarChart2 className="w-5 h-5" />
                  <span className="text-[10px]">Analytics</span>
                </NavLink>

                <NavLink
                  to="/creator/earnings"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-[10px]">Earnings</span>
                </NavLink>

                <NavLink
                  to="/"
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-[10px]">More</span>
                </NavLink>
              </>
            ) : isAdminRoute ? (
              /* 2. ADMIN NAV BAR (Screen 12) */
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px]">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Users className="w-5 h-5" />
                  <span className="text-[10px]">Users</span>
                </NavLink>

                <NavLink
                  to="/admin/moderation"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <Film className="w-5 h-5" />
                  <span className="text-[10px]">Videos</span>
                </NavLink>

                <NavLink
                  to="/admin/payouts"
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 ${
                      isActive ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`
                  }
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px]">Payments</span>
                </NavLink>

                <NavLink
                  to="/"
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-[10px]">More</span>
                </NavLink>
              </>
            ) : (
              /* 3. USER APP NAV BAR (Instagram Standard 5 Icons: Home, Search, Create +, Reels, Profile) */
              <div className="w-full flex items-center justify-around px-2">
                {/* 1. Home */}
                <NavLink
                  to="/"
                  className="p-2 text-white flex items-center justify-center transition active:scale-90"
                  title="Home"
                >
                  {({ isActive }) =>
                    isActive || path === '/' || path === '/feed' ? (
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2.09961L1 12H4V21C4 21.5523 4.44772 22 5 22H10V16H14V22H19C19.5523 22 20 21.5523 20 21V12H23L12 2.09961Z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                        <path d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H15V15.5H9V21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z" />
                      </svg>
                    )
                  }
                </NavLink>

                {/* 2. Search / Explore */}
                <NavLink
                  to="/explore"
                  className="p-2 text-white flex items-center justify-center transition active:scale-90"
                  title="Search & Explore"
                >
                  {({ isActive }) => (
                    <svg
                      className={`w-6 h-6 stroke-white fill-none ${isActive || path === '/explore' ? 'stroke-[2.8]' : 'stroke-[2.2]'}`}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="10.5" cy="10.5" r="6.5" />
                      <line x1="15.5" y1="15.5" x2="21" y2="21" />
                    </svg>
                  )}
                </NavLink>

                {/* 3. Create / Plus (+) Button */}
                <NavLink
                  to={user?.role === 'CREATOR' || user?.role === 'ADMIN' ? '/creator/upload' : '/creator-apply'}
                  className="p-2 text-white flex items-center justify-center transition active:scale-90"
                  title="Create & Upload"
                >
                  {({ isActive }) => (
                    <svg
                      className={`w-6 h-6 stroke-white ${isActive || path === '/creator/upload' || path === '/creator-apply' ? 'fill-white/20' : 'fill-none'} stroke-[2]`}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  )}
                </NavLink>

                {/* 4. Reels */}
                <NavLink
                  to="/reels"
                  className="p-2 text-white flex items-center justify-center transition active:scale-90"
                  title="Reels"
                >
                  {({ isActive }) => (
                    <svg
                      className={`w-6 h-6 stroke-white ${isActive || path === '/reels' ? 'fill-white/20' : 'fill-none'} stroke-[2]`}
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <path d="M9.5 8.5L15.5 12L9.5 15.5V8.5Z" fill="white" stroke="none" />
                      <line x1="3" y1="8" x2="8" y2="3" />
                      <line x1="8" y1="21" x2="21" y2="8" />
                    </svg>
                  )}
                </NavLink>

                {/* 5. User Profile Avatar */}
                <NavLink
                  to={user ? `/profile/${user.username}` : '/profile/srilatha_16'}
                  className="p-1 flex items-center justify-center transition active:scale-90"
                  title="Profile"
                >
                  {({ isActive }) => (
                    <div
                      className={`w-7 h-7 rounded-full overflow-hidden p-[1.5px] transition-all ${
                        isActive || path.startsWith('/profile')
                          ? 'ring-2 ring-white scale-105'
                          : 'ring-1 ring-white/60 hover:ring-white'
                      }`}
                    >
                      <img
                        src={
                          user?.profile?.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-slate-800"
                      />
                    </div>
                  )}
                </NavLink>
              </div>
            )}
          </div>
        )}

        {/* Smartphone Bottom Home Bar */}
        <div className={`h-4 ${frameBg} flex items-center justify-center flex-shrink-0 transition-colors duration-200`}>
          <div className={`w-32 h-1 ${homeBarColor} rounded-full`} />
        </div>
      </div>
    </div>
  );
};

