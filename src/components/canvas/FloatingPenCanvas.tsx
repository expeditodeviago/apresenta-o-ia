// src/components/canvas/FloatingPenCanvas.tsx
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, type ArcadeStroke, type StrokePoint } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Trash2,
  X,
  Palette,
} from 'lucide-react';

const CHALK_PALETTE = [
  { name: 'Branco Pérola', color: '#f8fafc' },
  { name: 'Ciano Elétrico', color: '#06b6d4' },
  { name: 'Dourado', color: '#f59e0b' },
  { name: 'Menta', color: '#10b981' },
];

export const FloatingPenCanvas: React.FC = () => {
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
  } = usePresentationStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<StrokePoint[]>([]);

  // Redimensionamento responsivo do Canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderAllStrokes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDrawingEnabled]);

  // Redesenhar todos os traços armazenados
  const renderAllStrokes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowColor = stroke.color;
        ctx.shadowBlur = 6;
      }

      ctx.stroke();
      ctx.restore();
    });
  };

  useEffect(() => {
    renderAllStrokes();
  }, [strokes]);

  // Handlers de Mouse & Touch
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pt: StrokePoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setIsDrawing(true);
    currentPointsRef.current = [pt];

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowColor = penColor;
        ctx.shadowBlur = 6;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawingEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pt: StrokePoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    currentPointsRef.current.push(pt);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPointsRef.current.length > 1) {
      const newStroke: ArcadeStroke = {
        id: `stroke-${Date.now()}-${Math.random()}`,
        points: [...currentPointsRef.current],
        color: penColor,
        width: penWidth,
        isEraser: activeTool === 'eraser',
      };
      addStroke(newStroke);
    }
    currentPointsRef.current = [];
  };

  if (!isDrawingEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 🖌️ Superfície do Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full pointer-events-auto cursor-crosshair"
      />

      {/* 🕹️ Barra Flutuante em Vidro Líquido */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex items-center gap-3 px-4 py-2.5 rounded-full liquid-glass border border-white/15 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
      >
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white tracking-wide">Lápis Keynote</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-zinc-300">D</span>
        </div>

        {/* Cores de Giz */}
        <div className="flex items-center gap-2">
          {CHALK_PALETTE.map((c) => (
            <button
              key={c.color}
              onClick={() => {
                setPenColor(c.color);
                setActiveTool('pen');
                arcadeAudio.playClick();
              }}
              aria-label={c.name}
              title={c.name}
              className={`w-5 h-5 rounded-full transition-transform active:scale-90 ${
                penColor === c.color && activeTool === 'pen'
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110'
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Ferramentas: Caneta vs Borracha */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTool('pen');
              arcadeAudio.playClick();
            }}
            title="Caneta"
            className={`p-1.5 rounded-lg transition-all ${
              activeTool === 'pen'
                ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveTool('eraser');
              arcadeAudio.playClick();
            }}
            title="Borracha"
            className={`p-1.5 rounded-lg transition-all ${
              activeTool === 'eraser'
                ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Desfazer & Limpar */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              undoStroke();
              arcadeAudio.playClick();
            }}
            title="Desfazer traço"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              clearStrokes();
              arcadeAudio.playClick();
            }}
            title="Limpar lousa"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Fechar Lápis */}
        <button
          onClick={toggleDrawing}
          title="Fechar modo lápis (D)"
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
