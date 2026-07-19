import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AdminController {
  public static async getAnalyticsOverview(req: AuthRequest, res: Response) {
    const totalUsers = db.data.users.length;
    const totalStudents = db.data.users.filter(u => u.role === 'STUDENT').length;
    const totalComplaints = db.data.complaints.length;
    const openComplaints = db.data.complaints.filter(c => c.status === 'OPEN' || c.status === 'ASSIGNED').length;
    const resolvedComplaints = db.data.complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    
    // Revenue calculations
    const paidPayments = db.data.payments.filter(p => p.status === 'PAID');
    const pendingPayments = db.data.payments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE');
    
    const revenueCollected = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);
    const revenuePending = pendingPayments.reduce((acc, p) => acc + Number(p.amount), 0);

    const occupancyRate = 88.5; // percentage

    const complaintTrends = [
      { month: 'Jan', ELECTRICAL: 12, PLUMBING: 8, CLEANING: 15, WIFI: 5 },
      { month: 'Feb', ELECTRICAL: 14, PLUMBING: 10, CLEANING: 12, WIFI: 8 },
      { month: 'Mar', ELECTRICAL: 9, PLUMBING: 15, CLEANING: 10, WIFI: 12 },
      { month: 'Apr', ELECTRICAL: 18, PLUMBING: 6, CLEANING: 14, WIFI: 9 },
      { month: 'May', ELECTRICAL: 11, PLUMBING: 12, CLEANING: 8, WIFI: 14 },
      { month: 'Jun', ELECTRICAL: 15, PLUMBING: 9, CLEANING: 16, WIFI: 7 },
      { month: 'Jul', ELECTRICAL: 8, PLUMBING: 11, CLEANING: 9, WIFI: 10 }
    ];

    const revenueMonthly = [
      { month: 'Jan', collected: 18500, pending: 1200 },
      { month: 'Feb', collected: 19200, pending: 800 },
      { month: 'Mar', collected: 21000, pending: 1500 },
      { month: 'Apr', collected: 20400, pending: 950 },
      { month: 'May', collected: 22100, pending: 600 },
      { month: 'Jun', collected: 23500, pending: 400 },
      { month: 'Jul', collected: revenueCollected || 24800, pending: revenuePending || 1850 }
    ];

    return sendSuccess(res, {
      kpis: {
        totalUsers,
        totalStudents,
        totalComplaints,
        openComplaints,
        resolvedComplaints,
        revenueCollected,
        revenuePending,
        occupancyRate
      },
      charts: {
        complaintTrends,
        revenueMonthly
      }
    });
  }

  public static async getUsers(req: AuthRequest, res: Response) {
    const users = db.data.users.map(({ passwordHash, password, ...u }) => u);
    return sendSuccess(res, users);
  }

  public static async createUser(req: AuthRequest, res: Response) {
    const { email, role, firstName, lastName, phone, specialty } = req.body;

    if (!email || !role || !firstName || !lastName) {
      return sendError(res, 'Email, role, first name and last name are required', 'VALIDATION_ERROR', 400);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: 'Demo123!',
      passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
      role,
      firstName,
      lastName,
      phone: phone || null,
      specialty: specialty || null,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256`,
      createdAt: new Date().toISOString()
    };

    db.data.users.push(newUser);
    db.save();
    db.logAudit(req.user?.id || 'sys', 'ADMIN_CREATE_USER', 'User', newUser.id, { role });

    const { passwordHash: _, password: __, ...userWithoutPwd } = newUser;
    return sendSuccess(res, userWithoutPwd, 'User created successfully', 201);
  }

  public static async updateUser(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const user = db.data.users.find(u => u.id === id);

    if (!user) {
      return sendError(res, 'User not found', 'NOT_FOUND', 404);
    }

    Object.assign(user, req.body);
    db.save();
    db.logAudit(req.user?.id || 'sys', 'ADMIN_UPDATE_USER', 'User', id);

    const { passwordHash: _, password: __, ...userWithoutPwd } = user;
    return sendSuccess(res, userWithoutPwd, 'User updated successfully');
  }

  public static async deleteUser(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const index = db.data.users.findIndex(u => u.id === id);

    if (index === -1) {
      return sendError(res, 'User not found', 'NOT_FOUND', 404);
    }

    db.data.users.splice(index, 1);
    db.save();
    db.logAudit(req.user?.id || 'sys', 'ADMIN_DELETE_USER', 'User', id);

    return sendSuccess(res, null, 'User deleted successfully');
  }

  public static async getHostels(req: AuthRequest, res: Response) {
    return sendSuccess(res, { hostels: db.data.hostels, rooms: db.data.rooms });
  }

  public static async getAuditLogs(req: AuthRequest, res: Response) {
    return sendSuccess(res, db.data.auditLogs);
  }
}
