import { createContext, useContext, useState, useEffect } from 'react';

const BackgroundContext = createContext();

export const backgrounds = [
  { id: 'network-mesh', name: 'Network Mesh', type: 'canvas' },
  { id: 'abstract-wave', name: 'Abstract Wave', type: 'css' },
  { id: 'neon-cubes', name: 'Neon Cubes', type: 'css' },
  { id: 'speed-lines', name: 'Data Flow', type: 'css' },
  { id: 'tech-math', name: 'Tech Math', type: 'css' },
  { id: 'hacker-matrix', name: 'Hacker Mode', type: 'canvas' }
];

export const BackgroundProvider = ({ children }) => {
  const [currentBg, setCurrentBg] = useState(() => {
    return localStorage.getItem('portfolio-bg') || 'network-mesh';
  });

  const [bgOpacity, setBgOpacity] = useState(() => {
    return parseFloat(localStorage.getItem('portfolio-bg-opacity')) || 0.6;
  });

  useEffect(() => {
    localStorage.setItem('portfolio-bg', currentBg);
    document.documentElement.setAttribute('data-bg', currentBg);
    document.documentElement.setAttribute('data-theme', currentBg);
  }, [currentBg]);

  useEffect(() => {
    localStorage.setItem('portfolio-bg-opacity', bgOpacity);
    document.documentElement.style.setProperty('--bg-opacity', bgOpacity);
    document.documentElement.style.setProperty('--ui-glass-opacity', Math.max(0.1, 1 - bgOpacity));
  }, [bgOpacity]);

  return (
    <BackgroundContext.Provider value={{ currentBg, setCurrentBg, backgrounds, bgOpacity, setBgOpacity }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
