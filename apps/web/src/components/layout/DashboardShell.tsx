import React, { useState } from 'react';
import { Sidebar } from './Sidebar.js';
import { Topbar } from './Topbar.js';
import { ChatWidget } from '../ai/ChatWidget.js';
import { useAuth } from '../../store/AuthContext.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { AlertOctagon, HelpCircle } from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  activeTab,
  setActiveTab
}) => {
  const { user, triggerSOSAlert } = useAuth();
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosLocation, setSosLocation] = useState('Oak Ridge Hall - Room 204');
  const [sosNotes, setSosNotes] = useState('Medical issue/Assistance needed');
  const [sosSending, setSosSending] = useState(false);

  const handleTriggerSOS = async () => {
    setSosSending(true);
    await triggerSOSAlert(sosLocation, sosNotes);
    setSosSending(false);
    setIsSOSOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/35">
      {/* Role Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenSOSModal={() => setIsSOSOpen(true)} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Floating Student Policy AI Assistant */}
      <ChatWidget />

      {/* Emergency SOS Modal */}
      <Modal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        title="🚨 TRIGGER EMERGENCY SOS BROADCAST"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400">
            <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs">
              <p className="font-bold">CRITICAL WARNING</p>
              <p className="mt-1 leading-relaxed text-red-300">
                Triggering the SOS button will broadcast a high-priority emergency alarm to all duty wardens, staff list, and campus security dispatch with your current room and phone details. Use only in actual emergency events.
              </p>
            </div>
          </div>

          <Input
            label="Emergency Location / Room Number"
            value={sosLocation}
            onChange={(e) => setSosLocation(e.target.value)}
            placeholder="e.g. Block B Room 204"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Nature of Emergency (Optional Notes)
            </label>
            <textarea
              value={sosNotes}
              onChange={(e) => setSosNotes(e.target.value)}
              placeholder="Describe emergency (medical, security issue, fire etc.)"
              className="w-full rounded-lg bg-slate-900/80 border border-slate-800 text-slate-100 text-sm px-3.5 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-3 justify-end pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsSOSOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={sosSending} onClick={handleTriggerSOS}>
              Broadcast Alarm Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
