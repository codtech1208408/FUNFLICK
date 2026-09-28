import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { videoId, postId, commentId } = req.body;

    if (!videoId && !postId && !commentId) {
      return res.status(400).json({ success: false, message: 'Target entity ID required' });
    }

    if (videoId) {
      const existing = await prisma.like.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        await prisma.video.update({ where: { id: videoId }, data: { likesCount: { decrement: 1 } } });
        return res.json({ success: true, liked: false, message: 'Unliked video' });
      } else {
        await prisma.like.create({ data: { userId, videoId } });
        const video = await prisma.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } },
          include: { creator: true }
        });

        // Send notification to creator
        if (video.creatorId !== userId) {
          await prisma.notification.create({
            data: {
              userId: video.creatorId,
              actorId: userId,
              type: 'LIKE',
              title: 'New Like! ❤️',
              message: `@${req.user!.username} liked your video "${video.title}"`,
              entityType: 'VIDEO',
              entityId: video.id
            }
          });
        }
        return res.json({ success: true, liked: true, message: 'Liked video' });
      }
    }

    if (commentId) {
      const existing = await prisma.like.findUnique({
        where: { userId_commentId: { userId, commentId } }
      });
      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        await prisma.comment.update({ where: { id: commentId }, data: { likesCount: { decrement: 1 } } });
        return res.json({ success: true, liked: false });
      } else {
        await prisma.like.create({ data: { userId, commentId } });
        await prisma.comment.update({ where: { id: commentId }, data: { likesCount: { increment: 1 } } });
        return res.json({ success: true, liked: true });
      }
    }

    return res.status(400).json({ success: false, message: 'Invalid like request' });
  } catch (error: any) {
    console.error('toggleLike error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle like' });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const currentUserId = req.user?.id;

    const comments = await prisma.comment.findMany({
      where: {
        videoId,
        parentId: null // top level
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                isVerified: true
              }
            }
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    fullName: true,
                    avatarUrl: true,
                    isVerified: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: comments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { videoId, parentId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const comment = await prisma.comment.create({
      data: {
        userId,
        videoId,
        parentId: parentId || null,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    if (videoId) {
      const video = await prisma.video.update({
        where: { id: videoId },
        data: { commentsCount: { increment: 1 } }
      });

      if (video.creatorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: video.creatorId,
            actorId: userId,
            type: 'COMMENT',
            title: 'New Comment 💬',
            message: `@${req.user!.username}: "${content.substring(0, 40)}..."`,
            entityType: 'VIDEO',
            entityId: videoId
          }
        });
      }
    }

    return res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

export const toggleSave = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { videoId, postId } = req.body;

    if (videoId) {
      const existing = await prisma.save.findUnique({
        where: { userId_videoId: { userId, videoId } }
      });

      if (existing) {
        await prisma.save.delete({ where: { id: existing.id } });
        await prisma.video.update({ where: { id: videoId }, data: { savesCount: { decrement: 1 } } });
        return res.json({ success: true, saved: false, message: 'Removed from saved collection' });
      } else {
        await prisma.save.create({ data: { userId, videoId } });
        await prisma.video.update({ where: { id: videoId }, data: { savesCount: { increment: 1 } } });
        return res.json({ success: true, saved: true, message: 'Saved to collection' });
      }
    }

    return res.status(400).json({ success: false, message: 'Video ID required' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to toggle save' });
  }
};

export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user!.id;
    const { targetUserId } = req.body;

    if (!targetUserId || targetUserId === followerId) {
      return res.status(400).json({ success: false, message: 'Invalid target user' });
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId: targetUserId } }
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return res.json({ success: true, isFollowing: false, message: 'Unfollowed creator' });
    } else {
      await prisma.follow.create({
        data: { followerId, followingId: targetUserId }
      });

      await prisma.notification.create({
        data: {
          userId: targetUserId,
          actorId: followerId,
          type: 'FOLLOW',
          title: 'New Follower! 🌟',
          message: `@${req.user!.username} started following your entertainment profile!`,
          entityType: 'USER',
          entityId: followerId
        }
      });

      return res.json({ success: true, isFollowing: true, message: 'Followed creator' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to toggle follow' });
  }
};

export const submitReport = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user!.id;
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Target, reason, and details are required' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        targetType,
        targetId,
        videoId: targetType === 'VIDEO' ? targetId : null,
        postId: targetType === 'POST' ? targetId : null,
        commentId: targetType === 'COMMENT' ? targetId : null,
        reason,
        details: details || null,
        status: 'PENDING'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team will review this shortly.',
      reportId: report.id
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};

export const recordShare = async (req: AuthRequest, res: Response) => {
  try {
    const { videoId, platform } = req.body;
    const userId = req.user?.id || null;

    if (!videoId) return res.status(400).json({ success: false, message: 'Video ID required' });

    await prisma.share.create({
      data: {
        videoId,
        userId,
        platform: platform || 'DIRECT_LINK'
      }
    });

    await prisma.video.update({
      where: { id: videoId },
      data: { sharesCount: { increment: 1 } }
    });

    return res.json({ success: true, message: 'Share recorded' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to record share' });
  }
};
