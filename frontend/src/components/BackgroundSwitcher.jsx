import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';
import { useBackground } from '../context/BackgroundContext';

const BackgroundSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentBg, setCurrentBg, backgrounds } = useBackground();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl w-64 origin-bottom-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Theme Background</h4>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Close theme switcher"
              >
                <X size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setCurrentBg(bg.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    currentBg === bg.id 
                      ? 'bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-accent-500/30' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${currentBg === bg.id ? 'bg-accent-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                    {bg.name}
                  </span>
                  {currentBg === bg.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-slate-700 dark:border-slate-200"
        aria-label="Toggle Background Theme"
      >
        <Palette size={20} />
      </motion.button>
    </div>
  );
};

export default BackgroundSwitcher;
