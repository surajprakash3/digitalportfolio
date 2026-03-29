import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Github, Linkedin, Twitter, Palette, Check, SlidersHorizontal } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useBackground } from '../context/BackgroundContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const { data: profile } = useProfile();
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  const { currentBg, setCurrentBg, backgrounds, bgOpacity, setBgOpacity } = useBackground();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);


  const toggleDarkMode = () => setIsDark(!isDark);
  const toggleMenu = () => setIsOpen(!isOpen);

  const ts = {
    navBg: "border-b",
    navBorder: "border-theme-border",
    itemText: "text-theme-text",
    itemHoverBg: "hover:bg-theme-border/50",
    itemHoverText: "hover:text-accent-500",
    itemActiveText: "text-accent-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]",
    logoText: "text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-blue-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    sidebarBg: "border-r border-theme-border shadow-theme-glow-lg",
    iconColor: "text-theme-muted hover:text-accent-500"
  };

  const navLinks = [
    { name: 'Home', path: '/#home' },
    { name: 'About', path: '/#about' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Projects', path: '/#projects' },
    { name: 'Certifications', path: '/certifications' },
    { name: 'Social', path: '/socials' },
    { name: 'Experience', path: '/#experience' },
    { name: 'Blog', path: '/#blog' },
    { name: 'Contact', path: '/#contact' },
  ];

  const NavItemMobile = ({ name, path }) => (
    <a
      href={path}
      onClick={() => setIsOpen(false)}
      className={`block px-4 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${ts.itemHoverBg} ${ts.itemHoverText} ${ts.itemText}`}
    >
      {name}
    </a>
  );

  return (
    <>
      <nav 
        className={`fixed w-full z-50 ${ts.navBg} ${ts.navBorder} transition-all duration-500`}
        style={{ 
          backgroundColor: `rgb(var(--theme-bg) / ${0.5 + (bgOpacity * 0.5)})`,
          backdropFilter: `blur(${10 + bgOpacity * 15}px)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0 flex items-center">
                <span className={`font-heading font-extrabold text-2xl transition-colors duration-500 ${ts.logoText}`}>
                  SP
                </span>
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <AnimatePresence>
                {navLinks.map((link) => {
                  const isActive = location.pathname + location.hash === link.path || (link.path.startsWith('/#') && location.pathname === '/' && location.hash === link.path.replace('/', ''));

                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      onMouseEnter={() => setHoveredPath(link.path)}
                      onMouseLeave={() => setHoveredPath(null)}
                      className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 z-10 hover:scale-105 ${isActive ? ts.itemActiveText : `${ts.itemText} ${ts.itemHoverText}`}`}
                    >
                      <span className="relative z-10 flex items-center gap-1">
                         {link.name}
                      </span>
                      {hoveredPath === link.path && (
                        <motion.div
                          layoutId="desktop-nav-hover"
                          className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg -z-0 border border-white/20"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      )}
                    </a>
                  );
                })}
              </AnimatePresence>

              <div className="flex items-center space-x-2 pl-4 ml-2 border-l border-slate-200 dark:border-slate-700/50">
                {profile?.socials?.githubUrl && (
                  <a href={profile.socials.githubUrl} target="_blank" rel="noopener noreferrer" className={`p-2 transition-colors ${ts.iconColor}`}>
                    <Github size={20} />
                  </a>
                )}
                {profile?.socials?.linkedinUrl && (
                  <a href={profile.socials.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`p-2 transition-colors ${ts.iconColor}`}>
                    <Linkedin size={20} />
                  </a>
                )}

                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full focus:outline-none transition-colors ml-2 ${ts.iconColor}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative">
                  <motion.button
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-2 rounded-full focus:outline-none transition-colors ml-1 group ${ts.iconColor} ${isThemeMenuOpen ? 'animate-pulse' : ''}`}
                    aria-label="Cycle Background Theme"
                  >
                    <Palette size={20} />
                    <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-accent-500 pointer-events-none"></span>
                  </motion.button>

                  <AnimatePresence>
                    {isThemeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[130%] right-0 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-2xl z-50 origin-top-right overflow-hidden"
                      >
                         <div className="flex items-center justify-between mb-3 px-1">
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Theme Engine</div>
                         </div>
                         
                         <div className="mb-4 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><SlidersHorizontal size={14}/> Background Visibility</div>
                               <div className="text-xs font-bold text-accent-500">{Math.round(bgOpacity * 100)}%</div>
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="80" 
                              value={bgOpacity * 100}
                              onChange={(e) => setBgOpacity(e.target.value / 100)}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                            />
                         </div>

                         <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
                           {backgrounds.map((bg) => (
                             <button
                               key={bg.id}
                               onClick={() => { setCurrentBg(bg.id); setIsThemeMenuOpen(false); }}
                               className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                 currentBg === bg.id 
                                   ? 'bg-accent-500 text-white shadow-md' 
                                   : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-transparent'
                               }`}
                             >
                               <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg outline outline-1 outline-offset-1 outline-slate-200 dark:outline-slate-700 bg-center bg-cover overflow-hidden relative shadow-inner flex items-center justify-center ${
                                    bg.id === 'network-mesh' ? 'bg-[#020617]' : 
                                    bg.id === 'abstract-wave' ? 'bg-gradient-to-br from-blue-900 to-purple-900' :
                                    bg.id === 'neon-cubes' ? 'bg-[#020617]' :
                                    bg.id === 'speed-lines' ? 'bg-gradient-to-br from-red-900 to-blue-900' :
                                    bg.id === 'hacker-matrix' ? 'bg-[#052e16]' : 'bg-[#060b14]'
                                  }`}>
                                     {bg.id === 'network-mesh' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.4),transparent)]"></div>}
                                     {bg.id === 'abstract-wave' && <div className="w-4 h-4 rounded-full border border-white/30"></div>}
                                     {bg.id === 'neon-cubes' && <div className="w-3 h-3 border border-orange-500/80 bg-orange-500/20 shadow-[0_0_5px_rgba(249,115,22,0.5)]"></div>}
                                     {bg.id === 'speed-lines' && <div className="w-full h-[1px] bg-cyan-400 rotate-12 shadow-[0_0_5px_rgba(6,182,212,1)]"></div>}
                                     {bg.id === 'tech-math' && <div className="text-[10px] font-mono text-cyan-400 font-bold blur-[0.5px]">∑</div>}
                                     {bg.id === 'hacker-matrix' && <div className="text-[6px] font-mono tracking-widest text-emerald-400 leading-none">01<br/>10</div>}
                                  </div>
                                  {bg.name}
                               </div>
                               {currentBg === bg.id && <Check size={14} />}
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile menu buttons */}
            <div className="flex items-center justify-center md:hidden gap-2">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full focus:outline-none transition-colors ${ts.iconColor}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="relative">
                  <motion.button
                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-2 rounded-full transition-colors group ${ts.iconColor}`}
                    aria-label="Select Background Theme"
                  >
                    <Palette size={20} />
                    <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-accent-500 pointer-events-none"></span>
                  </motion.button>
                  <AnimatePresence>
                    {isThemeMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[120%] right-0 w-[240px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-2xl z-50 origin-top-right overflow-hidden"
                      >
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2 mt-1">Theme Engine</div>
                         
                         <div className="mb-3 px-3 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                               <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><SlidersHorizontal size={14}/> Background Visibility</div>
                               <div className="text-xs font-bold text-accent-500">{Math.round(bgOpacity * 100)}%</div>
                            </div>
                            <input 
                              type="range" 
                              min="20" 
                              max="80" 
                              value={bgOpacity * 100}
                              onChange={(e) => setBgOpacity(e.target.value / 100)}
                              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
                            />
                         </div>

                         <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
                           {backgrounds.map((bg) => (
                             <button
                               key={bg.id}
                               onClick={() => { setCurrentBg(bg.id); setIsThemeMenuOpen(false); }}
                               className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                 currentBg === bg.id 
                                   ? 'bg-accent-500 text-white shadow-md' 
                                   : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300'
                               }`}
                             >
                                <span className="flex items-center gap-3">
                                  <span className={`w-3 h-3 rounded-full shadow-inner ${
                                    bg.id === 'network-mesh' ? 'bg-cyan-500' : 
                                    bg.id === 'abstract-wave' ? 'bg-purple-500' :
                                    bg.id === 'neon-cubes' ? 'bg-orange-500' :
                                    bg.id === 'speed-lines' ? 'bg-red-500' :
                                    bg.id === 'hacker-matrix' ? 'bg-emerald-500' :
                                    'bg-indigo-500'
                                  }`}></span>
                                  {bg.name}
                                </span>
                               {currentBg === bg.id && <Check size={14} />}
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              <button
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors ${ts.iconColor}`}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Advanced Sidebar Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-[40]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`absolute top-0 left-0 bottom-0 w-[280px] sm:w-[320px] shadow-2xl flex flex-col pt-20 pb-6 px-4 overflow-y-auto ${ts.sidebarBg}`}
              style={{ 
                backgroundColor: `rgb(var(--theme-bg) / ${0.7 + (bgOpacity * 0.3)})`,
                backdropFilter: `blur(${10 + bgOpacity * 20}px)`
              }}
            >
              <div className="flex flex-col gap-2 relative">
                {navLinks.map((link) => (
                  <NavItemMobile key={link.name} {...link} />
                ))}

                {(profile?.socials?.githubUrl || profile?.socials?.linkedinUrl || profile?.socials?.twitterUrl) && (
                  <div className="pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-center space-x-6 relative">
                    {profile?.socials?.githubUrl && (
                      <a href={profile.socials.githubUrl} target="_blank" rel="noopener noreferrer" className={`hover:scale-110 transition-all ${ts.iconColor}`}>
                        <Github size={24} />
                      </a>
                    )}
                    {profile?.socials?.linkedinUrl && (
                      <a href={profile.socials.linkedinUrl} target="_blank" rel="noopener noreferrer" className={`hover:scale-110 transition-all ${ts.iconColor}`}>
                        <Linkedin size={24} />
                      </a>
                    )}
                    {profile?.socials?.twitterUrl && (
                      <a href={profile.socials.twitterUrl} target="_blank" rel="noopener noreferrer" className={`hover:scale-110 transition-all ${ts.iconColor}`}>
                        <Twitter size={24} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
