// src/components/canvas/ArcadeDrawingOverlay.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore, ArcadeStroke } from '../../store/useGameStore';
import { getCanvasCoordinates } from '../../utils/canvasCoordinates';
import { Edit3, Eraser, RotateCcw, Trash2, X } from 'lucide-react';

const ARCADE_COLORS = [
  { name: 'Sky Cyan', hex: '#38bdf8' },
  { name: 'Lime Green', hex: '#4ade80' },
  { name: 'Amber Gold', hex: '#fbbf24' },
  { name: 'Hot Pink', hex: '#f43f5e' },
  { name: 'Neon Purple', hex: '#c084fc' },
  { name: 'Crystal White', hex: '#f8fafc' },
];

export const ArcadeDrawingOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);

  const {
    isDrawingEnabled,
    toggleDrawing,
    activeTool,
    setActiveTool,
    penColor,
    setPenColor,
    penWidth,
    setPenWidth,
    strokes,
    addStroke,
    undoStroke,
    clearStrokes,
  } = useGameStore();

  // Ajuste do tamanho do canvas para retina / DPR
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    ctx.globalCompositeOperation = 'source-over';
  }, [strokes]);

  useEffect(() => {
    requestAnimationFrame(redraw);
  }, [redraw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCanvasCoordinates(e, canvas, { x: 0, y: 0 }, 1);
    setIsDrawing(true);
    currentPointsRef.current = [coords];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const coords = getCanvasCoordinates(e, canvas, { x: 0, y: 0 }, 1);
    currentPointsRef.current.push(coords);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = activeTool === 'eraser' ? '#000000' : penColor;
    ctx.lineWidth = activeTool === 'eraser' ? penWidth * 7 : penWidth;

    if (activeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    const pts = currentPointsRef.current;
    if (pts.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPointsRef.current.length > 1) {
      const newStroke: ArcadeStroke = {
        id: `stroke-${Date.now()}-${Math.random()}`,
        points: [...currentPointsRef.current],
        color: activeTool === 'eraser' ? '#000000' : penColor,
        width: activeTool === 'eraser' ? penWidth * 7 : penWidth,
        isEraser: activeTool === 'eraser',
      };
      addStroke(newStroke);
    }
    currentPointsRef.current = [];
    requestAnimationFrame(redraw);
  };

  return (
    <>
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          isDrawingEnabled
            ? 'pointer-events-auto cursor-crosshair opacity-100'
            : 'pointer-events-none opacity-90'
        }`}
      />

      {/* Floating Toolbar when drawing is active */}
      {isDrawingEnabled && (
        <aside 
          aria-label="Barra de ferramentas de desenho"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b1120]/95 border border-sky-500/40 backdrop-blur-md shadow-2xl shadow-sky-500/20 animate-fade-in"
        >
          {/* Badge Indicador de Caneta Ativa */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Caneta Ativa</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Pen / Eraser Toggle */}
          <button
            onClick={() => setActiveTool('pen')}
            className={`p-1.5 rounded-full transition-all ${
              activeTool === 'pen'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Caneta"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`p-1.5 rounded-full transition-all ${
              activeTool === 'eraser'
                ? 'bg-rose-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Borracha"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700" />

          {/* Paleta de Cores Neon */}
          <div className="flex items-center gap-1">
            {ARCADE_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => {
                  setPenColor(col.hex);
                  setActiveTool('pen');
                }}
                className={`w-4 h-4 rounded-full transition-transform ${
                  penColor === col.hex && activeTool === 'pen'
                    ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-900'
                    : 'hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Espessura do traço */}
          <div className="flex items-center gap-1">
            {[2, 4, 7].map((w) => (
              <button
                key={w}
                onClick={() => setPenWidth(w)}
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] ${
                  penWidth === w
                    ? 'bg-slate-700 text-sky-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-700" />

          {/* Undo & Clear */}
          <button
            onClick={undoStroke}
            disabled={strokes.length === 0}
            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-all"
            title="Desfazer Último Traço"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearStrokes}
            disabled={strokes.length === 0}
            className="p-1 rounded text-slate-400 hover:text-rose-400 disabled:opacity-30 transition-all"
            title="Limpar Todos os Traços"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Close Button */}
          <button
            onClick={toggleDrawing}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all ml-1"
            title="Fechar Desenho (Tecla D)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </>
  );
};
