import React from 'react';
import { 
  Home, 
  Wrench, 
  UserCheck, 
  Shirt, 
  CreditCard, 
  CalendarCheck, 
  Bell, 
  Users, 
  Building2, 
  BarChart3, 
  LogOut, 
  Building,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext.js';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;

  const studentNav = [
    { section: 'MAIN MENU', items: [
      { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
      { id: 'room', label: 'My Room & Roommates', icon: Building },
    ]},
    { section: 'SERVICES & REQUESTS', items: [
      { id: 'complaints', label: 'Room Complaints', icon: Wrench },
      { id: 'visitors', label: 'Visitor Passes', icon: UserCheck },
      { id: 'laundry', label: 'Laundry Slots', icon: Shirt },
      { id: 'payments', label: 'Fee Invoices & Receipts', icon: CreditCard },
      { id: 'attendance', label: 'Attendance History', icon: CalendarCheck },
      { id: 'notices', label: 'Notices & Bulletins', icon: Bell }
    ]}
  ];

  const wardenNav = [
    { section: 'COMMAND CENTER', items: [
      { id: 'dashboard', label: 'Warden Dashboard', icon: Home },
      { id: 'complaints', label: 'Unassigned Complaints', icon: Wrench },
      { id: 'visitors', label: 'Visitor Gate Approvals', icon: UserCheck },
      { id: 'attendance', label: 'Room Roll-Call Grid', icon: CalendarCheck },
      { id: 'rooms', label: 'Room Allocations', icon: Building2 },
      { id: 'notices', label: 'Broadcast Notice', icon: Bell }
    ]}
  ];

  const staffNav = [
    { section: 'WORK ORDERS', items: [
      { id: 'dashboard', label: 'Staff Task Board', icon: Home },
      { id: 'laundry', label: 'Laundry Queue', icon: Shirt }
    ]}
  ];

  const adminNav = [
    { section: 'EXECUTIVE SUITE', items: [
      { id: 'dashboard', label: 'Executive Overview', icon: Home },
      { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
      { id: 'users', label: 'User Directory (RBAC)', icon: Users },
      { id: 'hostels', label: 'Hostel & Room Manager', icon: Building2 },
      { id: 'notices', label: 'System Bulletins', icon: Bell }
    ]}
  ];

  const getNavSections = () => {
    switch (role) {
      case 'STUDENT': return studentNav;
      case 'WARDEN': return wardenNav;
      case 'STAFF': return staffNav;
      case 'ADMIN': return adminNav;
      default: return studentNav;
    }
  };

  const navSections = getNavSections();

  return (
    <aside className="w-64 bg-white dark:bg-[#26262A] border-r border-[#E5E4E1] dark:border-[#38383C] flex flex-col justify-between h-screen sticky top-0 z-30 hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-md bg-[#8FB8A8] flex items-center justify-center text-[#1C1C1E] font-bold text-base">
              H
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-[#292826] dark:text-[#EDEDEC] flex items-center gap-1">
                Hostel<span className="text-[#8FB8A8]">Hub</span>
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-[#7A7873] dark:text-[#9C9C98] uppercase">
                Smart Management
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#8FB8A8]" title="System Online" />
        </div>

        {/* User Card */}
        <div className="p-3 mx-3 my-3 rounded-lg bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] flex items-center space-x-3">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={user.firstName}
            className="w-8 h-8 rounded-full border border-[#8FB8A8]/40 object-cover"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-[#292826] dark:text-[#EDEDEC] truncate">{user.firstName} {user.lastName}</p>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] border border-[#8FB8A8]/30">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-2 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-mono tracking-widest text-[#7A7873] dark:text-[#9C9C98] uppercase font-semibold">
                {sec.section}
              </p>
              <div className="space-y-0.5 mt-1.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 ${
                        isActive
                          ? 'bg-[#8FB8A8] text-[#1C1C1E] font-semibold'
                          : 'text-[#7A7873] dark:text-[#9C9C98] hover:text-[#292826] dark:hover:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#1C1C1E]' : 'text-[#7A7873] dark:text-[#9C9C98]'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#1C1C1E]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div className="p-3 border-t border-[#E5E4E1] dark:border-[#38383C]">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#7A7873] dark:text-[#9C9C98] hover:text-[#A44949] dark:hover:text-[#E2A7A7] hover:bg-[#D89A9A]/15 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4 text-[#7A7873] dark:text-[#9C9C98]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
