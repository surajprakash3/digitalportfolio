import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  // Use MotionValues for high-performance tracking (bypasses React render loop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50 });
  
  const ringX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const ringY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsDesktop(false);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (isHidden) setIsHidden(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isSelectable = 
        target.closest('a, button, input, textarea, select, [role="button"]') || 
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(!!isSelectable);
    };

    const handleMouseLeaveWindow = () => setIsHidden(true);
    const handleMouseEnterWindow = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [mouseX, mouseY, isHidden]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer Ring - Trailing Effect */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-accent-500/60 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isHidden ? 0 : 1,
          backgroundColor: isPointer ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      
      {/* Center Dot - Snappy Effect */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-500 rounded-full pointer-events-none z-[10000] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPointer ? 0.3 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </>
  );
};

export default CustomCursor;
