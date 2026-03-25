import { motion } from 'framer-motion';

const GlassBackground = () => {
  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-[#060b14] z-[-1] overflow-hidden">
      {/* Moving Blobs */}
      <motion.div 
        animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
      />
      <motion.div 
        animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1, 1.5, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-400/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen"
      />
      <motion.div 
        animate={{ y: [0, -100, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-500/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
      />
      
      {/* Noise Texture + Glass Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 backdrop-blur-[80px] bg-white/10 dark:bg-[#060b14]/40"></div>
    </div>
  );
};
export default GlassBackground;
