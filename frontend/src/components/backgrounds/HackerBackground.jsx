import React, { useEffect, useRef } from 'react';

const HackerBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%"&*(?)'.split('');
    const fontSize = 14;
    let columns = Math.ceil(width / fontSize);
    let drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    let animationFrame;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'; // Tailwind Emerald-500
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#000] z-[-1] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-100"></canvas>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};

export default HackerBackground;
