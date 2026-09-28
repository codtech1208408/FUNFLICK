import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const applyForCreator = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { creatorName, category, bio, socialLinks, idProofUrl } = req.body;

    if (!creatorName || !category || !bio) {
      return res.status(400).json({ success: false, message: 'Creator name, category, and bio are required' });
    }

    const existingApp = await prisma.creatorApplication.findFirst({
      where: { userId, status: 'PENDING' }
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You already have a pending creator application undergoing review' });
    }

    const application = await prisma.creatorApplication.create({
      data: {
        userId,
        creatorName,
        category,
        bio,
        socialLinks: typeof socialLinks === 'object' ? JSON.stringify(socialLinks) : socialLinks,
        idProofUrl: idProofUrl || null,
        status: 'PENDING'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Creator application submitted successfully. Administrator will review shortly.',
      data: application
    });
  } catch (error: any) {
    console.error('applyForCreator error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit creator application' });
  }
};

export const getCreatorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId },
      include: {
        plans: true
      }
    });

    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator profile not found. Please apply to become a creator first.' });
    }

    // Compute live metrics from database
    const videos = await prisma.video.findMany({
      where: { creatorId: userId }
    });

    const totalVideos = videos.length;
    const publishedVideos = videos.filter(v => v.status === 'PUBLISHED').length;
    const pendingVideos = videos.filter(v => v.status === 'PENDING_APPROVAL').length;
    const draftVideos = videos.filter(v => v.status === 'DRAFT').length;

    const totalViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);
    const totalLikes = videos.reduce((acc, v) => acc + v.likesCount, 0);
    const totalComments = videos.reduce((acc, v) => acc + v.commentsCount, 0);
    const totalShares = videos.reduce((acc, v) => acc + v.sharesCount, 0);
    const totalSaves = videos.reduce((acc, v) => acc + v.savesCount, 0);

    const followersCount = await prisma.follow.count({
      where: { followingId: userId }
    });

    const activeSubscribersCount = await prisma.subscription.count({
      where: { creatorId: creator.id, status: 'ACTIVE' }
    });

    const earnings = await prisma.creatorEarning.findMany({
      where: { creatorId: creator.id }
    });

    const totalGrossEarningsCents = earnings.reduce((acc, e) => acc + e.grossAmountCents, 0);
    const availablePayoutCents = earnings
      .filter(e => e.status === 'AVAILABLE')
      .reduce((acc, e) => acc + e.netAmountCents, 0);

    const paidPayouts = await prisma.creatorPayout.findMany({
      where: { creatorId: creator.id, status: 'PAID' }
    });
    const totalPaidCents = paidPayouts.reduce((acc, p) => acc + p.amountCents, 0);

    // Recent video performances
    const recentVideos = await prisma.video.findMany({
      where: { creatorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    });

    return res.json({
      success: true,
      creator: {
        id: creator.id,
        handle: creator.handle,
        displayName: creator.displayName,
        category: creator.category,
        avatarUrl: creator.avatarUrl,
        bannerUrl: creator.bannerUrl,
        monetizationActive: creator.monetizationActive
      },
      stats: {
        totalVideos,
        publishedVideos,
        pendingVideos,
        draftVideos,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        totalSaves,
        followersCount,
        subscribersCount: activeSubscribersCount,
        totalGrossEarningsCents,
        availablePayoutCents,
        totalPaidCents
      },
      recentVideos
    });
  } catch (error: any) {
    console.error('getCreatorDashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load creator dashboard' });
  }
};

export const uploadContent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      categorySlug,
      hashtags,
      type = 'REEL',
      durationSeconds = 30,
      aspectRatio = '9:16',
      visibility = 'PUBLIC',
      submitForApproval = true
    } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: 'Title and Video URL are required' });
    }

    let categoryId = null;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const status = submitForApproval ? 'PENDING_APPROVAL' : 'DRAFT';

    const video = await prisma.video.create({
      data: {
        creatorId: userId,
        title,
        description: description || '',
        videoUrl,
        thumbnailUrl: thumbnailUrl || '',
        type,
        durationSeconds: parseInt(durationSeconds) || 30,
        aspectRatio,
        categoryId,
        visibility,
        status
      }
    });

    // Handle hashtags
    if (hashtags && Array.isArray(hashtags)) {
      for (const tag of hashtags) {
        const cleanTag = tag.replace('#', '').toLowerCase().trim();
        if (cleanTag) {
          const hashtagRecord = await prisma.hashtag.upsert({
            where: { tag: cleanTag },
            update: { usageCount: { increment: 1 } },
            create: { tag: cleanTag, usageCount: 1 }
          });

          await prisma.videoHashtag.create({
            data: {
              videoId: video.id,
              hashtagId: hashtagRecord.id
            }
          });
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: submitForApproval
        ? 'Video submitted for moderation review. It will appear once approved by admin.'
        : 'Video saved as draft.',
      data: video
    });
  } catch (error: any) {
    console.error('uploadContent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload content' });
  }
};

export const getCreatorVideos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, search } = req.query;

    let whereClause: any = { creatorId: userId };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search) {
      whereClause.title = { contains: String(search) };
    }

    const videos = await prisma.video.findMany({
      where: whereClause,
      include: {
        category: true,
        hashtags: { include: { hashtag: true } },
        _count: {
          select: {
            likes: true,
            comments: true,
            saves: true,
            shares: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: videos });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch creator videos' });
  }
};

export const updateCreatorVideo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, description, categorySlug, visibility, submitForApproval } = req.body;

    const video = await prisma.video.findFirst({
      where: { id, creatorId: userId }
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    let categoryId = video.categoryId;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) categoryId = cat.id;
    }

    let nextStatus = video.status;
    if (submitForApproval && video.status === 'DRAFT') {
      nextStatus = 'PENDING_APPROVAL';
    }

    const updated = await prisma.video.update({
      where: { id },
      data: {
        title: title || video.title,
        description: description !== undefined ? description : video.description,
        categoryId,
        visibility: visibility || video.visibility,
        status: nextStatus
      }
    });

    return res.json({ success: true, message: 'Video updated', data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update video' });
  }
};

export const deleteCreatorVideo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const video = await prisma.video.findFirst({
      where: { id, creatorId: userId }
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    await prisma.video.delete({ where: { id } });

    return res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete video' });
  }
};

export const getCreatorEarnings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId }
    });

    if (!creator) return res.status(404).json({ success: false, message: 'Creator profile not found' });

    const earnings = await prisma.creatorEarning.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' }
    });

    const payouts = await prisma.creatorPayout.findMany({
      where: { creatorId: creator.id },
      orderBy: { createdAt: 'desc' }
    });

    const totalGross = earnings.reduce((acc, e) => acc + e.grossAmountCents, 0);
    const available = earnings.filter(e => e.status === 'AVAILABLE').reduce((acc, e) => acc + e.netAmountCents, 0);
    const totalPaid = payouts.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amountCents, 0);

    return res.json({
      success: true,
      summary: {
        totalGrossCents: totalGross,
        availableCents: available,
        paidCents: totalPaid
      },
      earnings,
      payouts
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch earnings' });
  }
};

export const requestPayout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amountCents, payoutMethod, accountDetails } = req.body;

    const creator = await prisma.creatorProfile.findUnique({ where: { userId } });
    if (!creator) return res.status(404).json({ success: false, message: 'Creator profile not found' });

    const earnings = await prisma.creatorEarning.findMany({
      where: { creatorId: creator.id, status: 'AVAILABLE' }
    });
    const availableBalance = earnings.reduce((acc, e) => acc + e.netAmountCents, 0);

    if (amountCents > availableBalance || amountCents <= 0) {
      return res.status(400).json({ success: false, message: 'Requested amount exceeds available balance' });
    }

    const payout = await prisma.creatorPayout.create({
      data: {
        creatorId: creator.id,
        amountCents,
        payoutMethod: payoutMethod || 'BANK_TRANSFER',
        accountDetails: accountDetails || 'Primary Direct Deposit',
        status: 'PENDING'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Payout request submitted to platform administration for approval.',
      data: payout
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to request payout' });
  }
};
