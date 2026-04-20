import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CisoDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section: Centered Text */}
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                    CISO Command
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Orchestrating autonomous agents across the Federal Amplify ecosystem.
                </p>
            </header>

            {/* Main Grid: Centered and Balanced */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Chat: Dominates the center (8 columns) */}
                <div className="lg:col-span-8 h-[700px]">
                    <ChatInterface targetAgent="ciso" />
                </div>

                {/* Sidebar Stats: Floating in the side (4 columns) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="liquid-glass border-white/10 bg-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-slate-400">Fleet Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Agents in System</span>
                                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">05</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">System Health</span>
                                <span className="text-emerald-400 text-xs font-bold">NOMINAL</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CisoDashboard;