import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ShieldCheck,
    Cpu,
    Cloud,
    Terminal,
    PanelLeft,
    PanelRight
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar();
    const isCollapsed = !isOpen;

    const navItems = [
        { name: 'CISO Command', path: '/dashboard', icon: ShieldCheck },
        { name: 'Amplify Specialist', path: '/specialist/amplify', icon: Cpu },
        { name: 'AWS Specialist', path: '/specialist/aws', icon: Cloud },
        { name: 'Google Specialist', path: '/specialist/google', icon: Cloud },
    ];

    return (
        <aside
            className={`relative flex flex-col h-screen liquid-glass border-r border-white/10 z-20 transition-all duration-300 ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* HEADER: Added h-20 to match Navbar and prevent cutoff */}
            <div className="h-20 flex items-center justify-between px-4 shrink-0 border-b border-white/5">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 animate-in fade-in duration-300">
                        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                            <Terminal className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-bold text-sm tracking-tight text-white">
              Amplify Fed
            </span>
                    </div>
                )}

                <button
                    onClick={toggle}
                    className={`p-2 rounded-md hover:bg-white/10 text-slate-400 transition-colors ${
                        isCollapsed ? 'w-full flex justify-center' : ''
                    }`}
                >
                    {isCollapsed ? <PanelRight className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* NAVIGATION */}
            <ScrollArea className="flex-1 py-4 px-3">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg transition-all duration-200 ${
                                    isCollapsed ? 'justify-center py-3' : 'px-3 py-2.5'
                                } ${
                                    isActive
                                        ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className={`shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                            {!isCollapsed && (
                                <span className="text-sm font-medium truncate">
                  {item.name}
                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </ScrollArea>

            {/* FOOTER: System Status */}
            <div className="p-4 border-t border-white/5 shrink-0">
                <div className={`flex items-center gap-3 bg-slate-950/40 rounded-lg border border-white/5 ${
                    isCollapsed ? 'justify-center py-3' : 'px-3 py-2'
                }`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    {!isCollapsed && (
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Secure
            </span>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;