import React from 'react';
import { usePresentationStore, PRESENTATION_ACTS } from '../../store/usePresentationStore';
import {
  ChevronLeft,
  ChevronRight,
  BookMarked,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const NavigationHUD: React.FC = () => {
  const {
    currentAct,
    totalActs,
    nextAct,
    prevAct,
    setAct,
    isPresenterNotesOpen,
    togglePresenterNotes,
  } = usePresentationStore();

  const currentMeta = PRESENTATION_ACTS[currentAct - 1];
  const progressPercent = (currentAct / totalActs) * 100;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl select-none">
      {/* HUD Bar */}
      <div className="obsidian-glass rounded-2xl p-2.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        {/* Act Info & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Act Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700/60 font-mono text-xs">
            <span className="text-white font-bold">
              {currentMeta.actNumberStr}
            </span>
            <span className="text-slate-500">de</span>
            <span className="text-slate-400">
              {String(totalActs).padStart(2, '0')}
            </span>
          </div>

          {/* Act Title */}
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-slate-100 tracking-tight truncate max-w-[280px]">
              {currentMeta.title}
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[280px]">
              {currentMeta.subtitle}
            </span>
          </div>
        </div>

        {/* 10 Acts Stepper Buttons */}
        <div className="flex items-center gap-1 bg-[#090d16] px-2 py-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {PRESENTATION_ACTS.map((act) => {
            const isActive = currentAct === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setAct(act.id)}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={`${act.actNumberStr}: ${act.title}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeActIndicator"
                    className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{String(act.id).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Presenter Notes Button (Key P) */}
          <button
            onClick={togglePresenterNotes}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
              isPresenterNotesOpen
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
            title="Notas do Apresentador (Atalho: P)"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notas</span>
            <span className="text-[10px] opacity-60 font-mono">(P)</span>
          </button>

          {/* Prev Button */}
          <button
            onClick={prevAct}
            disabled={currentAct <= 1}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Ato Anterior (Seta Esquerda)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextAct}
            disabled={currentAct >= totalActs}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-white text-xs font-semibold transition-all shadow-md active:scale-95"
            title="Próximo Ato (Espaço ou Seta Direita)"
          >
            <span>Próximo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/80 h-1 rounded-full overflow-hidden mt-1.5 border border-slate-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400"
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
    </div>
  );
};
