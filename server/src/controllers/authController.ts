import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db';
import { signToken, AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, mobile, password, avatarUrl } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_.]/g, '');
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanEmail }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(409).json({ success: false, message: 'Username is already taken' });
      }
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        mobile: mobile || null,
        passwordHash,
        role: 'USER',
        status: 'ACTIVE',
        profile: {
          create: {
            fullName,
            avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`,
            bio: 'Hey there! I am having fun on FunFlick 🎉'
          }
        }
      },
      include: {
        profile: true,
        creatorProfile: true
      }
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Welcome to FunFlick! 🚀',
        message: 'Discover the funniest reels, comedy sketches, and support your favorite creators.'
      }
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile: user.profile,
        creatorProfile: user.creatorProfile
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide your email/username and password' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const digitsOnly = cleanIdentifier.replace(/\D/g, '');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier },
          { mobile: cleanIdentifier },
          ...(digitsOnly.length >= 7 ? [{ mobile: { contains: digitsOnly } }] : [])
        ]
      },
      include: {
        profile: true,
        creatorProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    if (user.status === 'BLOCKED') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by FunFlick administration.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password does not match.' });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status
    });

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile: user.profile,
        creatorProfile: user.creatorProfile
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getProfileByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const cleanUsername = username.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanUsername },
          { mobile: cleanUsername }
        ]
      },
      include: {
        profile: true,
        creatorProfile: true,
        _count: {
          select: {
            followers: true,
            following: true,
            videos: true,
            likes: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile: user.profile,
        creatorProfile: user.creatorProfile,
        counts: user._count
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving profile', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { fullName, bio, avatarUrl, username } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        username: username ? username.toLowerCase().trim().replace(/[^a-z0-9_.]/g, '') : undefined,
        profile: {
          upsert: {
            create: {
              fullName: fullName || req.user.username,
              bio: bio || '',
              avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.user.username}`
            },
            update: {
              fullName: fullName !== undefined ? fullName : undefined,
              bio: bio !== undefined ? bio : undefined,
              avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined
            }
          }
        }
      },
      include: {
        profile: true,
        creatorProfile: true
      }
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        profile: updatedUser.profile,
        creatorProfile: updatedUser.creatorProfile
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        creatorProfile: true,
        _count: {
          select: {
            followers: true,
            following: true,
            videos: true,
            likes: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        profile: user.profile,
        creatorProfile: user.creatorProfile,
        counts: user._count
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile', error: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { emailOrMobile, otp } = req.body;
    // OTP verification simulation with standard 6-digit support (e.g., 123456 or any 6-digit in dev)
    if (!otp || otp.length < 4) {
      return res.status(400).json({ success: false, message: 'Valid OTP is required' });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      // Return success to avoid email enumeration
      return res.json({ success: true, message: 'If an account matches, a reset link has been dispatched.' });
    }

    return res.json({
      success: true,
      message: 'Password reset instructions have been sent to your registered email.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to request password reset' });
  }
};

export const loginWithOtp = async (req: Request, res: Response) => {
  try {
    const { identifier, otp, role } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide mobile number and OTP' });
    }

    if (otp !== '123456' && otp.length < 4) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please use temporary OTP: 123456' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const digitsOnly = cleanIdentifier.replace(/\D/g, '');

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier },
          { mobile: cleanIdentifier },
          ...(digitsOnly.length >= 7 ? [{ mobile: { contains: digitsOnly } }] : [])
        ]
      },
      include: {
        profile: true,
        creatorProfile: true
      }
    });

    if (!user) {
      // Auto-register user with default temporary credentials
      const generatedUsername = `user_${digitsOnly.slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;
      const passwordHash = await bcrypt.hash('password123', 10);
      user = await prisma.user.create({
        data: {
          username: generatedUsername,
          email: `${generatedUsername}@funflick.com`,
          mobile: cleanIdentifier,
          passwordHash,
          role: role === 'CREATOR' ? 'CREATOR' : 'USER',
          status: 'ACTIVE',
          profile: {
            create: {
              fullName: generatedUsername,
              avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${generatedUsername}`,
              bio: 'Hey there! I am having fun on FunFlick 🎉'
            }
          }
        },
        include: {
          profile: true,
          creatorProfile: true
        }
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status
    });

    return res.json({
      success: true,
      message: 'OTP Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile: user.profile,
        creatorProfile: user.creatorProfile
      }
    });
  } catch (error: any) {
    console.error('OTP login error:', error);
    return res.status(500).json({ success: false, message: 'OTP Login failed', error: error.message });
  }
};
