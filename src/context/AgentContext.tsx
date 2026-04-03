import React, { createContext, useState } from 'react';
export const AgentContext = createContext({});
export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeAgent, setActiveAgent] = useState('ciso');
    return <AgentContext.Provider value={{ activeAgent, setActiveAgent }}>{children}</AgentContext.Provider>;
};