import React, { useEffect, useRef } from 'react';

const NetworkMeshBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, particles = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      particles = [];
      const count = window.innerWidth < 768 ? 40 : 80;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1
        });
      }
    };
    init();
    window.addEventListener('resize', init);

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)'; // Cyan glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(6, 182, 212, 1)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 15000) { 
            const opacity = 1 - (dist / 15000);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.5})`; // Blue lines
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-[#020617] to-[#020617]"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80"></canvas>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-10 mix-blend-overlay"></div>
    </div>
  );
};
export default NetworkMeshBackground;
