import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User } from 'lucide-react';

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

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // In a real federal setup, you'd swap the URL based on targetAgent
            const baseUrl = import.meta.env.VITE_CISO_URL;

            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || "No response from agent."
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error calling agent:", error);
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: "🚨 Connection Error: Ensure the Cloud Run service is active and CORS is enabled."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-card shadow-inner border rounded-md">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                            {msg.role === 'assistant' ? <Terminal className="w-5 h-5 mt-1 shrink-0" /> : <User className="w-5 h-5 mt-1 shrink-0" />}
                            <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-lg animate-pulse text-sm">Agent is thinking...</div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t bg-background flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${targetAgent}...`}
                    className="flex-1 bg-muted border-none rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90 disabled:opacity-50"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;