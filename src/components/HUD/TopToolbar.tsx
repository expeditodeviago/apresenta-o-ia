import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  PenTool,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Palette,
  HelpCircle,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layout,
  Presentation,
} from 'lucide-react';
import { BoardTheme, PresentationMode } from '../../types/presentation';

interface TopToolbarProps {
  theme: BoardTheme;
  onThemeChange: (theme: BoardTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  drawingMode: boolean;
  onToggleDrawing: () => void;
  onOpenShortcuts: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onOverview: () => void;
  presentationMode: PresentationMode;
  onTogglePresentationMode: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  drawingMode,
  onToggleDrawing,
  onOpenShortcuts,
  onZoomIn,
  onZoomOut,
  onOverview,
  presentationMode,
  onTogglePresentationMode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // 2-hour Presentation Timer (7200 seconds total)
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${String(mins).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  const themes: { id: BoardTheme; label: string; bg: string; border: string }[] = [
    { id: 'green', label: 'Verde Clássico', bg: 'bg-[#142018]', border: 'border-emerald-500/40' },
    { id: 'slate', label: 'Grafite / Preto', bg: 'bg-[#12161f]', border: 'border-slate-500/40' },
    { id: 'blueprint', label: 'Blueprint Azul', bg: 'bg-[#0d1b2a]', border: 'border-sky-500/40' },
  ];

  return (
    <header className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none select-none">
      {/* Left: Brand & Logo */}
      <div className="matte-hud pointer-events-auto rounded-xl px-3.5 py-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground font-mono text-sm font-semibold">
          💡
        </div>
        <div>
          <h1 className="font-sans text-sm md:text-base font-bold text-foreground tracking-tight flex items-center gap-1.5 leading-tight">
            Lousa Viva de IA
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
              Palco Interativo
            </span>
          </h1>
          <p className="text-[11px] text-muted-foreground font-sans leading-none mt-0.5">
            Inteligência Artificial & Ferramentas Modernas
          </p>
        </div>
      </div>

      {/* Center / Right: Speaker Timer & Utility Controls */}
      <div className="matte-hud pointer-events-auto rounded-xl px-3 py-1.5 flex items-center gap-2">
        {/* Presentation Mode Switcher (Lousa a Giz vs Slides) */}
        <button
          onClick={onTogglePresentationMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
            presentationMode === 'deck'
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border-border'
          }`}
          title="Alternar entre Lousa a Giz (2D) e Modo Slides (M)"
        >
          {presentationMode === 'deck' ? (
            <>
              <Presentation className="w-3.5 h-3.5" />
              <span>Modo Slides</span>
            </>
          ) : (
            <>
              <Layout className="w-3.5 h-3.5" />
              <span>Lousa 2D</span>
            </>
          )}
        </button>

        <div className="w-[1px] h-5 bg-border mx-0.5" />

        {/* Presentation 2h Timer */}
        <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg border border-border text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-semibold text-foreground">{formatTimer(timerSeconds)}</span>
          <span className="text-[10px] text-muted-foreground">/ 2h</span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 text-muted-foreground hover:text-foreground transition-all ml-1"
            title={isTimerRunning ? 'Pausar Cronômetro' : 'Retomar'}
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-foreground" />}
          </button>
          <button
            onClick={() => setTimerSeconds(0)}
            className="p-1 hover:text-destructive transition-all text-muted-foreground"
            title="Zerar Cronômetro"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <div className="w-[1px] h-5 bg-border mx-0.5" />

        {/* Zoom In/Out Controls (only visible when in mindmap mode) */}
        {presentationMode === 'mindmap' && (
          <>
            <div className="flex items-center gap-0.5">
              <button
                onClick={onZoomIn}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Aproximar Zoom (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={onZoomOut}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title="Afastar Zoom (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
            <div className="w-[1px] h-5 bg-border mx-0.5" />
          </>
        )}

        {/* Drawing Mode Button */}
        {presentationMode === 'mindmap' && (
          <button
            onClick={onToggleDrawing}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              drawingMode
                ? 'bg-primary text-primary-foreground font-semibold border-primary shadow-sm'
                : 'bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border-border'
            }`}
            title="Modo Desenho Livre com Giz (D)"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Rabiscar</span>
          </button>
        )}

        {/* Sound Effects Button */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg text-xs transition-all border ${
            soundEnabled
              ? 'bg-secondary text-foreground border-border'
              : 'bg-muted/40 text-muted-foreground border-border'
          }`}
          title={soundEnabled ? 'Efeitos Sonoros Ativos (S)' : 'Efeitos Sonoros Mudos'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Theme Selector Dropdown / Pills */}
        <div className="flex items-center gap-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`w-5 h-5 rounded-full border transition-all ${
                theme === t.id ? 'scale-110 border-primary ring-1 ring-border' : 'border-border opacity-50 hover:opacity-100'
              } ${t.bg}`}
              title={`Tema: ${t.label}`}
            />
          ))}
        </div>

        {/* Shortcuts Help */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border transition-all"
          title="Atalhos de Teclado (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border transition-all"
          title="Tela Cheia (F)"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
