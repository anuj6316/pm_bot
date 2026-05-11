import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Loader2, MessageSquarePlus, Trash2, Mic, Plus, PanelLeftClose, PanelLeftOpen, Database, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  fetchConversations, 
  fetchChatModels, 
  deleteConversation, 
  postChatQuery,
  type Conversation, 
  type ChatModel 
} from '@/src/lib/api';
import { useChatWebSocket, type ChatMessage } from '@/src/hooks/useChatWebSocket';
import { ModelSelector, ModelInfoTooltip } from '@/src/components/chat/ModelSelector';
import { MessageBubble } from '@/src/components/chat/MessageBubble';
import { useProject } from '@/src/contexts/ProjectContext';

export function Chat() {
  const { selectedProject } = useProject();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convLoading, setConvLoading] = useState(true);
  const [models, setModels] = useState<ChatModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChatModel | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Toggle between Conversation mode and DB Query mode
  const [mode, setMode] = useState<'chat' | 'query'>('chat');
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);

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

  const loadModels = useCallback(async () => {
    try {
      const list = await fetchChatModels();
      setModels(list);
      setSelectedModel((prev) => {
        if (prev && list.find((m) => m.id === prev.id)) return prev;
        return list.find((m) => m.is_default && m.available) ?? list.find((m) => m.available) ?? null;
      });
    } catch { /* ignore */ }
  }, []);

  const {
    connectToConversation,
    sendMessage,
    messages: chatMessages,
    activeConvId,
    wsError,
    isSending: isChatSending
  } = useChatWebSocket(loadConversations, selectedModel?.id, selectedProject?.id);

  // Combine messages based on mode
  const currentMessages = mode === 'query' ? localMessages : chatMessages;
  const isSending = mode === 'query' ? isQuerying : isChatSending;

  useEffect(() => {
    loadConversations();
    loadModels();
  }, [loadConversations, loadModels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

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

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;
    setInputValue('');

    if (mode === 'query') {
      setIsQuerying(true);
      const userMsg: ChatMessage = { 
        id: `q-user-${Date.now()}`, 
        type: 'user', 
        text, 
        timestamp: new Date() 
      };
      setLocalMessages(prev => [...prev, userMsg]);

      try {
        const res = await postChatQuery(text, selectedModel?.id);
        const assistantMsg: ChatMessage = {
          id: `q-ai-${Date.now()}`,
          type: 'assistant',
          text: res.answer,
          timestamp: new Date()
        };
        setLocalMessages(prev => [...prev, assistantMsg]);
      } catch (err: any) {
        setLocalMessages(prev => [...prev, {
          id: `q-err-${Date.now()}`,
          type: 'error',
          text: err.message,
          timestamp: new Date()
        }]);
      } finally {
        setIsQuerying(false);
      }
    } else {
      sendMessage(text);
    }
  };

  const toggleMode = (newMode: 'chat' | 'query') => {
    setMode(newMode);
    if (newMode === 'query') {
      setLocalMessages([]);
    }
  };

  return (
    <div className="flex w-full h-full bg-[var(--color-canvas)] text-[var(--color-ink)] overflow-hidden relative">

      {/* ════ LEFT: Conversation sidebar ════════════════════════════════════════ */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="flex flex-col flex-shrink-0 border-r border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)] overflow-hidden"
          >
            {/* Sidebar header */}
            <div className="flex-shrink-0 flex items-center justify-between px-[16px] h-[52px] border-b border-[var(--color-divider-soft)] sticky top-0 z-10">
              <span className="text-body-strong text-[var(--color-ink)]">Conversations</span>
            </div>

            {/* Mode Switcher */}
            <div className="flex-shrink-0 p-[12px] flex gap-[4px] border-b border-[var(--color-divider-soft)] bg-[var(--color-surface-pearl)]">
              <button
                onClick={() => toggleMode('chat')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-[6px] py-[6px] rounded-sm text-caption-strong transition-all cursor-pointer",
                  mode === 'chat' ? "bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary)] shadow-sm" : "text-[var(--color-ink-muted-80)] hover:bg-[var(--color-divider-soft)]"
                )}
              >
                <MessageSquare className="w-[14px] h-[14px]" />
                Chat
              </button>
              <button
                onClick={() => toggleMode('query')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-[6px] py-[6px] rounded-sm text-caption-strong transition-all cursor-pointer",
                  mode === 'query' ? "bg-[var(--color-canvas)] border border-[var(--color-hairline)] text-[var(--color-primary)] shadow-sm" : "text-[var(--color-ink-muted-80)] hover:bg-[var(--color-divider-soft)]"
                )}
              >
                <Database className="w-[14px] h-[14px]" />
                Query
              </button>
            </div>

            {/* New chat button */}
            <div className="flex-shrink-0 p-[12px] border-b border-[var(--color-divider-soft)]">
              <button
                onClick={() => { toggleMode('chat'); connectToConversation('new'); }}
                className="w-full flex items-center gap-[8px] px-[12px] py-[10px] rounded-sm text-body-default text-[var(--color-ink)] hover:bg-[var(--color-divider-soft)] active:bg-[var(--color-hairline)] transition-colors group cursor-pointer"
              >
                <span className="w-[28px] h-[28px] rounded-sm bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 transition-colors">
                  <MessageSquarePlus className="w-[14px] h-[14px] text-[var(--color-on-primary)]" />
                </span>
                New chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-[8px] scrollbar-hide">
              {convLoading ? (
                <div className="flex justify-center py-[32px]"><Loader2 className="w-[20px] h-[20px] animate-spin text-[var(--color-ink-muted-48)]" /></div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center gap-[8px] py-[40px] text-center px-[12px]">
                  <MessageSquarePlus className="w-[16px] h-[16px] text-[var(--color-ink-muted-48)]" />
                  <p className="text-caption text-[var(--color-ink-muted-80)] leading-relaxed mt-[8px]">
                    No chats yet.<br />Click <strong className="text-[var(--color-ink)]">New chat</strong> to start.
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => { toggleMode('chat'); if (conv.id !== activeConvId) connectToConversation(conv.id); }}
                    className={cn(
                      'group flex items-center justify-between px-[12px] py-[10px] rounded-sm cursor-pointer transition-all text-body-default mb-[4px]',
                      activeConvId === conv.id && mode === 'chat'
                        ? 'bg-[var(--color-canvas)] border border-[var(--color-hairline)] shadow-sm text-[var(--color-ink)] font-medium'
                        : 'hover:bg-[var(--color-divider-soft)] text-[var(--color-ink-muted-80)]',
                    )}
                  >
                    <p className="truncate flex-1 mr-[8px]">{conv.title}</p>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-[4px] rounded-sm text-[var(--color-ink-muted-48)] hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-[12px] h-[12px]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ RIGHT: Main chat area ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--color-canvas-parchment)] relative">

        {/* ── Top header bar ───────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-[16px] h-[52px] border-b border-[var(--color-divider-soft)] sticky top-0 z-20 bg-[var(--color-canvas-parchment)]">
          <div className="flex items-center gap-[4px]">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-[8px] rounded-sm text-[var(--color-ink-muted-80)] hover:text-[var(--color-ink)] hover:bg-[var(--color-divider-soft)] transition-colors focus:outline-none cursor-pointer"
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-[16px] h-[16px]" /> : <PanelLeftOpen className="w-[16px] h-[16px]" />}
            </button>
            <div className="flex items-center gap-[8px] ml-[4px] mr-[8px] px-[8px] py-[4px]">
              <span className={cn(
                "w-[6px] h-[6px] rounded-full",
                mode === 'query' ? "bg-purple-500 animate-pulse" : "bg-green-500"
              )} />
              <span className="text-fine-print uppercase tracking-widest text-[var(--color-ink-muted-80)]">
                {mode === 'query' ? 'System Query' : 'Chat Mode'}
              </span>
            </div>
            <ModelSelector models={models} selected={selectedModel} onSelect={setSelectedModel} disabled={isSending} onRefresh={loadModels} />
            <ModelInfoTooltip model={selectedModel} />
          </div>

          <div className="flex items-center gap-[8px]">
            {mode === 'query' ? (
              <button
                onClick={() => setLocalMessages([])}
                className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-sm text-caption font-medium border border-[var(--color-hairline)] bg-[var(--color-canvas)] hover:bg-[var(--color-canvas-parchment)] transition-colors cursor-pointer text-[var(--color-ink)]"
              >
                <Trash2 className="w-[14px] h-[14px]" />
                Clear
              </button>
            ) : (
              <button
                onClick={() => connectToConversation('new')}
                className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-sm text-caption font-medium bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-focus)] transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquarePlus className="w-[14px] h-[14px]" />
                New chat
              </button>
            )}
          </div>
        </div>

        {wsError && mode === 'chat' && (
          <div className="flex-shrink-0 text-caption text-red-600 bg-red-50 border-b border-red-100 px-[24px] py-[8px] text-center absolute top-[52px] w-full z-10">{wsError}</div>
        )}

        {/* ── Messages area ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto w-full">
          {mode === 'chat' && !activeConvId && currentMessages.length === 0 ? (
            /* Empty state Chat */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full gap-[20px] text-center px-[24px]">
              <div className="w-[56px] h-[56px] rounded-[18px] bg-[var(--color-primary)] flex items-center justify-center shadow-product-elevation">
                <span className="text-[var(--color-on-primary)] font-bold text-display-md tracking-tight leading-none">PM</span>
              </div>
              <div>
                <p className="text-display-md text-[var(--color-ink)]">What can I help with?</p>
                {selectedModel && (
                  <p className="text-caption text-[var(--color-ink-muted-80)] mt-[6px]">
                    Using <span className="font-medium text-[var(--color-ink)]">{selectedModel.label}</span>
                    <span className="mx-[6px] text-[var(--color-divider-soft)]">·</span>
                    Conversational agent with tool access
                  </p>
                )}
              </div>
            </motion.div>
          ) : mode === 'query' && currentMessages.length === 0 ? (
            /* Empty state Query */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full gap-[20px] text-center px-[24px]">
              <div className="w-[56px] h-[56px] rounded-[18px] bg-purple-600 flex items-center justify-center shadow-product-elevation text-[var(--color-on-dark)]">
                <Database className="w-[28px] h-[28px]" />
              </div>
              <div>
                <p className="text-display-md text-[var(--color-ink)]">System Query Mode</p>
                <p className="text-caption text-[var(--color-ink-muted-80)] mt-[6px] max-w-sm">
                  Ask about your assigned projects, team members, or the status of AI processing tasks directly from our database.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto px-[24px] py-[32px] space-y-[8px]">
              {currentMessages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isSending={isSending} />
              ))}
              <div ref={messagesEndRef} className="h-[16px]" />
            </div>
          )}
        </div>

        {/* ── Input bar ────────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-[24px] pb-[24px] pt-[8px]">
          <div className="max-w-3xl mx-auto">
            <div className={cn(
              'flex items-end gap-[8px] bg-[var(--color-canvas)] rounded-lg p-[8px] border border-[var(--color-hairline)] transition-shadow focus-within:ring-2 focus-within:ring-[var(--color-primary-focus)]',
              mode === 'query' && 'focus-within:ring-purple-400'
            )}>
              <button disabled={isSending}
                className="flex-shrink-0 w-[40px] h-[40px] rounded-sm bg-[var(--color-canvas-parchment)] flex items-center justify-center text-[var(--color-ink-muted-80)] hover:bg-[var(--color-divider-soft)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-[2px]"
              >
                <Plus className="w-[16px] h-[16px]" />
              </button>

              <textarea
                ref={textareaRef} rows={1} value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={mode === 'query' ? "Query system status, projects or users..." : "Ask anything"}
                disabled={isSending}
                className="flex-1 bg-transparent border-none outline-none resize-none text-body-default text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted-48)] py-[12px] px-[4px] disabled:cursor-not-allowed max-h-[200px] overflow-y-auto"
                style={{ minHeight: '44px' }}
              />

              <button disabled={isSending}
                className="flex-shrink-0 w-[40px] h-[40px] flex items-center justify-center rounded-sm text-[var(--color-ink-muted-80)] hover:text-[var(--color-ink)] hover:bg-[var(--color-divider-soft)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-[2px]"
              >
                <Mic className="w-[16px] h-[16px]" />
              </button>

              <button onClick={handleSend}
                disabled={isSending || !inputValue.trim()}
                className={cn(
                  'flex-shrink-0 w-[44px] h-[44px] rounded-sm flex items-center justify-center transition-all mb-[1px]',
                  inputValue.trim() && !isSending
                    ? (mode === 'query' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-focus)]') + ' text-[var(--color-on-primary)] active:scale-[0.98] cursor-pointer'
                    : 'bg-[var(--color-divider-soft)] text-[var(--color-canvas)] cursor-not-allowed',
                )}
              >
                {isSending ? <Loader2 className="w-[16px] h-[16px] animate-spin" /> : <Send className="w-[16px] h-[16px] translate-x-[1px]" />}
              </button>
            </div>
            <p className="text-center text-fine-print text-[var(--color-ink-muted-48)] mt-[12px]">
              {mode === 'query' ? 'System Query mode uses the local database as source of truth.' : 'PM.ai can make mistakes. Verify important information.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
