import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class AttendanceController {
  public static async markBulk(req: AuthRequest, res: Response) {
    const { records, date } = req.body; // records: [{ studentId, status: 'PRESENT'|'ABSENT'|'LEAVE' }]
    const wardenId = req.user?.id || 'user-warden-1';

    if (!records || !Array.isArray(records) || !date) {
      return sendError(res, 'Records array and date are required', 'VALIDATION_ERROR', 400);
    }

    records.forEach((rec: any) => {
      const existingIdx = db.data.attendance.findIndex(a => a.studentId === rec.studentId && a.date === date);
      const newRecord = {
        id: existingIdx >= 0 ? db.data.attendance[existingIdx].id : `att-${Date.now()}-${Math.random()}`,
        studentId: rec.studentId,
        date,
        status: rec.status,
        markedById: wardenId
      };

      if (existingIdx >= 0) {
        db.data.attendance[existingIdx] = newRecord;
      } else {
        db.data.attendance.push(newRecord);
      }
    });

    db.save();
    db.logAudit(wardenId, 'MARK_BULK_ATTENDANCE', 'Attendance', date, { count: records.length });

    return sendSuccess(res, { count: records.length, date }, 'Attendance updated successfully');
  }

  public static async list(req: AuthRequest, res: Response) {
    const role = req.user?.role || 'ADMIN';
    const userId = req.user?.id;

    let list = [...db.data.attendance];
    if (role === 'STUDENT') {
      list = list.filter(a => a.studentId === userId);
    }

    return sendSuccess(res, list);
  }
}
