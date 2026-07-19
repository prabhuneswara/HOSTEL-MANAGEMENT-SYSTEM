import { Response } from 'express';
import { db } from '../services/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class PaymentController {
  public static async list(req: AuthRequest, res: Response) {
    const role = req.user?.role || 'ADMIN';
    const userId = req.user?.id;

    let list = [...db.data.payments];
    if (role === 'STUDENT') {
      list = list.filter(p => p.studentId === userId);
    }

    return sendSuccess(res, list);
  }

  public static async markPaid(req: AuthRequest, res: Response) {
    const id = req.params.id as string;
    const payment = db.data.payments.find(p => p.id === id);

    if (!payment) {
      return sendError(res, 'Payment invoice not found', 'NOT_FOUND', 404);
    }

    payment.status = 'PAID';
    payment.paidDate = new Date().toISOString().split('T')[0];
    payment.receiptUrl = `https://hostelhub.demo/receipts/REC-${Date.now()}.pdf`;

    db.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: payment.studentId,
      title: 'Payment Received',
      body: `Your payment of $${payment.amount} for ${payment.type} has been confirmed. Receipt generated.`,
      type: 'PAYMENT',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    db.save();
    db.logAudit(req.user?.id || 'sys', 'MARK_PAYMENT_PAID', 'Payment', id, { amount: payment.amount });

    return sendSuccess(res, payment, 'Payment successfully recorded and receipt generated');
  }
}
