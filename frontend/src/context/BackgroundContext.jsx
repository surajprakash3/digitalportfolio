import { createContext, useContext, useState } from 'react';

const BackgroundContext = createContext();

export const backgrounds = [];

export const BackgroundProvider = ({ children }) => {
  const [currentBg, setCurrentBg] = useState('default');
  const [bgOpacity, setBgOpacity] = useState(0.6);

  return (
    <BackgroundContext.Provider value={{ currentBg, setCurrentBg, backgrounds, bgOpacity, setBgOpacity }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);

