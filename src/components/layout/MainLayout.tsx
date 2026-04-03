import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        /* 1. WRAPPER: Full screen, black background */
        <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-950 text-slate-50 font-sans">

            {/* 2. NAVBAR: Stays at the top.
             Ensure Navbar.tsx does NOT have 'absolute' or 'fixed'!
      */}
            <Navbar />

            {/* 3. APP BODY: This area takes up all space BELOW the Navbar */}
            <div className="flex flex-1 overflow-hidden">

                {/* 4. SIDEBAR: Sits on the left */}
                <Sidebar />

                {/* 5. MAIN CONTENT: Sits to the right of the Sidebar */}
                <main className="flex-1 overflow-y-auto relative bg-slate-950/20">

                    {/* THE "BREATHING ROOM" FIX:
              We add a container with a huge top padding (pt-12)
              to ensure the 'CISO Command' title is pushed down.
          */}
                    <div className="max-w-7xl mx-auto p-6 lg:p-12 pt-12 lg:pt-16 relative z-10">

                        {/* Background Glows */}
                        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

                        {/* This is where CisoDashboard.tsx renders */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;