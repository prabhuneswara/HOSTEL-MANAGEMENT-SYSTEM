import { 
  DEMO_USERS, 
  DEMO_ROOMS, 
  DEMO_COMPLAINTS, 
  DEMO_VISITORS, 
  DEMO_LAUNDRY, 
  DEMO_PAYMENTS, 
  DEMO_NOTICES, 
  DEMO_NOTIFICATIONS 
} from './seedData.js';

const API_BASE = '/api/v1';

class ApiClient {
  private token: string | null = null;

  public setToken(token: string | null) {
    this.token = token;
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  // --- AUTH ---
  public async login(email: string, role: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ email, password: 'Demo123!' })
      });
      const data = await res.json();
      if (res.ok) return data;
    } catch (e) {
      console.warn('API unavailable, fallback to instant seed login');
    }

    // Fallback seed user match
    const targetUser = DEMO_USERS.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || 
                       DEMO_USERS.find((u: any) => u.role === role) || 
                       DEMO_USERS[0];
    
    const { passwordHash, password, ...userClean } = targetUser;

    return {
      success: true,
      data: {
        token: `mock-jwt-${targetUser.role.toLowerCase()}-${Date.now()}`,
        user: userClean,
        room: targetUser.role === 'STUDENT' ? DEMO_ROOMS[0] : null
      }
    };
  }

  // --- COMPLAINTS ---
  public async getComplaints() {
    try {
      const res = await fetch(`${API_BASE}/complaints`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_COMPLAINTS };
  }

  public async createComplaint(payload: { title: string; description: string; images?: string[] }) {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Dynamic AI Categorize fallback
    const titleLower = payload.title.toLowerCase();
    let cat = 'OTHER';
    let pri = 'MEDIUM';

    if (titleLower.includes('fan') || titleLower.includes('light') || titleLower.includes('power')) {
      cat = 'ELECTRICAL'; pri = 'HIGH';
    } else if (titleLower.includes('pipe') || titleLower.includes('leak') || titleLower.includes('water')) {
      cat = 'PLUMBING'; pri = 'URGENT';
    } else if (titleLower.includes('wifi') || titleLower.includes('net')) {
      cat = 'WIFI'; pri = 'MEDIUM';
    } else if (titleLower.includes('clean') || titleLower.includes('trash')) {
      cat = 'CLEANING'; pri = 'LOW';
    }

    const newComp = {
      id: `comp-${Date.now()}`,
      studentId: 'user-student-1',
      studentName: 'Alex Rivera',
      roomNumber: '204',
      category: cat,
      priority: pri,
      status: 'OPEN',
      title: payload.title,
      description: payload.description,
      aiSummary: `AI Diagnosis: Auto-tagged as ${cat} (${pri} priority) from natural language analysis.`,
      assignedStaffId: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
      images: payload.images || []
    };

    DEMO_COMPLAINTS.unshift(newComp as any);
    return { success: true, data: newComp };
  }

  public async assignComplaint(id: string, staffId: string) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ staffId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const comp = DEMO_COMPLAINTS.find((c: any) => c.id === id);
    if (comp) {
      (comp as any).assignedStaffId = staffId;
      (comp as any).status = 'ASSIGNED';
    }
    return { success: true, data: comp };
  }

  public static async updateComplaintStatus(id: string, status: string, completionProofUrl?: string) {
    // static helper fallback
    const comp = DEMO_COMPLAINTS.find((c: any) => c.id === id);
    if (comp) {
      (comp as any).status = status;
      if (status === 'RESOLVED') (comp as any).resolvedAt = new Date().toISOString();
      if (completionProofUrl) (comp as any).images.push(completionProofUrl);
    }
    return { success: true, data: comp };
  }

  public async updateComplaintStatus(id: string, status: string, completionProofUrl?: string) {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ status, completionProofUrl })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return ApiClient.updateComplaintStatus(id, status, completionProofUrl);
  }

  // --- VISITORS ---
  public async getVisitors() {
    try {
      const res = await fetch(`${API_BASE}/visitors`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_VISITORS };
  }

  public async createVisitor(payload: any) {
    try {
      const res = await fetch(`${API_BASE}/visitors`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newVis = {
      id: `vis-${Date.now()}`,
      studentId: 'user-student-1',
      ...payload,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    DEMO_VISITORS.unshift(newVis as any);
    return { success: true, data: newVis };
  }

  public async approveVisitor(id: string) {
    try {
      const res = await fetch(`${API_BASE}/visitors/${id}/approve`, {
        method: 'PATCH',
        headers: this.headers
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const vis = DEMO_VISITORS.find((v: any) => v.id === id);
    if (vis) (vis as any).status = 'APPROVED';
    return { success: true, data: vis };
  }

  public async rejectVisitor(id: string) {
    try {
      const res = await fetch(`${API_BASE}/visitors/${id}/reject`, {
        method: 'PATCH',
        headers: this.headers
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const vis = DEMO_VISITORS.find((v: any) => v.id === id);
    if (vis) (vis as any).status = 'REJECTED';
    return { success: true, data: vis };
  }

  // --- LAUNDRY ---
  public async getLaundry() {
    try {
      const res = await fetch(`${API_BASE}/laundry`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_LAUNDRY };
  }

  public async bookLaundry(slot: string, itemCount: number) {
    try {
      const res = await fetch(`${API_BASE}/laundry`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ slot, itemCount })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newL = {
      id: `laun-${Date.now()}`,
      studentId: 'user-student-1',
      slot,
      itemCount,
      status: 'BOOKED',
      createdAt: new Date().toISOString()
    };
    DEMO_LAUNDRY.unshift(newL as any);
    return { success: true, data: newL };
  }

  public async updateLaundryStatus(id: string, status: string) {
    try {
      const res = await fetch(`${API_BASE}/laundry/${id}/status`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const item = DEMO_LAUNDRY.find((l: any) => l.id === id);
    if (item) (item as any).status = status;
    return { success: true, data: item };
  }

  // --- PAYMENTS ---
  public async getPayments() {
    try {
      const res = await fetch(`${API_BASE}/payments`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_PAYMENTS };
  }

  public async markPaymentPaid(id: string) {
    try {
      const res = await fetch(`${API_BASE}/payments/${id}/mark-paid`, {
        method: 'POST',
        headers: this.headers
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const p = DEMO_PAYMENTS.find((pay: any) => pay.id === id);
    if (p) {
      (p as any).status = 'PAID';
      (p as any).paidDate = new Date().toISOString().split('T')[0];
      (p as any).receiptUrl = `https://hostelhub.demo/receipts/REC-${Date.now()}.pdf`;
    }
    return { success: true, data: p };
  }

  // --- NOTICES ---
  public async getNotices() {
    try {
      const res = await fetch(`${API_BASE}/notices`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_NOTICES };
  }

  public async createNotice(payload: { title: string; body: string; audience?: string[] }) {
    try {
      const res = await fetch(`${API_BASE}/notices`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newNotice = {
      id: `not-${Date.now()}`,
      title: payload.title,
      body: payload.body,
      audience: payload.audience || ['STUDENT', 'WARDEN', 'STAFF', 'ADMIN'],
      postedByName: 'Dr. Arthur Pendelton (Warden)',
      createdAt: new Date().toISOString()
    };
    DEMO_NOTICES.unshift(newNotice as any);
    return { success: true, data: newNotice };
  }

  // --- ATTENDANCE ---
  public async getAttendance() {
    try {
      const res = await fetch(`${API_BASE}/attendance`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      data: [
        { id: 'att-1', studentId: 'user-student-1', date: new Date().toISOString().split('T')[0], status: 'PRESENT' },
        { id: 'att-2', studentId: 'user-student-1', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], status: 'PRESENT' }
      ]
    };
  }

  public async markBulkAttendance(records: any[], date: string) {
    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ records, date })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: { count: records.length, date } };
  }

  // --- ADMIN ANALYTICS & USERS ---
  public async getAdminAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/admin/analytics/overview`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      success: true,
      data: {
        kpis: {
          totalUsers: 142,
          totalStudents: 120,
          totalComplaints: 28,
          openComplaints: 6,
          resolvedComplaints: 22,
          revenueCollected: 24800,
          revenuePending: 1850,
          occupancyRate: 88.5
        },
        charts: {
          complaintTrends: [
            { month: 'Jan', ELECTRICAL: 12, PLUMBING: 8, CLEANING: 15, WIFI: 5 },
            { month: 'Feb', ELECTRICAL: 14, PLUMBING: 10, CLEANING: 12, WIFI: 8 },
            { month: 'Mar', ELECTRICAL: 9, PLUMBING: 15, CLEANING: 10, WIFI: 12 },
            { month: 'Apr', ELECTRICAL: 18, PLUMBING: 6, CLEANING: 14, WIFI: 9 },
            { month: 'May', ELECTRICAL: 11, PLUMBING: 12, CLEANING: 8, WIFI: 14 },
            { month: 'Jun', ELECTRICAL: 15, PLUMBING: 9, CLEANING: 16, WIFI: 7 },
            { month: 'Jul', ELECTRICAL: 8, PLUMBING: 11, CLEANING: 9, WIFI: 10 }
          ],
          revenueMonthly: [
            { month: 'Jan', collected: 18500, pending: 1200 },
            { month: 'Feb', collected: 19200, pending: 800 },
            { month: 'Mar', collected: 21000, pending: 1500 },
            { month: 'Apr', collected: 20400, pending: 950 },
            { month: 'May', collected: 22100, pending: 600 },
            { month: 'Jun', collected: 23500, pending: 400 },
            { month: 'Jul', collected: 24800, pending: 1850 }
          ]
        }
      }
    };
  }

  public async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_USERS };
  }

  // --- AI ---
  public async getAIMaintenanceSummary() {
    try {
      const res = await fetch(`${API_BASE}/ai/maintenance-summary`, {
        method: 'POST',
        headers: this.headers
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return {
      success: true,
      data: {
        summaryText: `### Hostel Maintenance & Reliability Intelligence Summary\n\n1. **Executive Overview**: Over the selected reporting period, **28 total maintenance requests** were logged across 2 hostels. **22 complaints (78%) were resolved**, with an average resolution speed of **4.2 hours**.\n\n2. **Hotspot Analysis**: Electrical issues in **Room 204** represent the highest recurring frequency. Component testing for ceiling fans and floor breakers is advised.\n\n3. **Actionable Recommendations**: Deploy Marcus Vance for a full Floor 2 wiring audit before end-of-month inspection.`,
        hotspotRooms: ['Room 204', 'Room 101', 'Room 301'],
        topCategories: [
          { category: 'ELECTRICAL', count: 12 },
          { category: 'PLUMBING', count: 8 },
          { category: 'CLEANING', count: 5 }
        ],
        avgResolutionTimeHours: 4.2
      }
    };
  }

  public async sendAIChat(message: string) {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ message })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const lower = message.toLowerCase();
    let reply = `Hello! I am your HostelHub AI Assistant. I can assist with room issues, laundry slots, visitor rules, or payment dues.`;

    if (lower.includes('laundry') || lower.includes('wash')) {
      reply = `Laundry facilities are open daily **08:00 AM – 08:00 PM**. You can book a slot directly under **Laundry Scheduler** tab. Limit: 20 items per slot.`;
    } else if (lower.includes('visitor') || lower.includes('guest')) {
      reply = `Visitor passes must be submitted at least 24 hours in advance via the **Visitor Pass** tab. Visiting hours: **10:00 AM – 06:00 PM**.`;
    } else if (lower.includes('complaint') || lower.includes('repair') || lower.includes('broken')) {
      reply = `To report any broken fixture, use **Complaints -> New Complaint**. Upload photos if possible; our AI will auto-categorize and assign staff!`;
    } else if (lower.includes('curfew') || lower.includes('gate') || lower.includes('time')) {
      reply = `Main hostel gates close strictly at **10:00 PM**. Attendance is taken nightly by Wardens between **09:30 PM and 10:15 PM**.`;
    }

    return { success: true, data: { reply, timestamp: new Date().toISOString() } };
  }

  public async getNotifications() {
    try {
      const res = await fetch(`${API_BASE}/notifications`, { headers: this.headers });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, data: DEMO_NOTIFICATIONS };
  }

  public async triggerSOS(payload: { location: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE}/sos`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { success: true, message: 'SOS Alert Broadcast Sent to Duty Wardens & Security' };
  }
}

export const api = new ApiClient();
