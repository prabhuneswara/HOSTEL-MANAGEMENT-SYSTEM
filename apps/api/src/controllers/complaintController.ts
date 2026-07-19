import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AIService } from '../services/aiService.js';

export class ComplaintController {
  public static async create(req: AuthRequest, res: Response) {
    const { title, description, images } = req.body;
    const userId = req.user?.id || 'user-student-1';
    const student = db.data.users.find(u => u.id === userId) || db.data.users[0];

    if (!title || !description) {
      return sendError(res, 'Title and description are required', 'VALIDATION_ERROR', 400);
    }

    // AI Categorization & Priority detection
    const aiResult = await AIService.categorizeAndPrioritizeComplaint(title, description);

    const complaint = {
      id: `comp-${Date.now()}`,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      roomNumber: '204',
      category: aiResult.category,
      priority: aiResult.priority,
      status: 'OPEN',
      title,
      description,
      aiSummary: aiResult.aiSummary,
      assignedStaffId: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      images: images || []
    };

    db.data.complaints.unshift(complaint);

    // Create Notification for Student
    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: student.id,
      title: 'Complaint Registered',
      body: `Your ticket "${title}" has been registered as ${aiResult.category} (${aiResult.priority} priority).`,
      type: 'COMPLAINT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(student.id, 'CREATE_COMPLAINT', 'Complaint', complaint.id, { category: aiResult.category, priority: aiResult.priority });

    return sendSuccess(res, complaint, 'Complaint submitted successfully', 201);
  }

  public static async list(req: AuthRequest, res: Response) {
    const role = req.user?.role || 'ADMIN';
    const userId = req.user?.id;
    let list = [...db.data.complaints];

    if (role === 'STUDENT') {
      list = list.filter(c => c.studentId === userId);
    } else if (role === 'STAFF') {
      list = list.filter(c => c.assignedStaffId === userId || c.status === 'OPEN' || c.status === 'ASSIGNED');
    }

    return sendSuccess(res, list);
  }

  public static async getById(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const complaint = db.data.complaints.find(c => c.id === id);

    if (!complaint) {
      return sendError(res, 'Complaint not found', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, complaint);
  }

  public static async assign(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const { staffId } = req.body;

    const complaint = db.data.complaints.find(c => c.id === id);
    if (!complaint) {
      return sendError(res, 'Complaint not found', 'NOT_FOUND', 404);
    }

    const staffUser = db.data.users.find(u => u.id === staffId);
    complaint.assignedStaffId = staffId;
    complaint.status = 'ASSIGNED';

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: complaint.studentId,
      title: 'Complaint Assigned',
      body: `Your complaint #${id} has been assigned to ${staffUser ? staffUser.firstName : 'Duty Staff'}.`,
      type: 'COMPLAINT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'ASSIGN_COMPLAINT', 'Complaint', id, { staffId });

    return sendSuccess(res, complaint, 'Complaint assigned to staff');
  }

  public static async updateStatus(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const { status, completionProofUrl } = req.body;

    const complaint = db.data.complaints.find(c => c.id === id);
    if (!complaint) {
      return sendError(res, 'Complaint not found', 'NOT_FOUND', 404);
    }

    complaint.status = status;
    if (status === 'RESOLVED' || status === 'CLOSED') {
      complaint.resolvedAt = new Date().toISOString();
    }

    if (completionProofUrl && !complaint.images.includes(completionProofUrl)) {
      complaint.images.push(completionProofUrl);
    }

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: complaint.studentId,
      title: `Complaint ${status}`,
      body: `Your ticket "${complaint.title}" status has been updated to ${status}.`,
      type: 'COMPLAINT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'UPDATE_COMPLAINT_STATUS', 'Complaint', id, { status });

    return sendSuccess(res, complaint, `Complaint status updated to ${status}`);
  }
}
