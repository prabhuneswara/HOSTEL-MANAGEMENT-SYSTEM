import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class LaundryController {
  public static async book(req: AuthRequest, res: Response) {
    const { slot, itemCount } = req.body;
    const studentId = req.user?.id || 'user-student-1';

    if (!slot || !itemCount) {
      return sendError(res, 'Slot time and item count are required', 'VALIDATION_ERROR', 400);
    }

    if (itemCount < 1 || itemCount > 20) {
      return sendError(res, 'Item count must be between 1 and 20 items per wash slot', 'VALIDATION_ERROR', 400);
    }

    const booking = {
      id: `laun-${Date.now()}`,
      studentId,
      slot,
      itemCount: Number(itemCount),
      status: 'BOOKED',
      createdAt: new Date().toISOString()
    };

    db.data.laundry.unshift(booking);

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: studentId,
      title: 'Laundry Slot Booked',
      body: `Your laundry slot for ${new Date(slot).toLocaleString()} (${itemCount} items) is reserved.`,
      type: 'LAUNDRY',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(studentId, 'BOOK_LAUNDRY', 'Laundry', booking.id);

    return sendSuccess(res, booking, 'Laundry slot successfully booked', 201);
  }

  public static async list(req: AuthRequest, res: Response) {
    const role = req.user?.role || 'ADMIN';
    const userId = req.user?.id;

    let list = [...db.data.laundry];
    if (role === 'STUDENT') {
      list = list.filter(l => l.studentId === userId);
    }

    return sendSuccess(res, list);
  }

  public static async updateStatus(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const { status } = req.body;

    const booking = db.data.laundry.find(l => l.id === id);
    if (!booking) {
      return sendError(res, 'Laundry booking not found', 'NOT_FOUND', 404);
    }

    booking.status = status;

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: booking.studentId,
      title: 'Laundry Update',
      body: `Your laundry ticket #${id} status is now: ${status}.`,
      type: 'LAUNDRY',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'UPDATE_LAUNDRY_STATUS', 'Laundry', id, { status });

    return sendSuccess(res, booking, `Laundry status updated to ${status}`);
  }
}
