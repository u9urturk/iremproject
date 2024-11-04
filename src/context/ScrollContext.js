import React, { createContext, useContext, useRef } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const refs = useRef({});

  const registerRef = (id, ref) => {
    refs.current[id] = ref;
  };

  const scrollTo = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScrollContext.Provider value={{ registerRef, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);
