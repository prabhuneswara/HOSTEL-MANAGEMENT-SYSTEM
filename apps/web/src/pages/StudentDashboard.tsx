import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext.js';
import { api } from '../services/api.js';
import { Complaint, Visitor, Laundry, Payment, Notice } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { 
  Wrench, 
  UserCheck, 
  Shirt, 
  CreditCard, 
  CalendarCheck, 
  Bell, 
  Plus, 
  Building,
  User,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { user, addNotification } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [laundries, setLaundries] = useState<Laundry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Modals
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isLaundryModalOpen, setIsLaundryModalOpen] = useState(false);

  // Form states
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('PLUMBING');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const [visitorName, setVisitorName] = useState('');
  const [visitorRelation, setVisitorRelation] = useState('PARENT');
  const [visitDate, setVisitDate] = useState('');
  const [visitPurpose, setVisitPurpose] = useState('');
  const [submittingVisitor, setSubmittingVisitor] = useState(false);

  const [laundryDate, setLaundryDate] = useState('');
  const [laundrySlot, setLaundrySlot] = useState('10:00 AM - 11:30 AM');
  const [submittingLaundry, setSubmittingLaundry] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cRes, vRes, lRes, pRes, nRes] = await Promise.all([
      api.getComplaints(),
      api.getVisitors(),
      api.getLaundry(),
      api.getPayments(),
      api.getNotices()
    ]);

    if (cRes.success) setComplaints(cRes.data);
    if (vRes.success) setVisitors(vRes.data);
    if (lRes.success) setLaundries(lRes.data);
    if (pRes.success) setPayments(pRes.data);
    if (nRes.success) setNotices(nRes.data);

    setLoading(false);
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComplaint(true);
    const res = await api.createComplaint({
      title: complaintTitle,
      description: complaintDesc
    });

    if (res.success) {
      setComplaints(prev => [res.data, ...prev]);
      addNotification('Complaint Lodged', `Ticket #${res.data.id} created. Priority: ${res.data.priority}`, 'COMPLAINT');
      setIsComplaintModalOpen(false);
      setComplaintTitle('');
      setComplaintDesc('');
    }
    setSubmittingComplaint(false);
  };

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVisitor(true);
    const res = await api.createVisitor({
      visitorName,
      relation: visitorRelation,
      visitDate,
      purpose: visitPurpose
    });

    if (res.success) {
      setVisitors(prev => [res.data, ...prev]);
      addNotification('Visitor Pass Requested', `Pass for ${visitorName} submitted for Warden approval.`, 'VISITOR');
      setIsVisitorModalOpen(false);
      setVisitorName('');
      setVisitPurpose('');
    }
    setSubmittingVisitor(false);
  };

  const handleCreateLaundry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLaundry(true);
    const res = await api.bookLaundry(`${laundryDate} (${laundrySlot})`, 10);

    if (res.success) {
      setLaundries(prev => [res.data, ...prev]);
      addNotification('Laundry Booked', `Slot confirmed for ${res.data.slot}`, 'LAUNDRY');
      setIsLaundryModalOpen(false);
    }
    setSubmittingLaundry(false);
  };

  const attendanceData = [
    { day: 1, status: 'P' }, { day: 2, status: 'P' }, { day: 3, status: 'P' },
    { day: 4, status: 'P' }, { day: 5, status: 'A' }, { day: 6, status: 'P' },
    { day: 7, status: 'P' }, { day: 8, status: 'P' }, { day: 9, status: 'P' },
    { day: 10, status: 'L' }, { day: 11, status: 'P' }, { day: 12, status: 'P' },
    { day: 13, status: 'P' }, { day: 14, status: 'P' }, { day: 15, status: 'P' }
  ];

  return (
    <div className="space-y-6 text-[#292826] dark:text-[#EDEDEC]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#292826] dark:text-[#EDEDEC] tracking-tight">
            Welcome back, {user?.firstName} 👋
          </h2>
          <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] mt-1 font-medium">
            Room 204 • Oak Ridge Hall • Student Portal
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="primary" size="sm" onClick={() => setIsComplaintModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Lodge Complaint
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsLaundryModalOpen(true)}>
            <Shirt className="w-4 h-4 mr-1" />
            Book Laundry
          </Button>
        </div>
      </div>

      {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">My Room</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">Room 204</h3>
                  <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] mt-1">Bed A • Double Occupancy</p>
                </div>
                <div className="p-3 bg-[#E5E4E1]/40 dark:bg-[#38383C]/40 text-[#7A7873] dark:text-[#9C9C98] rounded-lg">
                  <Building className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Active Complaints</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">
                    {complaints.filter(c => c.status !== 'RESOLVED').length} Tickets
                  </h3>
                  <p className="text-[11px] text-[#B25D43] dark:text-[#F0C2B2] font-medium mt-1">In progress with staff</p>
                </div>
                <div className="p-3 bg-[#E8B4A0]/15 text-[#B25D43] dark:text-[#F0C2B2] rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Attendance Rate</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">93.3%</h3>
                  <p className="text-[11px] text-[#4F7348] dark:text-[#B8D4B2] font-medium mt-1">14/15 Days Present</p>
                </div>
                <div className="p-3 bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] rounded-lg">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Fee Status</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">Paid</h3>
                  <p className="text-[11px] text-[#4C7565] dark:text-[#A3CCA3] font-medium mt-1">Spring 2026 Cleared</p>
                </div>
                <div className="p-3 bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Announcements & Recent Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
                <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#8FB8A8]" />
                  Latest Warden Bulletins
                </h3>
              </div>
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="p-3 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">{n.title}</h4>
                      <span className="text-[10px] text-[#7A7873] dark:text-[#9C9C98]">{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">{n.body}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
                <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#8FB8A8]" />
                  My Recent Complaint Tickets
                </h3>
              </div>
              <div className="space-y-3">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">{c.title}</p>
                      <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98]">{c.category} • Priority: {c.priority}</p>
                    </div>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MY ROOM & ROOMMATES ==================== */}
      {activeTab === 'room' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 space-y-5 p-6">
              <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#7A7873] dark:text-[#9C9C98] uppercase font-semibold">ALLOCATED QUARTERS</span>
                  <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] mt-0.5">Oak Ridge Hall • Room 204</h3>
                </div>
                <Badge variant="success">Active Allocation</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-lg border border-[#E5E4E1] dark:border-[#38383C]">
                  <span className="text-[#7A7873] dark:text-[#9C9C98] text-[10px] uppercase font-semibold">Floor</span>
                  <p className="font-bold text-[#292826] dark:text-[#EDEDEC] mt-0.5">2nd Floor</p>
                </div>
                <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-lg border border-[#E5E4E1] dark:border-[#38383C]">
                  <span className="text-[#7A7873] dark:text-[#9C9C98] text-[10px] uppercase font-semibold">Bed ID</span>
                  <p className="font-bold text-[#292826] dark:text-[#EDEDEC] mt-0.5">Bed 204-A</p>
                </div>
                <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-lg border border-[#E5E4E1] dark:border-[#38383C]">
                  <span className="text-[#7A7873] dark:text-[#9C9C98] text-[10px] uppercase font-semibold">Room Type</span>
                  <p className="font-bold text-[#292826] dark:text-[#EDEDEC] mt-0.5">Double Sharing</p>
                </div>
                <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-lg border border-[#E5E4E1] dark:border-[#38383C]">
                  <span className="text-[#7A7873] dark:text-[#9C9C98] text-[10px] uppercase font-semibold">Monthly Rent</span>
                  <p className="font-bold text-[#4C7565] dark:text-[#A3CCA3] mt-0.5">$450.00 / mo</p>
                </div>
              </div>

              {/* Roommate Details */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98] font-semibold">Assigned Roommate</h4>
                <div className="p-4 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256"
                      alt="Roommate"
                      className="w-10 h-10 rounded-full border border-[#8FB8A8]/40 object-cover"
                    />
                    <div>
                      <h5 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">Liam Chen</h5>
                      <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98]">Computer Science • Year 3</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="inline-flex items-center text-[#7A7873] dark:text-[#9C9C98] font-medium">
                      <Phone className="w-3.5 h-3.5 mr-1 text-[#8FB8A8]" />
                      +1 (555) 382-9102
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Fixtures Inventory */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98] font-semibold">Room Fixtures & Amenities Checklist</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['Ceiling Fan', 'Study Table x2', 'Ergonomic Chair x2', 'Wardrobe Locker x2', 'Attached Balcony', 'High-Speed Wi-Fi Router'].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-md bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center space-x-2 text-[#292826] dark:text-[#EDEDEC]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4C7565] dark:text-[#8FB8A8]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Warden Contact Card */}
            <Card className="space-y-4 p-6">
              <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] border-b border-[#E5E4E1] dark:border-[#38383C] pb-3 uppercase tracking-wider">
                Warden Office Info
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start space-x-3">
                  <User className="w-4 h-4 text-[#8FB8A8] mt-0.5" />
                  <div>
                    <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">Dr. Arthur Pendelton</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">Head Warden • Oak Ridge</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#8FB8A8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#292826] dark:text-[#EDEDEC]">Warden Office Room 101</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">Ground Floor, West Wing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#8FB8A8] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#292826] dark:text-[#EDEDEC]">Visiting Hours</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">Mon - Fri: 4:00 PM - 7:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#E8B4A0]/15 border border-[#E8B4A0]/30 text-xs text-[#B25D43] dark:text-[#F0C2B2] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#B25D43]" />
                  Hostel Policy Guidelines
                </p>
                <p className="text-[11px] leading-relaxed">
                  Curfew is at 10:00 PM sharp. All visitors must check out at the main entrance gate prior to 8:00 PM.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: ROOM COMPLAINTS ==================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#8FB8A8]" />
              Room Maintenance Complaints
            </h3>
            <Button size="sm" variant="primary" onClick={() => setIsComplaintModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Lodge New Complaint
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.map((c) => (
              <Card key={c.id} className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={c.priority.toLowerCase() as any}>{c.priority} Priority</Badge>
                    <h4 className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC] mt-2">{c.title}</h4>
                  </div>
                  <Badge variant={c.status === 'RESOLVED' ? 'success' : 'warning'}>{c.status}</Badge>
                </div>
                <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">{c.description}</p>
                <div className="pt-2 border-t border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between text-[11px] text-[#7A7873] dark:text-[#9C9C98]">
                  <span>Category: {c.category}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: VISITORS ==================== */}
      {activeTab === 'visitors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#8FB8A8]" />
              Visitor Passes & Gate Approvals
            </h3>
            <Button size="sm" variant="primary" onClick={() => setIsVisitorModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Request Visitor Gate Pass
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visitors.map((v) => (
              <Card key={v.id} className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC]">{v.visitorName} ({v.relation})</h4>
                  <Badge variant={v.status === 'APPROVED' ? 'success' : v.status === 'REJECTED' ? 'urgent' : 'warning'}>
                    {v.status}
                  </Badge>
                </div>
                <div className="text-xs text-[#7A7873] dark:text-[#9C9C98] space-y-1">
                  <p>Visit Date: <span className="text-[#292826] dark:text-[#EDEDEC] font-semibold">{v.visitDate}</span></p>
                  <p>Purpose: {v.purpose}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 5: LAUNDRY SLOTS ==================== */}
      {activeTab === 'laundry' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
              <Shirt className="w-4 h-4 text-[#8FB8A8]" />
              Washing Machine Bookings
            </h3>
            <Button size="sm" variant="primary" onClick={() => setIsLaundryModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Reserve Laundry Slot
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {laundries.map((l) => (
              <Card key={l.id} className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC]">Washer #{l.id.slice(-4)}</span>
                  <Badge variant={l.status === 'READY' ? 'success' : 'info'}>{l.status}</Badge>
                </div>
                <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">Scheduled: {l.slot}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: PAYMENTS & INVOICES ==================== */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <CreditCard className="w-4 h-4 text-[#8FB8A8]" />
            Hostel Fee Invoices & Receipts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((p) => (
              <Card key={p.id} className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC]">{p.type} Fee Payment</h4>
                  <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>{p.status}</Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E5E4E1] dark:border-[#38383C]">
                  <span className="text-base font-bold text-[#4C7565] dark:text-[#A3CCA3]">${p.amount}.00</span>
                  <span className="text-xs text-[#7A7873] dark:text-[#9C9C98]">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 7: ATTENDANCE HISTORY ==================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <Card className="space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#7A7873] dark:text-[#9C9C98] uppercase font-semibold">MONTHLY ROLL-CALL RECORD</span>
                <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] mt-0.5">July 2026 Attendance Gauge</h3>
              </div>
              <Badge variant="success">93.3% Presence</Badge>
            </div>

            {/* Calendar Days Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98] font-semibold">Daily Attendance Calendar</h4>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {attendanceData.map((item) => (
                  <div
                    key={item.day}
                    className={`p-2.5 rounded-lg border text-center transition ${
                      item.status === 'P'
                        ? 'bg-[#A8C4A2]/15 border-[#A8C4A2]/30 text-[#4F7348] dark:text-[#B8D4B2]'
                        : item.status === 'A'
                        ? 'bg-[#D89A9A]/15 border-[#D89A9A]/30 text-[#A44949] font-bold'
                        : 'bg-[#E8B4A0]/15 border-[#E8B4A0]/30 text-[#B25D43] font-bold'
                    }`}
                  >
                    <span className="block text-[10px] opacity-80">Jul {item.day}</span>
                    <span className="block text-xs font-bold mt-0.5">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between text-xs text-[#7A7873] dark:text-[#9C9C98]">
              <span>Verified Warden Roll-Call Logs</span>
              <span className="font-bold text-[#292826] dark:text-[#EDEDEC]">0 Unexcused Absences</span>
            </div>
          </Card>
        </div>
      )}

      {/* ==================== TAB 8: NOTICES ==================== */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <Bell className="w-4 h-4 text-[#8FB8A8]" />
            Hostel Notice Board
          </h3>

          <div className="space-y-3">
            {notices.map((n) => (
              <Card key={n.id} className="space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC]">{n.title}</h4>
                  <span className="text-xs text-[#7A7873] dark:text-[#9C9C98] font-medium">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">{n.body}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* COMPLAINT MODAL */}
      <Modal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="Lodge Maintenance Complaint"
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <Input
            label="Issue Headline"
            value={complaintTitle}
            onChange={(e) => setComplaintTitle(e.target.value)}
            placeholder="e.g. Bathroom Sink Leakage"
            required
          />
          <Select
            label="Category"
            value={complaintCategory}
            onChange={(e) => setComplaintCategory(e.target.value)}
            options={[
              { label: 'Plumbing', value: 'PLUMBING' },
              { label: 'Electrical', value: 'ELECTRICAL' },
              { label: 'Furniture / Carpentry', value: 'FURNITURE' },
              { label: 'Cleaning & Janitorial', value: 'CLEANING' },
              { label: 'Wi-Fi / Network', value: 'WIFI' }
            ]}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98]">
              Detailed Problem Description
            </label>
            <textarea
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full rounded-md bg-white dark:bg-[#26262A] border border-[#E5E4E1] dark:border-[#38383C] text-[#292826] dark:text-[#EDEDEC] text-sm px-3.5 py-2.5 transition focus:outline-none focus:ring-1 focus:ring-[#8FB8A8]"
              rows={3}
              required
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsComplaintModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submittingComplaint}>
              Lodge Complaint
            </Button>
          </div>
        </form>
      </Modal>

      {/* VISITOR MODAL */}
      <Modal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        title="Request Visitor Gate Pass"
      >
        <form onSubmit={handleCreateVisitor} className="space-y-4">
          <Input
            label="Visitor Full Name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            placeholder="e.g. Robert Rivera"
            required
          />
          <Select
            label="Relation"
            value={visitorRelation}
            onChange={(e) => setVisitorRelation(e.target.value)}
            options={[
              { label: 'Parent / Guardian', value: 'PARENT' },
              { label: 'Sibling', value: 'SIBLING' },
              { label: 'Relative / Friend', value: 'FRIEND' }
            ]}
          />
          <Input
            label="Visit Date"
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />
          <Input
            label="Purpose of Visit"
            value={visitPurpose}
            onChange={(e) => setVisitPurpose(e.target.value)}
            placeholder="e.g. Delivering study materials & books"
            required
          />
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsVisitorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submittingVisitor}>
              Submit Gate Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* LAUNDRY MODAL */}
      <Modal
        isOpen={isLaundryModalOpen}
        onClose={() => setIsLaundryModalOpen(false)}
        title="Reserve Washing Machine Slot"
      >
        <form onSubmit={handleCreateLaundry} className="space-y-4">
          <Input
            label="Select Date"
            type="date"
            value={laundryDate}
            onChange={(e) => setLaundryDate(e.target.value)}
            required
          />
          <Select
            label="Time Slot"
            value={laundrySlot}
            onChange={(e) => setLaundrySlot(e.target.value)}
            options={[
              { label: '08:00 AM - 09:30 AM', value: '08:00 AM - 09:30 AM' },
              { label: '10:00 AM - 11:30 AM', value: '10:00 AM - 11:30 AM' },
              { label: '02:00 PM - 03:30 PM', value: '02:00 PM - 03:30 PM' },
              { label: '05:00 PM - 06:30 PM', value: '05:00 PM - 06:30 PM' }
            ]}
          />
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsLaundryModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submittingLaundry}>
              Book Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
