import React, { useEffect, useRef } from 'react';
import { CyberColor } from '../../types/presentation';

interface CosmicCanvasProps {
  currentActColor?: CyberColor;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseAngle: number;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ currentActColor = 'cyan' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  // Map cyber colors to particle accents
  const getActPalette = (colorKey: CyberColor) => {
    switch (colorKey) {
      case 'purple':
        return { primary: '#9d4edd', secondary: '#c084fc', glow: 'rgba(157, 78, 221, 0.4)' };
      case 'matrix':
        return { primary: '#00ff88', secondary: '#10b981', glow: 'rgba(0, 255, 136, 0.4)' };
      case 'amber':
        return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'rose':
        return { primary: '#ff007f', secondary: '#fb7185', glow: 'rgba(255, 0, 127, 0.4)' };
      case 'blue':
        return { primary: '#38bdf8', secondary: '#0284c7', glow: 'rgba(56, 189, 248, 0.4)' };
      case 'cyan':
      default:
        return { primary: '#00f2fe', secondary: '#4facfe', glow: 'rgba(0, 242, 254, 0.4)' };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Generate Particles
    const PARTICLE_COUNT = Math.min(100, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];

    const palette = getActPalette(currentActColor);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isSpecial = Math.random() < 0.25;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isSpecial ? Math.random() * 2.5 + 2 : Math.random() * 1.5 + 0.8,
        baseRadius: isSpecial ? 3 : 1.2,
        color: isSpecial ? palette.primary : '#94a3b8',
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(0.5, '#050914');
      bgGrad.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle dynamic nebula glow in corner
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        50,
        width * 0.8,
        height * 0.2,
        width * 0.5
      );
      nebulaGrad.addColorStop(0, palette.glow);
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Particles
      const mouse = mouseRef.current;
      const currentPalette = getActPalette(currentActColor);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gravitational interaction with mouse
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 10) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 0.8;
            p.y += (dy / dist) * force * 0.8;
          }
        }

        // Pulse radius
        p.pulseAngle += p.pulseSpeed;
        const currentRadius = p.baseRadius + Math.sin(p.pulseAngle) * 0.6;

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#94a3b8' ? `rgba(226, 232, 240, ${p.alpha})` : currentPalette.primary;
        if (p.color !== '#94a3b8') {
          ctx.shadowColor = currentPalette.primary;
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.restore();

        // Connect nearest particles with constellation lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 110;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentActColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
};
