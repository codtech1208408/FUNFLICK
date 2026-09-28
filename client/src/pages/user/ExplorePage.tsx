import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Play, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { name: 'Comedy', icon: '😄', color: 'bg-amber-400 text-amber-950', ring: 'ring-amber-200' },
    { name: 'Entertainment', icon: '🎭', color: 'bg-orange-400 text-orange-950', ring: 'ring-orange-200' },
    { name: 'Dance', icon: '💃', color: 'bg-rose-400 text-rose-950', ring: 'ring-rose-200' },
    { name: 'Music', icon: '🎵', color: 'bg-purple-400 text-purple-950', ring: 'ring-purple-200' },
    { name: 'Lifestyle', icon: '✨', color: 'bg-sky-400 text-sky-950', ring: 'ring-sky-200' }
  ];

  const trendingVideos = [
    {
      id: 'trend-1',
      title: 'Office Comedy',
      tag: '#comedy',
      views: '2.4M',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'trend-2',
      title: 'Relatable Moments',
      tag: '#comedy',
      views: '1.1M',
      thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'trend-3',
      title: 'Friends Forever',
      tag: '#entertainment',
      views: '950K',
      thumb: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=300&q=80'
    }
  ];

  const popularCreators = [
    {
      id: 'c-1',
      rank: 1,
      name: 'Pavani Reddy',
      handle: 'pavani_official',
      category: 'Stand-up & Sketches',
      followers: '2.8M',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    {
      id: 'c-2',
      rank: 2,
      name: 'Fun Bros Comedy',
      handle: 'fun_bros',
      category: 'Street Pranks',
      followers: '1.6M',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    {
      id: 'c-3',
      rank: 3,
      name: 'Comedy Raju',
      handle: 'comedy_raju',
      category: 'Viral Relatable Skits',
      followers: '1.1M',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: false
    },
    {
      id: 'c-4',
      rank: 4,
      name: 'Chill Mammu',
      handle: 'chill_mammu',
      category: 'Memes & Voiceovers',
      followers: '950K',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      isVerified: false
    },
    {
      id: 'c-5',
      rank: 5,
      name: 'Sam Miller',
      handle: 'standup_sam',
      category: 'Comedy Club Live',
      followers: '820K',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  ];

  const filteredCreators = searchQuery.trim()
    ? popularCreators.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularCreators;

  return (
    <div className="w-full h-full bg-white text-slate-800 flex flex-col overflow-y-auto no-scrollbar select-none p-4 space-y-5 pb-20">
      {/* Search Input Bar (Screen 4) */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos, creators, hashtags..."
          className="w-full bg-[#f1f3f7] text-slate-800 text-xs placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-full border border-slate-200/80 focus:outline-none focus:border-rose-400 transition"
        />
      </div>

      {/* Hero Banner: Trending Comedy Videos (Screen 4) */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-amber-500 p-4 text-white flex items-center justify-between shadow-lg shadow-purple-500/15 min-h-[115px]">
        <div className="space-y-1 z-10 max-w-[65%]">
          <h2 className="text-base sm:text-lg font-black leading-tight drop-shadow">
            Trending Comedy <br />
            Videos
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-amber-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Top Picks of the Day</span>
          </div>
        </div>

        {/* Hero Comedian Image */}
        <div className="absolute right-2 bottom-0 top-0 w-32 flex items-end justify-center pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
            alt=""
            className="w-24 h-28 object-cover rounded-t-2xl drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Categories Row (Screen 4: Comedy, Entertainment, Dance, Music, Lifestyle) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center gap-1.5 flex-1 min-w-[56px] group"
          >
            <div
              className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform`}
            >
              <span>{cat.icon}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-700 tracking-tight text-center truncate">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* Trending Now Section (Screen 4) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">Trending Now</h3>
          <Link to="/reels" className="text-[11px] font-bold text-rose-500 hover:text-rose-600">
            See All &gt;
          </Link>
        </div>

        {/* 3 Video Cards */}
        <div className="grid grid-cols-3 gap-2">
          {trendingVideos.map((vid) => (
            <Link
              key={vid.id}
              to="/"
              className="group flex flex-col space-y-1"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 shadow-sm">
                <img
                  src={vid.thumb}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                  <Play className="w-2 h-2 fill-white text-white" />
                  <span>{vid.views}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-900 truncate leading-tight">{vid.title}</p>
                <p className="text-[9px] text-slate-400 truncate">{vid.tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Creators Section in Clean Sequence (Screen 4) */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">Popular Creators</h3>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">
              Ranked
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {filteredCreators.length} Creators
          </span>
        </div>

        {/* Sequential Creator Profiles List */}
        <div className="space-y-2">
          {filteredCreators.map((creator) => {
            const isFollowing = !!followingMap[creator.id];
            return (
              <div
                key={creator.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition shadow-2xs group"
              >
                {/* Left: Sequence Rank Badge + Avatar + Info */}
                <Link
                  to={`/profile/${creator.handle}`}
                  className="flex items-center gap-3 min-w-0 flex-1 pr-2"
                >
                  {/* Sequence Number */}
                  <div className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                    {creator.rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-xs group-hover:scale-105 transition"
                    />
                    {creator.isVerified && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-500 rounded-full text-white text-[8px] font-black flex items-center justify-center ring-1 ring-white">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate group-hover:text-rose-600 transition">
                      {creator.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      @{creator.handle} • <span className="text-rose-500 font-bold">{creator.followers}</span>
                    </p>
                  </div>
                </Link>

                {/* Right: Follow Action Button */}
                <button
                  onClick={() => toggleFollow(creator.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-xs flex-shrink-0 active:scale-95 ${
                    isFollowing
                      ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

