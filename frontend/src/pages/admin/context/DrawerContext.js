import React, { createContext, useContext, useState } from 'react';

const DrawerContext = createContext();

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);
  
  const value = { open, toggleDrawer };  // value 객체 명시적으로 생성
  
  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
};