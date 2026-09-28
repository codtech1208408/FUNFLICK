import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Flame, PlusCircle, Compass, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MobileNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 glass-panel bg-[#090a0f]/90 border-t border-white/10 backdrop-blur-xl px-4 flex items-center justify-around">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? 'text-rose-500' : 'text-slate-400'}`
        }
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </NavLink>

      <NavLink
        to="/reels"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? 'text-rose-500' : 'text-slate-400'}`
        }
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Reels</span>
      </NavLink>

      <NavLink
        to={user?.role === 'CREATOR' || user?.role === 'ADMIN' ? '/creator/upload' : '/creator-apply'}
        className="flex flex-col items-center -mt-4"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-[#090a0f]">
          <PlusCircle className="w-6 h-6 text-white" />
        </div>
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? 'text-rose-500' : 'text-slate-400'}`
        }
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Explore</span>
      </NavLink>

      <NavLink
        to={user ? `/profile/${user.username}` : '/login'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${isActive ? 'text-rose-500' : 'text-slate-400'}`
        }
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Profile</span>
      </NavLink>
    </div>
  );
};
