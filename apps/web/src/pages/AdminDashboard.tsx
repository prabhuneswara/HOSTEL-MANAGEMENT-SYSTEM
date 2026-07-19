import React, { useState } from 'react';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { 
  Users, 
  Building2, 
  BarChart3, 
  Sparkles, 
  UserPlus, 
  DollarSign, 
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../store/AuthContext.js';
import { api } from '../services/api.js';

export const AdminDashboard: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const { addNotification } = useAuth();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('STUDENT');
  const [creatingUser, setCreatingUser] = useState(false);

  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Alex Rivera', email: 'student@hostelhub.com', role: 'STUDENT', room: '204' },
    { id: 'usr-2', name: 'Dr. Arthur Pendelton', email: 'warden@hostelhub.com', role: 'WARDEN', room: 'Office 101' },
    { id: 'usr-3', name: 'Marcus Vance', email: 'staff@hostelhub.com', role: 'STAFF', room: 'Maintenance Wing' },
    { id: 'usr-4', name: 'Sarah Connor', email: 'admin@hostelhub.com', role: 'ADMIN', room: 'Admin Suite' }
  ]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setTimeout(() => {
      setUsersList(prev => [
        ...prev,
        { id: `usr-${Date.now()}`, name: newName, email: newEmail, role: newRole, room: 'Unallocated' }
      ]);
      addNotification('User Provisioned', `Created user account for ${newName} (${newRole})`, 'SYSTEM');
      setIsUserModalOpen(false);
      setNewName('');
      setNewEmail('');
      setCreatingUser(false);
    }, 600);
  };

  const handleGenerateAiReport = async () => {
    setGeneratingReport(true);
    const res = await api.getAIMaintenanceSummary();
    if (res.success) {
      setAiReport(res.data.summaryText);
      addNotification('AI Report Ready', 'Maintenance Intelligence Insights generated.', 'SYSTEM');
    }
    setGeneratingReport(false);
  };

  return (
    <div className="space-y-6 text-[#292826] dark:text-[#EDEDEC]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#292826] dark:text-[#EDEDEC] tracking-tight">
            Executive Admin Control Center
          </h2>
          <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] mt-1 font-medium">
            Multi-Tenant Administration • Oak Ridge Hall
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="primary" size="sm" onClick={() => setIsUserModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add User Account
          </Button>
          <Button variant="outline" size="sm" loading={generatingReport} onClick={handleGenerateAiReport}>
            <Sparkles className="w-4 h-4 mr-1.5 text-[#8FB8A8]" />
            AI Intelligence Report
          </Button>
        </div>
      </div>

      {/* ==================== TAB 1: EXECUTIVE OVERVIEW ==================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Monthly Revenue</p>
                  <h3 className="text-xl font-bold text-[#4F7348] dark:text-[#B8D4B2] mt-1">$48,500.00</h3>
                  <p className="text-[11px] text-[#4F7348] dark:text-[#B8D4B2] font-medium mt-1">+12.4% vs last month</p>
                </div>
                <div className="p-3 bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Total Occupancy</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">92.5%</h3>
                  <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] font-medium mt-1">185 / 200 Beds Occupied</p>
                </div>
                <div className="p-3 bg-[#E5E4E1]/40 dark:bg-[#38383C]/40 text-[#7A7873] dark:text-[#9C9C98] rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">Active Users</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">214 Users</h3>
                  <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] font-medium mt-1">Students, Wardens, Staff</p>
                </div>
                <div className="p-3 bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#7A7873] dark:text-[#9C9C98] uppercase">SLA Resolution Rate</p>
                  <h3 className="text-xl font-bold text-[#292826] dark:text-[#EDEDEC] mt-1">98.2%</h3>
                  <p className="text-[11px] text-[#4F7348] dark:text-[#B8D4B2] font-medium mt-1">Within 24hr target</p>
                </div>
                <div className="p-3 bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* AI Intelligence Report Banner */}
          {aiReport && (
            <Card className="p-5 border-[#8FB8A8]/40 bg-[#8FB8A8]/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8FB8A8]" />
                  AI Maintenance Intelligence Summary
                </h4>
                <Badge variant="info">Generated Real-Time</Badge>
              </div>
              <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] leading-relaxed whitespace-pre-line">{aiReport}</p>
            </Card>
          )}

          {/* User Directory Overview */}
          <Card className="space-y-4 p-5">
            <h3 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC] uppercase tracking-wider flex items-center justify-between border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
              <span>Platform User Accounts (RBAC)</span>
              <Button size="sm" variant="primary" onClick={() => setIsUserModalOpen(true)}>Add User</Button>
            </h3>
            <div className="divide-y divide-[#E5E4E1] dark:divide-[#38383C]">
              {usersList.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#292826] dark:text-[#EDEDEC]">{u.name}</p>
                    <p className="text-[#7A7873] dark:text-[#9C9C98]">{u.email} • Location: {u.room}</p>
                  </div>
                  <Badge variant={u.role === 'ADMIN' ? 'urgent' : u.role === 'WARDEN' ? 'high' : u.role === 'STAFF' ? 'warning' : 'info'}>
                    {u.role}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ==================== TAB 2: ANALYTICS & REPORTS ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC] flex items-center gap-2 border-b border-[#E5E4E1] dark:border-[#38383C] pb-3">
            <BarChart3 className="w-4 h-4 text-[#8FB8A8]" />
            Financial & Operations Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">Revenue & Fee Collections</h4>
              <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">Total collected this semester: $142,500.00</p>
              <div className="h-32 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-md border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-center text-xs text-[#7A7873] dark:text-[#9C9C98] font-medium">
                Financial Trend Graph Visualizer
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">Complaint Resolution Metrics</h4>
              <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">Average resolution time: 4.2 Hours</p>
              <div className="h-32 bg-[#FAFAF9] dark:bg-[#1C1C1E] rounded-md border border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-center text-xs text-[#7A7873] dark:text-[#9C9C98] font-medium">
                Work Order Distribution Chart
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Provision New User Account"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Full Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Eleanor Vance"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="e.g. eleanor@hostelhub.com"
            required
          />
          <Select
            label="Assigned System Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              { label: 'Student Resident', value: 'STUDENT' },
              { label: 'Hostel Warden', value: 'WARDEN' },
              { label: 'Maintenance Staff', value: 'STAFF' },
              { label: 'System Admin', value: 'ADMIN' }
            ]}
          />
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={creatingUser}>
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
