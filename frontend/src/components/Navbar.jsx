import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useBackground } from '../context/BackgroundContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();
  const [hoveredPath, setHoveredPath] = useState(null);
  const location = useLocation();
  const { bgOpacity } = useBackground();

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
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0 flex items-center">
                <span className={`font-heading font-extrabold text-2xl transition-colors duration-500 ${ts.logoText}`}>
                  Suraj Prakash
                </span>
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1 lg:space-x-2">
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
              </div>
            </div>

            {/* Mobile menu buttons */}
            <div className="flex items-center justify-center lg:hidden gap-2">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full focus:outline-none transition-colors ${ts.iconColor}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
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
          <div className="lg:hidden fixed inset-0 z-[40]">
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
