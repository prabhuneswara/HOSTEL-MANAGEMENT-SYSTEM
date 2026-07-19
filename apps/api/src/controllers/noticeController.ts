import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class NoticeController {
  public static async create(req: AuthRequest, res: Response) {
    const { title, body, audience } = req.body;
    const user = req.user;

    if (!title || !body) {
      return sendError(res, 'Title and body are required', 'VALIDATION_ERROR', 400);
    }

    const notice = {
      id: `not-${Date.now()}`,
      title,
      body,
      audience: audience || ['STUDENT', 'WARDEN', 'STAFF', 'ADMIN'],
      postedByName: `${user?.firstName} ${user?.lastName} (${user?.role})`,
      createdAt: new Date().toISOString()
    };

    db.data.notices.unshift(notice);

    // Notify targeted users
    db.data.users.forEach(u => {
      if (notice.audience.includes(u.role)) {
        db.data.notifications.unshift({
          id: `notif-${Date.now()}-${Math.random()}`,
          userId: u.id,
          title: `New Notice: ${title}`,
          body: body.substring(0, 100) + '...',
          type: 'NOTICE',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    db.save();
    db.logAudit(user?.id || 'sys', 'CREATE_NOTICE', 'Notice', notice.id);

    return sendSuccess(res, notice, 'Notice published successfully', 201);
  }

  public static async list(req: AuthRequest, res: Response) {
    const userRole = req.user?.role || 'STUDENT';
    const list = db.data.notices.filter(n => !n.audience || n.audience.includes(userRole));

    return sendSuccess(res, list);
  }
}
