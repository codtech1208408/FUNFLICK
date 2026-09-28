import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FunFlick database seed...');

  // Clear existing data safely
  await prisma.notification.deleteMany();
  await prisma.watchHistory.deleteMany();
  await prisma.like.deleteMany();
  await prisma.save.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.share.deleteMany();
  await prisma.report.deleteMany();
  await prisma.videoHashtag.deleteMany();
  await prisma.video.deleteMany();
  await prisma.post.deleteMany();
  await prisma.creatorEarning.deleteMany();
  await prisma.creatorPayout.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.creatorApplication.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.adminActionLog.deleteMany();
  await prisma.hashtag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Categories
  const categoriesData = [
    { name: 'Stand-up', slug: 'stand-up', icon: 'Mic2', description: 'Hilarious live stand-up specials and punchlines', sortOrder: 1 },
    { name: 'Memes & Edits', slug: 'memes', icon: 'Sparkles', description: 'Top tier internet humor and viral edits', sortOrder: 2 },
    { name: 'Pranks & Street', slug: 'pranks', icon: 'Smile', description: 'Wholesome street comedy and harmless pranks', sortOrder: 3 },
    { name: 'Sketches', slug: 'sketches', icon: 'Clapperboard', description: 'Original comedy skits and relatable situations', sortOrder: 4 },
    { name: 'Funny Animals', slug: 'funny-animals', icon: 'Cat', description: 'Pets being goofy and dramatic', sortOrder: 5 },
    { name: 'Parodies', slug: 'parodies', icon: 'Music', description: 'Pop culture parodies and voiceover humor', sortOrder: 6 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }

  // 2. Hashtags
  const tagsData = ['comedy', 'funflick', 'standup', 'lol', 'viral', 'funny', 'skit', 'prank', 'laughter'];
  const hashtags: Record<string, any> = {};
  for (const tag of tagsData) {
    hashtags[tag] = await prisma.hashtag.create({
      data: { tag, usageCount: Math.floor(Math.random() * 50) + 10 }
    });
  }

  // 3. Admin Account
  const admin = await prisma.user.create({
    data: {
      email: 'admin@funflick.com',
      username: 'admin',
      mobile: '+1000000000',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      profile: {
        create: {
          fullName: 'FunFlick Chief Admin',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          bio: 'Platform Administrator & Content Safety Director',
          isVerified: true
        }
      }
    }
  });

  // 4. Creators
  const creatorUsersData = [
    {
      username: 'laughlab',
      email: 'laughlab@funflick.com',
      fullName: 'The Laugh Lab',
      bio: 'Daily hilarious comedy skits and office humor 😂 1M+ community',
      category: 'Sketches',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
      subscribersCount: 240,
      grossEarningsCents: 119760 // $1,197.60
    },
    {
      username: 'standup_sam',
      email: 'sam@funflick.com',
      fullName: 'Sam Miller Comedy',
      bio: 'Touring stand-up comedian 🎤 Punchlines that hit right in the feels',
      category: 'Stand-up',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
      subscribersCount: 180,
      grossEarningsCents: 89820
    },
    {
      username: 'prankking_dan',
      email: 'dan@funflick.com',
      fullName: 'Dan "The Prank" Rivers',
      bio: 'Zero-harm public comedy & awkward social experiments 🚀',
      category: 'Pranks & Street',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
      subscribersCount: 310,
      grossEarningsCents: 154690
    },
    {
      username: 'meme_queen',
      email: 'mia@funflick.com',
      fullName: 'Mia Meme Edits',
      bio: 'Curating the funniest relatable moments on the internet ✨',
      category: 'Memes & Edits',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      subscribersCount: 95,
      grossEarningsCents: 47405
    }
  ];

  const creators: any[] = [];
  for (const c of creatorUsersData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        username: c.username,
        passwordHash,
        role: 'CREATOR',
        status: 'ACTIVE',
        profile: {
          create: {
            fullName: c.fullName,
            bio: c.bio,
            avatarUrl: c.avatarUrl,
            bannerUrl: c.bannerUrl,
            isVerified: true
          }
        },
        creatorProfile: {
          create: {
            handle: c.username,
            displayName: c.fullName,
            category: c.category,
            bio: c.bio,
            avatarUrl: c.avatarUrl,
            bannerUrl: c.bannerUrl,
            subscriberCount: c.subscribersCount,
            grossEarningsCents: c.grossEarningsCents,
            monetizationActive: true
          }
        }
      },
      include: {
        creatorProfile: true
      }
    });

    // Create Subscription Plan for this Creator
    await prisma.subscriptionPlan.create({
      data: {
        type: 'FAN_SUBSCRIPTION',
        creatorId: user.creatorProfile!.id,
        name: `${c.fullName} VIP Pass`,
        description: `Exclusive bloopers, early access comedy skits, and VIP supporter badge!`,
        priceCents: 499,
        interval: 'MONTHLY',
        perksJson: JSON.stringify(['VIP Supporter Badge', 'Early Reel Access', 'Exclusive Uncut Bloopers', 'Priority Comment Replies'])
      }
    });

    // Create some creator earnings logs
    await prisma.creatorEarning.create({
      data: {
        creatorId: user.creatorProfile!.id,
        sourceType: 'SUBSCRIPTION',
        grossAmountCents: 49900,
        platformFeeCents: 9980,
        netAmountCents: 39920,
        status: 'AVAILABLE'
      }
    });

    creators.push(user);
  }

  // 5. Standard Users
  const user1 = await prisma.user.create({
    data: {
      email: 'alex@funflick.com',
      username: 'alex_comedyfan',
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      profile: {
        create: {
          fullName: 'Alex Reynolds',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          bio: 'Here for the laughs and comedy specials! 🍿'
        }
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah@funflick.com',
      username: 'sarah_vibes',
      passwordHash,
      role: 'USER',
      status: 'ACTIVE',
      profile: {
        create: {
          fullName: 'Sarah Chen',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
          bio: 'Addicted to FunFlick reels 💫'
        }
      }
    }
  });

  // Follow relationships
  await prisma.follow.create({ data: { followerId: user1.id, followingId: creators[0].id } });
  await prisma.follow.create({ data: { followerId: user1.id, followingId: creators[1].id } });
  await prisma.follow.create({ data: { followerId: user2.id, followingId: creators[0].id } });

  // 6. High-Quality Comedy & Entertainment Short Videos (Optimized MP4 streams)
  const videosData = [
    {
      creatorId: creators[0].id,
      title: 'When your coworker says "Quick Sync" at 4:59 PM 😂💀',
      description: 'The instant panic when you hear that notification sound right before signing off. Who else can relate? #comedy #skit #funflick #viral',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-sitting-on-a-chair-and-laughing-40342-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['sketches'].id,
      type: 'REEL',
      durationSeconds: 18,
      viewsCount: 14250,
      likesCount: 1890,
      commentsCount: 64,
      sharesCount: 230,
      isFeatured: true
    },
    {
      creatorId: creators[1].id,
      title: 'The exact moment you realize you became your parents 🎤',
      description: 'Live at the Laugh Lounge! Buying a vacuum cleaner shouldn’t make someone this excited... #standup #comedy #funflick #lol',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-rain-41246-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['stand-up'].id,
      type: 'REEL',
      durationSeconds: 26,
      viewsCount: 29800,
      likesCount: 3450,
      commentsCount: 128,
      sharesCount: 512,
      isFeatured: true
    },
    {
      creatorId: creators[2].id,
      title: 'Offering strangers giant fake trophies for everyday tasks 🏆',
      description: 'Best parallel parker in the city gets the championship cup! Their reactions made my week. #prank #funny #funflick #wholesome',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-friends-laughing-together-outdoors-42861-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['pranks'].id,
      type: 'REEL',
      durationSeconds: 32,
      viewsCount: 45200,
      likesCount: 6120,
      commentsCount: 240,
      sharesCount: 890,
      isFeatured: true
    },
    {
      creatorId: creators[3].id,
      title: 'POV: You opened the fridge for the 14th time expecting new food ✨',
      description: 'Hoping magical pizza appeared on shelf 2. Tag a friend who does this every single night! #memes #laughter #viral #relatable',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-eating-popcorn-and-laughing-40344-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['memes'].id,
      type: 'REEL',
      durationSeconds: 15,
      viewsCount: 18400,
      likesCount: 2210,
      commentsCount: 95,
      sharesCount: 310,
      isFeatured: false
    },
    {
      creatorId: creators[0].id,
      title: 'Translating corporate emails into what people actually mean 📨',
      description: '"Per my last email" = Can you please read what I wrote 5 minutes ago?! 😂 #comedy #skit #funflick',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-sitting-on-a-curb-and-talking-42862-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['sketches'].id,
      type: 'REEL',
      durationSeconds: 22,
      viewsCount: 11200,
      likesCount: 1400,
      commentsCount: 45,
      sharesCount: 180,
      isFeatured: false
    }
  ];

  for (const v of videosData) {
    const video = await prisma.video.create({
      data: {
        creatorId: v.creatorId,
        title: v.title,
        description: v.description,
        videoUrl: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
        categoryId: v.categoryId,
        type: v.type,
        durationSeconds: v.durationSeconds,
        viewsCount: v.viewsCount,
        likesCount: v.likesCount,
        commentsCount: v.commentsCount,
        sharesCount: v.sharesCount,
        isFeatured: v.isFeatured,
        status: 'PUBLISHED'
      }
    });

    // Attach sample comments
    const comment1 = await prisma.comment.create({
      data: {
        userId: user1.id,
        videoId: video.id,
        content: 'I am crying laughing at this! Too accurate 🤣🤣',
        likesCount: 12
      }
    });

    await prisma.comment.create({
      data: {
        userId: creators[0].id,
        videoId: video.id,
        parentId: comment1.id,
        content: 'Appreciate it Alex! More coming tomorrow 🔥',
        likesCount: 4
      }
    });

    await prisma.comment.create({
      data: {
        userId: user2.id,
        videoId: video.id,
        content: 'Best reel on FunFlick this week hands down 🙌',
        likesCount: 7
      }
    });

    // Attach Likes
    await prisma.like.create({ data: { userId: user1.id, videoId: video.id } });
    await prisma.like.create({ data: { userId: user2.id, videoId: video.id } });
    await prisma.save.create({ data: { userId: user1.id, videoId: video.id } });
  }

  // 7. Pending Creator Application for Demonstration in Admin Panel
  await prisma.creatorApplication.create({
    data: {
      userId: user1.id,
      creatorName: 'Alex Comedy Show',
      category: 'Stand-up',
      bio: 'Up and coming standup comic with 50k on other platforms. Wanting to publish exclusive sets on FunFlick!',
      socialLinks: JSON.stringify({ instagram: '@alexcomedy', youtube: 'alexcomedyofficial' }),
      status: 'PENDING'
    }
  });

  // 8. Pending Video in Moderation Queue for Demonstration in Admin Panel
  await prisma.video.create({
    data: {
      creatorId: creators[2].id,
      title: 'Testing the limits of Elevator Etiquette (Pending Review)',
      description: 'Staring backwards in crowded elevators. Moderation check required for community guidelines.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-sitting-on-a-chair-and-laughing-40342-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      categoryId: categories['pranks'].id,
      type: 'REEL',
      durationSeconds: 25,
      status: 'PENDING_APPROVAL'
    }
  });

  console.log('✅ FunFlick database successfully populated with rich seed data!');
  console.log('------------------------------------------------------------');
  console.log('Admin Credentials:   admin@funflick.com  / admin123');
  console.log('Creator Credentials: laughlab@funflick.com / password123');
  console.log('User Credentials:    alex@funflick.com   / password123');
  console.log('------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
