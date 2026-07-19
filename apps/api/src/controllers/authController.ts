import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../services/db.js';
import { sendSuccess, sendError } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'hostelhub-super-secret-jwt-key-2026';

export class AuthController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 'VALIDATION_ERROR', 400);
    }

    const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return sendError(res, 'Invalid credentials. User not found.', 'AUTH_FAILED', 401);
    }

    // Demo environment password check (Demo123! or matched password)
    if (password !== 'Demo123!' && password !== user.password) {
      return sendError(res, 'Invalid password.', 'AUTH_FAILED', 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    db.logAudit(user.id, 'LOGIN', 'User', user.id, { role: user.role });

    // Return token and user info without password
    const { passwordHash, password: pwd, ...userWithoutPassword } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, {
      token,
      user: userWithoutPassword
    }, 'Login successful');
  }

  public static async register(req: Request, res: Response) {
    const { email, password, role, firstName, lastName, phone, studentCode, course, year } = req.body;

    if (!email || !password || !role || !firstName || !lastName) {
      return sendError(res, 'Missing required fields', 'VALIDATION_ERROR', 400);
    }

    const existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return sendError(res, 'A user with this email already exists', 'CONFLICT', 409);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
      role,
      firstName,
      lastName,
      phone: phone || null,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256`,
      studentCode: studentCode || `STU-2026-${Math.floor(100 + Math.random() * 900)}`,
      course: course || 'B.Tech CS',
      year: year || 1,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();

    db.logAudit(newUser.id, 'REGISTER', 'User', newUser.id, { role: newUser.role });

    const { passwordHash: _, password: __, ...userWithoutPassword } = newUser;

    return sendSuccess(res, { user: userWithoutPassword }, 'User registered successfully', 201);
  }

  public static async me(req: any, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthenticated', 'UNAUTHORIZED', 401);
    }

    const user = db.data.users.find(u => u.id === req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 'NOT_FOUND', 404);
    }

    const { passwordHash: _, password: __, ...userWithoutPassword } = user;

    // Attach room detail if student
    let room = null;
    if (user.role === 'STUDENT') {
      room = db.data.rooms.find(r => r.id === 'room-204') || db.data.rooms[0];
    }

    return sendSuccess(res, { user: userWithoutPassword, room });
  }

  public static async refresh(req: Request, res: Response) {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return sendError(res, 'Refresh token missing', 'UNAUTHORIZED', 401);
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = db.data.users.find(u => u.id === decoded.id);

      if (!user) {
        return sendError(res, 'User not found', 'UNAUTHORIZED', 401);
      }

      const newToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return sendSuccess(res, { token: newToken });
    } catch (e) {
      return sendError(res, 'Invalid refresh token', 'UNAUTHORIZED', 401);
    }
  }

  public static async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    return sendSuccess(res, null, 'Logged out successfully');
  }

  public static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    return sendSuccess(res, null, `Password reset instructions have been sent to ${email}`);
  }

  public static async resetPassword(req: Request, res: Response) {
    return sendSuccess(res, null, 'Password reset successful. You may now log in.');
  }
}
