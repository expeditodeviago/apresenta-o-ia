// src/components/Games/Level5_AgentTycoon.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
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
} from 'lucide-react';

interface BugItem {
  id: number;
  x: number;
  y: number;
}

export const Level5_AgentTycoon: React.FC = () => {
  const { addScore } = useGameStore();

  const [progress, setProgress] = useState<number>(20);
  const [bugs, setBugs] = useState<BugItem[]>([
    { id: 1, x: 22, y: 30 },
    { id: 2, x: 74, y: 35 },
    { id: 3, x: 50, y: 65 },
  ]);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [showBuiltApp, setShowBuiltApp] = useState<boolean>(false);
  const [clickerCount, setClickerCount] = useState<number>(0);

  // Status badges dinâmicos para os 3 avatares
  const [agentStatuses, setAgentStatuses] = useState({
    architect: 'Planejando arquitetura...',
    coder: 'Aguardando especificações...',
    tester: 'Preparando suite Playwright...',
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoRunning && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(100, prev + 12);
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
          } else if (next > 60) {
            setAgentStatuses({
              architect: 'Validando requisitos',
              coder: 'Refatorando código',
              tester: 'Executando testes E2E...',
            });
          } else {
            setAgentStatuses({
              architect: 'Decompondo tarefas',
              coder: 'Escrevendo componentes React',
              tester: 'Monitorando erros...',
            });
          }
          return next;
        });

        // Elimina bug durante o ciclo automático
        setBugs((prev) => {
          if (prev.length > 0) {
            arcadeAudio.playSquashBug();
            addScore(40);
            return prev.slice(1);
          }
          return prev;
        });
      }, 600);
    }
    return () => clearInterval(timer);
  }, [isAutoRunning, progress, addScore]);

  const handleSquashBug = (id: number) => {
    setBugs((prev) => prev.filter((b) => b.id !== id));
    arcadeAudio.playSquashBug();
    addScore(50);
    setProgress((prev) => Math.min(100, prev + 5));
  };

  const handleStartAutoPlay = () => {
    setIsAutoRunning(true);
    arcadeAudio.playClick();
  };

  const handleReset = () => {
    setProgress(20);
    setBugs([
      { id: Date.now() + 1, x: 25, y: 35 },
      { id: Date.now() + 2, x: 70, y: 40 },
      { id: Date.now() + 3, x: 48, y: 60 },
    ]);
    setIsAutoRunning(false);
    setShowBuiltApp(false);
    setClickerCount(0);
    setAgentStatuses({
      architect: 'Planejando arquitetura...',
      coder: 'Aguardando especificações...',
      tester: 'Preparando suite Playwright...',
    });
    arcadeAudio.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 07 • AGENTES AUTÔNOMOS & CICLO REACT
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              O Enxame de Agentes & O Ciclo ReAct
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Reason ➔ Act ➔ Observe: Como equipes de agentes constroem software e corrigem os próprios bugs.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleStartAutoPlay}
            disabled={isAutoRunning || progress >= 100}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Acelerar agentes automaticamente"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoRunning ? 'Agentes em Ação...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🏢 CONTAINER DO PROJETO & PROGRESSO */}
        <div className="w-full p-6 rounded-xl bg-zinc-950/60 border border-zinc-800/70 relative overflow-hidden flex flex-col justify-between">
          {/* Barra de Progresso */}
          <div className="space-y-1.5 mb-6">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                <Laptop className="w-3.5 h-3.5 text-blue-400" />
                <span>Status da Construção do Software</span>
              </span>
              <span className="font-mono font-bold text-blue-400">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Os 3 Avatares Minimalistas com Badges de Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Avatar 1: Arquiteto */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                📐
              </div>
              <h4 className="font-bold text-white text-sm">Arquiteto</h4>
              <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                {agentStatuses.architect}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Decompõe requisitos em tarefas atômicas e contratos de API.
              </p>
            </div>

            {/* Avatar 2: Coder */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                💻
              </div>
              <h4 className="font-bold text-white text-sm">Coder</h4>
              <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                {agentStatuses.coder}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Escreve a lógica, integra dependências e manuseia arquivos.
              </p>
            </div>

            {/* Avatar 3: Tester */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                🧪
              </div>
              <h4 className="font-bold text-white text-sm">Tester</h4>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {agentStatuses.tester}
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Roda testes automatizados e orienta a auto-correção de falhas.
              </p>
            </div>

            {/* Bugs Clicáveis */}
            {bugs.map((bug) => (
              <motion.button
                key={bug.id}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                onClick={() => handleSquashBug(bug.id)}
                style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
                className="absolute z-20 p-2 rounded-full bg-rose-500 text-white shadow-lg border border-white/20 cursor-pointer active:scale-90 transition-transform"
                title="Clique para eliminar o bug manualmente (+50 score)"
              >
                <Bug className="w-4 h-4" />
              </motion.button>
            ))}
          </div>

          {/* Mini-App Gerado na Conclusão */}
          <AnimatePresence>
            {showBuiltApp && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 p-6 flex flex-col items-center justify-center space-y-4 text-center"
              >
                <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCheck className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Software Entregue pelos Agentes</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    O app interativo abaixo foi planejado, codificado e validado de forma autônoma:
                  </p>
                </div>

                {/* Mini App Widget */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 w-full max-w-xs flex flex-col items-center space-y-2.5">
                  <span className="text-xs font-mono text-zinc-400">Contador Reativo Interativo</span>
                  <span className="text-3xl font-mono font-bold text-blue-400">{clickerCount}</span>
                  <button
                    onClick={() => {
                      setClickerCount((c) => c + 1);
                      arcadeAudio.playClick();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
                  >
                    Incrementar Contador
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Simulação
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span>
            💡 <strong>Loop ReAct:</strong> O tester lê a mensagem de erro no terminal e o coder reescreve o código sozinho até o teste passar.
          </span>
          <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-2">+400 Score</span>
        </div>
      </div>
    </div>
  );
};
