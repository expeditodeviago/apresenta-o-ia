// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, PRESENTATION_ACTS } from './store/usePresentationStore';
import { PresenterDock } from './components/navigation/PresenterDock';
import { LevelOverviewModal } from './components/navigation/LevelOverviewModal';
import { PresenterNotes } from './components/navigation/PresenterNotes';
import { FloatingPenCanvas } from './components/canvas/FloatingPenCanvas';
import { ArcadeHeader, ArcadeBanner } from './components/Arcade/ArcadeHeader';
import { MathematicsLens } from './components/Arcade/MathematicsLens';
import { ARCADE_CURRICULUM } from './data/arcadeCurriculum';
import { Clock3, Sigma } from 'lucide-react';

// 🕹️ Os 13 Atos Rebranded ("Twilight Aurora & Tactile Glass")
import { Act01_TokenForge } from './components/acts/Act01_TokenForge';
import { Act_TemperaturePlayground } from './components/acts/Act_TemperaturePlayground';
import { Act02_VectorCompass } from './components/acts/Act02_VectorCompass';
import { Act03_RotaryClock } from './components/acts/Act03_RotaryClock';
import { Act03_AttentionBeams } from './components/acts/Act03_AttentionBeams';
import { Act_ContextWindowTetris } from './components/acts/Act_ContextWindowTetris';
import { Act04_MazeRunner } from './components/acts/Act04_MazeRunner';
import { Act05_AIArena } from './components/acts/Act05_AIArena';
import { Act06_BuilderMatrix } from './components/acts/Act06_BuilderMatrix';
import { Act_HallucinationDetective } from './components/acts/Act_HallucinationDetective';
import { Act08_AgentPipeline } from './components/acts/Act08_AgentPipeline';
import { Act07_AgentTycoon } from './components/acts/Act07_AgentTycoon';
import { Act08_TuringShowdown } from './components/acts/Act08_TuringShowdown';

export function App() {
  const {
    currentAct,
    nextAct,
    prevAct,
    setAct,
    toggleDrawing,
    togglePresenterNotes,
  } = usePresentationStore();

  const [isOverviewOpen, setIsOverviewOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement>(null);
  const lesson = ARCADE_CURRICULUM[currentAct - 1];
  useEffect(() => { mainRef.current?.scrollTo(0, 0); }, [currentAct]);

  // Metadados do Ato Atual (Cores da Aurora, Título, Gênero)
  const currentMeta =
    PRESENTATION_ACTS.find((a) => a.id === currentAct) || PRESENTATION_ACTS[0];

  // 🧭 Atalhos de Teclado Universais para o Apresentador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.ctrlKey || e.metaKey || e.altKey || target.closest('button, select, [role="dialog"]')) return;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (isOverviewOpen) return;
      const state = usePresentationStore.getState();
      if (e.key === 'Escape' && state.isPresenterNotesOpen) { togglePresenterNotes(); return; }
      if (e.key === 'Escape' && state.isDrawingEnabled) { toggleDrawing(); return; }
      if (state.isPresenterNotesOpen || state.isDrawingEnabled) return;

      // Avançar com Espaço, PageDown ou Seta Direita
      if (e.code === 'Space' || e.code === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        nextAct();
      }
      // Voltar com PageUp ou Seta Esquerda
      else if (e.code === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevAct();
      }
      // Menu Geral / Visão Geral com Esc
      else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOverviewOpen((prev) => !prev);
      }
      // Modo Caneta de Anotação com D
      else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        toggleDrawing();
      }
      // Notas do Apresentador com P
      else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePresenterNotes();
      }
      // Salto direto por teclas 1 a 9
      else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        e.preventDefault();
        const targetAct = parseInt(e.key, 10);
        setAct(targetAct);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextAct, prevAct, setAct, toggleDrawing, togglePresenterNotes, isOverviewOpen]);

  return (
    <div className="arcade-app relative text-[#f8fafc] flex flex-col font-sans" style={{ '--act-color': lesson.color, '--act-wash': `${lesson.color}14` } as React.CSSProperties}>
      {/* 🌌 BACKDROP COM NÉVOA DINÂMICA (TWILIGHT AURORA MESH GRADIENT) */}
      <div className="arcade-atmosphere" aria-hidden="true" />
      <ArcadeHeader onOverview={() => setIsOverviewOpen(true)} />
      {false && <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000 ease-out">
        {/* Orbe 1: Superior Central / Esquerdo */}
        <motion.div
          animate={{
            backgroundColor: currentMeta.auroraPrimary,
            scale: [1, 1.1, 1],
          }}
          transition={{
            backgroundColor: { duration: 0.8 },
            scale: { repeat: Infinity, duration: 8, ease: 'easeInOut' },
          }}
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[850px] h-[450px] blur-[140px] rounded-full pointer-events-none"
        />

        {/* Orbe 2: Inferior Direito */}
        <motion.div
          animate={{
            backgroundColor: currentMeta.auroraSecondary,
            scale: [1, 1.15, 1],
          }}
          transition={{
            backgroundColor: { duration: 0.8 },
            scale: { repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 1 },
          }}
          className="absolute -bottom-[20%] right-[10%] w-[650px] h-[450px] blur-[150px] rounded-full pointer-events-none"
        />

        {/* Grid Fino de Contraste Espacial */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>}

      {/* ✏️ CAMADA DE CANETA SOBREPOSTA (TECLA D) */}
      <FloatingPenCanvas />

      {/* 📖 GAVETA DE NOTAS DO APRESENTADOR (TECLA P) */}
      <PresenterNotes />

      {/* 🏛️ PALCO PRINCIPAL DOS 13 ATOS INTERATIVOS */}
      <main ref={mainRef} className="arcade-main relative z-10">
        <div className="arcade-content">
        <ArcadeBanner />
        <div className="arcade-act-heading"><div><span className="arcade-eyebrow"><span className="act-number">ATO {String(currentAct).padStart(2, '0')}</span><span>EXPERIMENTO {String(currentAct).padStart(2, '0')} / 13</span></span><h2>{lesson.title}</h2></div><div className="act-heading-meta"><span><Sigma size={14} />{lesson.math}</span><span><Clock3 size={14} />{lesson.minutes} min</span></div></div>
        <div className="arcade-stage" data-act={currentAct}>
        <AnimatePresence mode="wait">
          {currentAct === 1 && (
            <motion.div
              key="act-1"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act01_TokenForge />
            </motion.div>
          )}

          {currentAct === 2 && (
            <motion.div
              key="act-2"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act_TemperaturePlayground />
            </motion.div>
          )}

          {currentAct === 3 && (
            <motion.div
              key="act-3"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act02_VectorCompass />
            </motion.div>
          )}

          {currentAct === 4 && (
            <motion.div
              key="act-4"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act03_RotaryClock />
            </motion.div>
          )}

          {currentAct === 5 && (
            <motion.div
              key="act-5"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act03_AttentionBeams />
            </motion.div>
          )}

          {currentAct === 6 && (
            <motion.div
              key="act-6"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act_ContextWindowTetris />
            </motion.div>
          )}

          {currentAct === 7 && (
            <motion.div
              key="act-7"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act04_MazeRunner />
            </motion.div>
          )}

          {currentAct === 8 && (
            <motion.div
              key="act-8"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act05_AIArena />
            </motion.div>
          )}

          {currentAct === 9 && (
            <motion.div
              key="act-9"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act06_BuilderMatrix />
            </motion.div>
          )}

          {currentAct === 10 && (
            <motion.div
              key="act-10"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act_HallucinationDetective />
            </motion.div>
          )}

          {currentAct === 11 && (
            <motion.div
              key="act-11"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act08_AgentPipeline />
            </motion.div>
          )}

          {currentAct === 12 && (
            <motion.div
              key="act-12"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act07_AgentTycoon />
            </motion.div>
          )}

          {currentAct === 13 && (
            <motion.div
              key="act-13"
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex items-center justify-center"
            >
              <Act08_TuringShowdown />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        <MathematicsLens key={currentAct} act={currentAct} />
        <div className="arcade-stage-footer"><span>SYNAPSE // ENGENHARIA DE SOFTWARE</span><span>13 conexões entre matemática e inteligência.</span></div>
        </div>
      </main>

      {/* 🧭 FLOATING PRESENTER DOCK (Barra Fixa Universal em Vidro Líquido) */}
      <PresenterDock onOpenOverview={() => setIsOverviewOpen(true)} />

      {/* 🗂️ MODAL DE VISÃO GERAL DOS 8 ATOS (TECLA ESC) */}
      <LevelOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
      />
    </div>
  );
}

export default App;
