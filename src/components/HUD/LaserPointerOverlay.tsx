import React, { useEffect, useRef } from 'react';

interface LaserPoint {
  x: number;
  y: number;
  time: number;
}

interface LaserPointerOverlayProps {
  enabled: boolean;
  onLaserClick?: () => void;
}

export const LaserPointerOverlay: React.FC<LaserPointerOverlayProps> = ({ enabled, onLaserClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<LaserPoint[]>([]);
  const currentPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) {
      pointsRef.current = [];
      currentPosRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      currentPosRef.current = { x: e.clientX, y: e.clientY };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, time: now });
    };

    const handleClick = () => {
      if (onLaserClick) onLaserClick();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      const MAX_AGE = 350; // ms trail decay

      // Filter old points
      pointsRef.current = pointsRef.current.filter((p) => now - p.time < MAX_AGE);

      // Draw glowing trail
      if (pointsRef.current.length > 1) {
        ctx.save();
        for (let i = 1; i < pointsRef.current.length; i++) {
          const p1 = pointsRef.current[i - 1];
          const p2 = pointsRef.current[i];
          const ageRatio = 1 - (now - p2.time) / MAX_AGE;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 30, 86, ${ageRatio * 0.85})`;
          ctx.lineWidth = 4 * ageRatio + 1;
          ctx.lineCap = 'round';
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw current laser head
      if (currentPosRef.current) {
        const { x, y } = currentPosRef.current;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ff1744';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 20;
        ctx.fill();

        // Core white hot dot
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, [enabled, onLaserClick]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none cursor-none"
    />
  );
};
