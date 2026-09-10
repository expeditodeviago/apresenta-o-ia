import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Trash2, Eraser, PenTool, X, Square, Undo2 } from 'lucide-react';

export type ChalkToolType = 'pen' | 'rect' | 'eraser';

export interface ChalkItem {
  id: string;
  type: 'stroke' | 'rect';
  color: string;
  size: number;
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface ChalkDrawingOverlayProps {
  enabled: boolean;
  onClose: () => void;
  viewport: { x: number; y: number; zoom: number };
  onChalkSound?: () => void;
  strokes?: ChalkItem[];
  onStrokesChange?: (strokes: ChalkItem[]) => void;
}

const DRAWING_COLORS = [
  { hex: '#22c55e', name: 'Giz Verde', label: 'Verde' },
  { hex: '#f8fafc', name: 'Giz Branco', label: 'Branco' },
  { hex: '#f59e0b', name: 'Giz Âmbar', label: 'Âmbar' },
  { hex: '#38bdf8', name: 'Giz Azul', label: 'Azul' },
  { hex: '#ef4444', name: 'Giz Coral', label: 'Coral' },
];

const STROKE_SIZES = [
  { size: 3, label: 'Fino' },
  { size: 6, label: 'Médio' },
  { size: 12, label: 'Grosso' },
];

export const ChalkDrawingOverlay: React.FC<ChalkDrawingOverlayProps> = ({
  enabled,
  onClose,
  viewport,
  onChalkSound,
  strokes: externalStrokes,
  onStrokesChange,
}) => {
  const [internalStrokes, setInternalStrokes] = useState<ChalkItem[]>([]);
  const strokes = externalStrokes !== undefined ? externalStrokes : internalStrokes;
  const setStrokes = useCallback(
    (updater: ChalkItem[] | ((prev: ChalkItem[]) => ChalkItem[])) => {
      if (typeof updater === 'function') {
        if (onStrokesChange) {
          const next = updater(strokes);
          onStrokesChange(next);
        } else {
          setInternalStrokes(updater);
        }
      } else {
        if (onStrokesChange) {
          onStrokesChange(updater);
        } else {
          setInternalStrokes(updater);
        }
      }
    },
    [strokes, onStrokesChange]
  );

  const [activeTool, setActiveTool] = useState<ChalkToolType>('pen');
  const [activeColor, setActiveColor] = useState('#22c55e');
  const [activeSize, setActiveSize] = useState(6);
  const [currentDraft, setCurrentDraft] = useState<ChalkItem | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startDragWorldRef = useRef<{ x: number; y: number } | null>(null);

  // Resize canvas to window dimensions
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        redraw();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redraw all strokes in world coordinates transformed to viewport
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const allItems = currentDraft ? [...strokes, currentDraft] : strokes;

    allItems.forEach((item) => {
      if (item.type === 'stroke' && item.points && item.points.length >= 2) {
        ctx.beginPath();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = Math.max(1, item.size * viewport.zoom);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 6 * viewport.zoom;

        const p0 = item.points[0];
        const s0x = p0.x * viewport.zoom + viewport.x;
        const s0y = p0.y * viewport.zoom + viewport.y;
        ctx.moveTo(s0x, s0y);

        for (let i = 1; i < item.points.length; i++) {
          const p = item.points[i];
          const sx = p.x * viewport.zoom + viewport.x;
          const sy = p.y * viewport.zoom + viewport.y;
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      } else if (item.type === 'rect' && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
        const sx = item.x * viewport.zoom + viewport.x;
        const sy = item.y * viewport.zoom + viewport.y;
        const sw = item.w * viewport.zoom;
        const sh = item.h * viewport.zoom;

        // Subtle chalk background fill
        ctx.fillStyle = `${item.color}18`;
        ctx.fillRect(sx, sy, sw, sh);

        // Chalk outline
        ctx.beginPath();
        ctx.strokeStyle = item.color;
        ctx.lineWidth = Math.max(1.5, item.size * viewport.zoom);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([8 * viewport.zoom, 6 * viewport.zoom]);
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 8 * viewport.zoom;
        ctx.strokeRect(sx, sy, sw, sh);
        ctx.setLineDash([]);
      }
    });
  }, [strokes, currentDraft, viewport]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Converte posição da tela para o espaço real do canvas:
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) {
      return {
        x: (e.clientX - viewport.x) / viewport.zoom,
        y: (e.clientY - viewport.y) / viewport.zoom,
      };
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    const worldX = (screenX - viewport.x) / viewport.zoom;
    const worldY = (screenY - viewport.y) / viewport.zoom;

    return { x: worldX, y: worldY };
  };

  // Mouse handlers for drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    if (e.button !== 0) return;

    const { x: worldX, y: worldY } = getCanvasCoordinates(e);

    startDragWorldRef.current = { x: worldX, y: worldY };

    if (activeTool === 'eraser') {
      eraseAt(worldX, worldY);
      return;
    }

    onChalkSound?.();

    if (activeTool === 'pen') {
      setCurrentDraft({
        id: `stroke-${Date.now()}-${Math.random()}`,
        type: 'stroke',
        color: activeColor,
        size: activeSize,
        points: [{ x: worldX, y: worldY }],
      });
    } else if (activeTool === 'rect') {
      setCurrentDraft({
        id: `rect-${Date.now()}-${Math.random()}`,
        type: 'rect',
        color: activeColor,
        size: activeSize,
        x: worldX,
        y: worldY,
        w: 0,
        h: 0,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!enabled) return;

    const { x: worldX, y: worldY } = getCanvasCoordinates(e);

    if (activeTool === 'eraser' && e.buttons === 1) {
      eraseAt(worldX, worldY);
      return;
    }

    if (!currentDraft || !startDragWorldRef.current) return;

    if (activeTool === 'pen') {
      setCurrentDraft((prev) =>
        prev && prev.points
          ? { ...prev, points: [...prev.points, { x: worldX, y: worldY }] }
          : null
      );
    } else if (activeTool === 'rect') {
      const startX = startDragWorldRef.current.x;
      const startY = startDragWorldRef.current.y;
      const rx = Math.min(startX, worldX);
      const ry = Math.min(startY, worldY);
      const rw = Math.abs(worldX - startX);
      const rh = Math.abs(worldY - startY);

      setCurrentDraft((prev) =>
        prev
          ? {
              ...prev,
              x: rx,
              y: ry,
              w: rw,
              h: rh,
            }
          : null
      );
    }
  };

  const handleMouseUp = () => {
    if (!enabled) return;
    if (currentDraft) {
      // Validate that rectangle has meaningful size or stroke has points
      if (currentDraft.type === 'rect') {
        if ((currentDraft.w || 0) > 10 && (currentDraft.h || 0) > 10) {
          setStrokes((prev) => [...prev, currentDraft]);
        }
      } else if (currentDraft.type === 'stroke') {
        if (currentDraft.points && currentDraft.points.length >= 2) {
          setStrokes((prev) => [...prev, currentDraft]);
        }
      }
      setCurrentDraft(null);
    }
    startDragWorldRef.current = null;
  };

  const eraseAt = (worldX: number, worldY: number) => {
    const threshold = 35 / viewport.zoom;
    setStrokes((prev) =>
      prev.filter((item) => {
        if (item.type === 'stroke' && item.points) {
          return !item.points.some(
            (p) => Math.hypot(p.x - worldX, p.y - worldY) < threshold
          );
        }
        if (item.type === 'rect' && item.x !== undefined && item.y !== undefined) {
          const inX = worldX >= item.x - threshold && worldX <= item.x + (item.w || 0) + threshold;
          const inY = worldY >= item.y - threshold && worldY <= item.y + (item.h || 0) + threshold;
          return !(inX && inY);
        }
        return true;
      })
    );
  };

  // If there are no strokes and not enabled, do not mount canvas
  if (!enabled && strokes.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-40 select-none ${
        enabled ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
    >
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full block"
      />

      {/* Floating Toolbar (only when enabled) */}
      {enabled && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#0c1410]/95 backdrop-blur-xl px-5 py-3 rounded-2xl border-2 border-emerald-500/50 shadow-2xl flex items-center gap-3 animate-fade-in no-pan select-none pointer-events-auto">
          {/* Tool mode toggle */}
          <div className="flex items-center gap-1.5 mr-1">
            <button
              onClick={() => setActiveTool('pen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTool === 'pen'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
              title="Lápis / Giz Livre (✏️)"
            >
              <PenTool className="w-4 h-4" />
              <span>Giz</span>
            </button>

            <button
              onClick={() => setActiveTool('rect')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTool === 'rect'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
              title="Forma Rápida: Caixa de Destaque Retangular (▭)"
            >
              <Square className="w-4 h-4" />
              <span>Destaque</span>
            </button>
          </div>

          <div className="w-[1px] h-6 bg-white/20" />

          {/* Color pickers: Verde, Branco, Âmbar, Azul, Coral */}
          <div className="flex items-center gap-2">
            {DRAWING_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => {
                  setActiveColor(c.hex);
                  if (activeTool === 'eraser') setActiveTool('pen');
                }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  activeColor === c.hex && activeTool !== 'eraser'
                    ? 'scale-125 border-white shadow-lg ring-2 ring-emerald-400'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>

          <div className="w-[1px] h-6 bg-white/20" />

          {/* Thickness controls */}
          <div className="flex items-center gap-1">
            {STROKE_SIZES.map((s) => (
              <button
                key={s.size}
                onClick={() => {
                  setActiveSize(s.size);
                  if (activeTool === 'eraser') setActiveTool('pen');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeSize === s.size && activeTool !== 'eraser'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
                title={`Espessura: ${s.label}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="w-[1px] h-6 bg-white/20" />

          {/* Eraser Tool */}
          <button
            onClick={() => setActiveTool(activeTool === 'eraser' ? 'pen' : 'eraser')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTool === 'eraser'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
            title="Borracha / Apagar Traços (⌫)"
          >
            <Eraser className="w-4 h-4" />
            <span>Borracha</span>
          </button>

          {/* Undo */}
          <button
            onClick={() => setStrokes((prev) => prev.slice(0, -1))}
            disabled={strokes.length === 0}
            className="p-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-slate-200 transition-all"
            title="Desfazer último traço (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Clear All */}
          <button
            onClick={() => setStrokes([])}
            disabled={strokes.length === 0}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-rose-500/20 hover:bg-rose-500/40 disabled:opacity-30 disabled:pointer-events-none text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 font-bold"
            title="Limpar todos os desenhos da lousa"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>

          <div className="w-[1px] h-6 bg-white/20" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-slate-300 transition-all"
            title="Sair do Modo Desenho (Tecla 'D' ou Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

