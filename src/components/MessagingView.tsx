import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Shield,
  ShieldAlert,
  Search,
  Check,
  CheckCheck,
  User,
  MoreVertical,
  Flag,
  Ban,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Conversation, MessageItem } from '../types';

interface MessagingViewProps {
  conversations: Conversation[];
  activeConversationId?: string;
  messages: MessageItem[];
  currentUserId: string;
  currentUserName: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onBlockUser?: (conversationId: string) => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  conversations,
  activeConversationId,
  messages,
  currentUserId,
  currentUserName,
  onSelectConversation,
  onSendMessage,
  onBlockUser,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    activeConversationId || conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selectedId with activeConversationId prop
  useEffect(() => {
    if (activeConversationId) {
      setSelectedId(activeConversationId);
    }
  }, [activeConversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedId]);

  const activeConversation = conversations.find((c) => c.id === selectedId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedId) return;
    onSendMessage(selectedId, inputText.trim());
    setInputText('');
  };

  const handleQuickQuestion = (question: string) => {
    if (!selectedId) return;
    onSendMessage(selectedId, question);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.reportName && c.reportName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden h-[750px] max-h-[82vh] flex flex-col md:flex-row">
      {/* Conversations Left Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col ${
          selectedId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Messages & Handover Chat
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted coordinator chat with verified finders & owners
          </p>

          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats or items..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No active conversations found
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedId;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-slate-800/90'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={
                        conv.participantAvatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={conv.participantName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#315FEA] text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.participantName}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessageTimestamp}
                      </span>
                    </div>

                    {conv.reportName && (
                      <span className="inline-block text-[10px] font-semibold text-[#315FEA] dark:text-[#20C9A7] truncate max-w-full">
                        {conv.reportName}
                      </span>
                    )}

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Thread Right Section */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/40">
          {/* Thread Header */}
          <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedId('')}
                className="p-1 rounded-lg text-slate-500 md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={
                  activeConversation.participantAvatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                }
                alt=""
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  {activeConversation.participantName}
                </h3>
                {activeConversation.reportName && (
                  <p className="text-xs text-[#315FEA] dark:text-[#20C9A7] font-medium truncate max-w-xs">
                    Re: {activeConversation.reportName}
                  </p>
                )}
              </div>
            </div>

            {/* Safety badge and action menu */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                <Shield className="w-3.5 h-3.5" /> Identity Protected
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20 text-xs">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        alert('Report submitted to Back2U trust and safety team.');
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Flag className="w-3.5 h-3.5 text-amber-500" />
                      Report suspicious user
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (onBlockUser) onBlockUser(activeConversation.id);
                      }}
                      className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Block conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Safe Contact Guidelines Banner */}
          <div className="px-6 py-2 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#315FEA] shrink-0" />
            <span>
              Never send OTPs, banking PINs, or money upfront. Meet in daytime at metro helpdesks or police stations for safe handovers.
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-1 px-1">
                    {msg.senderName} • {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-[#315FEA] text-white rounded-br-none shadow-md'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Helper Pills */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 scrollbar-none">
            <span className="text-[11px] text-slate-400 self-center shrink-0">
              Quick prompts:
            </span>
            {[
              'Can you verify the serial number or scratch marks?',
              'Can we meet at the nearest Metro station control desk?',
              'I have ID proof ready for safe verification.',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box - GUARANTEED INPUT TEXT VISIBILITY (Fix 8) */}
          <form
            onSubmit={handleSend}
            className="p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#315FEA]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#315FEA] hover:bg-[#264ecc] text-white shadow-md disabled:opacity-40 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <p className="text-sm">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};
