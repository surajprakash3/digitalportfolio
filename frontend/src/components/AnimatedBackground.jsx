const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {/* Clean, simple background base */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300" />

      {/* Extremely subtle ambient glow at the top for clean, modern depth */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[300px] bg-gradient-to-b from-sky-500/[0.06] dark:from-sky-400/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
