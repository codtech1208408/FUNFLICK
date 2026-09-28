import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { videos: { where: { status: 'PUBLISHED' } } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return res.json({ success: true, data: categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const getTrendingHashtags = async (req: Request, res: Response) => {
  try {
    const hashtags = await prisma.hashtag.findMany({
      where: { isBlocked: false },
      orderBy: { usageCount: 'desc' },
      take: 20
    });

    return res.json({ success: true, data: hashtags });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch hashtags' });
  }
};

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.json({
        success: true,
        data: { users: [], creators: [], videos: [], categories: [], hashtags: [] }
      });
    }

    const [users, creators, videos, categories, hashtags] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query } },
            { profile: { fullName: { contains: query } } }
          ],
          status: 'ACTIVE'
        },
        include: { profile: true },
        take: 8
      }),
      prisma.creatorProfile.findMany({
        where: {
          OR: [
            { handle: { contains: query } },
            { displayName: { contains: query } },
            { category: { contains: query } }
          ]
        },
        take: 8
      }),
      prisma.video.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } }
          ],
          status: 'PUBLISHED'
        },
        include: {
          creator: { select: { username: true, profile: true } },
          category: true
        },
        take: 12
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query },
          isActive: true
        },
        take: 5
      }),
      prisma.hashtag.findMany({
        where: {
          tag: { contains: query.replace('#', '') },
          isBlocked: false
        },
        take: 8
      })
    ]);

    return res.json({
      success: true,
      data: {
        users,
        creators,
        videos,
        categories,
        hashtags
      }
    });
  } catch (error: any) {
    console.error('globalSearch error:', error);
    return res.status(500).json({ success: false, message: 'Search query failed' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, icon } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: 'Name and slug required' });

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        description: description || '',
        icon: icon || 'Film'
      }
    });

    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};
