import { motion, AnimatePresence } from 'framer-motion';
import { useBackground } from '../context/BackgroundContext';
import NetworkMeshBackground from './backgrounds/NetworkMeshBackground';
import AbstractWaveBackground from './backgrounds/AbstractWaveBackground';
import NeonCubesBackground from './backgrounds/NeonCubesBackground';
import SpeedLinesBackground from './backgrounds/SpeedLinesBackground';
import TechMathBackground from './backgrounds/TechMathBackground';
import HackerBackground from './backgrounds/HackerBackground';

const AnimatedBackground = () => {
  const { currentBg, bgOpacity } = useBackground();
  const currentOpacity = typeof bgOpacity === 'number' ? bgOpacity : 0.6;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] transition-colors duration-1000 ease-in-out">
      <AnimatePresence>
        <motion.div
          key={currentBg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentBg === 'network-mesh' && <NetworkMeshBackground />}
          {currentBg === 'abstract-wave' && <AbstractWaveBackground />}
          {currentBg === 'neon-cubes' && <NeonCubesBackground />}
          {currentBg === 'speed-lines' && <SpeedLinesBackground />}
          {currentBg === 'tech-math' && <TechMathBackground />}
          {currentBg === 'hacker-matrix' && <HackerBackground />}
        </motion.div>
      </AnimatePresence>
      
      {/* Global Theme Transparency Overlay Engine */}
      <div 
        className="absolute inset-0 bg-white dark:bg-[#020617] pointer-events-none"
        style={{ opacity: 1 - currentOpacity, transition: 'opacity 0.2s ease-out' }} 
      />
    </div>
  );
};

export default AnimatedBackground;
