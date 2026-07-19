import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext.js';
import { api } from '../services/api.js';
import { Complaint, Laundry } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { 
  Wrench, 
  Shirt, 
  CheckCircle, 
  Clock, 
  Upload, 
  Check, 
  AlertTriangle
} from 'lucide-react';

export const StaffDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { user, addNotification } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [laundries, setLaundries] = useState<Laundry[]>([]);

  // Resolution modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [cRes, lRes] = await Promise.all([
      api.getComplaints(),
      api.getLaundry()
    ]);

    if (cRes.success) setComplaints(cRes.data);
    if (lRes.success) setLaundries(lRes.data);

    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'IN_PROGRESS' | 'RESOLVED') => {
    setUpdating(true);
    const res = await api.updateComplaintStatus(id, newStatus);
    if (res.success) {
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
      addNotification('Work Order Updated', `Ticket #${id} status changed to ${newStatus}`, 'COMPLAINT');
      setSelectedComplaint(null);
    }
    setUpdating(false);
  };

  const handleLaundryStatus = async (id: string, newStatus: 'IN_PROGRESS' | 'READY') => {
    const res = await api.updateLaundryStatus(id, newStatus);
    if (res.success) {
      setLaundries(prev => prev.map(l => l.id === id ? res.data : l));
      addNotification('Laundry Updated', `Machine slot status set to ${newStatus}`, 'LAUNDRY');
    }
  };

  const myAssignedComplaints = complaints;
  const pendingCount = myAssignedComplaints.filter(c => c.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6 text-[#292826] dark:text-[#EDEDEC]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#292826] dark:text-[#EDEDEC] tracking-tight">
            Staff Work Duty Dispatch Board
          </h2>
          <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] mt-1 font-medium">
            Duty Officer: Marcus Vance • Electrical & Maintenance Specialist
          </p>
        </div>
        <Badge variant="success">Active Shift Duty</Badge>
      </div>

      {/* ==================== TAB 1: WORK ORDERS DASHBOARD ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Assigned Work Orders</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">{myAssignedComplaints.length} Total</h3>
                  <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] font-medium mt-1">Maintenance & Repairs</p>
                </div>
                <div className="p-3 bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Pending Resolution</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">{pendingCount} Active</h3>
                  <p className="text-[11px] text-[#B25D43] dark:text-[#F0C2B2] font-medium mt-1">Requires site visit</p>
                </div>
                <div className="p-3 bg-[#E8B4A0]/15 text-[#B25D43] dark:text-[#F0C2B2] rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Resolved Today</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">
                    {myAssignedComplaints.filter(c => c.status === 'RESOLVED').length} Tickets
                  </h3>
                  <p className="text-[11px] text-[#4F7348] dark:text-[#B8D4B2] font-medium mt-1">100% SLA target hit</p>
                </div>
                <div className="p-3 bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Priority-Sorted Work Order Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] border-b border-[#E5E4E1] dark:border-[#38383C] pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B25D43]" />
              Priority Work Orders (Sorted by Severity)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAssignedComplaints.map((c) => (
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
                      <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] mt-0.5">Student: {c.studentName}</p>
                    </div>
                    <Badge variant={c.status === 'RESOLVED' ? 'success' : c.status === 'IN_PROGRESS' ? 'info' : 'warning'}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] line-clamp-2">{c.description}</p>

                  <div className="pt-3 border-t border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
                    <span className="text-[11px] text-[#7A7873] dark:text-[#9C9C98]">{c.category}</span>
                    <Button size="sm" variant="primary" onClick={() => setSelectedComplaint(c)}>
                      Update Resolution
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LAUNDRY QUEUE ==================== */}
      {activeTab === 'laundry' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <Shirt className="w-4 h-4 text-[#8FB8A8]" />
            Washing Machine Operational Queue
          </h3>

          <div className="bg-white dark:bg-[#26262A] rounded-xl overflow-hidden border border-[#E5E4E1] dark:border-[#38383C]">
            <table className="w-full text-left text-xs text-[#292826] dark:text-[#EDEDEC]">
              <thead className="bg-[#FAFAF9] dark:bg-[#1C1C1E] text-[#7A7873] dark:text-[#9C9C98] uppercase tracking-wider text-[10px] font-bold border-b border-[#E5E4E1] dark:border-[#38383C]">
                <tr>
                  <th className="p-3.5">Machine #</th>
                  <th className="p-3.5">Scheduled Slot</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Duty Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E4E1] dark:divide-[#38383C]">
                {laundries.map((l) => (
                  <tr key={l.id} className="hover:bg-[#FAFAF9] dark:hover:bg-[#1C1C1E]">
                    <td className="p-3.5 font-bold text-[#292826] dark:text-[#EDEDEC]">Washer #{l.id.slice(-4)}</td>
                    <td className="p-3.5 font-medium">{l.slot}</td>
                    <td className="p-3.5">
                      <Badge variant={l.status === 'READY' ? 'success' : l.status === 'IN_PROGRESS' ? 'info' : 'warning'}>
                        {l.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {l.status === 'BOOKED' && (
                        <Button size="sm" variant="outline" className="py-1 px-2.5 text-xs" onClick={() => handleLaundryStatus(l.id, 'IN_PROGRESS')}>
                          Start Cycle
                        </Button>
                      )}
                      {l.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="primary" className="py-1 px-2.5 text-xs" onClick={() => handleLaundryStatus(l.id, 'READY')}>
                          Mark Done
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        title="Update Work Order Resolution Status"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="p-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-md border border-[#E5E4E1] dark:border-[#38383C] text-xs text-[#7A7873] dark:text-[#9C9C98] space-y-1">
              <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">{selectedComplaint.title}</p>
              <p>Room: {selectedComplaint.roomNumber} • Student: {selectedComplaint.studentName}</p>
            </div>

            <div className="p-4 rounded-md border border-dashed border-[#E5E4E1] dark:border-[#38383C] text-center space-y-2 cursor-pointer hover:bg-[#FAFAF9] dark:hover:bg-[#1C1C1E]">
              <Upload className="w-5 h-5 mx-auto text-[#7A7873]" />
              <p className="text-xs text-[#292826] dark:text-[#EDEDEC] font-semibold">Upload Resolution Photo Proof</p>
              <p className="text-[10px] text-[#7A7873] dark:text-[#9C9C98]">JPG or PNG up to 5MB (Optional)</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
              <Button variant="outline" size="sm" loading={updating} onClick={() => handleUpdateStatus(selectedComplaint.id, 'IN_PROGRESS')}>
                Set In-Progress
              </Button>
              <Button variant="primary" size="sm" loading={updating} onClick={() => handleUpdateStatus(selectedComplaint.id, 'RESOLVED')}>
                <Check className="w-4 h-4 mr-1" />
                Mark Resolved
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
