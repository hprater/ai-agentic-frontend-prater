import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/auth.ts';
import { ShieldCheck, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setError(null);

        try {
            // This will trigger the AuthProvider observer in App.tsx
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            console.error("Login Failed", err);
            setError("Access Denied: Invalid Credentials or Unauthorized Domain.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">

                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30 mb-2">
                        <ShieldCheck className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-mono text-white tracking-tighter uppercase">Secure Login Required</h2>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Federal Amplify Network // Level 4</p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                placeholder="Service Email"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                placeholder="Access Key"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-mono bg-red-400/10 p-3 rounded border border-red-400/20 flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isAuthenticating}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-sm rounded-lg transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest"
                    >
                        {isAuthenticating ? "Authenticating..." : "Establish Secure Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
                        Classified System // Authorized Personnel Only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;