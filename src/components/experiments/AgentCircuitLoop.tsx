import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, Terminal, Brain, Target, Wrench, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CircuitNode {
  id: number;
  name: string;
  role: string;
  icon: React.ElementType;
  x: number;
  y: number;
  color: string;
}

const CIRCUIT_NODES: CircuitNode[] = [
  { id: 1, name: '1. Objetivo', role: 'Definição da Missão & Critérios de Aceite', icon: Target, x: 120, y: 180, color: '#38bdf8' },
  { id: 2, name: '2. Cérebro / Planejador', role: 'Raciocínio, Chain-of-Thought & Decomposição', icon: Brain, x: 380, y: 80, color: '#a855f7' },
  { id: 3, name: '3. Execução & Ferramentas', role: 'Acesso a Terminal, Arquivos, Web & APIs', icon: Wrench, x: 640, y: 180, color: '#f59e0b' },
  { id: 4, name: '4. Verificação Visual', role: 'Inspeção de Resultados, Testes & Feedback', icon: Eye, x: 380, y: 280, color: '#10b981' },
];

interface ExecutionLog {
  time: string;
  nodeId: number;
  message: string;
  type: 'info' | 'warn' | 'action' | 'success';
}

export const AgentCircuitLoop: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Scripted agent execution sequence simulating real AI loop: Plan -> Code -> Fail test -> Self-correct -> Pass
  const SEQUENCE = [
    {
      nodeId: 1,
      message: '🎯 Objetivo recebido: "Construir componente de checkout com validação e teste Playwright".',
      type: 'info' as const,
      delay: 1100,
    },
    {
      nodeId: 2,
      message: '🧠 Cérebro: Decompondo em 3 etapas: 1. Layout Tailwind, 2. Máscara de cartão, 3. Script de teste.',
      type: 'info' as const,
      delay: 1300,
    },
    {
      nodeId: 3,
      message: '⚡ Terminal: Escrevendo arquivo src/components/CheckoutModal.tsx e executando `npm test`...',
      type: 'action' as const,
      delay: 1400,
    },
    {
      nodeId: 4,
      message: '👁️ Verificação: Falha no teste unitário: "Esperado botão desabilitado quando input de cartão vazio".',
      type: 'warn' as const,
      delay: 1500,
    },
    {
      nodeId: 2,
      message: '🧠 Cérebro (Auto-correção): Ajustando lógica em CheckoutModal.tsx para `disabled={!cardNumber}`.',
      type: 'info' as const,
      delay: 1300,
    },
    {
      nodeId: 3,
      message: '⚡ Terminal: Re-executando `npx playwright test`...',
      type: 'action' as const,
      delay: 1400,
    },
    {
      nodeId: 4,
      message: '👁️ Verificação: Teste aprovado com sucesso em 142ms. Zero regressões visuais.',
      type: 'success' as const,
      delay: 1200,
    },
    {
      nodeId: 1,
      message: '✨ Missão concluída com excelência pelo Agente Autônomo!',
      type: 'success' as const,
      delay: 800,
    },
  ];

  const runAgentTask = () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCompleted(false);
    setStepIndex(0);
    setLogs([]);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (stepIndex < SEQUENCE.length) {
      const current = SEQUENCE[stepIndex];
      setActiveNodeId(current.nodeId);

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setLogs((prev) => [
        ...prev,
        {
          time: timeStr,
          nodeId: current.nodeId,
          message: current.message,
          type: current.type,
        },
      ]);

      const timer = setTimeout(() => {
        setStepIndex((s) => s + 1);
      }, current.delay);

      return () => clearTimeout(timer);
    } else {
      // Loop finished
      setIsRunning(false);
      setIsCompleted(true);
      setActiveNodeId(null);

      // Discrete celebratory confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
        disableForReducedMotion: true,
      });
    }
  }, [isRunning, stepIndex]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const resetAgent = () => {
    setIsRunning(false);
    setActiveNodeId(null);
    setStepIndex(0);
    setLogs([]);
    setIsCompleted(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Módulo 03 • Agentes Autônomos
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-zinc-400" /> Loop Cibernético Fechado
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            The Autonomous Agent Circuit
            <span className="text-sm font-normal text-zinc-400 hidden sm:inline">
              — Do Chat Simples ao Loop de Ação & Auto-Correção
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Um agente não apenas responde: ele <strong className="text-zinc-200">planeja, executa ferramentas reais</strong> e valida seu próprio trabalho em loop fechado até o objetivo ser atingido.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetAgent}
            disabled={isRunning}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
            title="Resetar Circuito"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={runAgentTask}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-zinc-950'}`} />
            {isRunning ? 'Agente em Execução...' : 'Executar Tarefa do Agente'}
          </button>
        </div>
      </div>

      {/* Main split view: Circuit Diagram & Live Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 flex-1 min-h-[400px]">
        {/* SVG Circuit Canvas */}
        <div className="lg:col-span-7 bg-[#0d0d10] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-center">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Animated Circuit Tracks */}
          <svg viewBox="0 0 760 360" className="w-full h-full max-h-[380px] select-none">
            <defs>
              <linearGradient id="wire-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>

              {/* Pulsing glow filter */}
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Circuit paths between nodes */}
            {/* 1 (Objetivo) -> 2 (Cérebro) */}
            <path
              d="M 170 180 C 230 180, 290 80, 330 80"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />
            {/* 2 (Cérebro) -> 3 (Execução) */}
            <path
              d="M 430 80 C 470 80, 530 180, 590 180"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />
            {/* 3 (Execução) -> 4 (Verificação) */}
            <path
              d="M 590 180 C 530 180, 470 280, 430 280"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />
            {/* 4 (Verificação) -> 2 (Loop de Auto-Correção) */}
            <path
              d="M 330 280 C 290 280, 290 80, 330 80"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            {/* 4 (Verificação) -> 1 (Conclusão do Objetivo) */}
            <path
              d="M 330 280 C 260 280, 200 220, 170 180"
              fill="none"
              stroke="#27272a"
              strokeWidth="3"
            />

            {/* Glowing active wire overlays when running */}
            {isRunning && (
              <>
                <motion.path
                  d="M 170 180 C 230 180, 290 80, 330 80 M 430 80 C 470 80, 530 180, 590 180 M 590 180 C 530 180, 470 280, 430 280 M 330 280 C 290 280, 290 80, 330 80"
                  fill="none"
                  stroke="url(#wire-glow)"
                  strokeWidth="3"
                  strokeDasharray="16 12"
                  animate={{ strokeDashoffset: [-100, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                />
              </>
            )}

            {/* Nodes Render */}
            {CIRCUIT_NODES.map((node) => {
              const isActive = activeNodeId === node.id;
              const IconComp = node.icon;

              return (
                <g key={node.id} className="cursor-pointer">
                  {/* Node Background Halo */}
                  {isActive && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="48"
                      fill={node.color}
                      fillOpacity="0.18"
                      filter="url(#glow-filter)"
                    />
                  )}

                  {/* Node Main Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="34"
                    fill="#141418"
                    stroke={isActive ? node.color : '#3f3f46'}
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    className="transition-colors duration-200"
                  />

                  {/* Inner Node Glow Icon */}
                  <foreignObject
                    x={node.x - 16}
                    y={node.y - 16}
                    width="32"
                    height="32"
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComp
                        className="w-5 h-5 transition-colors duration-200"
                        style={{ color: isActive ? node.color : '#a1a1aa' }}
                      />
                    </div>
                  </foreignObject>

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    fill={isActive ? '#fafafa' : '#a1a1aa'}
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.name}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 64}
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {node.role.slice(0, 24)}...
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Loop annotation badge */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <RotateCcw className="w-3 h-3 text-sky-400" />
            Loop de auto-correção iterativo
          </div>
        </div>

        {/* Live Terminal & Logs Section */}
        <div className="lg:col-span-5 bg-[#09090c] border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="px-4 py-3 bg-[#121215] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" /> agent-runtime.log
              </span>
            </div>
            {isCompleted && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
          </div>

          {/* Terminal Console Logs */}
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 scrollbar-thin max-h-[320px]">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic py-12 text-center">
                Terminal em espera. Clique em <span className="text-zinc-400 font-semibold">[Executar Tarefa do Agente]</span> para iniciar o ciclo autônomo.
              </div>
            ) : (
              logs.map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-zinc-600 select-none">{log.time}</span>
                  <span
                    className={`flex-1 ${
                      log.type === 'warn'
                        ? 'text-amber-400 font-medium'
                        : log.type === 'action'
                        ? 'text-sky-400'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : 'text-zinc-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </motion.div>
              ))
            )}
            <div ref={terminalBottomRef} />
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-4 py-2.5 bg-[#101013] border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Iterações: {logs.filter((l) => l.nodeId === 2).length}</span>
            <span>Ações de Ferramentas: {logs.filter((l) => l.nodeId === 3).length}</span>
            <span>Status: {isRunning ? 'RODANDO' : isCompleted ? 'SUCESSO' : 'OCIOSO'}</span>
          </div>
        </div>
      </div>

      {/* Footer explanation */}
      <div className="bg-[#141417] border border-zinc-800/80 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            Diferença crucial: Chatbots comuns apenas conversam; <strong>Agentes executam ferramentas, testam seu próprio código e se auto-corrigem sozinhos</strong>.
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500 whitespace-nowrap">
          Paradigma ReAct • Reason + Act
        </span>
      </div>
    </div>
  );
};
