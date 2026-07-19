import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class SOSController {
  public static async triggerSOS(req: AuthRequest, res: Response) {
    const { location, notes } = req.body;
    const user = req.user;

    const studentName = user ? `${user.firstName} ${user.lastName}` : 'Student in Room 204';
    const sosLocation = location || 'Oak Ridge Hall - Room 204';

    const sosAlert = {
      id: `sos-${Date.now()}`,
      studentId: user?.id || 'user-student-1',
      studentName,
      location: sosLocation,
      notes: notes || 'EMERGENCY SOS BUTTON TRIGGERED',
      timestamp: new Date().toISOString()
    };

    // Broadcast urgent notification to all Wardens, Staff, and Admins
    db.data.users.forEach(u => {
      if (u.role === 'WARDEN' || u.role === 'STAFF' || u.role === 'ADMIN') {
        db.data.notifications.unshift({
          id: `notif-sos-${Date.now()}-${Math.random()}`,
          userId: u.id,
          title: '🚨 URGENT EMERGENCY SOS ALERT',
          body: `Emergency signal sent by ${studentName} at ${sosLocation}! Immediate response required.`,
          type: 'SOS',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    db.save();
    db.logAudit(user?.id || 'sys', 'TRIGGER_EMERGENCY_SOS', 'SOSAlert', sosAlert.id, { location: sosLocation });

    return sendSuccess(res, sosAlert, '🚨 EMERGENCY SOS ALERT BROADCAST SENT TO ALL DUTY WARDENS & SECURITY STAFF');
  }
}
