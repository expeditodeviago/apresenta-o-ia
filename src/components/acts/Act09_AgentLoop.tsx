import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, CheckCircle2, Terminal, Brain, Target, Wrench, Eye, Sparkles } from 'lucide-react';
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
  { id: 1, name: '1. Objetivo', role: 'Definição da Missão & Critérios de Aceite', icon: Target, x: 120, y: 170, color: '#0ea5e9' },
  { id: 2, name: '2. Planejador', role: 'Raciocínio & Decomposição em Etapas', icon: Brain, x: 380, y: 70, color: '#6366f1' },
  { id: 3, name: '3. Execução / Terminal', role: 'Acesso a Terminal, Arquivos & Git', icon: Wrench, x: 640, y: 170, color: '#f59e0b' },
  { id: 4, name: '4. Verificador Crítico', role: 'Inspeção de Resultados & Testes', icon: Eye, x: 380, y: 270, color: '#10b981' },
];

interface ExecutionLog {
  time: string;
  nodeId: number;
  message: string;
  type: 'info' | 'warn' | 'action' | 'success';
}

export const Act09_AgentLoop: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const SEQUENCE = [
    {
      nodeId: 1,
      message: '🎯 Objetivo recebido: "Construir botão animado de pagamento com validação e teste Playwright".',
      type: 'info' as const,
      delay: 1100,
    },
    {
      nodeId: 2,
      message: '🧠 Planejador: Decompondo em 3 passos: 1. JSX do botão, 2. Script de teste, 3. Execução no terminal.',
      type: 'info' as const,
      delay: 1300,
    },
    {
      nodeId: 3,
      message: '⚡ Terminal: Escrevendo src/components/PayButton.tsx e executando `npx playwright test`...',
      type: 'action' as const,
      delay: 1400,
    },
    {
      nodeId: 4,
      message: '👁️ Verificador: Falha no teste: "Esperado estado disabled={true} quando saldo insuficiente".',
      type: 'warn' as const,
      delay: 1500,
    },
    {
      nodeId: 2,
      message: '🧠 Planejador (Auto-Correção): Reescrevendo lógica de bloqueio condicional em PayButton.tsx.',
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
      message: '👁️ Verificador: 100% dos testes aprovados em 84ms! Zero regressões.',
      type: 'success' as const,
      delay: 1200,
    },
    {
      nodeId: 1,
      message: '✨ Tarefa entregue com perfeição pelo Agente Autônomo!',
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
      setIsRunning(false);
      setIsCompleted(true);
      setActiveNodeId(null);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0ea5e9', '#10b981', '#f59e0b', '#6366f1'],
        disableForReducedMotion: true,
      });
    }
  }, [isRunning, stepIndex]);

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ato 09 • Agentes de Ação Real
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-emerald-400" /> Paradigma ReAct (Reason + Act)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Enxame de Agentes Autônomos
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Do Chat Simples ao Loop Cibernético Fechado
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Um agente não é um chatbot que apenas dá conselhos: ele é um programa que <strong className="text-emerald-300">opera ferramentas reais, escreve código, roda testes e corrige os próprios erros</strong> sozinho.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={resetAgent}
            disabled={isRunning}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            title="Resetar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={runAgentTask}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs md:text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-slate-950'}`} />
            {isRunning ? 'Agente em Loop de Ação...' : 'Executar Tarefa do Agente'}
          </button>
        </div>
      </div>

      {/* Main Split: SVG Circuit & Live Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 flex-1 min-h-[380px]">
        {/* SVG Circuit Canvas */}
        <div className="lg:col-span-7 obsidian-glass rounded-2xl p-6 relative overflow-hidden flex items-center justify-center border border-slate-800">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:20px_20px]" />

          <svg viewBox="0 0 760 340" className="w-full h-full max-h-[340px] select-none">
            <defs>
              <linearGradient id="wire-pulse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Path 1 -> 2 */}
            <path d="M 170 170 C 230 170, 290 70, 330 70" fill="none" stroke="#334155" strokeWidth="3" />
            {/* Path 2 -> 3 */}
            <path d="M 430 70 C 470 70, 530 170, 590 170" fill="none" stroke="#334155" strokeWidth="3" />
            {/* Path 3 -> 4 */}
            <path d="M 590 170 C 530 170, 470 270, 430 270" fill="none" stroke="#334155" strokeWidth="3" />
            {/* Path 4 -> 2 (Self-correction feedback loop) */}
            <path d="M 330 270 C 290 270, 290 70, 330 70" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
            {/* Path 4 -> 1 (Completion) */}
            <path d="M 330 270 C 260 270, 200 210, 170 170" fill="none" stroke="#334155" strokeWidth="3" />

            {/* Animated Pulse when running */}
            {isRunning && (
              <motion.path
                d="M 170 170 C 230 170, 290 70, 330 70 M 430 70 C 470 70, 530 170, 590 170 M 590 170 C 530 170, 470 270, 430 270 M 330 270 C 290 270, 290 70, 330 70"
                fill="none"
                stroke="url(#wire-pulse)"
                strokeWidth="3.5"
                strokeDasharray="16 12"
                animate={{ strokeDashoffset: [-100, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            )}

            {/* Render Circuit Nodes */}
            {CIRCUIT_NODES.map((node) => {
              const isActive = activeNodeId === node.id;
              const IconComp = node.icon;

              return (
                <g key={node.id} className="cursor-pointer">
                  {isActive && (
                    <circle cx={node.x} cy={node.y} r="46" fill={node.color} fillOpacity="0.18" />
                  )}

                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="34"
                    fill="#0f172a"
                    stroke={isActive ? node.color : '#475569'}
                    strokeWidth={isActive ? '2.5' : '1.5'}
                    className="transition-colors duration-200"
                  />

                  <foreignObject x={node.x - 16} y={node.y - 16} width="32" height="32" className="pointer-events-none">
                    <div className="w-full h-full flex items-center justify-center">
                      <IconComp
                        className="w-5 h-5 transition-colors duration-200"
                        style={{ color: isActive ? node.color : '#94a3b8' }}
                      />
                    </div>
                  </foreignObject>

                  <text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    fill={isActive ? '#ffffff' : '#cbd5e1'}
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
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="sans-serif"
                  >
                    {node.role.slice(0, 24)}...
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
            <RotateCcw className="w-3 h-3 text-sky-400" />
            Loop de auto-correção iterativo
          </div>
        </div>

        {/* Live Terminal */}
        <div className="lg:col-span-5 bg-[#060911] border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-[#0d121f] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" /> agent-terminal.log
              </span>
            </div>
            {isCompleted && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Concluído
              </span>
            )}
          </div>

          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 scrollbar-thin max-h-[300px]">
            {logs.length === 0 ? (
              <div className="text-slate-600 italic py-12 text-center">
                Terminal ocioso. Clique em <span className="text-slate-300 font-semibold">[Executar Tarefa do Agente]</span> para assistir ao loop autônomo ao vivo.
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 select-none">{log.time}</span>
                  <span
                    className={`flex-1 ${
                      log.type === 'warn'
                        ? 'text-amber-400 font-medium'
                        : log.type === 'action'
                        ? 'text-sky-400'
                        : log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalBottomRef} />
          </div>

          <div className="px-4 py-2.5 bg-[#0a0f1b] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Iterações: {logs.filter((l) => l.nodeId === 2).length}</span>
            <span>Ações de Ferramentas: {logs.filter((l) => l.nodeId === 3).length}</span>
            <span>Status: {isRunning ? 'RODANDO' : isCompleted ? 'SUCESSO' : 'OCIOSO'}</span>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            A fronteira atual: <strong>"Dar para a IA o poder de testar seu próprio código antes de te responder é a diferença entre um brinquedo e uma ferramenta industrial."</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Engenharia Agêntica 2025+
        </span>
      </div>
    </div>
  );
};
