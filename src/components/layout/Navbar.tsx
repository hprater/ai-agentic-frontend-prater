import { Bell, Search, User, ShieldCheck, Activity } from 'lucide-react';

const Navbar = () => {
    return (
        <header className="h-16 w-full liquid-glass border-b border-white/10 z-30 flex items-center justify-between px-6 shrink-0">
            {/* LEFT: Branding/System Identity */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                    <span className="font-bold tracking-tighter text-xl uppercase">
            Amplify <span className="text-blue-500">Fed</span>
          </span>
                </div>
                <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block" />
                <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span>UPLINK: ENCRYPTED</span>
                </div>
            </div>

            {/* CENTER: Global Search (Command Palette Style) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <div className="w-full relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search agents or logs..."
                        className="w-full bg-slate-900/50 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                </div>
            </div>

            {/* RIGHT: User Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;