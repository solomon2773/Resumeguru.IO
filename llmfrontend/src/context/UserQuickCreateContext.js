import React, { createContext, useState } from 'react';

const UserQuickCreateContext = createContext();

export const UserQuickCreateProvider = ({ children }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const openOverlay = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };

    return (
        <UserQuickCreateContext.Provider value={{ isOverlayOpen, openOverlay, closeOverlay }}>
            {children}
        </UserQuickCreateContext.Provider>
    );
};

export default UserQuickCreateContext;

