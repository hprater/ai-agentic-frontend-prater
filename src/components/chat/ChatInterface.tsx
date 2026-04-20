import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User, ShieldAlert } from 'lucide-react';
import { getBearerToken } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const ChatInterface = ({ targetAgent }: { targetAgent: string }) => {
    const { user, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

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
                    message: {
                        role: "user",
                        messageId: `msg_${Date.now()}`,
                        parts: [{ text: currentInput }]
                    },
                    agent_id: "ciso_orchestrator"
                }
            };

            const response = await fetch("https://orchestrator-nvqex3tt2a-uc.a.run.app/", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message || "Protocol Error");
            }

            // --- DEEP PARSING LOGIC ---
            const taskResult = data.result;
            const state = taskResult?.status?.state;

            // 1. Check for the final response in artifacts (Standard A2A)
            // 2. Fallback to status message (Protocol standard)
            // 3. Fallback to history (Last resort)
            const assistantText =
                taskResult?.artifacts?.[0]?.parts?.[0]?.text ||
                taskResult?.status?.message?.parts?.[0]?.text ||
                taskResult?.history?.filter((h: any) => h.role === 'agent')?.pop()?.parts?.[0]?.text ||
                "Uplink confirmed, no text returned.";

            const assistantMessage: Message = {
                role: 'assistant',
                content: state === 'failed' ? `⚠️ SYSTEM ALERT: ${assistantText}` : assistantText
            };

            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error: any) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `🚨 UPLINK FAILURE: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) return <div className="h-full flex items-center justify-center font-mono text-xs opacity-50">ESTABLISHING SECURE COMMS...</div>;

    return (
        <div className="flex flex-col h-full liquid-glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50">
                        <ShieldAlert className="w-12 h-12" />
                        <p className="text-sm font-mono uppercase tracking-[0.3em]">Awaiting Command...</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                        <div className={`flex gap-4 max-w-[85%] p-4 rounded-2xl ${
                            msg.role === 'user'
                                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 ml-12'
                                : msg.content.includes('🚨') || msg.content.includes('⚠️')
                                    ? 'bg-red-950/30 border border-red-500/50 text-red-200 mr-12'
                                    : 'bg-white/5 border border-white/10 text-slate-200 mr-12'
                        }`}>
                            <div className="shrink-0 mt-1">
                                {msg.role === 'assistant' ? <Terminal className="w-5 h-5 text-blue-400" /> : <User className="w-5 h-5 text-slate-400" />}
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Processing...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                <div className="flex gap-3 bg-slate-950/50 border border-white/10 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-100 placeholder:text-slate-600"
                        placeholder={`Transmit to ORCHESTRATOR...`}
                        autoComplete="off"
                    />
                    <button type="submit" disabled={isLoading || !input.trim() || !user} className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg active:scale-95 disabled:opacity-30">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;