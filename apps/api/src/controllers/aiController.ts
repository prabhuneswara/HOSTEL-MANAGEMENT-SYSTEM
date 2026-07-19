import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AIService } from '../services/aiService.js';

export class AIController {
  public static async categorizeComplaint(req: AuthRequest, res: Response) {
    const { title, description } = req.body;

    if (!title || !description) {
      return sendError(res, 'Title and description are required for AI analysis', 'VALIDATION_ERROR', 400);
    }

    const result = await AIService.categorizeAndPrioritizeComplaint(title, description);
    return sendSuccess(res, result);
  }

  public static async generateMaintenanceSummary(req: AuthRequest, res: Response) {
    const complaints = db.data.complaints;
    const summary = await AIService.generateMaintenanceSummary(complaints);
    return sendSuccess(res, summary);
  }

  public static async chat(req: AuthRequest, res: Response) {
    const { message } = req.body;
    const studentName = req.user ? `${req.user.firstName}` : 'Student';

    if (!message) {
      return sendError(res, 'Message text is required', 'VALIDATION_ERROR', 400);
    }

    const reply = await AIService.handleStudentChat(message, studentName);
    return sendSuccess(res, { reply, timestamp: new Date().toISOString() });
  }
}
