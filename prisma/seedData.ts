export interface DemoUser {
  id: string;
  email: string;
  password: string; // Plain password for reference
  passwordHash: string;
  role: 'STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN';
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  studentCode?: string;
  course?: string;
  year?: number;
  guardianName?: string;
  guardianPhone?: string;
  specialty?: string;
  hostelName?: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-student-1',
    email: 'student@hostelhub.com',
    password: 'Demo123!',
    // pre-computed bcrypt hash for Demo123!
    passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
    role: 'STUDENT',
    firstName: 'Alex',
    lastName: 'Rivera',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    studentCode: 'STU-2026-042',
    course: 'B.Tech Computer Science',
    year: 3,
    guardianName: 'Robert Rivera',
    guardianPhone: '+1 (555) 987-6543'
  },
  {
    id: 'user-warden-1',
    email: 'warden@hostelhub.com',
    password: 'Demo123!',
    passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
    role: 'WARDEN',
    firstName: 'Dr. Arthur',
    lastName: 'Pendelton',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    hostelName: 'Oak Ridge Hall'
  },
  {
    id: 'user-staff-1',
    email: 'staff@hostelhub.com',
    password: 'Demo123!',
    passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
    role: 'STAFF',
    firstName: 'Marcus',
    lastName: 'Vance',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    specialty: 'ELECTRICAL'
  },
  {
    id: 'user-admin-1',
    email: 'admin@hostelhub.com',
    password: 'Demo123!',
    passwordHash: '$2a$12$e8xL4sL1vH5sBwY0d.z4/eYk2v7o7x0p2p7v.1Vb2s3u4v5w6x7y8',
    role: 'ADMIN',
    firstName: 'Sarah',
    lastName: 'Connor',
    phone: '+1 (555) 567-8901',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'
  }
];

export const DEMO_HOSTELS = [
  {
    id: 'hostel-1',
    name: 'Oak Ridge Hall',
    address: '100 University Campus North, Building A',
    totalRooms: 20
  },
  {
    id: 'hostel-2',
    name: 'Pine Crest Residency',
    address: '104 University Campus West, Building B',
    totalRooms: 15
  }
];

export const DEMO_ROOMS = [
  {
    id: 'room-204',
    hostelId: 'hostel-1',
    roomNumber: '204',
    floor: 2,
    capacity: 2,
    occupied: 1,
    type: 'DOUBLE',
    monthlyRent: 450.00
  },
  {
    id: 'room-101',
    hostelId: 'hostel-1',
    roomNumber: '101',
    floor: 1,
    capacity: 1,
    occupied: 1,
    type: 'SINGLE',
    monthlyRent: 600.00
  },
  {
    id: 'room-301',
    hostelId: 'hostel-1',
    roomNumber: '301',
    floor: 3,
    capacity: 4,
    occupied: 3,
    type: 'DORMITORY',
    monthlyRent: 300.00
  }
];

export const DEMO_COMPLAINTS = [
  {
    id: 'comp-101',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    roomNumber: '204',
    category: 'ELECTRICAL',
    priority: 'HIGH',
    status: 'OPEN',
    title: 'Ceiling fan making loud squeaking noise & oscillating violently',
    description: 'The ceiling fan in Room 204 started wobbling significantly last night and makes a high-pitched squeaking noise at speed 3.',
    aiSummary: 'AI Analysis: High priority electrical issue due to potential mechanical failure of ceiling fixture. Recommended inspector: Marcus Vance.',
    assignedStaffId: null,
    resolvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    images: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=400']
  },
  {
    id: 'comp-102',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    roomNumber: '204',
    category: 'PLUMBING',
    priority: 'URGENT',
    status: 'ASSIGNED',
    title: 'Washroom sink pipe slow leak onto floor',
    description: 'Noticeable water pooling underneath the bathroom sink. The elbow joint connection appears loose.',
    aiSummary: 'AI Analysis: Urgent plumbing risk. Immediate moisture containment required to prevent floor damage.',
    assignedStaffId: 'user-staff-1',
    resolvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    images: []
  },
  {
    id: 'comp-103',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    roomNumber: '204',
    category: 'CLEANING',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    title: 'Floor 2 hallway window glass dust & streak cleaning',
    description: 'Post-rain dust on outer glass panes near room 204 entry.',
    aiSummary: 'AI Analysis: Routine janitorial maintenance.',
    assignedStaffId: 'user-staff-1',
    resolvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400']
  }
];

export const DEMO_VISITORS = [
  {
    id: 'vis-1',
    studentId: 'user-student-1',
    visitorName: 'Robert Rivera',
    relation: 'Father',
    phone: '+1 (555) 987-6543',
    visitDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    purpose: 'Delivering semester textbooks & personal supplies',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  },
  {
    id: 'vis-2',
    studentId: 'user-student-1',
    visitorName: 'Samantha Rivera',
    relation: 'Sister',
    phone: '+1 (555) 876-5432',
    visitDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    purpose: 'Weekend campus visit',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const DEMO_LAUNDRY = [
  {
    id: 'laun-1',
    studentId: 'user-student-1',
    slot: '2026-07-20T16:00:00.000Z',
    itemCount: 8,
    status: 'BOOKED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'laun-2',
    studentId: 'user-student-1',
    slot: '2026-07-15T14:00:00.000Z',
    itemCount: 12,
    status: 'COLLECTED',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const DEMO_PAYMENTS = [
  {
    id: 'pay-1',
    studentId: 'user-student-1',
    amount: 450.00,
    type: 'ROOM_RENT',
    status: 'PENDING',
    dueDate: '2026-07-25',
    paidDate: null,
    receiptUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'pay-2',
    studentId: 'user-student-1',
    amount: 180.00,
    type: 'MESS_FEE',
    status: 'PAID',
    dueDate: '2026-07-10',
    paidDate: '2026-07-05',
    receiptUrl: 'https://hostelhub.demo/receipts/REC-2026-0705.pdf',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'pay-3',
    studentId: 'user-student-1',
    amount: 300.00,
    type: 'SECURITY_DEPOSIT',
    status: 'PAID',
    dueDate: '2026-06-01',
    paidDate: '2026-05-28',
    receiptUrl: 'https://hostelhub.demo/receipts/REC-2026-0528.pdf',
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString()
  }
];

export const DEMO_NOTICES = [
  {
    id: 'not-1',
    title: 'Hostel Annual Electrical Grid Maintenance Notice',
    body: 'Please be informed that backup generator testing and electrical panel maintenance will be conducted this Saturday between 10:00 AM and 02:00 PM. Brief power interruptions may occur.',
    audience: ['STUDENT', 'WARDEN', 'STAFF', 'ADMIN'],
    postedByName: 'Dr. Arthur Pendelton (Warden)',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'not-2',
    title: 'Revised Campus Gate & Visitor Entry Hours',
    body: 'Effective immediately, all student visitor requests must be submitted at least 24 hours in advance via the HostelHub portal for Warden verification.',
    audience: ['STUDENT', 'WARDEN'],
    postedByName: 'Administration Office',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Complaint Status Updated',
    body: 'Your complaint #comp-102 (Washroom sink pipe) has been assigned to Marcus Vance (Electrical/Plumbing).',
    type: 'COMPLAINT',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Laundry Slot Confirmation',
    body: 'Your laundry booking for Today at 04:00 PM (8 items) is confirmed.',
    type: 'LAUNDRY',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];
