import { motion } from 'framer-motion';

const AbstractWaveBackground = () => {
  const shapes = Array.from({ length: 15 });
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0c1e3e] via-[#1e1b4b] to-[#3b0764] z-[-1] overflow-hidden">
      {/* Heavy blur layers for depth */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/30 blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/20 blur-[130px]"
      />
      
      {/* Floating Shapes */}
      <div className="absolute inset-0 opacity-40">
        {shapes.map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight * 1.2], 
              rotate: [null, Math.random() * 360 + 360],
              x: [null, Math.random() * window.innerWidth]
            }}
            transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear" }}
            className={`absolute border border-white/20 blur-[1px] ${
              i % 3 === 0 ? 'w-12 h-12 rounded-lg' : 
              i % 3 === 1 ? 'w-8 h-8 rounded-full' : 
              'w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-white/20 bg-transparent'
            }`}
          />
        ))}
      </div>
      {/* Animated Flowing Wave Grid */}
      <div className="absolute inset-[-50%] perspective-[1000px] pointer-events-none">
        <motion.div 
          animate={{ translateY: [0, 64], translateZ: [0, 30] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:64px_64px] [transform-style:preserve-3d] [transform:rotateX(60deg)] opacity-80 mix-blend-screen"
          style={{ WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 60%)" }}
        />
      </div>
    </div>
  );
};
export default AbstractWaveBackground;
