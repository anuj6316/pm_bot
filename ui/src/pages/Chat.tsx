import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2, MessageSquarePlus, Trash2, Mic, Plus, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { fetchConversations, fetchChatModels, deleteConversation, type Conversation, type ChatModel } from '@/src/lib/api';
import { useChatWebSocket } from '@/src/hooks/useChatWebSocket';
import { ModelSelector, ModelInfoTooltip } from '@/src/components/chat/ModelSelector';
import { MessageBubble } from '@/src/components/chat/MessageBubble';

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convLoading, setConvLoading] = useState(true);
  const [models, setModels] = useState<ChatModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChatModel | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data.results);
    } catch {
      // Ignored for UI
    } finally {
      setConvLoading(false);
    }
  }, []);

  const {
    connectToConversation,
    sendMessage,
    messages,
    activeConvId,
    wsError,
    isSending
  } = useChatWebSocket(loadConversations, selectedModel?.id);

  useEffect(() => {
    loadConversations();
    fetchChatModels().then((list) => {
      setModels(list);
      setSelectedModel(list.find((m) => m.is_default && m.available) ?? list.find((m) => m.available) ?? null);
    }).catch(() => {});
  }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }, [inputValue]);

  const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) connectToConversation('new');
    } catch { /* ignore */ }
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isSending) return;
    setInputValue('');
    sendMessage(text);
  };

  return (
    <div className="flex w-full h-full bg-apple-bg overflow-hidden relative">

      {/* ════ LEFT: Conversation sidebar ════════════════════════════════════════ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex flex-col flex-shrink-0 border-r border-gray-200/60 bg-gray-50/50 overflow-hidden"
          >
            {/* Sidebar header (Glass) */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 h-[57px] bg-white/50 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
              <span className="text-sm font-semibold text-gray-700">Conversations</span>
            </div>

            {/* New chat button */}
            <div className="flex-shrink-0 p-3 border-b border-gray-200/60">
              <button
                onClick={() => connectToConversation('new')}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200/80 active:bg-gray-300/80 transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-white" />
                </span>
                New chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              {convLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center px-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shadow-inner">
                    <MessageSquarePlus className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-2">
                    No chats yet.<br />Click <strong className="text-gray-600">New chat</strong> to start.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => { if (conv.id !== activeConvId) connectToConversation(conv.id); }}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm mb-0.5',
                      activeConvId === conv.id
                        ? 'bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-gray-900 font-medium'
                        : 'hover:bg-gray-200/60 text-gray-600',
                    )}
                  >
                    <p className="truncate flex-1 mr-2">{conv.title}</p>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ RIGHT: Main chat area ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white/60 relative">

        {/* ── Top header bar (True Glassmorphism) ───────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-[57px] bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 sticky top-0 z-20">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors mr-0.5 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            <ModelSelector models={models} selected={selectedModel} onSelect={setSelectedModel} disabled={isSending} />
            <ModelInfoTooltip model={selectedModel} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => connectToConversation('new')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 transition-colors shadow-sm cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              New chat
            </button>
          </div>
        </div>

        {wsError && (
          <div className="flex-shrink-0 text-sm text-red-600 bg-red-50/90 backdrop-blur-md border-b border-red-100 px-6 py-2 text-center absolute top-[57px] w-full z-10">{wsError}</div>
        )}

        {/* ── Messages area ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto w-full">
          {!activeConvId && messages.length === 0 ? (
            /* Empty state */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
              <div className="w-14 h-14 rounded-[20px] bg-gray-900 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl tracking-tight">PM</span>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">What can I help with?</p>
                {selectedModel && (
                  <p className="text-sm text-gray-400 mt-1.5">
                    Using <span className="font-medium text-gray-600">{selectedModel.label}</span>
                    <span className="mx-1.5 text-gray-300">·</span>
                    Click <strong className="text-gray-600">New chat</strong> to start
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-2">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isSending={isSending} />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* ── Input bar ────────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-6 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className={cn(
              'flex items-end gap-2 bg-[#F4F4F4]/80 backdrop-blur-md rounded-[28px] p-2 ring-1 ring-gray-200/60 transition-shadow focus-within:ring-gray-300 hover:ring-gray-300/80 shadow-[0_2px_15px_rgb(0,0,0,0.03)]'
            )}>
              <button disabled={isSending}
                className="flex-shrink-0 w-[40px] h-[40px] rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ml-1 mb-0.5"
              >
                <Plus className="w-4 h-4" />
              </button>

              <textarea
                ref={textareaRef} rows={1} value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything"
                disabled={isSending}
                className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-gray-900 placeholder:text-gray-400 py-3 px-1 mb-0.5 disabled:cursor-not-allowed max-h-[200px] overflow-y-auto leading-relaxed"
                style={{ minHeight: '40px' }}
              />

              <button disabled={isSending}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-0.5"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button onClick={handleSend}
                disabled={isSending || !inputValue.trim()}
                className={cn(
                  'flex-shrink-0 w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-200 mb-0.5 mr-1',
                  inputValue.trim() && !isSending
                    ? 'bg-apple-blue text-white hover:bg-apple-blue-hover shadow-md active:scale-95 cursor-pointer'
                    : 'bg-gray-300 text-white cursor-not-allowed',
                )}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 translate-x-[1px]" />}
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-400/80 mt-3 font-medium tracking-wide">
              PM Bot can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
