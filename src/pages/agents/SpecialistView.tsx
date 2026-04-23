import { useParams } from 'react-router-dom';
import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SpecialistView = () => {
    // 1. Hook into the URL parameter set in App.tsx
    const { agentId } = useParams<{ agentId: string }>();

    // 2. Format the name for the display
    const displayId = agentId || 'agent';
    const formattedName = displayId.charAt(0).toUpperCase() + displayId.slice(1);

    return (
        /**
         * UPDATED WRAPPER:
         * Using max-w-7xl and mx-auto ensures the grid is the same width as the Dashboard.
         * pt-12 matches the "Breathing Room" logic from your MainLayout.
         */
        <div className="max-w-7xl mx-auto p-6 lg:p-12 pt-12 lg:pt-16 space-y-8 animate-in fade-in duration-700 relative z-10">

            {/* Background Glow (matching Dashboard aesthetic) */}
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -z-10" />

            {/* Header Section */}
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 uppercase">
                    {formattedName} Specialist
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                    Secure interface for {formattedName} orchestration and autonomous tasking.
                </p>
            </header>

            {/* Main Grid: 8/4 Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* THE CHAT BOX: Locked at 650px height with min-h to prevent compression */}
                <div className="lg:col-span-8 h-[650px] min-h-[650px] flex flex-col w-full">
                    {/* key={agentId} forces a remount so chat resets between different specialists */}
                    <ChatInterface key={agentId} targetAgent={displayId.toLowerCase()} />
                </div>

                {/* SIDEBAR: Status Cards */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Agent Identity Card */}
                    <Card className="liquid-glass border-white/10 bg-white/5 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                Agent Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-300">Identity</span>
                                <span className="text-xs font-mono text-blue-400">{displayId.toUpperCase()}_v1</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-300">Node Status</span>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">ACTIVE</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enclave Status Card */}
                    <Card className="liquid-glass border-white/10 bg-white/5 opacity-60">
                        <CardContent className="pt-6">
                            <p className="text-[10px] font-mono text-slate-500 text-center uppercase tracking-widest leading-relaxed">
                                Secure Enclave // {displayId.toUpperCase()} <br/>
                                Uplink Status: Nominal
                            </p>
                        </CardContent>
                    </Card>

                    {/* Quick Guidance Card */}
                    <Card className="liquid-glass border-white/10 bg-white/5 border-dashed border-white/5">
                        <CardContent className="pt-6">
                            <p className="text-xs text-slate-500 font-sans italic text-center">
                                Task this specialist with domain-specific objectives. The orchestrator will monitor execution.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SpecialistView;