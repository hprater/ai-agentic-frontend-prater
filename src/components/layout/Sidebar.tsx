import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ShieldCheck,
    Cog,
    Cloud,
    Terminal,
    Menu,
    ChevronLeft
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar();
    const isCollapsed = !isOpen;

    const orchestratorItem = { name: 'CISO Command', path: '/dashboard', icon: ShieldCheck };

    const specialistWorkflows = [
        { name: 'Software Department', path: '/specialist/software', icon: Cloud },
        { name: 'MCSWF Scorecard', path: '/specialist/mcswf', icon: Cog }
    ];

    return (
        <aside
            className={`relative flex flex-col h-screen liquid-glass border-r border-white/10 z-40 
            transition-[width] duration-500 will-change-[width] transform-gpu
            ${isCollapsed ? 'w-20' : 'w-64'} 
            custom-bezier`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
            {/* HEADER AREA */}
            <div className="h-16 flex items-center px-4 shrink-0 border-b border-white/5 overflow-hidden gap-3">
                <button
                    onClick={toggle}
                    className="flex items-center justify-center min-w-[40px] h-10 rounded-xl bg-white/5 border border-white/10 text-blue-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/50 transition-all duration-300 group/trigger shrink-0"
                >
                    {isCollapsed ? (
                        <Menu className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 group-hover/trigger:-translate-x-0.5 transition-transform" />
                    )}
                </button>

                <div className={`flex items-center gap-2 transition-all duration-500 ${isCollapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
                    <div className="h-4 w-[1px] bg-white/20 mx-1" />
                    <span className="font-bold text-sm tracking-widest text-white whitespace-nowrap uppercase">
                        Agentic <span className="text-blue-500">Systems</span>
                    </span>
                </div>
            </div>

            {/* NAVIGATION SECTION */}
            <ScrollArea className="flex-1 py-6 px-3">
                <nav className="space-y-8">

                    {/* ORCHESTRATOR LINK */}
                    <div className="space-y-1">
                        <NavLink
                            to={orchestratorItem.path}
                            className={({ isActive }) =>
                                `relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden ${
                                    isActive
                                        ? 'bg-blue-600/15 text-blue-100 border border-blue-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center justify-center min-w-[56px]">
                                        <orchestratorItem.icon className={`transition-all duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:text-slate-200'}`} size={20} />
                                    </div>
                                    <span className={`text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-500 delay-100 ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                        {orchestratorItem.name}
                                    </span>
                                    {isActive && (
                                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    </div>

                    {/* MORPHING PILL DIVIDER */}
                    <div className="relative flex items-center justify-center py-2 h-8">
                        <div className="absolute inset-0 flex items-center px-4">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className={`relative transition-all duration-700 ease-in-out flex items-center justify-center ${
                            isCollapsed
                                ? 'w-2 h-2 bg-blue-500/40 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                : 'bg-slate-950 px-4 py-1 rounded-full border border-white/10 shadow-inner w-auto'
                        }`}>
                            <span className={`text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100 delay-200'}`}>
                                Workflows
                            </span>
                        </div>
                    </div>

                    {/* SPECIALISTS SECTION */}
                    <div className="space-y-2">
                        {specialistWorkflows.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden ${
                                        isActive
                                            ? 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center justify-center min-w-[56px]">
                                            <item.icon className={`transition-all duration-300 ${isActive ? 'scale-110 text-emerald-400' : 'group-hover:text-slate-200'}`} size={20} />
                                        </div>
                                        <span className={`text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-500 delay-100 ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </ScrollArea>

            {/* SYSTEM FOOTER */}
            <div className="p-4 border-t border-white/5 shrink-0 bg-white/[0.01]">
                <div className="flex items-center h-8">
                    <div className="flex items-center justify-center min-w-[48px] relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                    </div>
                    <div className={`flex flex-col transition-all duration-500 ${isCollapsed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 delay-200'}`}>
                        <span className="text-[10px] font-mono text-slate-200 leading-none uppercase tracking-tighter font-bold">Secure Uplink</span>
                        <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1">Encrypted Node 01</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;