import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User, ShieldAlert } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
    targetAgent: string; // 'ciso', 'amplify', 'aws', etc.
}

const ChatInterface = ({ targetAgent }: ChatInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic for new transmissions
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const baseUrl = import.meta.env.VITE_CISO_URL;

            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    agent_context: targetAgent // Passing the specialist context to the CISO
                }),
            });

            if (!response.ok) throw new Error('Uplink Failure');

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || "No data received from terminal."
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Transmission Error:", error);
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: "🚨 ERROR: Secure Uplink Terminated. Verify Cloud Run status and IAM permissions."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full liquid-glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500">

            {/* MESSAGES AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 opacity-50">
                        <ShieldAlert className="w-12 h-12" />
                        <p className="text-sm font-mono uppercase tracking-widest">Awaiting Command Input...</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`flex gap-4 max-w-[85%] p-4 rounded-2xl ${
                            msg.role === 'user'
                                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50 ml-12'
                                : 'bg-white/5 border border-white/10 text-slate-200 mr-12'
                        }`}>
                            <div className="shrink-0 mt-1">
                                {msg.role === 'assistant' ? (
                                    <Terminal className="w-5 h-5 text-blue-400" />
                                ) : (
                                    <User className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                            </div>
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Decrypting Response...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* INPUT AREA: Floating Glass Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
                <div className="flex gap-3 bg-slate-950/50 border border-white/10 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-inner">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-slate-100 placeholder:text-slate-600"
                        placeholder={`Transmit command to ${targetAgent.toUpperCase()}...`}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-30 disabled:grayscale disabled:pointer-events-none shadow-lg shadow-blue-900/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-2 text-[10px] text-center text-slate-600 font-mono uppercase tracking-[0.2em]">
                    Classified // Federal Amplify Network // Level 4 Clear
                </p>
            </form>
        </div>
    );
};

export default ChatInterface;