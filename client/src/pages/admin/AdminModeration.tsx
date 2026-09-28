import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Ban, Play, Video, Sparkles } from 'lucide-react';
import api from '../../services/api';

export const AdminModeration: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  const fetchPendingVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/moderation/videos');
      if (res.data.success) {
        setVideos(res.data.data);
        if (res.data.data.length > 0 && !selectedVideo) {
          setSelectedVideo(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVideos();
  }, []);

  const handleAction = async (videoId: string, action: 'APPROVE' | 'REJECT' | 'BLOCK') => {
    let reason = '';
    if (action === 'REJECT' || action === 'BLOCK') {
      const input = prompt('Please provide reason for this moderation action (will be sent to creator):');
      if (input === null) return;
      reason = input.trim();
    }

    try {
      const res = await api.post(`/admin/moderation/videos/${videoId}`, { action, reason });
      if (res.data.success) {
        alert(`Video successfully marked as ${action}D`);
        fetchPendingVideos();
        setSelectedVideo(null);
      }
    } catch (err) {
      alert('Failed to moderate video');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Content Moderation Center</h1>
        <p className="text-xs text-slate-400">Review submitted creator reels, verify safety standards, and approve for public feed.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-[#151824] p-12 rounded-3xl border border-white/10 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Moderation Queue Clear! 🎉</h3>
          <p className="text-xs text-slate-400">All submitted creator videos have been reviewed and published.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Video List */}
          <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto">
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVideo(v)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                  selectedVideo?.id === v.id
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-[#151824] border-white/10 hover:border-white/20'
                }`}
              >
                <img
                  src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">{v.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">by @{v.creator?.username}</p>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Video Inspection Preview */}
          <div className="lg:col-span-7">
            {selectedVideo && (
              <div className="bg-[#151824] p-6 rounded-3xl border border-white/10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white truncate max-w-sm">{selectedVideo.title}</h3>
                  <span className="text-xs text-slate-400">Creator ID: {selectedVideo.creatorId.substring(0, 8)}</span>
                </div>

                {/* Video Player */}
                <div className="aspect-[9/16] max-h-[440px] bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mx-auto">
                  <video
                    src={selectedVideo.videoUrl}
                    poster={selectedVideo.thumbnailUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Metadata */}
                <div className="p-3 bg-[#0f111a] rounded-2xl space-y-1 text-xs text-slate-300">
                  <p><strong className="text-white">Description:</strong> {selectedVideo.description || 'None'}</p>
                  <p><strong className="text-white">Category:</strong> {selectedVideo.category?.name || 'General'}</p>
                  <p><strong className="text-white">Duration:</strong> {selectedVideo.durationSeconds}s</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleAction(selectedVideo.id, 'REJECT')}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold rounded-2xl transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Video</span>
                  </button>

                  <button
                    onClick={() => handleAction(selectedVideo.id, 'APPROVE')}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
