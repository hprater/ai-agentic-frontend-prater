import React, { useState, useEffect, useRef } from 'react';
import {
    Send, Terminal, User, ShieldAlert, Copy, Check,
    GitGraph, Cpu, History, Activity
} from 'lucide-react';
import { getBearerToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    metadata?: {
        usage?: any;
        status?: any;
        handoffs?: string[];
    };
}

const ChatInterface = ({ targetAgent }: { targetAgent: string }) => {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleCopy = async (content: string, index: number) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedId(index);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || authLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const token = await getBearerToken();
            if (!token) throw new Error('Authentication Required');

            const payload = {
                jsonrpc: "2.0",
                id: Date.now().toString(),
                method: "message/send",
                params: {
                    message: { role: "user", messageId: `msg_${Date.now()}`, parts: [{ text: currentInput }] },
                    agent_id: targetAgent || "ciso_orchestrator"
                }
            };

            const response = await fetch("https://orchestrator-nvqex3tt2a-uc.a.run.app/", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!data || !data.result) throw new Error("Invalid Uplink Protocol");

            const taskResult = data.result;

            // --- IMPROVED CONTENT RESOLUTION ---
            // 1. Check Artifacts
            // 2. Check Status Message
            // 3. Fallback: Deep search the history for the final agent message text
            const history = taskResult?.history || [];
            const lastAgentMsg = [...history].reverse().find(h => h.role === 'agent' && h.parts?.[0]?.text);

            const assistantText =
                taskResult?.artifacts?.[0]?.parts?.[0]?.text ||
                taskResult?.status?.message?.parts?.[0]?.text ||
                lastAgentMsg?.parts?.[0]?.text ||
                "Uplink confirmed, task completed.";

            // --- RECURSIVE TRACE PARSER ---
            const trace: string[] = [];
            history.forEach((h: any) => {
                const name = h?.parts?.[0]?.data?.args?.agent_name;
                if (name && !trace.includes(name)) trace.push(name);
            });

            const customMetaRaw = taskResult?.metadata?.adk_custom_metadata;
            if (customMetaRaw && typeof customMetaRaw === 'string') {
                const agentMatches = customMetaRaw.match(/'agent_name':\s*'([^']+)'/g);
                if (agentMatches) {
                    agentMatches.forEach(match => {
                        const parts = match.split("'");
                        const name = parts[3];
                        if (name && !trace.includes(name)) trace.push(name);
                    });
                }
            }

            const sanitizedMetadata = {
                usage: taskResult?.metadata?.adk_usage_metadata ?? {},
                status: taskResult?.status ?? {},
                handoffs: trace.map(t => t.replace(/_/g, ' '))
            };

            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: assistantText,
                metadata: sanitizedMetadata
            }]);

        } catch (error: any) {
            console.error("Agent Error:", error);
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `🚨 UPLINK FAILURE: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full min-h-[600px] lg:min-h-[650px] w-full max-w-full liquid-glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50">
                        <ShieldAlert className="w-12 h-12" />
                        <p className="text-sm font-mono uppercase tracking-[0.3em]">Awaiting Command...</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    const { usage, status, handoffs } = msg.metadata || {};

                    return (
                        <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                            <div className={`group relative flex flex-col max-w-[90%] lg:max-w-[85%] rounded-2xl transition-all duration-200 ${
                                isUser ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 ml-12' : 'bg-white/5 border border-white/10 text-slate-200 mr-12'
                            }`}>

                                {!isUser && msg.metadata && (
                                    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-white/5 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleCopy(msg.content, i)} className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-blue-400 transition-colors">
                                            {copiedId === i ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>

                                        <div className="relative group/tooltip">
                                            <button className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-blue-400 transition-colors"><GitGraph className="w-3.5 h-3.5" /></button>
                                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50 bg-slate-900/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-2xl min-w-[200px] animate-in fade-in zoom-in-95">
                                                <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1 text-left">Reasoning Trace</p>
                                                <div className="text-[11px] font-sans text-slate-300 space-y-1 text-left capitalize">
                                                    {handoffs && handoffs.length > 0 ? handoffs.map((h: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-2"><span className="text-blue-500">↳</span> {h}</div>
                                                    )) : <span>Direct Execution</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group/tooltip">
                                            <button className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-blue-400 transition-colors"><Cpu className="w-3.5 h-3.5" /></button>
                                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50 bg-slate-900/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-2xl min-w-[180px] animate-in fade-in zoom-in-95">
                                                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1 text-left">Token Metrics</p>
                                                <div className="text-[11px] font-mono text-slate-300 grid grid-cols-2 gap-x-4 gap-y-1 text-left">
                                                    <span className="text-slate-500">Total:</span> <span>{usage?.totalTokenCount ?? 0}</span>
                                                    <span className="text-slate-500">Prompt:</span> <span>{usage?.promptTokenCount ?? 0}</span>
                                                    <span className="text-slate-500">Thoughts:</span> <span>{usage?.thoughtsTokenCount ?? 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group/tooltip">
                                            <button className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-blue-400 transition-colors"><History className="w-3.5 h-3.5" /></button>
                                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50 bg-slate-900/95 backdrop-blur-xl p-3 rounded-lg border border-white/20 shadow-2xl min-w-[220px] animate-in fade-in zoom-in-95">
                                                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 text-left">Uplink Status</p>
                                                <div className="text-[11px] font-sans text-slate-300 space-y-1 text-left">
                                                    <div className="flex justify-between gap-4"><span className="text-slate-500">State:</span> <span className="uppercase text-emerald-400 font-mono">{status?.state ?? 'Nominal'}</span></div>
                                                    <div className="flex justify-between gap-4"><span className="text-slate-500">Timestamp:</span> <span className="whitespace-nowrap">{status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'N/A'}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isUser && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <button onClick={() => handleCopy(msg.content, i)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white/10 text-slate-500 transition-all duration-200">
                                            {copiedId === i ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                )}

                                <div className="flex gap-4 p-4">
                                    <div className="shrink-0 mt-1">
                                        {isUser ? <User className="w-5 h-5 text-slate-400" /> : <Terminal className="w-5 h-5 text-blue-400" />}
                                    </div>
                                    <div className={`text-sm leading-relaxed whitespace-pre-wrap font-sans ${isUser ? 'pr-8' : ''}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                            <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Processing...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md shrink-0">
                <div className="flex gap-3 bg-slate-950/50 border border-white/10 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent outline-none px-3 text-sm text-slate-100 placeholder:text-slate-500"
                        placeholder={`Transmit to ${targetAgent?.toUpperCase() || 'ORCHESTRATOR'}...`}
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 text-white p-2.5 rounded-lg active:scale-95 disabled:opacity-30 transition-all">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;