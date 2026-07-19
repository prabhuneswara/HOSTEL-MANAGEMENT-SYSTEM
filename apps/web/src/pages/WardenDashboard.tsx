import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext.js';
import { api } from '../services/api.js';
import { Complaint, Visitor, Notice } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { 
  Wrench, 
  UserCheck, 
  CalendarCheck, 
  Bell, 
  Check, 
  X, 
  UserPlus, 
  Building2,
  Plus
} from 'lucide-react';

export const WardenDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { user, addNotification } = useAuth();

  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  // Staff list for assigning tasks
  const staffMembers = [
    { id: 'user-staff-1', name: 'Marcus Vance (Electrical / Plumbing)' },
    { id: 'user-staff-2', name: 'Elena Rostova (Cleaning / Janitorial)' },
    { id: 'user-staff-3', name: 'David Miller (General Maintenance)' }
  ];

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignStaffId, setAssignStaffId] = useState('user-staff-1');
  const [assigning, setAssigning] = useState(false);

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [publishingNotice, setPublishingNotice] = useState(false);

  // Attendance grid state
  const [attendanceGrid, setAttendanceGrid] = useState([
    { studentId: 'user-student-1', name: 'Alex Rivera', room: '204', status: 'PRESENT' },
    { studentId: 'user-student-2', name: 'Emma Watson', room: '101', status: 'PRESENT' },
    { studentId: 'user-student-3', name: 'Liam Chen', room: '301', status: 'ABSENT' },
    { studentId: 'user-student-4', name: 'Sophia Martinez', room: '301', status: 'PRESENT' }
  ]);
  const [savingAttendance, setSavingAttendance] = useState(false);

  // Rooms list state
  const [roomsList] = useState([
    { id: 'room-101', number: '101', floor: 1, type: 'SINGLE', capacity: 1, occupied: 1, rent: 600, student: 'Emma Watson' },
    { id: 'room-102', number: '102', floor: 1, type: 'DOUBLE', capacity: 2, occupied: 2, rent: 450, student: 'Noah Taylor & James Bond' },
    { id: 'room-204', number: '204', floor: 2, type: 'DOUBLE', capacity: 2, occupied: 2, rent: 450, student: 'Alex Rivera & Liam Chen' },
    { id: 'room-301', number: '301', floor: 3, type: 'DORMITORY', capacity: 4, occupied: 3, rent: 300, student: 'Sophia Martinez + 2 others' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cRes, vRes, nRes] = await Promise.all([
      api.getComplaints(),
      api.getVisitors(),
      api.getNotices()
    ]);

    if (cRes.success) setComplaints(cRes.data);
    if (vRes.success) setVisitors(vRes.data);
    if (nRes.success) setNotices(nRes.data);

    setLoading(false);
  };

  const handleAssignStaff = async () => {
    if (!selectedComplaint) return;
    setAssigning(true);
    const res = await api.assignComplaint(selectedComplaint.id, assignStaffId);
    if (res.success) {
      setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? res.data : c));
      addNotification('Complaint Assigned', `Task #${selectedComplaint.id} assigned to staff.`, 'COMPLAINT');
      setSelectedComplaint(null);
    }
    setAssigning(false);
  };

  const handleApproveVisitor = async (id: string) => {
    const res = await api.approveVisitor(id);
    if (res.success) {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'APPROVED' } : v));
      addNotification('Visitor Approved', 'Visitor gate pass granted.', 'VISITOR');
    }
  };

  const handleRejectVisitor = async (id: string) => {
    const res = await api.rejectVisitor(id);
    if (res.success) {
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'REJECTED' } : v));
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishingNotice(true);
    const res = await api.createNotice({ title: noticeTitle, body: noticeBody });
    if (res.success) {
      setNotices(prev => [res.data, ...prev]);
      addNotification('Notice Posted', noticeTitle, 'NOTICE');
      setIsNoticeModalOpen(false);
      setNoticeTitle('');
      setNoticeBody('');
    }
    setPublishingNotice(false);
  };

  const handleSaveAttendance = async () => {
    setSavingAttendance(true);
    await api.markBulkAttendance(attendanceGrid, new Date().toISOString().split('T')[0]);
    addNotification('Attendance Marked', "Today's room attendance saved successfully.", 'SYSTEM');
    setSavingAttendance(false);
  };

  const toggleAttendanceStatus = (studentId: string) => {
    setAttendanceGrid(prev => prev.map(item => {
      if (item.studentId === studentId) {
        const nextStatus = item.status === 'PRESENT' ? 'ABSENT' : item.status === 'ABSENT' ? 'LEAVE' : 'PRESENT';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const unassignedCount = complaints.filter(c => c.status === 'OPEN').length;
  const pendingVisitorsCount = visitors.filter(v => v.status === 'PENDING').length;

  return (
    <div className="space-y-6 text-[#292826] dark:text-[#EDEDEC]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#292826] dark:text-[#EDEDEC] tracking-tight">
            Warden Operations Command
          </h2>
          <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] mt-1">
            Oak Ridge Hall • Warden: Dr. Arthur Pendelton
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsNoticeModalOpen(true)}>
          <Bell className="w-4 h-4 mr-1.5" />
          Broadcast Notice
        </Button>
      </div>

      {/* ==================== TAB 1: OVERVIEW DASHBOARD ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Unassigned Tickets</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">{unassignedCount} Requiring Action</h3>
                  <p className="text-[11px] text-[#B25D43] dark:text-[#F0C2B2] font-medium mt-1">Assign to specialty staff</p>
                </div>
                <div className="p-3 bg-[#E8B4A0]/15 text-[#B25D43] dark:text-[#F0C2B2] rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Pending Visitors</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">{pendingVisitorsCount} Approvals</h3>
                  <p className="text-[11px] text-[#4F7348] dark:text-[#B8D4B2] font-medium mt-1">Gate verification queued</p>
                </div>
                <div className="p-3 bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Room Attendance</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">75% Marked</h3>
                  <p className="text-[11px] text-[#4C7565] dark:text-[#A3CCA3] font-medium mt-1">3 of 4 rooms verified</p>
                </div>
                <div className="p-3 bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] rounded-lg">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Total Occupancy</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">18 / 20 Beds</h3>
                  <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] font-medium mt-1">90% capacity occupied</p>
                </div>
                <div className="p-3 bg-[#E5E4E1]/40 dark:bg-[#38383C]/40 text-[#7A7873] dark:text-[#9C9C98] rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Warden Urgent Queue Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="space-y-3 p-5">
              <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#8FB8A8]" />
                Unassigned Complaint Tickets
              </h3>
              {complaints.filter(c => c.status === 'OPEN').map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">{c.title}</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">Room {c.roomNumber} • {c.category} ({c.priority})</p>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => setSelectedComplaint(c)}>Assign</Button>
                </div>
              ))}
            </Card>

            <Card className="space-y-3 p-5">
              <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#4F7348]" />
                Visitor Approvals Pending
              </h3>
              {visitors.filter(v => v.status === 'PENDING').map(v => (
                <div key={v.id} className="p-3 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">{v.visitorName} ({v.relation})</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">Visit Date: {v.visitDate}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="primary" onClick={() => handleApproveVisitor(v.id)}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => handleRejectVisitor(v.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: COMPLAINT QUEUE ==================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <Wrench className="w-4 h-4 text-[#8FB8A8]" />
            Complaint Dispatch & Staff Assignment Queue
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complaints.map((c) => (
              <Card key={c.id} className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={c.priority.toLowerCase() as any}>{c.priority}</Badge>
                      <span className="text-[10px] font-bold text-[#7A7873] dark:text-[#9C9C98] uppercase bg-[#E5E4E1]/40 dark:bg-[#38383C]/40 px-2 py-0.5 rounded">
                        Room {c.roomNumber}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC] mt-2">{c.title}</h4>
                    <p className="text-xs text-[#4C7565] dark:text-[#A3CCA3] font-semibold mt-0.5">Student: {c.studentName}</p>
                  </div>
                  <Badge variant={c.status === 'OPEN' ? 'warning' : 'info'}>{c.status}</Badge>
                </div>
                <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] line-clamp-2">{c.description}</p>

                <div className="pt-2 border-t border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A7873] dark:text-[#9C9C98]">
                    {c.assignedStaffId ? 'Assigned to Staff' : 'Unassigned'}
                  </span>
                  <Button size="sm" variant="primary" onClick={() => setSelectedComplaint(c)}>
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Assign Staff
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: VISITORS ==================== */}
      {activeTab === 'visitors' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <UserCheck className="w-4 h-4 text-[#4F7348]" />
            Visitor Pass Approval Queue
          </h3>

          <div className="bg-white dark:bg-[#26262A] rounded-xl overflow-hidden border border-[#E5E4E1] dark:border-[#38383C]">
            <table className="w-full text-left text-xs text-[#292826] dark:text-[#EDEDEC]">
              <thead className="bg-[#FAFAF9] dark:bg-[#1C1C1E] text-[#7A7873] dark:text-[#9C9C98] uppercase tracking-wider text-[10px] font-bold border-b border-[#E5E4E1] dark:border-[#38383C]">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Visitor Name</th>
                  <th className="p-3.5">Relation</th>
                  <th className="p-3.5">Visit Date</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E1] dark:divide-[#38383C]">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FAFAF9] dark:hover:bg-[#1C1C1E]">
                    <td className="p-3.5 font-bold text-[#292826] dark:text-[#EDEDEC]">Alex Rivera (Room 204)</td>
                    <td className="p-3.5 font-semibold text-[#292826] dark:text-[#EDEDEC]">{v.visitorName}</td>
                    <td className="p-3.5">{v.relation}</td>
                    <td className="p-3.5">{v.visitDate}</td>
                    <td className="p-3.5 max-w-xs truncate">{v.purpose}</td>
                    <td className="p-3.5">
                      <Badge variant={v.status === 'APPROVED' ? 'success' : v.status === 'REJECTED' ? 'urgent' : 'warning'}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {v.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="primary" className="py-1 px-2 text-xs" onClick={() => handleApproveVisitor(v.id)}>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="danger" className="py-1 px-2 text-xs" onClick={() => handleRejectVisitor(v.id)}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: ATTENDANCE ==================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#8FB8A8]" />
              Daily Room Roll-Call Attendance
            </h3>
            <Button size="sm" variant="primary" loading={savingAttendance} onClick={handleSaveAttendance}>
              Save Roll-Call Record
            </Button>
          </div>

          <div className="bg-white dark:bg-[#26262A] rounded-xl border border-[#E5E4E1] dark:border-[#38383C] overflow-hidden">
            <table className="w-full text-left text-xs text-[#292826] dark:text-[#EDEDEC]">
              <thead className="bg-[#FAFAF9] dark:bg-[#1C1C1E] text-[#7A7873] dark:text-[#9C9C98] uppercase tracking-wider text-[10px] font-bold border-b border-[#E5E4E1] dark:border-[#38383C]">
                <tr>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Room Number</th>
                  <th className="p-3.5">Today's Status</th>
                  <th className="p-3.5 text-right">Toggle Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E1] dark:divide-[#38383C]">
                {attendanceGrid.map((st) => (
                  <tr key={st.studentId} className="hover:bg-[#FAFAF9] dark:hover:bg-[#1C1C1E]">
                    <td className="p-3.5 font-bold text-[#292826] dark:text-[#EDEDEC]">{st.name}</td>
                    <td className="p-3.5 font-mono">Room {st.room}</td>
                    <td className="p-3.5">
                      <Badge variant={st.status === 'PRESENT' ? 'success' : st.status === 'ABSENT' ? 'urgent' : 'warning'}>
                        {st.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button size="sm" variant="outline" onClick={() => toggleAttendanceStatus(st.studentId)}>
                        Change Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: ROOM ALLOCATIONS ==================== */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <Building2 className="w-4 h-4 text-[#8FB8A8]" />
            Hostel Room Directory & Bed Allocations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomsList.map((rm) => (
              <Card key={rm.id} className="space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#292826] dark:text-[#EDEDEC]">Room {rm.number} (Floor {rm.floor})</span>
                  <Badge variant="info">{rm.type}</Badge>
                </div>
                <div className="text-xs text-[#7A7873] dark:text-[#9C9C98] space-y-1">
                  <p>Occupied: <span className="text-[#292826] dark:text-[#EDEDEC] font-bold">{rm.occupied} / {rm.capacity} Beds</span></p>
                  <p>Allocated Students: <span className="text-[#4C7565] dark:text-[#A3CCA3] font-semibold">{rm.student}</span></p>
                  <p>Monthly Rent: <span className="text-[#4F7348] dark:text-[#B8D4B2] font-bold">${rm.rent}.00 / mo</span></p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 6: NOTICES ==================== */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8FB8A8]" />
              Published Warden Bulletins & Notices
            </h3>
            <Button size="sm" variant="primary" onClick={() => setIsNoticeModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Post New Notice
            </Button>
          </div>

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

      {/* ASSIGN STAFF MODAL */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Assign Staff Member to Complaint Ticket"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-md border border-[#E5E4E1] dark:border-[#38383C] text-xs text-[#7A7873] dark:text-[#9C9C98] space-y-1">
              <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">{selectedComplaint.title}</p>
              <p>Room: {selectedComplaint.roomNumber} • Category: {selectedComplaint.category}</p>
            </div>

            <Select
              label="Select Duty Staff Member"
              value={assignStaffId}
              onChange={(e) => setAssignStaffId(e.target.value)}
              options={staffMembers.map(s => ({ label: s.name, value: s.id }))}
            />

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
              <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={assigning} onClick={handleAssignStaff}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* POST NOTICE MODAL */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Broadcast Announcement Notice"
      >
        <form onSubmit={handlePublishNotice} className="space-y-4">
          <Input
            label="Notice Headline"
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder="e.g. Campus Power Maintenance Schedule"
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98]">
              Notice Body Content
            </label>
            <textarea
              value={noticeBody}
              onChange={(e) => setNoticeBody(e.target.value)}
              placeholder="Full announcement text..."
              className="w-full rounded-md bg-white dark:bg-[#26262A] border border-[#E5E4E1] dark:border-[#38383C] text-[#292826] dark:text-[#EDEDEC] text-sm px-3.5 py-2.5 transition focus:outline-none focus:ring-1 focus:ring-[#8FB8A8]"
              rows={4}
              required
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsNoticeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={publishingNotice}>
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
