import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const section = (req.query.section as string) || 'recommended'; // recommended, trending, latest, following
    const categorySlug = req.query.category as string;
    const skip = (page - 1) * limit;

    const currentUserId = req.user?.id;

    let whereClause: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC'
    };

    if (categorySlug && categorySlug !== 'all') {
      whereClause.category = {
        slug: categorySlug
      };
    }

    let orderBy: any = { createdAt: 'desc' };

    if (section === 'trending') {
      orderBy = [
        { viewsCount: 'desc' },
        { likesCount: 'desc' },
        { createdAt: 'desc' }
      ];
    } else if (section === 'following' && currentUserId) {
      const following = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true }
      });
      const followingIds = following.map(f => f.followingId);
      whereClause.creatorId = { in: followingIds };
    }

    const videos = await prisma.video.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                isVerified: true
              }
            },
            creatorProfile: {
              select: {
                handle: true,
                displayName: true,
                subscriberCount: true
              }
            }
          }
        },
        category: true,
        hashtags: {
          include: {
            hashtag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
            shares: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    });

    // If user is logged in, attach isLiked, isSaved, isFollowing flags
    let enhancedVideos = videos;
    if (currentUserId) {
      const videoIds = videos.map(v => v.id);
      const creatorIds = videos.map(v => v.creatorId);

      const [userLikes, userSaves, userFollows] = await Promise.all([
        prisma.like.findMany({
          where: { userId: currentUserId, videoId: { in: videoIds } },
          select: { videoId: true }
        }),
        prisma.save.findMany({
          where: { userId: currentUserId, videoId: { in: videoIds } },
          select: { videoId: true }
        }),
        prisma.follow.findMany({
          where: { followerId: currentUserId, followingId: { in: creatorIds } },
          select: { followingId: true }
        })
      ]);

      const likedMap = new Set(userLikes.map(l => l.videoId));
      const savedMap = new Set(userSaves.map(s => s.videoId));
      const followMap = new Set(userFollows.map(f => f.followingId));

      enhancedVideos = videos.map(v => ({
        ...v,
        isLiked: likedMap.has(v.id),
        isSaved: savedMap.has(v.id),
        isFollowing: followMap.has(v.creatorId)
      }));
    }

    const totalCount = await prisma.video.count({ where: whereClause });

    return res.json({
      success: true,
      data: enhancedVideos,
      pagination: {
        page,
        limit,
        totalCount,
        hasMore: skip + videos.length < totalCount
      }
    });
  } catch (error: any) {
    console.error('getFeed error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch feed', error: error.message });
  }
};

export const getReels = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;
    const currentUserId = req.user?.id;

    const reels = await prisma.video.findMany({
      where: {
        status: 'PUBLISHED',
        type: { in: ['REEL', 'SHORT'] }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                isVerified: true
              }
            },
            creatorProfile: {
              select: {
                handle: true,
                displayName: true,
                subscriberCount: true
              }
            }
          }
        },
        category: true,
        hashtags: {
          include: {
            hashtag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
            shares: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { likesCount: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    let enhancedReels = reels;
    if (currentUserId) {
      const reelIds = reels.map(r => r.id);
      const creatorIds = reels.map(r => r.creatorId);

      const [userLikes, userSaves, userFollows] = await Promise.all([
        prisma.like.findMany({
          where: { userId: currentUserId, videoId: { in: reelIds } },
          select: { videoId: true }
        }),
        prisma.save.findMany({
          where: { userId: currentUserId, videoId: { in: reelIds } },
          select: { videoId: true }
        }),
        prisma.follow.findMany({
          where: { followerId: currentUserId, followingId: { in: creatorIds } },
          select: { followingId: true }
        })
      ]);

      const likedMap = new Set(userLikes.map(l => l.videoId));
      const savedMap = new Set(userSaves.map(s => s.videoId));
      const followMap = new Set(userFollows.map(f => f.followingId));

      enhancedReels = reels.map(r => ({
        ...r,
        isLiked: likedMap.has(r.id),
        isSaved: savedMap.has(r.id),
        isFollowing: followMap.has(r.creatorId)
      }));
    }

    return res.json({
      success: true,
      data: enhancedReels,
      page,
      hasMore: reels.length === limit
    });
  } catch (error: any) {
    console.error('getReels error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reels' });
  }
};

export const getVideoById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profile: true,
            creatorProfile: true
          }
        },
        category: true,
        hashtags: {
          include: {
            hashtag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
            shares: true
          }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    let isLiked = false;
    let isSaved = false;
    let isFollowing = false;

    if (currentUserId) {
      const [like, save, follow] = await Promise.all([
        prisma.like.findUnique({ where: { userId_videoId: { userId: currentUserId, videoId: id } } }),
        prisma.save.findUnique({ where: { userId_videoId: { userId: currentUserId, videoId: id } } }),
        prisma.follow.findUnique({ where: { followerId_followingId: { followerId: currentUserId, followingId: video.creatorId } } })
      ]);
      isLiked = !!like;
      isSaved = !!save;
      isFollowing = !!follow;
    }

    return res.json({
      success: true,
      data: {
        ...video,
        isLiked,
        isSaved,
        isFollowing
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch video details' });
  }
};

export const recordWatch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { durationSeconds, completed } = req.body;
    const userId = req.user?.id;

    // Increment video view count
    await prisma.video.update({
      where: { id },
      data: {
        viewsCount: { increment: 1 }
      }
    });

    // Record watch history if authenticated
    if (userId) {
      await prisma.watchHistory.upsert({
        where: {
          userId_videoId: { userId, videoId: id }
        },
        update: {
          watchDurationSeconds: durationSeconds || 0,
          completed: !!completed,
          watchedAt: new Date()
        },
        create: {
          userId,
          videoId: id,
          watchDurationSeconds: durationSeconds || 0,
          completed: !!completed
        }
      });
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to record watch view' });
  }
};
