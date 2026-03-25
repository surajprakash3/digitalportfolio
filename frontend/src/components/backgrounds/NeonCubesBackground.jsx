import { motion } from 'framer-motion';

const NeonCubesBackground = () => {
  const cubes = Array.from({ length: 20 });
  
  return (
    <div className="fixed inset-0 bg-[#020617] z-[-1] overflow-hidden perspective-[1000px]">
      {/* Center Light Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-accent-500/20 blur-[150px] pointer-events-none"></div>
      
      {/* Floating 3D Cubes */}
      <div className="absolute inset-0 [transform-style:preserve-3d] pointer-events-none">
        {cubes.map((_, i) => {
          const depth = (Math.random() * 600) - 300;
          const isOrange = i % 3 === 0;
          
          return (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight, 
                z: depth,
                rotateX: Math.random() * 360,
                rotateY: Math.random() * 360
              }}
              animate={{ 
                y: [null, -300], 
                rotateX: [null, Math.random() * 360 + 360],
                rotateY: [null, Math.random() * 360 + 360]
              }}
              transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear" }}
              className={`absolute w-16 h-16 border-[1.5px] backdrop-blur-[2px] ${
                isOrange 
                  ? 'border-orange-500/80 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.4),inset_0_0_20px_rgba(249,115,22,0.4)]' 
                  : 'border-accent-500/80 bg-accent-500/10 shadow-[0_0_20px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            />
          );
        })}
      </div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};
export default NeonCubesBackground;
