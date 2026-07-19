import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { api } from '../../services/api.js';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your HostelHub Assistant. Ask me about curfew rules, laundry schedules, visitor passes, or maintenance status.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const res = await api.sendAIChat(userMsg);
    if (res.success) {
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
    } else {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Apologies, I am having trouble processing that right now.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#8FB8A8] hover:bg-[#7AA393] text-[#1C1C1E] rounded-full shadow-md font-semibold text-xs transition duration-150"
        >
          <Sparkles className="w-4 h-4 text-[#1C1C1E]" />
          <span>Ask AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white dark:bg-[#26262A] rounded-xl border border-[#E5E4E1] dark:border-[#38383C] shadow-xl overflow-hidden flex flex-col h-[480px] text-[#292826] dark:text-[#EDEDEC]">
          {/* Header */}
          <div className="p-3.5 bg-[#FAFAF9] dark:bg-[#1C1C1E] border-b border-[#E5E4E1] dark:border-[#38383C] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#4C7565] dark:text-[#8FB8A8]" />
              <div>
                <h4 className="text-xs font-bold text-[#292826] dark:text-[#EDEDEC]">HostelHub AI Policy Assistant</h4>
                <p className="text-[9px] text-[#7A7873] dark:text-[#9C9C98] font-mono">24/7 Smart Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded text-[#7A7873] hover:text-[#292826] dark:hover:text-[#EDEDEC]">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAF9] dark:bg-[#1C1C1E] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-md ${m.sender === 'user' ? 'bg-[#8FB8A8] text-[#1C1C1E]' : 'bg-[#E5E4E1] dark:bg-[#38383C] text-[#292826] dark:text-[#EDEDEC]'}`}>
                  {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`p-3 rounded-xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#8FB8A8] text-[#1C1C1E] font-medium'
                      : 'bg-white dark:bg-[#26262A] text-[#292826] dark:text-[#EDEDEC] border border-[#E5E4E1] dark:border-[#38383C]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-[#7A7873] text-xs font-medium">
                <Bot className="w-3.5 h-3.5 animate-pulse text-[#8FB8A8]" />
                <span>AI is processing...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#E5E4E1] dark:border-[#38383C] bg-white dark:bg-[#26262A] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about curfew, laundry..."
              className="flex-1 px-3 py-2 bg-[#FAFAF9] dark:bg-[#1C1C1E] border border-[#E5E4E1] dark:border-[#38383C] rounded-md text-xs text-[#292826] dark:text-[#EDEDEC] placeholder-[#7A7873]/50 focus:outline-none focus:border-[#8FB8A8]"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-[#8FB8A8] hover:bg-[#7AA393] text-[#1C1C1E] rounded-md transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
