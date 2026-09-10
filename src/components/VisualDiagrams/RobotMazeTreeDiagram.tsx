import React, { useState, useEffect } from 'react';
import { GitFork, Play, Pause, RotateCcw, ChevronRight, Scissors, CheckCircle, AlertOctagon, Sparkles, Bot } from 'lucide-react';

interface MazeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'root' | 'branch' | 'pruned' | 'optimal';
  parent?: string;
  reason?: string;
}

interface RobotMazeTreeDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

export const RobotMazeTreeDiagram: React.FC<RobotMazeTreeDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;
  const [isPlaying, setIsPlaying] = useState(false);

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(5, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  // Auto-play timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((step + 1) % 6);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, step]);

  // Tree nodes definition for visual maze
  const NODES: Record<string, MazeNode> = {
    root: { id: 'root', label: 'Problema de Código Difícil', x: 400, y: 60, type: 'root' },
    // Level 1
    left: { id: 'left', label: 'Tentativa A (Chute Rápido)', x: 220, y: 160, type: 'branch', parent: 'root' },
    right: { id: 'right', label: 'Tentativa B (Raciocínio Seguro)', x: 580, y: 160, type: 'branch', parent: 'root' },
    // Level 2 Left (Errors)
    left_1: { id: 'left_1', label: 'A.1: Loop Infinito', x: 140, y: 270, type: 'pruned', parent: 'left', reason: 'Bug detectado! Descartando caminho' },
    left_2: { id: 'left_2', label: 'A.2: Erro de Tipagem', x: 300, y: 270, type: 'pruned', parent: 'left', reason: 'Tipo incompatível! Descartado' },
    // Level 2 Right (1 Error, 1 Winner)
    right_1: { id: 'right_1', label: 'B.1: Incompleto', x: 500, y: 270, type: 'pruned', parent: 'right', reason: 'Faltam casos de borda. Descartado' },
    right_2: { id: 'right_2', label: 'B.2: Código 100% Funcional!', x: 660, y: 270, type: 'optimal', parent: 'right', reason: 'SOLUÇÃO VALIDADA! Passou nos testes' },
  };

  // Robot coordinates and state based on step (0 to 5)
  const getRobotState = () => {
    switch (step) {
      case 0:
        return { x: 400, y: 60, status: 'thinking', message: 'Robô na Raiz: analisando os caminhos lógicos para resolver o problema...' };
      case 1:
        return { x: 220, y: 160, status: 'exploring', message: 'Explorando Tentativa A: descendo pelo primeiro galho...' };
      case 2:
        return { x: 140, y: 270, status: 'error', message: 'ERRO DETECTADO! Loop infinito no código. Galho pisca em vermelho!' };
      case 3:
        return { x: 400, y: 60, status: 'backtracking', message: 'MEIA-VOLTA! O robô percebe o erro e retorna à raiz com segurança.' };
      case 4:
        return { x: 580, y: 160, status: 'exploring', message: 'Explorando Tentativa B: avaliando o ramo com rascunho cuidadoso...' };
      case 5:
        return { x: 660, y: 270, status: 'victory', message: 'VITÓRIA! Encontrou o código perfeito que passa em todos os testes!' };
      default:
        return { x: 400, y: 60, status: 'thinking', message: 'Analisando...' };
    }
  };

  const robot = getRobotState();

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-foreground shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Top Header & Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shadow-sm">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              O Robô no Labirinto: Como os Modelos de Raciocínio Pensam (DeepSeek-R1 / o1)
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Explorar hipóteses • Dar meia-volta ao errar (Backtracking) • Podar galhos sem saída
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all border ${
              isPlaying
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Auto-Play'}</span>
          </button>
          <button
            onClick={() => setStep((step + 1) % 6)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold flex items-center gap-1 transition-all"
          >
            <span>Passo {step + 1}/6</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700"
            title="Reiniciar labirinto"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Visual Maze Arena */}
      <div className="relative min-h-[420px] rounded-xl bg-secondary/30 border border-border p-6 flex flex-col justify-between overflow-hidden">
        {/* Status Callout Banner */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-card border border-border shadow-sm">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                robot.status === 'error'
                  ? 'bg-destructive'
                  : robot.status === 'victory'
                  ? 'bg-emerald-500'
                  : robot.status === 'backtracking'
                  ? 'bg-amber-500'
                  : 'bg-foreground'
              }`}
            />
            <span className="text-xs md:text-sm font-mono font-semibold text-foreground">
              {robot.message}
            </span>
          </div>

          {/* Efficiency Metric Pill */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">Estratégia: <strong className="text-foreground">Backtracking</strong></span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-secondary border border-border text-foreground">
              {step === 5 ? '100% Validado' : 'Pensando...'}
            </span>
          </div>
        </div>

        {/* SVG Interactive Branching Exploration Tree */}
        <div className="w-full flex-1 flex items-center justify-center relative py-4 z-10">
          <svg viewBox="0 0 700 280" className="w-full max-w-2xl h-auto select-none overflow-visible">
            <defs>
              <linearGradient id="tree-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* BRANCH CONNECTORS */}
            <line
              x1={NODES.root.x}
              y1={NODES.root.y}
              x2={NODES.left.x}
              y2={NODES.left.y}
              stroke={step >= 2 ? '#f43f5e' : step === 1 ? '#0ea5e9' : '#334155'}
              strokeWidth={step >= 2 ? '4' : '3'}
              strokeDasharray={step >= 2 ? '6 6' : 'none'}
              className="transition-colors duration-500"
            />
            <line
              x1={NODES.left.x}
              y1={NODES.left.y}
              x2={NODES.left_1.x}
              y2={NODES.left_1.y}
              stroke={step >= 2 ? '#f43f5e' : '#334155'}
              strokeWidth={step >= 2 ? '4' : '3'}
              className="transition-colors duration-500"
            />
            <line
              x1={NODES.left.x}
              y1={NODES.left.y}
              x2={NODES.left_2.x}
              y2={NODES.left_2.y}
              stroke={step >= 2 ? '#f43f5e' : '#334155'}
              strokeWidth={step >= 2 ? '4' : '3'}
              className="transition-colors duration-500"
            />

            <line
              x1={NODES.root.x}
              y1={NODES.root.y}
              x2={NODES.right.x}
              y2={NODES.right.y}
              stroke={step === 5 ? '#10b981' : step === 4 ? '#0ea5e9' : '#334155'}
              strokeWidth={step === 5 ? '5' : '3'}
              className="transition-colors duration-500"
            />
            <line
              x1={NODES.right.x}
              y1={NODES.right.y}
              x2={NODES.right_1.x}
              y2={NODES.right_1.y}
              stroke={step >= 5 ? '#f43f5e' : '#334155'}
              strokeWidth={step >= 5 ? '4' : '3'}
              strokeDasharray={step >= 5 ? '6 6' : 'none'}
              className="transition-colors duration-500"
            />
            <line
              x1={NODES.right.x}
              y1={NODES.right.y}
              x2={NODES.right_2.x}
              y2={NODES.right_2.y}
              stroke={step === 5 ? '#10b981' : '#334155'}
              strokeWidth={step === 5 ? '5' : '3'}
              className="transition-colors duration-500"
            />

            {/* TREE NODES */}
            {Object.values(NODES).map((n) => {
              const isPruned =
                (step >= 2 && ['left', 'left_1', 'left_2'].includes(n.id)) ||
                (step >= 5 && n.id === 'right_1');
              const isVictoryNode = step === 5 && (n.id === 'right_2' || n.id === 'right' || n.id === 'root');

              return (
                <g key={n.id} transform={`translate(${n.x}, ${n.y})`} className="cursor-pointer">
                  {/* Node Circle */}
                  <circle
                    r={n.type === 'root' ? 22 : 18}
                    fill={
                      isVictoryNode
                        ? '#10b981'
                        : isPruned
                        ? '#f43f5e'
                        : n.id === 'right' && step === 4
                        ? '#0ea5e9'
                        : '#1e293b'
                    }
                    stroke={
                      isVictoryNode
                        ? '#6ee7b7'
                        : isPruned
                        ? '#fda4af'
                        : '#475569'
                    }
                    strokeWidth={isVictoryNode ? 3 : 2}
                    className="transition-all duration-500"
                  />

                  {/* Pruned Cross Icon */}
                  {isPruned && (
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-xs font-black font-mono select-none"
                    >
                      ✕
                    </text>
                  )}

                  {/* Victory Star Icon */}
                  {isVictoryNode && (
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="text-xs font-black font-mono select-none"
                    >
                      ★
                    </text>
                  )}

                  {/* Node Label Text */}
                  <text
                    x="0"
                    y={n.y > 200 ? 32 : -28}
                    textAnchor="middle"
                    fill={isVictoryNode ? '#34d399' : isPruned ? '#f87171' : '#cbd5e1'}
                    className="text-[11px] font-mono font-bold select-none"
                  >
                    {n.label}
                  </text>

                  {/* Failure reason callout if pruned */}
                  {isPruned && n.reason && (
                    <text
                      x="0"
                      y={n.y > 200 ? 46 : -40}
                      textAnchor="middle"
                      fill="#fca5a5"
                      className="text-[9px] font-mono select-none"
                    >
                      {n.reason}
                    </text>
                  )}
                </g>
              );
            })}

            {/* ANIMATED ROBOT AVATAR */}
            <g
              transform={`translate(${robot.x}, ${robot.y})`}
              className="transition-all duration-700 ease-out"
            >
              <circle r="28" fill="#38bdf8" opacity="0.2" className="animate-pulse" />

              <g transform="translate(-16, -16)">
                <rect width="32" height="32" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <line x1="16" y1="0" x2="16" y2="-6" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="16" cy="-7" r="2.5" fill="#f59e0b" />
                <circle cx="10" cy="12" r="3" fill="#ffffff" />
                <circle cx="10" cy="12" r="1.5" fill="#0f172a" />
                <circle cx="22" cy="12" r="3" fill="#ffffff" />
                <circle cx="22" cy="12" r="1.5" fill="#0f172a" />
                {robot.status === 'error' ? (
                  <path d="M 11 23 Q 16 19 21 23" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M 11 21 Q 16 26 21 21" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                )}
              </g>

              {robot.status === 'backtracking' && (
                <g transform="translate(20, -10)">
                  <rect width="90" height="20" rx="6" fill="#f59e0b" />
                  <text x="45" y="14" textAnchor="middle" fill="#000000" className="text-[9px] font-mono font-black">
                    VOLTANDO ATRÁS ↺
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        {/* 3 Step Explanatory Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className={`p-2.5 rounded-xl border ${step <= 1 ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
            <span className="font-bold block">1. Rascunho de Hipóteses</span>
            <span>A IA avalia dois caminhos lógicos sem responder no susto.</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${step >= 2 && step <= 3 ? 'border-rose-500/50 bg-rose-500/10 text-rose-200' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
            <span className="font-bold block">2. Descarte de Erros</span>
            <span>Caminhos que quebram são podados; o robô volta atrás e tenta outra rota.</span>
          </div>
          <div className={`p-2.5 rounded-xl border ${step >= 4 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
            <span className="font-bold block">3. Caminho da Vitória</span>
            <span>A resposta ótima é entregue limpa após validação cuidadosa de cada passo.</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Como Funciona: O raciocínio passo a passo impede a IA de alucinar respostas impulsivas.</span>
        </div>
        <span className="text-slate-500">Pressione [Espaço] para avançar o passo do robô</span>
      </div>
    </div>
  );
};
