import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  ShieldAlert, 
  Search, 
  ChevronDown, 
  UserCheck, 
  CheckCircle2, 
  X,
  Command
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext.js';

interface TopbarProps {
  onOpenSOSModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSOSModal }) => {
  const { user, login, theme, toggleTheme, notifications, markNotificationRead } = useAuth();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const quickRoles = [
    { email: 'student@hostelhub.com', role: 'STUDENT', label: 'Alex Rivera', badge: 'Student' },
    { email: 'warden@hostelhub.com', role: 'WARDEN', label: 'Dr. Arthur Pendelton', badge: 'Warden' },
    { email: 'staff@hostelhub.com', role: 'STAFF', label: 'Marcus Vance', badge: 'Staff' },
    { email: 'admin@hostelhub.com', role: 'ADMIN', label: 'Sarah Connor', badge: 'Admin' }
  ];

  return (
    <header className="h-16 bg-white dark:bg-[#26262A] border-b border-[#E5E4E1] dark:border-[#38383C] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar with Shortcut Badge */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7873] dark:text-[#9C9C98]" />
        <input
          type="text"
          placeholder="Search rooms, complaints, visitors..."
          className="w-full pl-9 pr-12 py-1.5 bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] rounded-md text-xs text-[#292826] dark:text-[#EDEDEC] placeholder-[#7A7873]/60 focus:outline-none focus:border-[#8FB8A8] focus:ring-1 focus:ring-[#8FB8A8] transition"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono text-[#7A7873] dark:text-[#9C9C98] bg-[#E5E4E1]/50 dark:bg-[#38383C]/50 px-1.5 py-0.5 rounded border border-[#E5E4E1] dark:border-[#38383C]">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#8FB8A8]/15 hover:bg-[#8FB8A8]/25 border border-[#8FB8A8]/30 text-xs font-medium text-[#4C7565] dark:text-[#A3CCA3] transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#4C7565] dark:text-[#A3CCA3]" />
            <span>Switch Role ({user?.role})</span>
            <ChevronDown className="w-3 h-3 text-[#4C7565] dark:text-[#A3CCA3]" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#26262A] rounded-xl border border-[#E5E4E1] dark:border-[#38383C] shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <p className="text-[10px] font-mono tracking-widest text-[#7A7873] dark:text-[#9C9C98] uppercase px-3 py-1.5 border-b border-[#E5E4E1] dark:border-[#38383C]">
                Quick Demo Persona Switcher
              </p>
              <div className="py-1 space-y-0.5">
                {quickRoles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => {
                      login(r.email, r.role);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center justify-between ${
                      user?.role === r.role ? 'bg-[#8FB8A8] text-[#1C1C1E] font-semibold' : 'text-[#292826] dark:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{r.label}</p>
                      <span className="text-[9px] opacity-80 font-mono uppercase">{r.badge}</span>
                    </div>
                    {user?.role === r.role && <CheckCircle2 className="w-4 h-4 text-[#1C1C1E]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency SOS Trigger */}
        <button
          onClick={onOpenSOSModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D89A9A]/15 hover:bg-[#D89A9A]/25 border border-[#D89A9A]/30 text-[#A44949] dark:text-[#E2A7A7] rounded-md text-xs font-semibold transition"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#A44949] dark:text-[#E2A7A7]" />
          <span>SOS Emergency</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#7A7873] dark:text-[#9C9C98] hover:text-[#292826] dark:hover:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40 rounded-md transition border border-transparent hover:border-[#E5E4E1] dark:hover:border-[#38383C]"
          title="Toggle Soft Light/Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-[#7A7873] dark:text-[#9C9C98] hover:text-[#292826] dark:hover:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40 rounded-md transition relative border border-transparent hover:border-[#E5E4E1] dark:hover:border-[#38383C]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8FB8A8] rounded-full" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#26262A] rounded-xl border border-[#E5E4E1] dark:border-[#38383C] shadow-lg p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E4E1] dark:border-[#38383C]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98]">Notifications ({unreadCount})</h4>
                <button onClick={() => setShowNotifDropdown(false)}>
                  <X className="w-3.5 h-3.5 text-[#7A7873] dark:text-[#9C9C98] hover:text-[#292826] dark:hover:text-[#EDEDEC]" />
                </button>
              </div>
              <div className="divide-y divide-[#E5E4E1]/50 dark:divide-[#38383C]/50 max-h-64 overflow-y-auto py-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#7A7873] dark:text-[#9C9C98] text-center py-6">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`py-2.5 px-2 rounded-md cursor-pointer transition ${
                        n.isRead ? 'opacity-60' : 'bg-[#8FB8A8]/10 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#292826] dark:text-[#EDEDEC]">
                        <span className="truncate">{n.title}</span>
                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#8FB8A8]" />}
                      </div>
                      <p className="text-[11px] text-[#7A7873] dark:text-[#9C9C98] mt-1 line-clamp-2">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
