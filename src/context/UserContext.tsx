import React, { createContext, useContext } from 'react';
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    return <React.Fragment>{children}</React.Fragment>;
};