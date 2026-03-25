import { motion } from 'framer-motion';

const GridBackground = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 z-[-1] overflow-hidden perspective-[1000px]">
      <motion.div 
        animate={{ translateY: [0, 64] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-100%] bottom-[-50%] border-t border-accent-500/20 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:4rem_4rem] [transform-style:preserve-3d] [transform:rotateX(75deg)] opacity-60"
      />
      <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-accent-500/20 blur-[150px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
};
export default GridBackground;
