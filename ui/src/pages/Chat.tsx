import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send, Loader2, Wrench, MessageSquarePlus, Trash2,
  ChevronDown, Check, Zap, Info, Copy, CheckCheck,
  ThumbsUp, ThumbsDown, RotateCcw, Mic, Plus,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  openChatSocket,
  fetchConversations,
  fetchChatModels,
  fetchConversationMessages,
  deleteConversation,
  type Conversation,
  type ChatModel,
  type HistoryMessage,
} from '@/src/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'tool_call' | 'tool_result' | 'error';
  text: string;
  toolName?: string;
  isStreaming?: boolean;
  timestamp: Date;
}

// ─── Provider palette ─────────────────────────────────────────────────────────

const PROVIDER_DOT: Record<string, string> = {
  Groq: 'bg-orange-500', OpenAI: 'bg-green-600',
  Anthropic: 'bg-violet-600', Google: 'bg-blue-500', Ollama: 'bg-gray-500',
};
const PROVIDER_TEXT: Record<string, string> = {
  Groq: 'text-orange-600', OpenAI: 'text-green-700',
  Anthropic: 'text-violet-700', Google: 'text-blue-700', Ollama: 'text-gray-600',
};

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); })}
      title="Copy"
      className={cn('p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors', className)}
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Model selector ───────────────────────────────────────────────────────────

function ModelSelector({ models, selected, onSelect, disabled }: {
  models: ChatModel[]; selected: ChatModel | null;
  onSelect: (m: ChatModel) => void; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const byProvider: Record<string, ChatModel[]> = {};
  for (const m of models) { if (!byProvider[m.provider]) byProvider[m.provider] = []; byProvider[m.provider].push(m); }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !disabled && setOpen(!open)} disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold transition-all select-none',
          disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100 cursor-pointer',
        )}
      >
        {selected && <span className={cn('w-2 h-2 rounded-full flex-shrink-0', PROVIDER_DOT[selected.provider] ?? 'bg-gray-400')} />}
        <span>{selected?.label ?? 'Select model'}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 max-h-80 overflow-y-auto">
            {Object.entries(byProvider).map(([provider, pms]) => (
              <div key={provider} className="mb-2 last:mb-0">
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className={cn('w-2 h-2 rounded-full', PROVIDER_DOT[provider] ?? 'bg-gray-400')} />
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{provider}</span>
                </div>
                {pms.map((m) => (
                  <button key={m.id} disabled={!m.available}
                    onClick={() => { onSelect(m); setOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors',
                      !m.available && 'opacity-40 cursor-not-allowed',
                      m.available && selected?.id === m.id && 'bg-gray-100',
                      m.available && selected?.id !== m.id && 'hover:bg-gray-50',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{m.label}</span>
                        {m.is_default && <span className="text-[9px] bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5 font-semibold">DEFAULT</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Zap className="w-2.5 h-2.5 text-gray-300" />
                        <span className="text-[10px] text-gray-400">{m.badge}</span>
                        {!m.available && m.env_var && <span className="text-[10px] text-orange-400 ml-1">needs {m.env_var}</span>}
                      </div>
                    </div>
                    {selected?.id === m.id && <Check className="w-4 h-4 text-gray-700 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Model info tooltip ───────────────────────────────────────────────────────

function ModelInfoTooltip({ model }: { model: ChatModel | null }) {
  const [visible, setVisible] = useState(false);
  if (!model) return null;
  return (
    <div className="relative flex-shrink-0">
      <button type="button"
        onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)} onBlur={() => setVisible(false)}
        aria-label="Model information"
        className="flex items-center justify-center w-5 h-5 rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {visible && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 pointer-events-none" role="tooltip">
          <div className="absolute left-1/2 -translate-x-1/2 top-[-5px] w-2.5 h-2.5 bg-white border-l border-t border-gray-200 rotate-45" />
          <div className="flex items-center gap-2 mb-3">
            <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', PROVIDER_DOT[model.provider] ?? 'bg-gray-400')} />
            <span className={cn('text-[10px] font-bold uppercase tracking-widest', PROVIDER_TEXT[model.provider] ?? 'text-gray-500')}>{model.provider}</span>
            {model.is_default && <span className="ml-auto text-[9px] bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5 font-semibold">DEFAULT</span>}
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-3">{model.label}</p>
          <div className="flex items-center gap-1.5 mb-3">
            <Zap className="w-3 h-3 text-amber-400" /><span className="text-xs text-gray-500">{model.badge}</span>
          </div>
          <div className="border-t border-gray-100 my-2" />
          <div className="flex items-start gap-2 text-xs mb-2">
            <span className="text-gray-400 font-medium w-16 flex-shrink-0">API Key:</span>
            {model.env_var
              ? <span className={cn('font-mono text-[10px] px-1.5 py-0.5 rounded', model.available ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200')}>{model.env_var}</span>
              : <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">None (local)</span>}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 font-medium w-16 flex-shrink-0">Status:</span>
            <span className={cn('flex items-center gap-1 font-medium', model.available ? 'text-green-600' : 'text-orange-500')}>
              <span className={cn('w-1.5 h-1.5 rounded-full', model.available ? 'bg-green-500' : 'bg-orange-400')} />
              {model.available ? 'Available' : 'Key not set'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bot message action toolbar ───────────────────────────────────────────────

function BotActions({ text }: { text: string }) {
  const [liked, setLiked] = useState<'up' | 'down' | null>(null);
  return (
    <div className="flex items-center gap-0.5 mt-2">
      <CopyBtn text={text} />
      <button onClick={() => setLiked(liked === 'up' ? null : 'up')} title="Good response"
        className={cn('p-1.5 rounded-lg transition-colors', liked === 'up' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100')}>
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => setLiked(liked === 'down' ? null : 'down')} title="Bad response"
        className={cn('p-1.5 rounded-lg transition-colors', liked === 'down' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100')}>
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
      <button title="Regenerate" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main Chat component ──────────────────────────────────────────────────────

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [convLoading, setConvLoading] = useState(true);
  const [wsError, setWsError] = useState('');
  const [activeModel, setActiveModel] = useState<string>('');
  const [models, setModels] = useState<ChatModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<ChatModel | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIdRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingMessageRef = useRef<string | null>(null);

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

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data.results);
    } catch {
      setWsError('Could not load conversations.');
    } finally {
      setConvLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    fetchChatModels()
      .then((list) => {
        setModels(list);
        setSelectedModel(list.find((m) => m.is_default && m.available) ?? list.find((m) => m.available) ?? null);
      })
      .catch(() => {});
  }, [loadConversations]);

  // ─── WebSocket ──────────────────────────────────────────────────────────────

  const connectToConversation = useCallback(async (convId: 'new' | string) => {
    wsRef.current?.close();
    wsRef.current = null;
    setMessages([]);
    setWsError('');
    setIsSending(false);
    streamingIdRef.current = null;

    if (convId !== 'new') {
      try {
        const history: HistoryMessage[] = await fetchConversationMessages(convId);
        setMessages(
          history
            .filter((m) => m.role === 'human' || m.role === 'assistant')
            .map((m): ChatMessage => ({
              id: m.id, type: m.role === 'human' ? 'user' : 'assistant',
              text: m.content, isStreaming: false, timestamp: new Date(m.created_at),
            })),
        );
      } catch { /* non-fatal */ }
    }

    const ws = openChatSocket(convId, {
      onConnected: (newId, model) => {
        setActiveConvId(newId); setActiveModel(model ?? '');
        if (convId === 'new') loadConversations();
        
        if (pendingMessageRef.current) {
          const text = pendingMessageRef.current;
          pendingMessageRef.current = null;
          setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', text, timestamp: new Date() }]);
          const sid = `stream-${Date.now()}`;
          streamingIdRef.current = sid;
          setMessages((prev) => [...prev, { id: sid, type: 'assistant', text: '', isStreaming: true, timestamp: new Date() }]);
          wsRef.current?.send(JSON.stringify({ type: 'message', content: text }));
        }
      },
      onToken: (token) => {
        setMessages((prev) => {
          const sid = streamingIdRef.current;
          if (!sid) return prev;
          return prev.map((m) => m.id === sid ? { ...m, text: m.text + token } : m);
        });
      },
      onToolCall: (name) => {
        setMessages((prev) => {
          const sid = streamingIdRef.current;
          const idx = prev.findIndex((m) => m.id === sid);
          if (idx === -1) return [...prev, { id: `tool-${Date.now()}`, type: 'tool_call', text: '', toolName: name, timestamp: new Date() }];
          const copy = [...prev];
          copy.splice(idx, 0, { id: `tool-${Date.now()}`, type: 'tool_call', text: '', toolName: name, timestamp: new Date() });
          return copy;
        });
      },
      onToolResult: (result) => {
        setMessages((prev) => {
          const sid = streamingIdRef.current;
          const idx = prev.findIndex((m) => m.id === sid);
          if (idx === -1) return [...prev, { id: `result-${Date.now()}`, type: 'tool_result', text: result, timestamp: new Date() }];
          const copy = [...prev];
          copy.splice(idx, 0, { id: `result-${Date.now()}`, type: 'tool_result', text: result, timestamp: new Date() });
          return copy;
        });
      },
      onDone: () => {
        streamingIdRef.current = null;
        setMessages((prev) => prev.map((m) => m.isStreaming ? { ...m, isStreaming: false } : m));
        setIsSending(false);
        loadConversations();
      },
      onError: (msg) => {
        streamingIdRef.current = null;
        setMessages((prev) => prev.map((m) => m.isStreaming ? { ...m, isStreaming: false } : m));
        setMessages((prev) => [...prev, { id: `err-${Date.now()}`, type: 'error', text: msg, timestamp: new Date() }]);
        setIsSending(false);
      },
      onClose: () => setIsSending(false),
    }, selectedModel?.id);
    wsRef.current = ws;
  }, [loadConversations, selectedModel]);

  useEffect(() => { return () => { wsRef.current?.close(); }; }, []);

  const handleDeleteConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) { setActiveConvId(null); setMessages([]); wsRef.current?.close(); }
    } catch { /* ignore */ }
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    setInputValue('');
    setIsSending(true);

    if (!activeConvId || !wsRef.current) {
      pendingMessageRef.current = text;
      connectToConversation('new');
      return;
    }

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, type: 'user', text, timestamp: new Date() }]);
    const sid = `stream-${Date.now()}`;
    streamingIdRef.current = sid;
    setMessages((prev) => [...prev, { id: sid, type: 'assistant', text: '', isStreaming: true, timestamp: new Date() }]);
    wsRef.current.send(JSON.stringify({ type: 'message', content: text }));
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">

      {/* ════ LEFT: Conversation sidebar ════════════════════════════════════════ */}
      <div className={cn(
        'flex flex-col flex-shrink-0 border-r border-gray-100 bg-gray-50 transition-all duration-200 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0',
      )}>
        {/* Sidebar header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-[57px] border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Conversations</span>
        </div>

        {/* New chat button */}
        <div className="flex-shrink-0 p-3 border-b border-gray-100">
          <button
            onClick={() => connectToConversation('new')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200/70 active:bg-gray-200 transition-colors group"
          >
            <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
              <MessageSquarePlus className="w-3.5 h-3.5 text-white" />
            </span>
            New chat
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto p-2">
          {convLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center px-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <MessageSquarePlus className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                No chats yet.<br />Click <strong className="text-gray-600">New chat</strong> to start.
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => { if (conv.id !== activeConvId) connectToConversation(conv.id); }}
                className={cn(
                  'group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sm mb-0.5',
                  activeConvId === conv.id
                    ? 'bg-white shadow-sm text-gray-900 border border-gray-200/80'
                    : 'hover:bg-gray-200/60 text-gray-600',
                )}
              >
                <p className="font-medium truncate flex-1 mr-2">{conv.title}</p>
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
      </div>

      {/* ════ RIGHT: Main chat area ══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">

        {/* ── Top header bar ──────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-[57px] border-b border-gray-100">
          <div className="flex items-center gap-1">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-0.5"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800 transition-colors"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              New chat
            </button>
          </div>
        </div>

        {wsError && (
          <div className="flex-shrink-0 text-sm text-red-600 bg-red-50 border-b border-red-100 px-6 py-2 text-center">{wsError}</div>
        )}

        {/* ── Messages area ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {!activeConvId ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
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
              {/* Quick-action suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-md">
                {[
                  'Show all open issues',
                  'Create a new issue',
                  'List projects',
                  'Show high-priority bugs',
                ].map((q) => (
                  <button key={q}
                    onClick={() => { setInputValue(q); textareaRef.current?.focus(); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
              {messages.map((msg) => {
                // Tool call
                if (msg.type === 'tool_call') return (
                  <div key={msg.id} className="flex justify-start my-1 w-full relative group">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 px-1 py-1">
                      {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" /> : <Wrench className="w-3.5 h-3.5 opacity-60" />}
                      <span>Used <span className="font-mono text-[10px]">{msg.toolName}</span></span>
                      {isSending && <span className="ml-1 opacity-60 animate-pulse text-[10px]">Processing...</span>}
                    </div>
                  </div>
                );

                // Tool result
                if (msg.type === 'tool_result') {
                  const isError = /error|exception|failed|traceback/i.test(msg.text.substring(0, 100));
                  const ok = !isError;
                  return (
                    <div key={msg.id} className="flex justify-start w-full mb-3">
                      <details className={cn("group border border-gray-100 rounded-xl bg-gray-50/50 text-[11px] font-mono overflow-hidden transition-colors hover:bg-gray-50", !ok && "border-red-100 bg-red-50/50")}>
                        <summary className="px-3 py-1.5 flex items-center gap-2 cursor-pointer outline-none list-none [&::-webkit-details-marker]:hidden text-gray-500 group-hover:text-gray-700 transition-colors select-none">
                          <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform opacity-50" />
                          <span className={cn(ok ? '' : 'text-red-500 font-medium')}>
                            {ok ? 'Tool Output (Success)' : 'Tool Output (Logs)'}
                          </span>
                        </summary>
                        <div className="p-3 border-t border-gray-100 bg-white max-w-xl overflow-x-auto">
                          <pre className={cn("whitespace-pre-wrap break-words leading-relaxed", ok ? "text-gray-500" : "text-red-600")}>{msg.text}</pre>
                        </div>
                      </details>
                    </div>
                  );
                }

                // Error
                if (msg.type === 'error') return (
                  <div key={msg.id} className="max-w-xl mx-auto text-xs text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">{msg.text}</div>
                );

                // User message — gray pill
                if (msg.type === 'user') return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[70%] bg-[#F4F4F4] text-gray-900 rounded-3xl px-5 py-3 text-sm leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                );

                // Assistant — clean text with markdown
                return (
                  <div key={msg.id} className="flex flex-col items-start">
                    <div className="text-gray-900 text-sm leading-relaxed w-full">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => <p className="font-bold text-base mb-2">{children}</p>,
                          h2: ({ children }) => <p className="font-bold text-sm mb-1.5">{children}</p>,
                          h3: ({ children }) => <p className="font-semibold text-sm mb-1">{children}</p>,
                          p:  ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                          hr: () => <hr className="border-gray-200 my-3" />,
                          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:opacity-75">{children}</a>,
                          code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode; [key: string]: unknown }) =>
                            inline
                              ? <code className="bg-gray-100 text-blue-700 font-mono text-[11px] px-1.5 py-0.5 rounded-md" {...props}>{children}</code>
                              : <code className="block font-mono text-[11px]" {...props}>{children}</code>,
                          pre: ({ children }) => (
                            <pre className="bg-gray-50 border border-gray-200 rounded-2xl p-4 my-2 overflow-x-auto text-[11px] font-mono leading-relaxed">{children}</pre>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                      {msg.isStreaming && (
                        <span className="inline-block w-[3px] h-[14px] bg-gray-400 opacity-80 animate-pulse ml-0.5 align-middle rounded-sm" />
                      )}
                    </div>
                    {!msg.isStreaming && msg.text && <BotActions text={msg.text} />}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ────────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-6 pb-5 pt-3">
          <div className="max-w-3xl mx-auto">
            <div className={cn(
              'flex items-end gap-1.5 bg-[#F4F4F4] rounded-3xl p-2 ring-1 ring-gray-200/60 transition-shadow focus-within:ring-gray-300'
            )}>
              {/* + */}
              <button disabled={isSending}
                className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Auto-grow textarea */}
              <textarea
                ref={textareaRef} rows={1} value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything"
                disabled={isSending}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-900 placeholder:text-gray-400 py-2.5 px-1 disabled:cursor-not-allowed max-h-[180px] overflow-y-auto leading-tight"
                style={{ minHeight: '36px' }}
              />

              {/* Mic */}
              <button disabled={isSending}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send — dark circle */}
              <button onClick={handleSend}
                disabled={isSending || !inputValue.trim()}
                className={cn(
                  'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all',
                  inputValue.trim() && !isSending
                    ? 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm active:scale-95'
                    : 'bg-gray-300 text-white cursor-not-allowed',
                )}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              PM Bot can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
