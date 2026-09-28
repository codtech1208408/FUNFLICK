import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Play } from 'lucide-react';

export const StudioContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending'>('all');

  const videos = [
    {
      id: 'v1',
      title: 'Office Comedy Part 2',
      views: '2.4M',
      time: '5 days ago',
      status: 'PUBLISHED',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'v2',
      title: 'Relatable Moments',
      views: '1.1M',
      time: '1 week ago',
      status: 'PENDING_APPROVAL',
      thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'v3',
      title: 'Travel Vlog',
      views: '856K',
      time: '2 weeks ago',
      status: 'DRAFT',
      thumb: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'v4',
      title: 'Funny Reels',
      views: '3.2M',
      time: '3 weeks ago',
      status: 'PUBLISHED',
      thumb: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
    }
  ];

  const filteredVideos = videos.filter((v) => {
    if (activeTab === 'draft') return v.status === 'DRAFT';
    if (activeTab === 'pending') return v.status === 'PENDING_APPROVAL';
    return true;
  });

  return (
    <div className="w-full h-full bg-[#090a0f] text-white flex flex-col p-4 pb-20 space-y-4 select-none overflow-y-auto no-scrollbar">
      {/* Top Bar (Screen 10: < My Videos and + Upload button) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/creator/dashboard')} className="p-1 -ml-1 text-slate-300 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-sm font-bold text-white">My Videos</h1>
        </div>

        <Link
          to="/creator/upload"
          className="flex items-center gap-1 bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-md shadow-rose-500/20 active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Upload</span>
        </Link>
      </div>

      {/* Filter Tabs (Screen 10: All (32), Draft (5), Pending (3)) */}
      <div className="flex items-center gap-2 bg-[#151824] p-1 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'all'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All (32)
        </button>

        <button
          onClick={() => setActiveTab('draft')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'draft'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Draft (5)
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition text-center ${
            activeTab === 'pending'
              ? 'bg-[#212638] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending (3)
        </button>
      </div>

      {/* Video Item List (Screen 10) */}
      <div className="space-y-2.5 pt-1">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-3 bg-[#151824] p-2.5 rounded-2xl border border-white/5 shadow-sm hover:border-white/15 transition group"
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
              <img
                src={video.thumb}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white/80" />
              </div>
            </div>

            {/* Video Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-xs font-bold text-white truncate">{video.title}</h3>
              <p className="text-[10px] text-slate-400 font-medium">
                ▶ {video.views} • {video.time}
              </p>

              {/* Status Pill Badge */}
              {video.status === 'PUBLISHED' && (
                <span className="inline-block text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Published
                </span>
              )}
              {video.status === 'PENDING_APPROVAL' && (
                <span className="inline-block text-[9px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Pending Approval
                </span>
              )}
              {video.status === 'DRAFT' && (
                <span className="inline-block text-[9px] font-bold text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded-full border border-slate-600">
                  Draft
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

