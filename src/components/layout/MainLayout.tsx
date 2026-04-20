import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { SidebarProvider } from '../../context/SidebarContext'; // Adjust path to your context file

/**
 * We wrap the internal layout in the Provider so that
 * both Sidebar and Navbar can access 'isOpen' and 'toggle'.
 */
const MainLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <div className="h-screen w-full flex overflow-hidden bg-slate-950 text-slate-50 font-sans">

                {/* 1. SIDEBAR: Sits on the far left.
                  Internal to Sidebar.tsx, you should now use const { isOpen } = useSidebar();
                */}
                <Sidebar />

                {/* 2. CONTENT WRAPPER: This flex container is the "sibling" to the Sidebar.
                  It will expand and contract automatically as the Sidebar's width changes.
                */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">

                    {/* 3. NAVBAR: Now nested inside the content wrapper.
                      It starts exactly where the sidebar ends.
                    */}
                    <Navbar />

                    {/* 4. MAIN SCROLL AREA: Everything else below the navbar.
                    */}
                    <main className="flex-1 overflow-y-auto relative bg-slate-950/20 custom-scrollbar">
                        <div className="max-w-7xl mx-auto p-6 lg:p-12 pt-12 lg:pt-16 relative z-10">

                            {/* Background Glows */}
                            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;