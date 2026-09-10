import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Crosshair,
  Sun,
  Moon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Terminal,
  Layers,
  Map,
  Trophy,
  Mic,
} from 'lucide-react';
import { ACTS, NODES } from '../../data/presentationData';
import { PresentationMode } from '../../types/presentation';

interface KeynoteHUDProps {
  currentStep: number;
  totalSteps: number;
  presentationMode: PresentationMode;
  onTogglePresentationMode: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (step: number) => void;
  onToggleOverview: () => void;
  laserEnabled: boolean;
  onToggleLaser: () => void;
  spotlightEnabled: boolean;
  onToggleSpotlight: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNeuralRoom: () => void;
  onOpenMatrixProtocol: () => void;
  isPresenterNotesOpen?: boolean;
  onTogglePresenterNotes?: () => void;
  isQuizActive?: boolean;
  onToggleQuiz?: () => void;
  isLightTheme?: boolean;
  onToggleTheme?: () => void;
}

export const KeynoteHUD: React.FC<KeynoteHUDProps> = ({
  currentStep,
  totalSteps,
  presentationMode,
  onTogglePresentationMode,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onToggleOverview,
  laserEnabled,
  onToggleLaser,
  spotlightEnabled,
  onToggleSpotlight,
  soundEnabled,
  onToggleSound,
  onOpenNeuralRoom,
  onOpenMatrixProtocol,
  isPresenterNotesOpen = false,
  onTogglePresenterNotes,
  isQuizActive = false,
  onToggleQuiz,
  isLightTheme = false,
  onToggleTheme,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 2-Hour Timer State (7200 seconds)
  const [timerSeconds, setTimerSeconds] = useState(7200);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  // Fullscreen Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentNode = NODES.find((n) => n.stepNumber === currentStep) || NODES[0];
  const currentAct = ACTS.find((a) => a.id === currentNode.actId) || ACTS[0];

  return (
    <>
      {/* Top HUD Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between pointer-events-none select-none">
        {/* Left: Act & Topic Indicator */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl glass-panel border border-cyan-500/30 text-xs font-mono shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-bold text-cyan-400">ATO {currentAct.actNumber}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-200 font-semibold tracking-wide truncate max-w-[240px]">
              {currentNode.title}
            </span>
          </div>

          {/* View Mode Toggle Button */}
          <button
            onClick={onTogglePresentationMode}
            title="Alternar entre Modo Keynote (Slides) e Mapa Cósmico (Grafo)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-panel hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 transition-colors"
          >
            {presentationMode === 'deck' ? (
              <>
                <Map className="w-3.5 h-3.5 text-purple-400" />
                <span>Mapa Cósmico</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Modo Keynote</span>
              </>
            )}
          </button>
        </div>

        {/* Center: 2-Hour Timer */}
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-1.5 rounded-2xl glass-panel border border-white/10 text-xs font-mono shadow-xl">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tracking-widest text-slate-100">{formatTimer(timerSeconds)}</span>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1 hover:text-cyan-400 transition-colors text-slate-300"
            title={timerRunning ? 'Pausar Cronômetro' : 'Iniciar Cronômetro'}
          >
            {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={() => {
              setTimerRunning(false);
              setTimerSeconds(7200);
            }}
            className="p-1 hover:text-amber-400 transition-colors text-slate-400"
            title="Reiniciar para 2 Horas"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Tools, Quiz, Presenter Notes, Theme & Showstoppers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Visual Quiz Trigger (Tecla Q) */}
          {onToggleQuiz && (
            <button
              onClick={onToggleQuiz}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                isQuizActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-secondary text-foreground hover:bg-muted border-border'
              }`}
              title="Ativar Desafio Visual para a Turma (Tecla Q)"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>QUIZ [Q]</span>
            </button>
          )}

          {/* Presenter Notes Trigger (Tecla P) */}
          {onTogglePresenterNotes && (
            <button
              onClick={onTogglePresenterNotes}
              className={`p-2 rounded-lg border transition-all ${
                isPresenterNotesOpen
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border-border'
              }`}
              title="Notas do Apresentador / Roteiro (Tecla P)"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle (Tecla T) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
              title="Alternar Modo Escuro Ardósia / Papel Claro (Tecla T)"
            >
              {isLightTheme ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            </button>
          )}

          {/* Showstopper A: The Neural Room */}
          <button
            onClick={onOpenNeuralRoom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border text-xs font-semibold tracking-wider font-mono transition-all"
            title="Conectar a sala inteira pelo celular com QR Code ao vivo"
          >
            <Radio className="w-3.5 h-3.5 text-foreground" />
            <span>NEURAL ROOM</span>
          </button>

          {/* Showstopper B: The Matrix Protocol */}
          <button
            onClick={onOpenMatrixProtocol}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border text-xs font-semibold tracking-wider font-mono transition-all"
            title="Ativar enxame de 3 agentes de IA gerando app em tempo real"
          >
            <Terminal className="w-3.5 h-3.5 text-foreground" />
            <span>MATRIX</span>
          </button>

          {/* Laser Pointer Toggle */}
          <button
            onClick={onToggleLaser}
            className={`p-2 rounded-lg border transition-all ${
              laserEnabled
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border-border'
            }`}
            title="Ponteiro de Foco (Tecla L)"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-2xl border transition-all ${
              soundEnabled
                ? 'glass-panel text-cyan-300 border-cyan-500/30'
                : 'glass-panel text-slate-500 border-white/5'
            }`}
            title="Efeitos Sonoros Sci-Fi (Tecla M)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Overview Matrix Modal */}
          <button
            onClick={onToggleOverview}
            className="p-2 rounded-2xl glass-panel hover:bg-white/10 text-slate-400 hover:text-white border-white/10 transition-colors"
            title="Visão Geral dos 5 Atos (Tecla O)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-2xl glass-panel hover:bg-white/10 text-slate-400 hover:text-white border-white/10 transition-colors"
            title="Tela Cheia (Tecla F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Bottom Progress Bar & Navigation HUD */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 px-6 py-3 flex items-center justify-between pointer-events-none select-none">
        {/* Left: Previous Button & Step Count */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onPrevStep}
            disabled={currentStep <= 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border border-white/10 text-xs font-mono transition-all ${
              currentStep <= 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'hover:bg-white/10 text-slate-200 hover:text-white hover:border-cyan-400/40'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ANTERIOR</span>
          </button>

          <span className="text-xs font-mono text-slate-400 px-2">
            SLIDE <span className="text-cyan-400 font-bold">{currentStep}</span> / {totalSteps}
          </span>
        </div>

        {/* Center: Interactive Step Dots / Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel border border-white/10 shadow-xl max-w-xl overflow-x-auto">
          {NODES.map((node) => {
            const isActive = node.stepNumber === currentStep;
            const isPassed = node.stepNumber < currentStep;

            return (
              <button
                key={node.id}
                onClick={() => onJumpToStep(node.stepNumber)}
                title={`Ir para ${node.title}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-2 bg-primary'
                    : isPassed
                    ? 'w-2 h-2 bg-foreground/60'
                    : 'w-2 h-2 bg-muted-foreground/30'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Next Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-semibold tracking-wide shadow-sm transition-all border border-primary/20 ${
              currentStep >= totalSteps ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>PRÓXIMO</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </>
  );
};
