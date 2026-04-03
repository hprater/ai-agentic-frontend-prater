import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from './context/SidebarContext';
import { AgentProvider } from './context/AgentContext';

// Components & UI
import { Toaster } from './components/ui/toaster';
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
 * RouterContent defines the actual page hierarchy.
 * It is separated so it can use hooks from the Providers above it.
 */
const RouterContent = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Layout: Everything inside here uses MainLayout (Sidebar/Navbar) */}
            <Route path="/" element={<MainLayout />}>
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
            <BrowserRouter> {/* Moved up to ensure Auth/Theme can use navigation hooks */}
                <ThemeProvider>
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