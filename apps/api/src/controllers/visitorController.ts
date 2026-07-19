import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class VisitorController {
  public static async create(req: AuthRequest, res: Response) {
    const { visitorName, relation, phone, visitDate, purpose } = req.body;
    const studentId = req.user?.id || 'user-student-1';

    if (!visitorName || !phone || !visitDate || !purpose) {
      return sendError(res, 'All visitor fields are required', 'VALIDATION_ERROR', 400);
    }

    const visitor = {
      id: `vis-${Date.now()}`,
      studentId,
      visitorName,
      relation: relation || 'Guest',
      phone,
      visitDate,
      purpose,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    db.data.visitors.unshift(visitor);
    db.save();
    db.logAudit(studentId, 'CREATE_VISITOR_REQUEST', 'Visitor', visitor.id);

    return sendSuccess(res, visitor, 'Visitor pass request submitted for Warden approval', 201);
  }

  public static async list(req: AuthRequest, res: Response) {
    const role = req.user?.role || 'ADMIN';
    const userId = req.user?.id;

    let list = [...db.data.visitors];
    if (role === 'STUDENT') {
      list = list.filter(v => v.studentId === userId);
    }

    return sendSuccess(res, list);
  }

  public static async approve(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const visitor = db.data.visitors.find(v => v.id === id);

    if (!visitor) {
      return sendError(res, 'Visitor record not found', 'NOT_FOUND', 404);
    }

    visitor.status = 'APPROVED';
    visitor.approvedById = req.user?.id;

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: visitor.studentId,
      title: 'Visitor Pass Approved',
      body: `Your visitor pass for ${visitor.visitorName} on ${visitor.visitDate} has been APPROVED by the Warden.`,
      type: 'VISITOR',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'APPROVE_VISITOR', 'Visitor', id);

    return sendSuccess(res, visitor, 'Visitor pass approved');
  }

  public static async reject(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const visitor = db.data.visitors.find(v => v.id === id);

    if (!visitor) {
      return sendError(res, 'Visitor record not found', 'NOT_FOUND', 404);
    }

    visitor.status = 'REJECTED';

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: visitor.studentId,
      title: 'Visitor Pass Rejected',
      body: `Your visitor pass for ${visitor.visitorName} has been declined by the Warden.`,
      type: 'VISITOR',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'REJECT_VISITOR', 'Visitor', id);

    return sendSuccess(res, visitor, 'Visitor pass rejected');
  }
}
