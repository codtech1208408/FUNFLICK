import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Heart, History, Play, Film, ChevronLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  defaultTab?: 'saved' | 'liked' | 'history';
}

export const SavedLikedHistoryPage: React.FC<Props> = ({ defaultTab = 'saved' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'liked' | 'history'>(defaultTab);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        // Fetch feed with user's saved/liked/history items
        const res = await api.get('/videos/feed', { params: { limit: 20 } });
        if (res.data.success) {
          if (activeTab === 'saved') {
            setVideos(res.data.data.filter((v: any) => v.isSaved));
          } else if (activeTab === 'liked') {
            setVideos(res.data.data.filter((v: any) => v.isLiked));
          } else {
            setVideos(res.data.data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeTab, user]);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto no-scrollbar bg-[#090a0f] text-slate-100 select-none pb-8">
      {/* Top Header Bar with Back Button */}
      <div className="sticky top-0 z-30 bg-[#090a0f]/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-1 -ml-1 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition"
          title="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-sm font-extrabold text-white">Saved & Liked</h2>
        <div className="w-6" />
      </div>

      <div className="p-4 space-y-4">
        {/* Tab Selectors */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeTab === 'saved' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Videos</span>
        </button>

        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeTab === 'liked' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Liked Reels</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            activeTab === 'history' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Watch History</span>
        </button>
      </div>

      {/* Video Grid */}
      <div>
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-[#151824] p-12 text-center rounded-3xl border border-white/10 space-y-2">
            <Film className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-bold text-white">No videos in {activeTab}</p>
            <p className="text-xs text-slate-400">Discover reels on the home feed and add them to your collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videos.map((v) => (
              <Link
                key={v.id}
                to="/reels"
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-md"
              >
                <img
                  src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                  <span className="text-xs font-bold text-white line-clamp-2 drop-shadow">
                    {v.title}
                  </span>
                  <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                    <Play className="w-2.5 h-2.5 fill-rose-400" /> {v.viewsCount || 0} views
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};
