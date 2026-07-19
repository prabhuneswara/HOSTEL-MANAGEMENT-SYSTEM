export type Role = 'STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN';

export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'DORMITORY';

export type ComplaintCategory = 'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'WIFI' | 'FURNITURE' | 'SECURITY' | 'OTHER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export type VisitorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type LaundryStatus = 'BOOKED' | 'IN_PROGRESS' | 'READY' | 'COLLECTED' | 'CANCELLED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LEAVE';

export type PaymentType = 'ROOM_RENT' | 'MESS_FEE' | 'SECURITY_DEPOSIT' | 'FINE' | 'OTHER';

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'REFUNDED';

export type NotificationType = 'COMPLAINT' | 'VISITOR' | 'LAUNDRY' | 'PAYMENT' | 'NOTICE' | 'SOS' | 'SYSTEM';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  studentCode?: string;
  course?: string;
  year?: number;
  specialty?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: RoomType;
  monthlyRent: number;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  title: string;
  description: string;
  aiSummary?: string;
  assignedStaffId?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  images: string[];
}

export interface Visitor {
  id: string;
  studentId: string;
  visitorName: string;
  relation: string;
  phone: string;
  visitDate: string;
  purpose: string;
  status: VisitorStatus;
  createdAt: string;
}

export interface Laundry {
  id: string;
  studentId: string;
  slot: string;
  itemCount: number;
  status: LaundryStatus;
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  markedById: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string | null;
  receiptUrl?: string | null;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  audience: Role[];
  postedByName: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
