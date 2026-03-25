import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
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
      const count = window.innerWidth < 768 ? 30 : 60; // Mobile friendly limits
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };
    init();
    window.addEventListener('resize', init);

    let animationFrame;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)'; // Cyan/Accent color for dots

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Optional connecting lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < 10000) { // roughly 100 distance
            ctx.beginPath();
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
      {/* Background Image Abstract tech gradient */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-screen scale-105 pointer-events-none"></div>
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/90 to-[#020617] pointer-events-none"></div>
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none"></canvas>
    </div>
  );
};
export default ParticleBackground;
