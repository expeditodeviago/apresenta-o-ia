// src/components/navigation/PresenterDock.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, PRESENTATION_ACTS } from '../../store/usePresentationStore';
import {
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Volume2,
  VolumeX,
  Edit3,
  BookOpen,
  Trophy,
} from 'lucide-react';

interface PresenterDockProps {
  onOpenOverview: () => void;
}

export const PresenterDock: React.FC<PresenterDockProps> = ({ onOpenOverview }) => {
  const {
    currentAct,
    totalActs,
    score,
    soundEnabled,
    toggleSound,
    nextAct,
    prevAct,
    setAct,
    isDrawingEnabled,
    toggleDrawing,
    isPresenterNotesOpen,
    togglePresenterNotes,
  } = usePresentationStore();

  const [hoveredAct, setHoveredAct] = useState<number | null>(null);
  const currentMeta = PRESENTATION_ACTS.find((a) => a.id === currentAct) || PRESENTATION_ACTS[0];

  return (
    <nav
      aria-label="Navegação da apresentação Synapse"
      className="arcade-dock z-40 select-none pointer-events-auto"
    >
      <div className="arcade-dock-inner flex items-center gap-2 sm:gap-3 px-4 py-2.5">
        {/* ⬅ Botão Anterior */}
        <button
          onClick={prevAct}
          disabled={currentAct === 1}
          aria-label="Anterior"
          className="tactile-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
          title="Ato Anterior (Seta Esquerda ou PageUp)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Separador */}
        <div className="h-4 w-px bg-white/10" />

        {/* Contador Central [ Ato 01 de 08 ] */}
        <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-zinc-200 font-semibold hidden md:flex items-center gap-1.5">
          <span className="text-cyan-400 font-bold">{currentMeta.actNumberStr}</span>
          <span className="text-zinc-500">de</span>
          <span className="text-zinc-400 font-bold">{String(totalActs).padStart(2, '0')}</span>
        </div>

        {/* 🔘 Pílulas dos 8 Atos com Tooltip Apple/Linear Clean */}
        <div className="dock-act-dots flex items-center gap-1.5 px-1 relative">
          {PRESENTATION_ACTS.map((act) => {
            const isActive = act.id === currentAct;
            const isPassed = act.id < currentAct;

            return (
              <div
                key={act.id}
                className="relative"
                onMouseEnter={() => setHoveredAct(act.id)}
                onMouseLeave={() => setHoveredAct(null)}
              >
                <button
                  onClick={() => setAct(act.id)}
                  aria-label={`Ir para ${act.actNumberStr}: ${act.title}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-7 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                      : isPassed
                      ? 'w-2 bg-emerald-400/80 hover:bg-emerald-300'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />

                {/* Tooltip Fluido */}
                <AnimatePresence>
                  {hoveredAct === act.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-white/15 text-[11px] font-sans text-zinc-200 whitespace-nowrap shadow-2xl pointer-events-none z-50 flex flex-col items-center backdrop-blur-xl"
                    >
                      <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        {act.actNumberStr} • {act.genre}
                      </span>
                      <span className="font-semibold text-white">{act.title}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-950" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Separador */}
        <div className="h-4 w-px bg-white/10" />

        {/* 🗂️ Botão Menu de Atos (Esc) */}
        <button
          onClick={onOpenOverview}
          aria-label="Menu de Atos"
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          title="Ver Todos os 13 Atos (Esc)"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Separador */}
        <div className="h-4 w-px bg-white/10" />

        {/* ➔ Botão Próximo */}
        <button
          onClick={nextAct}
          disabled={currentAct === totalActs}
          aria-label="Próximo"
          className="tactile-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/30 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
          title="Próximo Ato (Espaço, Seta Direita ou PageDown)"
        >
          <span>Próximo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Separador */}
        <div className="hidden md:block h-4 w-px bg-white/10" />

        {/* 🔊 Som, ✏️ Lápis & 📖 Guia (Acessórios Discretos) */}
        <div className="dock-legacy-tools hidden md:flex items-center gap-1">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Desativar Som' : 'Ativar Som'}
            className={`p-1.5 rounded-full transition-all ${
              soundEnabled
                ? 'text-zinc-400 hover:text-emerald-400 hover:bg-white/10'
                : 'text-rose-400 hover:bg-rose-500/20'
            }`}
            title={soundEnabled ? 'Som Ativo' : 'Mudo'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleDrawing}
            aria-label="Lápis de Desenho"
            className={`p-1.5 rounded-full transition-all ${
              isDrawingEnabled
                ? 'text-cyan-400 bg-cyan-500/20 ring-1 ring-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Lápis de Desenho Keynote (D)"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePresenterNotes}
            aria-label="Notas do Apresentador"
            className={`p-1.5 rounded-full transition-all ${
              isPresenterNotesOpen
                ? 'text-amber-400 bg-amber-500/20 ring-1 ring-amber-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title="Notas do Apresentador (P)"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Mini Score Badge */}
          <div className="ml-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-white/10 text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>{String(score).padStart(4, '0')}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
