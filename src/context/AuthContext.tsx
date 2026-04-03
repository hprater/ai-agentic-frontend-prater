import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext({ user: null, loading: false });
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user] = useState(null); // Placeholder for Firebase logic
    return <AuthContext.Provider value={{ user, loading: false }}>{children}</AuthContext.Provider>;
};