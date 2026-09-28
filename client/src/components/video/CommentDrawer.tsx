import React, { useState, useEffect } from 'react';
import { X, Send, Heart, CornerDownRight } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  user: {
    id: string;
    username: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
      isVerified?: boolean;
    };
  };
  replies?: Comment[];
}

interface CommentDrawerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ videoId, isOpen, onClose, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/social/comments/${videoId}`);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [videoId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;
    if (!user) {
      alert('Please log in to comment on videos');
      return;
    }

    try {
      const res = await api.post('/social/comments', {
        videoId,
        content: inputContent.trim(),
        parentId: replyingTo?.id || null
      });

      if (res.data.success) {
        setInputContent('');
        setReplyingTo(null);
        fetchComments();
        if (onCommentAdded) onCommentAdded();
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#151824] rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] h-[550px] overflow-hidden">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Comments <span className="text-xs text-slate-400 font-normal">({comments.length})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No comments yet. Be the first to start the banter! 🎉
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <img
                    src={comment.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.user.username}`}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">@{comment.user.username}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-1">{comment.content}</p>
                    <button
                      onClick={() => setReplyingTo({ id: comment.id, username: comment.user.username })}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 mt-1.5"
                    >
                      Reply
                    </button>
                  </div>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-9 pl-3 border-l-2 border-white/10 space-y-2 pt-1">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2.5">
                        <img
                          src={reply.user.profile?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${reply.user.username}`}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">@{reply.user.username}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#0f111a]">
          {replyingTo && (
            <div className="flex items-center justify-between text-xs text-rose-400 px-3 py-1 bg-rose-500/10 rounded-lg mb-2">
              <span>Replying to @{replyingTo.username}</span>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={user ? (replyingTo ? 'Write a reply...' : 'Add a comment...') : 'Login to comment'}
              disabled={!user}
              className="flex-1 bg-[#1c2030] text-xs text-white placeholder-slate-400 px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputContent.trim() || !user}
              className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
