import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { BorderGlow } from '../components/ui/BorderGlow.js';
import { PixelSnow } from '../components/ui/PixelSnow.js';
import { Mail, Lock, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('student@hostelhub.com');
  const [password, setPassword] = useState('Demo123!');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'WARDEN' | 'STAFF' | 'ADMIN'>('STUDENT');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, selectedRole);
    if (!success) {
      setError('Invalid login credentials or role assignment.');
    }
  };

  const presetAccounts = [
    {
      role: 'STUDENT',
      name: 'Alex Rivera',
      email: 'student@hostelhub.com',
      badge: 'Student',
      desc: 'Complaints, Laundry & Visitor Passes'
    },
    {
      role: 'WARDEN',
      name: 'Dr. Arthur Pendelton',
      email: 'warden@hostelhub.com',
      badge: 'Warden',
      desc: 'Approvals & Attendance Dispatch'
    },
    {
      role: 'STAFF',
      name: 'Marcus Vance',
      email: 'staff@hostelhub.com',
      badge: 'Staff',
      desc: 'Work Orders & Resolution Proof'
    },
    {
      role: 'ADMIN',
      name: 'Sarah Connor',
      email: 'admin@hostelhub.com',
      badge: 'Admin',
      desc: 'Executive Analytics & User RBAC'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#1C1C1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Ambient Pixel Snow Background */}
      <PixelSnow color="#8FB8A8" density={0.35} speed={0.8} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center space-y-2.5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#8FB8A8] text-[#1C1C1E] font-bold text-xl">
          H
        </div>
        <h2 className="text-2xl font-bold text-[#292826] dark:text-[#EDEDEC] tracking-tight">
          Welcome to <span className="text-[#4C7565] dark:text-[#8FB8A8]">HostelHub</span>
        </h2>
        <p className="text-xs text-[#7A7873] dark:text-[#9C9C98]">
          Enterprise Smart Hostel Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <BorderGlow colors={['#8FB8A8', '#E8B4A0', '#A8C4A2']} borderRadius={16} glowIntensity={0.6}>
          <div className="p-8 space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-[#D89A9A]/15 border border-[#D89A9A]/30 text-[#A44949] dark:text-[#E2A7A7] text-xs font-semibold">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="primary" className="w-full" loading={loading}>
                Sign In to Dashboard
              </Button>
            </form>

            {/* Quick Demo Persona Presets */}
            <div className="pt-4 border-t border-[#E5E4E1] dark:border-[#38383C] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#7A7873] dark:text-[#9C9C98] flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#8FB8A8]" />
                  Select Demo Persona
                </span>
                <span className="text-[10px] font-mono text-[#4C7565] dark:text-[#A3CCA3] bg-[#8FB8A8]/15 px-2 py-0.5 rounded border border-[#8FB8A8]/30">
                  One-Click Demo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {presetAccounts.map((p) => (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => {
                      setEmail(p.email);
                      setSelectedRole(p.role as any);
                      login(p.email, p.role);
                    }}
                    className={`p-3 rounded-lg border text-left transition-colors duration-150 ${
                      selectedRole === p.role
                        ? 'bg-[#8FB8A8]/15 border-[#8FB8A8]/40'
                        : 'bg-[#FAFAF9] dark:bg-[#1C1C1E] border-[#E5E4E1] dark:border-[#38383C] hover:border-[#8FB8A8]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block text-xs font-semibold text-[#292826] dark:text-[#EDEDEC] truncate">{p.name}</span>
                      {selectedRole === p.role && <CheckCircle2 className="w-3.5 h-3.5 text-[#4C7565] dark:text-[#8FB8A8] flex-shrink-0" />}
                    </div>
                    <span className="block text-[9px] font-mono text-[#7A7873] dark:text-[#9C9C98] font-semibold uppercase mt-1">{p.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BorderGlow>

        <p className="mt-6 text-center text-xs text-[#7A7873] dark:text-[#9C9C98] flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#4C7565] dark:text-[#8FB8A8]" />
          Production-Grade Relational Architecture & RBAC Security
        </p>
      </div>
    </div>
  );
};
