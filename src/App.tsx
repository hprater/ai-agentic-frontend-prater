import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from './context/SidebarContext';
import { AgentProvider } from './context/AgentContext';

// Components & UI
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from './components/ui/tooltip';
import MainLayout from './components/layout/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import CisoDashboard from './pages/dashboard/CisoDashboard';
import SpecialistView from './pages/agents/SpecialistView';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

/**
 * A wrapper component that redirects to login if the user is not authenticated.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="text-blue-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                    Synchronizing Secure Tunnel...
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect them to /login, but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

/**
 * RouterContent defines the actual page hierarchy.
 */
const RouterContent = () => {
    const { user, loading } = useAuth();

    return (
        <Routes>
            {/* Public Routes:
                If already logged in, redirect away from login to dashboard
            */}
            <Route
                path="/login"
                element={user && !loading ? <Navigate to="/dashboard" replace /> : <Login />}
            />

            {/* Protected Layout: Everything inside here requires a valid Firebase Session */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                {/* Default to Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                <Route path="dashboard" element={<CisoDashboard />} />

                {/* Dynamic Specialist Routes (AWS, Google, Amplify) */}
                <Route path="specialist/:agentId" element={<SpecialistView />} />

                {/* Profile/Settings */}
                <Route path="profile" element={<Home />} />
            </Route>

            {/* Fallback for 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ThemeProvider>
                    {/* Ensure AuthProvider is high enough to cover the whole RouterContent */}
                    <AuthProvider>
                        <UserProvider>
                            <AgentProvider>
                                <TooltipProvider>
                                    <SidebarProvider>
                                        <Toaster />
                                        <RouterContent />
                                    </SidebarProvider>
                                </TooltipProvider>
                            </AgentProvider>
                        </UserProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;