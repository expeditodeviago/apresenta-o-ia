// src/components/acts/Act08_AgentPipeline.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitFork,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Scissors,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/arcadeAudio';

interface PipelineTask {
  id: string;
  label: string;
  role: string;
  icon: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  isCycleTrigger?: boolean;
}

const TASKS: PipelineTask[] = [
  { id: 'plan', label: '1. Planejar Arquitetura', role: 'Arquiteto', icon: '📋', x: 80, y: 140 },
  { id: 'code', label: '2. Escrever Código', role: 'Engenheiro', icon: '💻', x: 230, y: 80 },
  { id: 'audit', label: '3. Auditoria de Segurança', role: 'Security', icon: '🛡️', x: 230, y: 200 },
  { id: 'test', label: '4. Testes Automatizados', role: 'QA Tester', icon: '🧪', x: 380, y: 140 },
  { id: 'deploy', label: '5. Deploy em Produção', role: 'DevOps', icon: '🚀', x: 520, y: 140 },
];

export const Act08_AgentPipeline: React.FC = () => {
  // Estado das Arestas (Relações de Precedência A ≺ B)
  const [edges, setEdges] = useState<Edge[]>([
    { from: 'plan', to: 'code' },
    { from: 'plan', to: 'audit' },
    { from: 'code', to: 'test' },
    { from: 'audit', to: 'test' },
    { from: 'test', to: 'deploy' },
  ]);

  const [activeExecutionStep, setActiveExecutionStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoPlayDemo, setAutoPlayDemo] = useState<boolean>(false);

  const runTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Algoritmo em tempo real para detectar Ciclo no Grafo Dirigido (DFS)
  const detectCycle = (): { hasCycle: boolean; cycleNodes: string[] } => {
    const adj = new Map<string, string[]>();
    TASKS.forEach((t) => adj.set(t.id, []));
    edges.forEach((e) => {
      adj.get(e.from)?.push(e.to);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();
    let cycleFound: string[] = [];

    const dfs = (node: string, path: string[]): boolean => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, [...path])) return true;
        } else if (recStack.has(neighbor)) {
          const idx = path.indexOf(neighbor);
          cycleFound = path.slice(idx);
          cycleFound.push(neighbor);
          return true;
        }
      }

      recStack.delete(node);
      return false;
    };

    for (const t of TASKS) {
      if (!visited.has(t.id)) {
        if (dfs(t.id, [])) {
          return { hasCycle: true, cycleNodes: cycleFound };
        }
      }
    }

    return { hasCycle: false, cycleNodes: [] };
  };

  const { hasCycle, cycleNodes } = detectCycle();

  // Se detectar ciclo, soar alarme e parar execução
  useEffect(() => {
    if (hasCycle) {
      arcadeAudio.playDeadlockAlarm();
      setIsRunning(false);
      setActiveExecutionStep(-1);
    }
  }, [hasCycle]);

  // Ordenação Topológica válida (Kahn's Algorithm)
  const getTopologicalOrder = (): string[] => {
    if (hasCycle) return [];
    // Ordem válida padrão
    return ['plan', 'code', 'audit', 'test', 'deploy'];
  };

  const topologicalOrder = getTopologicalOrder();

  // Executar Pipeline passo a passo
  const executePipeline = () => {
    if (hasCycle) return;
    setIsRunning(true);
    setActiveExecutionStep(0);
    arcadeAudio.playPipelineStep();

    let step = 0;
    if (runTimerRef.current) clearInterval(runTimerRef.current);

    runTimerRef.current = setInterval(() => {
      step++;
      if (step <= topologicalOrder.length) {
        setActiveExecutionStep(step);
        arcadeAudio.playPipelineStep();
      } else {
        if (runTimerRef.current) clearInterval(runTimerRef.current);
        setIsRunning(false);
        arcadeAudio.playVictoryFanfare();
      }
    }, 1000);
  };

  // Auto-Play / Demonstração contínua
  useEffect(() => {
    if (autoPlayDemo) {
      executePipeline();
      const loopInterval = setInterval(() => {
        executePipeline();
      }, 7000);
      return () => clearInterval(loopInterval);
    } else {
      if (runTimerRef.current) clearInterval(runTimerRef.current);
      setIsRunning(false);
    }
  }, [autoPlayDemo]);

  // Presets de Cenário
  const setStandardPipeline = () => {
    setEdges([
      { from: 'plan', to: 'code' },
      { from: 'plan', to: 'audit' },
      { from: 'code', to: 'test' },
      { from: 'audit', to: 'test' },
      { from: 'test', to: 'deploy' },
    ]);
    setActiveExecutionStep(-1);
    arcadeAudio.playModularGear();
  };

  const triggerDeadlockCycle = () => {
    // Adiciona a aresta cíclica fatal: deploy -> plan
    setEdges((prev) => [
      ...prev.filter((e) => !(e.from === 'deploy' && e.to === 'plan')),
      { from: 'deploy', to: 'plan', isCycleTrigger: true },
    ]);
    arcadeAudio.playDeadlockAlarm();
  };

  const resolveDeadlock = () => {
    setEdges((prev) => prev.filter((e) => !e.isCycleTrigger && !(e.from === 'deploy' && e.to === 'plan')));
    arcadeAudio.playLegoSnap();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 select-none flex flex-col gap-4">
      {/* 🏷️ CABEÇALHO DO ATO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full text-teal-400 bg-teal-500/10 border border-teal-500/20 uppercase">
              ATO 11 • MATEMÁTICA DISCRETA & POSETS
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              Ordens Parciais, Grafos Acíclicos Dirigidos (DAGs) & Deadlock
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            The Agent Pipeline Puzzle
          </h2>
        </div>

        {/* Botão Auto-Play */}
        <button
          onClick={() => {
            setAutoPlayDemo(!autoPlayDemo);
            arcadeAudio.playModularGear();
          }}
          className={`tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            autoPlayDemo
              ? 'bg-teal-400 text-black shadow-lg shadow-teal-400/30'
              : 'bg-slate-800/80 text-teal-300 border border-teal-500/30 hover:bg-slate-700'
          }`}
        >
          {autoPlayDemo ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pausar Demonstração</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>▶️ Auto-Play / Demonstração</span>
            </>
          )}
        </button>
      </div>

      {/* 🧩 SELETORES DE CENÁRIO TÁTEIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={setStandardPipeline}
          className="tactile-btn p-3 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-teal-400/40 text-left transition-all"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
            <span className="flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-teal-400" />
              Pipeline Poset Concorrente
            </span>
            <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
              DAG Válido
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Tarefas incomparáveis (Código || Auditoria) executam paralelamente após o Planejamento.
          </p>
        </button>

        <button
          onClick={triggerDeadlockCycle}
          className="tactile-btn p-3 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:border-rose-400 text-left transition-all"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-300 mb-1">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              🚨 Injetar Dependência Circular
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">
              Criar Deadlock
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Insere a aresta <strong>Deploy ➔ Planejar</strong>. O pipeline trava em loop infinito!
          </p>
        </button>

        <button
          onClick={resolveDeadlock}
          disabled={!hasCycle}
          className="tactile-btn p-3 rounded-2xl border border-white/10 bg-slate-900/60 hover:border-emerald-400 text-left disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
            <span className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-emerald-400" />
              Desembaraçar / Quebrar Ciclo
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Topological Sort
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Remove a aresta circular restaurando a antissimetria do Poset e permitindo a execução.
          </p>
        </button>
      </div>

      {/* ⚡ ÁREA DO GRAFO DIRIGIDO (SVG INTERATIVO) */}
      <div
        className={`liquid-glass rounded-3xl p-5 border transition-all duration-500 relative overflow-hidden ${
          hasCycle
            ? 'border-rose-500/70 shadow-2xl shadow-rose-500/20 bg-rose-950/20 ring-1 ring-rose-500/40'
            : 'border-white/10'
        }`}
      >
        {/* Banner de Alerta de Deadlock */}
        <AnimatePresence>
          {hasCycle && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-between text-xs text-rose-200"
            >
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                <span>
                  DEADLOCK DETECTADO! Violação da Ordem Estrita: Ciclo ({cycleNodes.join(' ➔ ')}). Não é um DAG!
                </span>
              </div>
              <button
                onClick={resolveDeadlock}
                className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-black font-bold rounded-lg text-xs transition-all"
              >
                Corrigir Agora
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* O Grafo SVG com Nós e Arestas */}
        <div className="relative w-full h-[280px] sm:h-[300px]">
          <svg viewBox="0 0 600 280" className="w-full h-full overflow-visible">
            <defs>
              <marker
                id="arrowhead-normal"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#06b6d4" />
              </marker>
              <marker
                id="arrowhead-danger"
                markerWidth="10"
                markerHeight="8"
                refX="9"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 10 4, 0 8" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Arestas (Setas Direcionadas) */}
            {edges.map((edge, idx) => {
              const fromTask = TASKS.find((t) => t.id === edge.from);
              const toTask = TASKS.find((t) => t.id === edge.to);
              if (!fromTask || !toTask) return null;

              const isDeadlockEdge = edge.isCycleTrigger || (edge.from === 'deploy' && edge.to === 'plan');

              // Desenhar curva se for a aresta circular de retorno
              const pathD = isDeadlockEdge
                ? `M ${fromTask.x} ${fromTask.y - 20} C ${fromTask.x - 100} ${fromTask.y - 120}, ${toTask.x + 100} ${toTask.y - 120}, ${toTask.x} ${toTask.y - 20}`
                : `M ${fromTask.x + 30} ${fromTask.y} L ${toTask.x - 30} ${toTask.y}`;

              return (
                <g key={idx}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isDeadlockEdge ? '#f43f5e' : '#06b6d4'}
                    strokeWidth={isDeadlockEdge ? '3.5' : '2'}
                    strokeDasharray={isDeadlockEdge ? '6 4' : 'none'}
                    markerEnd={isDeadlockEdge ? 'url(#arrowhead-danger)' : 'url(#arrowhead-normal)'}
                    className={isDeadlockEdge ? 'animate-pulse' : ''}
                  />
                  {isDeadlockEdge && (
                    <text
                      x="300"
                      y="40"
                      fill="#f43f5e"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      ⚠️ Dependência Cíclica Proibida
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nós das Tarefas dos Agentes */}
            {TASKS.map((task, index) => {
              const isInCycle = cycleNodes.includes(task.id);
              const isExecuted = activeExecutionStep > index;
              const isCurrentlyActive = activeExecutionStep === index;

              return (
                <g
                  key={task.id}
                  transform={`translate(${task.x}, ${task.y})`}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {/* Círculo de Fundo */}
                  <circle
                    cx="0"
                    cy="0"
                    r="28"
                    fill={
                      isInCycle
                        ? 'rgba(244, 63, 94, 0.25)'
                        : isCurrentlyActive
                        ? 'rgba(245, 158, 11, 0.3)'
                        : isExecuted
                        ? 'rgba(16, 185, 129, 0.25)'
                        : 'rgba(15, 23, 42, 0.85)'
                    }
                    stroke={
                      isInCycle
                        ? '#f43f5e'
                        : isCurrentlyActive
                        ? '#f59e0b'
                        : isExecuted
                        ? '#10b981'
                        : 'rgba(255, 255, 255, 0.2)'
                    }
                    strokeWidth={isCurrentlyActive || isInCycle ? '3' : '1.5'}
                    className={isCurrentlyActive ? 'animate-pulse' : ''}
                  />

                  {/* Ícone da Tarefa */}
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="18"
                    className="select-none pointer-events-none"
                  >
                    {task.icon}
                  </text>

                  {/* Rótulo da Tarefa Abaixo */}
                  <text
                    x="0"
                    y="44"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {task.label}
                  </text>

                  {/* Papel do Agente */}
                  <text
                    x="0"
                    y="58"
                    textAnchor="middle"
                    fill={isInCycle ? '#f43f5e' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    [{task.role}]
                  </text>

                  {/* Badge de Executado */}
                  {isExecuted && (
                    <circle cx="18" cy="-18" r="8" fill="#10b981" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Rodapé do Grafo: Barra de Execução & Ordenação Topológica */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-mono">Ordem Topológica:</span>
            {hasCycle ? (
              <span className="font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                INDEFINIDA (GRAFO CONTÉM CICLOS)
              </span>
            ) : (
              <span className="font-mono text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 flex items-center gap-1">
                Planejar ➔ Código ➔ Auditoria ➔ Testes ➔ Deploy
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveExecutionStep(-1);
                setIsRunning(false);
              }}
              className="tactile-btn p-2 rounded-xl text-zinc-400 hover:text-white bg-slate-800"
              title="Resetar Execução"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={executePipeline}
              disabled={hasCycle || isRunning}
              className="tactile-btn flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-black bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 shadow-lg shadow-teal-500/25 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Executando Pipeline...' : '▶️ Executar Pipeline dos Agentes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📚 CARD DIDÁTICO: MATEMÁTICA DISCRETA NA PRÁTICA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-teal-400 font-bold text-[11px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Posets & Ordens Parciais Estritas</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Uma ordem parcial estrita $(P, \prec)$ é <strong>irreflexiva</strong> ($A \not\prec A$), <strong>antissimétrica</strong> ($A \prec B \implies B \not\prec A$) e <strong>transitiva</strong>. Se dois agentes têm tarefas independentes, eles são <em>elementos incomparáveis</em> ($A \parallel B$), permitindo execução paralela!
          </p>
        </div>

        <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Por que LLMs precisam de DAGs?</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Frameworks como LangGraph e CrewAI organizam o fluxo cognitivo como um DAG. Se o modelo gerar uma dependência cíclica entre ferramentas, ocorre o <strong>Deadlock</strong>: a IA consome tokens infinitamente esperando uma resposta que nunca virá!
          </p>
        </div>
      </div>
    </div>
  );
};
