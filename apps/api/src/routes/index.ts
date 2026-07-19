import { Router } from 'express';
import { checkAuth, checkRole } from '../middleware/auth.js';
import { AuthController } from '../controllers/authController.js';
import { ComplaintController } from '../controllers/complaintController.js';
import { VisitorController } from '../controllers/visitorController.js';
import { LaundryController } from '../controllers/laundryController.js';
import { AttendanceController } from '../controllers/attendanceController.js';
import { PaymentController } from '../controllers/paymentController.js';
import { NoticeController } from '../controllers/noticeController.js';
import { AdminController } from '../controllers/adminController.js';
import { AIController } from '../controllers/aiController.js';
import { SOSController } from '../controllers/sosController.js';

const router = Router();

// --- AUTH ROUTES ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/reset-password', AuthController.resetPassword);
router.get('/students/me', checkAuth, AuthController.me);

// --- COMPLAINTS ROUTES ---
router.post('/complaints', checkAuth, checkRole(['STUDENT', 'ADMIN']), ComplaintController.create);
router.get('/complaints', checkAuth, ComplaintController.list);
router.get('/complaints/:id', checkAuth, ComplaintController.getById);
router.patch('/complaints/:id/assign', checkAuth, checkRole(['WARDEN', 'ADMIN']), ComplaintController.assign);
router.patch('/complaints/:id/status', checkAuth, checkRole(['WARDEN', 'STAFF', 'ADMIN']), ComplaintController.updateStatus);

// --- VISITORS ROUTES ---
router.post('/visitors', checkAuth, checkRole(['STUDENT', 'ADMIN']), VisitorController.create);
router.get('/visitors', checkAuth, VisitorController.list);
router.patch('/visitors/:id/approve', checkAuth, checkRole(['WARDEN', 'ADMIN']), VisitorController.approve);
router.patch('/visitors/:id/reject', checkAuth, checkRole(['WARDEN', 'ADMIN']), VisitorController.reject);

// --- LAUNDRY ROUTES ---
router.post('/laundry', checkAuth, checkRole(['STUDENT', 'ADMIN']), LaundryController.book);
router.get('/laundry', checkAuth, LaundryController.list);
router.patch('/laundry/:id/status', checkAuth, checkRole(['STAFF', 'ADMIN']), LaundryController.updateStatus);

// --- ATTENDANCE ROUTES ---
router.post('/attendance', checkAuth, checkRole(['WARDEN', 'ADMIN']), AttendanceController.markBulk);
router.get('/attendance', checkAuth, AttendanceController.list);

// --- PAYMENTS ROUTES ---
router.get('/payments', checkAuth, PaymentController.list);
router.post('/payments/:id/mark-paid', checkAuth, PaymentController.markPaid);

// --- NOTICES ROUTES ---
router.post('/notices', checkAuth, checkRole(['WARDEN', 'ADMIN']), NoticeController.create);
router.get('/notices', checkAuth, NoticeController.list);

// --- ADMIN & ANALYTICS ROUTES ---
router.get('/admin/analytics/overview', checkAuth, checkRole(['ADMIN']), AdminController.getAnalyticsOverview);
router.get('/admin/users', checkAuth, checkRole(['ADMIN']), AdminController.getUsers);
router.post('/admin/users', checkAuth, checkRole(['ADMIN']), AdminController.createUser);
router.patch('/admin/users/:id', checkAuth, checkRole(['ADMIN']), AdminController.updateUser);
router.delete('/admin/users/:id', checkAuth, checkRole(['ADMIN']), AdminController.deleteUser);
router.get('/admin/hostels', checkAuth, checkRole(['ADMIN', 'WARDEN']), AdminController.getHostels);
router.get('/admin/audit-logs', checkAuth, checkRole(['ADMIN']), AdminController.getAuditLogs);

// --- AI FEATURES ROUTES ---
router.post('/ai/categorize-complaint', checkAuth, AIController.categorizeComplaint);
router.post('/ai/maintenance-summary', checkAuth, checkRole(['ADMIN']), AIController.generateMaintenanceSummary);
router.post('/ai/chat', checkAuth, AIController.chat);

// --- EMERGENCY SOS ROUTE ---
router.post('/sos', checkAuth, checkRole(['STUDENT', 'WARDEN', 'STAFF', 'ADMIN']), SOSController.triggerSOS);

export default router;
