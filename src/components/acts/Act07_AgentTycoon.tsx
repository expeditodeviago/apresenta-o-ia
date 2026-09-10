// src/components/acts/Act07_AgentTycoon.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Users,
  Bug,
  Sparkles,
  Play,
  RotateCcw,
  CheckCheck,
  Laptop,
  Layers,
  Terminal,
  Activity,
  Zap,
  ShieldCheck,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface BugItem {
  id: number;
  label: string;
  x: number;
  y: number;
}

export const Act07_AgentTycoon: React.FC = () => {
  const { addScore } = usePresentationStore();

  const [progress, setProgress] = useState<number>(20);
  const [bugs, setBugs] = useState<BugItem[]>([
    { id: 1, label: 'NullPointerException #42', x: 25, y: 35 },
    { id: 2, label: 'Race Condition (API)', x: 72, y: 40 },
    { id: 3, label: 'CSS Overflow Mobile', x: 48, y: 65 },
  ]);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [showBuiltApp, setShowBuiltApp] = useState<boolean>(false);
  const [clickerCount, setClickerCount] = useState<number>(0);
  const [activePacket, setActivePacket] = useState<'arch-to-code' | 'code-to-test' | 'test-to-arch' | null>('arch-to-code');

  // Status dos 3 Agentes
  const [agentStatuses, setAgentStatuses] = useState({
    architect: 'Planejando arquitetura & schema...',
    coder: 'Aguardando especificações do Arquiteto...',
    tester: 'Preparando suite Playwright E2E...',
  });

  // Ciclo do Swarm
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoRunning && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(100, prev + 14);
          if (next >= 100) {
            setIsAutoRunning(false);
            setShowBuiltApp(true);
            arcadeAudio.playVictoryFanfare();
            fireStarBurst(0.5, 0.4);
            addScore(400);
            setAgentStatuses({
              architect: 'Specs finalizadas ✓',
              coder: 'Deploy concluído ✓',
              tester: '100% dos testes aprovados ✓',
            });
            setActivePacket(null);
          } else if (next > 65) {
            setActivePacket('test-to-arch');
            setAgentStatuses({
              architect: 'Validando requisitos de entrega...',
              coder: 'Refatorando warnings de TypeScript...',
              tester: 'Executando testes E2E Playwright (2ms)...',
            });
          } else if (next > 35) {
            setActivePacket('code-to-test');
            setAgentStatuses({
              architect: 'Decompondo tarefas em PRDs...',
              coder: 'Escrevendo componentes React & API routes...',
              tester: 'Verificando regressões nos endpoints...',
            });
          } else {
            setActivePacket('arch-to-code');
            setAgentStatuses({
              architect: 'Criando mapa de dependências...',
              coder: 'Indexando contexto do repositório...',
              tester: 'Aguardando primeiro build...',
            });
          }
          return next;
        });

        // Elimina bugs gradualmente
        setBugs((prev) => {
          if (prev.length > 0) {
            arcadeAudio.playSquashBug();
            addScore(50);
            return prev.slice(1);
          }
          return prev;
        });
      }, 750);
    }
    return () => clearInterval(timer);
  }, [isAutoRunning, progress, addScore]);

  const handleSquashBug = (id: number) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
    arcadeAudio.playSquashBug();
    addScore(60);
    setProgress((prev) => Math.min(100, prev + 8));
  };

  const handleStartAutoPlay = () => {
    if (isAutoRunning) return;
    if (progress >= 100) {
      handleReset();
    }
    setIsAutoRunning(true);
    arcadeAudio.playClick();
  };

  const handleReset = () => {
    setProgress(15);
    setBugs([
      { id: 1, label: 'NullPointerException #42', x: 25, y: 35 },
      { id: 2, label: 'Race Condition (API)', x: 72, y: 40 },
      { id: 3, label: 'CSS Overflow Mobile', x: 48, y: 65 },
    ]);
    setShowBuiltApp(false);
    setIsAutoRunning(false);
    setAgentStatuses({
      architect: 'Planejando arquitetura & schema...',
      coder: 'Aguardando especificações do Arquiteto...',
      tester: 'Preparando suite Playwright E2E...',
    });
    setActivePacket('arch-to-code');
    arcadeAudio.playClick();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl rounded-3xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
              ATO 07 • AGENTES AUTÔNOMOS & SWARM INTELLIGENCE
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Agent Swarm Tycoon: O Escritório Autônomo</span>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Três agentes com papéis especializados cooperando em alta frequência: planejamento, codificação e testes automatizados.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartAutoPlay}
              disabled={isAutoRunning}
              className="tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400/40 text-xs font-semibold text-emerald-200 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              title="Iniciar simulação do enxame de agentes"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
              <span>{isAutoRunning ? 'Agentes Trabalhando...' : 'Criar App do Zero [▶]'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
              title="Resetar Simulação"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 📊 BARRA DE PROGRESSO DO PIPELINE */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
            <span className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pipeline de Engenharia Autônoma:
            </span>
            <span className="text-emerald-400 font-bold">{progress}% Concluído</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950/80 border border-white/10 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-400 shadow-lg shadow-emerald-500/20"
              initial={{ width: '15%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 🏢 O ESCRITÓRIO ISOMÉTRICO DOS 3 AGENTES */}
        <div className="relative w-full min-h-[300px] rounded-2xl liquid-glass-subtle border border-white/10 bg-slate-950/70 p-6 flex flex-col justify-between overflow-hidden">
          {/* SVG de Transferência de Pacotes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Linha Arquiteto -> Coder */}
            <line x1="22%" y1="50%" x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.4" />
            {/* Linha Coder -> Tester */}
            <line x1="50%" y1="50%" x2="78%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.4" />
          </svg>

          {/* Os 3 Agentes Especializados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* 1. O ARQUITETO */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="p-4 rounded-2xl liquid-glass border border-cyan-500/30 bg-slate-900/80 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-lg">
                    🏛️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Agente Arquiteto</div>
                    <div className="text-[10px] font-mono text-cyan-400">Spec & Decomposição</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-[11px] text-zinc-300 min-h-[44px]">
                {agentStatuses.architect}
              </div>
            </motion.div>

            {/* 2. O CODER (ENGENHEIRO) */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
              className="p-4 rounded-2xl liquid-glass border border-amber-500/30 bg-slate-900/80 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Agente Engenheiro</div>
                    <div className="text-[10px] font-mono text-amber-400">Full-Stack Synthesis</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-[11px] text-zinc-300 min-h-[44px]">
                {agentStatuses.coder}
              </div>
            </motion.div>

            {/* 3. O TESTER (QA E2E) */}
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 2 }}
              className="p-4 rounded-2xl liquid-glass border border-emerald-500/30 bg-slate-900/80 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold text-lg">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Agente QA Tester</div>
                    <div className="text-[10px] font-mono text-emerald-400">Playwright & Heurísticas</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-[11px] text-zinc-300 min-h-[44px]">
                {agentStatuses.tester}
              </div>
            </motion.div>
          </div>

          {/* 🐞 BUGS FLUTUANTES (INTERATIVOS) */}
          <div className="relative w-full h-24 my-2">
            <AnimatePresence>
              {bugs.map((bug) => (
                <motion.button
                  key={bug.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSquashBug(bug.id)}
                  style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                  className="tactile-btn absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-xl shadow-rose-600/30 border border-rose-400/60 cursor-pointer z-20"
                >
                  <Bug className="w-3.5 h-3.5 animate-bounce" />
                  <span>{bug.label}</span>
                  <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded ml-1">Resolver [x]</span>
                </motion.button>
              ))}
            </AnimatePresence>

            {bugs.length === 0 && !showBuiltApp && (
              <div className="w-full h-full flex items-center justify-center text-xs font-mono text-emerald-400">
                ✓ Zero bugs pendentes. O Swarm está compilando o produto final...
              </div>
            )}
          </div>

          {/* 📱 MINI-APLICATIVO FUNCIONAL ENTREGUE PELOS AGENTES */}
          {showBuiltApp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-5 rounded-2xl liquid-glass border border-emerald-400/50 bg-slate-900/90 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Mini-App Entregue: "FocusFlow AI"</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Deploy 100% Funcional
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Construído autonomamente pelo Swarm em 12 segundos. Clique para interagir com o contador!
                  </p>
                </div>
              </div>

              {/* Widget Interativo para a Turma Clicar */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setClickerCount((prev) => prev + 1);
                    arcadeAudio.playClick();
                    addScore(25);
                  }}
                  className="tactile-btn px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg active:scale-95"
                >
                  🚀 Testar Cliques ({clickerCount})
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
