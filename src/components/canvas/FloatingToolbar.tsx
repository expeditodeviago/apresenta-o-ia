import React from 'react';
import { usePresentationStore } from '../../store/usePresentationStore';
import {
  Pen,
  Eraser,
  Trash2,
  ZoomIn,
  ZoomOut,
  Undo2,
} from 'lucide-react';

const CHROMATIC_PALETTE = [
  { hex: '#f8fafc', name: 'Branco Cristal' },
  { hex: '#10b981', name: 'Verde Menta' },
  { hex: '#f59e0b', name: 'Dourado Solar' },
  { hex: '#0ea5e9', name: 'Azul Elétrico' },
  { hex: '#f43f5e', name: 'Rosa Coral' },
];

export const FloatingToolbar: React.FC = () => {
  const {
    isDrawingEnabled,
    toggleDrawing,
    activeTool,
    setActiveTool,
    penColor,
    setPenColor,
    strokes,
    undoStroke,
    clearStrokes,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePresentationStore();

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl obsidian-glass shadow-2xl transition-all select-none border border-slate-800">
      {/* Pen Toggle Mode Button */}
      <button
        onClick={toggleDrawing}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          isDrawingEnabled
            ? 'bg-indigo-600 text-white shadow-md'
            : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
        title="Ativar/Desativar Caneta (Atalho: D)"
      >
        <Pen className="w-3.5 h-3.5" />
        <span>{isDrawingEnabled ? 'Caneta Ativa' : 'Modo Giz'}</span>
        <span className="text-[10px] opacity-70 ml-0.5 font-mono">(D)</span>
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-800 mx-0.5" />

      {/* Active Tools */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTool('pen')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'pen' && isDrawingEnabled
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Lápis / Caneta"
        >
          <Pen className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          className={`p-1.5 rounded-lg transition-colors ${
            activeTool === 'eraser' && isDrawingEnabled
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Borracha"
        >
          <Eraser className="w-4 h-4" />
        </button>

        <button
          onClick={undoStroke}
          disabled={strokes.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 disabled:opacity-30 transition-colors"
          title="Desfazer último traço"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={clearStrokes}
          disabled={strokes.length === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 disabled:opacity-30 transition-colors"
          title="Limpar todos os desenhos"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-800 mx-0.5" />

      {/* Chromatic Palette */}
      <div className="flex items-center gap-1.5 px-1">
        {CHROMATIC_PALETTE.map((color) => {
          const isSelected = penColor.toLowerCase() === color.hex.toLowerCase();
          return (
            <button
              key={color.hex}
              onClick={() => {
                setPenColor(color.hex);
                setActiveTool('pen');
              }}
              style={{ backgroundColor: color.hex }}
              className={`w-4 h-4 rounded-full transition-transform ${
                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'hover:scale-105'
              }`}
              title={color.name}
            />
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-800 mx-0.5" />

      {/* Zoom Controls: [ + ], [ - ], [ 100% ] */}
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Diminuir Zoom (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetZoom}
          className="px-2 py-1 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Restaurar Zoom (100%)"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={zoomIn}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Aumentar Zoom (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
