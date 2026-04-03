import React, { createContext, useContext, useState } from 'react';
const SidebarContext = createContext({ isOpen: true, toggle: () => {} });
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return <SidebarContext.Provider value={{ isOpen, toggle: () => setIsOpen(!isOpen) }}>{children}</SidebarContext.Provider>;
};