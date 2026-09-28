import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Crown,
  UserPlus,
  UserCheck,
  Flag,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { CommentDrawer } from './CommentDrawer';
import { ShareModal } from './ShareModal';
import { ReportModal } from './ReportModal';
import { SubscribeModal } from '../subscription/SubscribeModal';

export interface ReelData {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  creator: {
    id: string;
    username: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
      isVerified?: boolean;
    };
    creatorProfile?: {
      handle: string;
      displayName: string;
      subscriberCount: number;
    };
  };
  category?: {
    name: string;
    slug: string;
  };
  hashtags?: Array<{ hashtag: { tag: string } }>;
}

interface ReelCardProps {
  reel: ReelData;
  isActive: boolean;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, isActive }) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 0);
  const [isLiked, setIsLiked] = useState(!!reel.isLiked);
  const [isSaved, setIsSaved] = useState(!!reel.isSaved);
  const [isFollowing, setIsFollowing] = useState(!!reel.isFollowing);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Modals state
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  // Handle Play/Pause when isActive changes (from intersection observer in parent)
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        // Record watch view
        api.post(`/videos/${reel.id}/watch`, { durationSeconds: 5, completed: false }).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, reel.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      handleLikeToggle();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleLikeToggle = async () => {
    if (!user) {
      alert('Please log in to like videos');
      return;
    }
    try {
      const nextLiked = !isLiked;
      setIsLiked(nextLiked);
      setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));
      await api.post('/social/like', { videoId: reel.id });
    } catch (err) {
      setIsLiked(!isLiked);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      alert('Please log in to save videos');
      return;
    }
    try {
      const nextSaved = !isSaved;
      setIsSaved(nextSaved);
      await api.post('/social/save', { videoId: reel.id });
    } catch (err) {
      setIsSaved(!isSaved);
    }
  };

  const handleFollowToggle = async () => {
    if (!user) {
      alert('Please log in to follow creators');
      return;
    }
    try {
      const nextFollow = !isFollowing;
      setIsFollowing(nextFollow);
      await api.post('/social/follow', { targetUserId: reel.creatorId });
    } catch (err) {
      setIsFollowing(!isFollowing);
    }
  };

  return (
    <div className="reel-section w-full h-full flex items-center justify-center p-0 select-none relative">
      <div className="relative w-full h-full bg-black overflow-hidden group flex items-center justify-center">
        {/* Video element */}
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          onDoubleClick={handleDoubleTap}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Double-tap heart animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 animate-heart-beat drop-shadow-2xl" />
          </div>
        )}

        {/* Play/Pause state indicator overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </button>
        )}

        {/* Top Controls: Mute toggle & Category badge */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
          {reel.category && (
            <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-rose-400" />
              {reel.category.name}
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Bottom Metadata & Creator Information */}
        <div className="absolute bottom-3 left-0 right-16 px-4 py-2 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-auto">
          {/* Creator Profile Chip */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <Link to={`/profile/${reel.creator.username}`} className="flex items-center gap-2 group/creator min-w-0 max-w-[55%]">
              <img
                src={reel.creator.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${reel.creator.username}`}
                alt=""
                className="w-9 h-9 rounded-full object-cover border-2 border-rose-500 shadow-md group-hover/creator:scale-105 transition flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs font-bold text-white group-hover/creator:underline truncate max-w-[120px]">
                    @{reel.creator.username}
                  </span>
                  {reel.creator.profile?.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] flex items-center justify-center font-bold text-white flex-shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-300 block truncate max-w-[120px]">
                  {reel.creator.creatorProfile?.displayName || reel.creator.profile?.fullName || ''}
                </span>
              </div>
            </Link>

            {/* Action buttons with flex-shrink-0 */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {user?.id !== reel.creatorId && (
                <button
                  onClick={handleFollowToggle}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition flex items-center gap-1 flex-shrink-0 active:scale-95 ${
                    isFollowing
                      ? 'bg-white/10 text-slate-300 border-white/20'
                      : 'bg-rose-500 hover:bg-rose-600 text-white border-transparent shadow-md shadow-rose-500/30'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              )}

              {/* VIP Fan Pass Button */}
              <button
                onClick={() => setShowSubscribe(true)}
                className="text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-full flex items-center gap-1 transition flex-shrink-0 active:scale-95"
              >
                <Crown className="w-3 h-3 fill-amber-400" />
                <span>VIP</span>
              </button>
            </div>
          </div>

          {/* Title and Description */}
          <h2 className="text-[13px] font-bold text-white line-clamp-2 leading-snug drop-shadow">
            {reel.title}
          </h2>

          {reel.description && (
            <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 drop-shadow-sm leading-tight">
              {reel.description}
            </p>
          )}

          {/* Hashtags */}
          {reel.hashtags && reel.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {reel.hashtags.slice(0, 3).map((h, i) => (
                <Link
                  key={i}
                  to={`/explore?q=%23${h.hashtag.tag}`}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  #{h.hashtag.tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Side Action Rail */}
        <div className="absolute right-2 bottom-6 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
          {/* Like */}
          <button
            onClick={handleLikeToggle}
            className="flex flex-col items-center gap-1 group/btn"
          >
            <div
              className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-transform group-hover/btn:scale-110 ${
                isLiked ? 'bg-rose-500/30 text-rose-500' : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">{likesCount}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-1 group/btn"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-transform group-hover/btn:scale-110">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">{reel.commentsCount || 0}</span>
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={handleSaveToggle}
            className="flex flex-col items-center gap-1 group/btn"
          >
            <div
              className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-transform group-hover/btn:scale-110 ${
                isSaved ? 'bg-amber-500/30 text-amber-400' : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">Save</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShare(true)}
            className="flex flex-col items-center gap-1 group/btn"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-transform group-hover/btn:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow">Share</span>
          </button>

          {/* Report */}
          <button
            onClick={() => setShowReport(true)}
            className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition"
            title="Report"
          >
            <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-slate-300">
              <Flag className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CommentDrawer
        videoId={reel.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <ShareModal
        videoId={reel.id}
        title={reel.title}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      <ReportModal
        targetId={reel.id}
        targetType="VIDEO"
        isOpen={showReport}
        onClose={() => setShowReport(false)}
      />

      {showSubscribe && (
        <SubscribeModal
          plan={{
            id: 'demo-plan',
            name: `${reel.creator.creatorProfile?.displayName || reel.creator.username} VIP Pass`,
            priceCents: 499,
            creator: {
              displayName: reel.creator.creatorProfile?.displayName || reel.creator.username,
              handle: reel.creator.username,
              avatarUrl: reel.creator.profile?.avatarUrl
            }
          }}
          isOpen={showSubscribe}
          onClose={() => setShowSubscribe(false)}
        />
      )}
    </div>
  );
};
