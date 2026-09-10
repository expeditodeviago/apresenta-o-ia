// src/components/hud/GameHUD.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GAME_LEVELS } from '../../store/useGameStore';
import {
  Volume2,
  VolumeX,
  Edit3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Trophy,
  Sparkles,
} from 'lucide-react';

export const GameHUD: React.FC = () => {
  const {
    currentLevel,
    totalLevels,
    score,
    soundEnabled,
    toggleSound,
    nextLevel,
    prevLevel,
    setLevel,
    isDrawingEnabled,
    toggleDrawing,
    isPresenterGuideOpen,
    togglePresenterGuide,
  } = useGameStore();

  const currentMeta = GAME_LEVELS[currentLevel - 1] || GAME_LEVELS[0];

  return (
    <>
      {/* 🎮 TOP ARCADE HUD BAR */}
      <header className="fixed top-0 left-0 right-0 z-30 px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md select-none shadow-lg shadow-black/40">
        {/* Esquerda: Logo Arcade & Gênero */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs tracking-wider font-bold shadow-inner">
            <Gamepad2 className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>THE AI ARCADE</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{currentMeta.genre}</span>
          </div>
        </div>

        {/* Centro: Indicador da Fase [ FASE ATUAL: 01 / 06 ] e Seletor */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={prevLevel}
              disabled={currentLevel === 1}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Fase Anterior (Seta Esquerda)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0f172a] border border-slate-700/80 shadow-inner">
              <span className="text-xs font-mono font-bold text-amber-400">
                FASE ATUAL: {String(currentLevel).padStart(2, '0')} / {String(totalLevels).padStart(2, '0')}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline tracking-tight">
                {currentMeta.title}
              </span>
            </div>

            <button
              onClick={nextLevel}
              disabled={currentLevel === totalLevels}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Próxima Fase (Espaço ou Seta Direita)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots de progresso rápido */}
          <div className="flex items-center gap-1.5 mt-1">
            {GAME_LEVELS.map((lvl) => {
              const isActive = lvl.id === currentLevel;
              const isPassed = lvl.id < currentLevel;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setLevel(lvl.id)}
                  title={`${lvl.levelNumberStr}: ${lvl.title}`}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : isPassed
                      ? 'w-2 bg-emerald-500/70 hover:bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Direita: Score, Som, Lápis e Guia */}
        <div className="flex items-center gap-2">
          {/* Placar SCORE: 0000 */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>SCORE:</span>
            <motion.span
              key={score}
              initial={{ scale: 1.25, color: '#fef08a' }}
              animate={{ scale: 1, color: '#fcd34d' }}
              transition={{ duration: 0.2 }}
              className="font-black tracking-wider"
            >
              {String(score).padStart(4, '0')}
            </motion.span>
          </div>

          {/* Botão de Som */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-emerald-400 hover:bg-slate-700'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title={soundEnabled ? 'Desativar Som' : 'Ativar Efeitos Sonoros'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Botão Lápis (D) */}
          <button
            onClick={toggleDrawing}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isDrawingEnabled
                ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Modo Lápis Sobreposto (Tecla D)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lápis</span>
            <kbd className="text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-700 text-slate-400">D</kbd>
          </button>

          {/* Botão Guia (P) */}
          <button
            onClick={togglePresenterGuide}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              isPresenterGuideOpen
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Guia do Apresentador (Tecla P)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guia</span>
            <kbd className="text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-700 text-slate-400">P</kbd>
          </button>
        </div>
      </header>

      {/* 🕹️ BOTTOM ARCADE FOOTER HUD */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 px-4 py-2 border-t border-slate-800/70 bg-[#090d16]/80 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="text-amber-400">{currentMeta.icon}</span>
            <span className="font-semibold text-slate-200">{currentMeta.title}</span>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-slate-400 text-[10px]">
            {currentMeta.subtitle}
          </span>
        </div>

        {/* Atalhos Rápidos */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">Espaço</kbd> / <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">→</kbd> Próxima Fase
          </span>
          <span className="hidden md:inline">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">←</kbd> Fase Anterior
          </span>
          <span className="hidden lg:inline">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">D</kbd> Lápis
          </span>
          <span className="hidden lg:inline">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">P</kbd> Guia do Apresentador
          </span>
        </div>
      </footer>
    </>
  );
};
