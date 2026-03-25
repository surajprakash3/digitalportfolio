import { motion } from 'framer-motion';

const SpeedLinesBackground = () => {
  const lines = Array.from({ length: 30 });
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-950/80 via-slate-950 to-blue-950/80 z-[-1] overflow-hidden">
      {/* Heavy vignette shadow */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)] z-10 pointer-events-none"></div>
      
      <div className="absolute inset-[-50%] rotate-[15deg] pointer-events-none">
        {lines.map((_, i) => {
          const width = Math.random() * 300 + 100;
          const yPos = Math.random() * 100;
          return (
            <motion.div
              key={i}
              initial={{ x: '-20vw', opacity: 0 }}
              animate={{ 
                x: ['-20vw', '120vw'],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="absolute h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px]"
              style={{
                top: `${yPos}%`,
                width: `${width}px`,
                boxShadow: '0 0 15px rgba(6,182,212,0.8)'
              }}
            >
               {/* Particle moving along the line */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]"></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
export default SpeedLinesBackground;
