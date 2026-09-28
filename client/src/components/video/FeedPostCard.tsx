import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  UserPlus,
  UserCheck,
  Crown,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ReelData } from './ReelCard';
import { CommentDrawer } from './CommentDrawer';
import { ShareModal } from './ShareModal';
import { SubscribeModal } from '../subscription/SubscribeModal';

interface FeedPostCardProps {
  post: ReelData;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(!!post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(!!post.isSaved);
  const [isFollowing, setIsFollowing] = useState(!!post.isFollowing);

  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

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

  const handleLike = async () => {
    if (!user) return alert('Please log in to like');
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((prev) => (next ? prev + 1 : Math.max(0, prev - 1)));
    try {
      await api.post('/social/like', { videoId: post.id });
    } catch (e) {
      setIsLiked(!next);
    }
  };

  const handleSave = async () => {
    if (!user) return alert('Please log in to save');
    const next = !isSaved;
    setIsSaved(next);
    try {
      await api.post('/social/save', { videoId: post.id });
    } catch (e) {
      setIsSaved(!next);
    }
  };

  const handleFollow = async () => {
    if (!user) return alert('Please log in to follow');
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      await api.post('/social/follow', { targetUserId: post.creatorId });
    } catch (e) {
      setIsFollowing(!next);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#151824] rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 transition-all mb-6">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.username}`} className="flex items-center gap-3 group">
            <img
              src={post.creator.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.creator.username}`}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40 group-hover:scale-105 transition"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:underline">
                  @{post.creator.username}
                </span>
                {post.creator.profile?.isVerified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] flex items-center justify-center font-bold text-white">
                    ✓
                  </span>
                )}
                {post.category && (
                  <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                    {post.category.name}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                {post.creator.creatorProfile?.displayName || post.creator.profile?.fullName || ''}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {user?.id !== post.creatorId && (
            <button
              onClick={handleFollow}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1 ${
                isFollowing
                  ? 'bg-white/10 text-slate-300'
                  : 'bg-rose-500 hover:bg-rose-600 text-white'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}

          <button
            onClick={() => setShowSubscribe(true)}
            className="p-1.5 bg-amber-500/20 text-amber-300 rounded-full hover:bg-amber-500/30 transition"
            title="Subscribe to Creator VIP"
          >
            <Crown className="w-4 h-4 fill-amber-400" />
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="relative aspect-[4/5] sm:aspect-[9/16] max-h-[520px] bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={post.videoUrl}
          poster={post.thumbnailUrl}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
          </button>
        )}

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/80"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Action Buttons Bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
              <span className="text-xs font-bold">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-bold">{post.commentsCount || 0}</span>
            </button>

            <button
              onClick={() => setShowShare(true)}
              className="text-slate-300 hover:text-white transition"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="text-slate-300 hover:text-white transition"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'text-amber-400 fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Video Title & Captions */}
        <div>
          <p className="text-xs text-slate-100 font-medium">
            <span className="font-bold mr-1.5 text-white">@{post.creator.username}</span>
            {post.title}
          </p>
          {post.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{post.description}</p>
          )}
        </div>

        {/* View Comments Trigger */}
        <button
          onClick={() => setShowComments(true)}
          className="text-xs text-slate-400 hover:text-rose-400 transition"
        >
          View all {post.commentsCount || 0} comments
        </button>
      </div>

      {/* Modals */}
      <CommentDrawer
        videoId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      <ShareModal
        videoId={post.id}
        title={post.title}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      {showSubscribe && (
        <SubscribeModal
          plan={{
            id: 'feed-plan',
            name: `${post.creator.creatorProfile?.displayName || post.creator.username} VIP Pass`,
            priceCents: 499,
            creator: {
              displayName: post.creator.creatorProfile?.displayName || post.creator.username,
              handle: post.creator.username,
              avatarUrl: post.creator.profile?.avatarUrl
            }
          }}
          isOpen={showSubscribe}
          onClose={() => setShowSubscribe(false)}
        />
      )}
    </div>
  );
};
