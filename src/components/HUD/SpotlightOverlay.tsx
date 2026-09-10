import React, { useEffect, useState } from 'react';

interface SpotlightOverlayProps {
  enabled: boolean;
  radius?: number;
}

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({ enabled, radius = 180 }) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle ${radius}px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(3, 7, 18, 0.5) 70%, rgba(3, 7, 18, 0.92) 100%)`,
      }}
    >
      {/* Subtle glowing ring around the spotlight */}
      <div
        className="absolute rounded-full border border-cyan-400/30 pointer-events-none transition-transform duration-75"
        style={{
          width: radius * 2,
          height: radius * 2,
          left: mousePos.x - radius,
          top: mousePos.y - radius,
          boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)',
        }}
      />
    </div>
  );
};
