// src/components/Games/Level3_MazeRunner.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  Terminal,
  AlertCircle,
  CornerDownRight,
} from 'lucide-react';

const MAZE_GRID = [
  [0, 0, 1, 0, 3],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 2, 1],
  [0, 0, 0, 0, 0],
];

interface Position {
  r: number;
  c: number;
}

export const Level3_MazeRunner: React.FC = () => {
  const { addScore } = useGameStore();
  const [robotPos, setRobotPos] = useState<Position>({ r: 4, c: 0 });
  const [visitedPath, setVisitedPath] = useState<Position[]>([{ r: 4, c: 0 }]);
  const [deadEndReached, setDeadEndReached] = useState<Position | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [thinkLogs, setThinkLogs] = useState<string[]>([
    '<think>',
    'Mapeando o grafo de estados e hipóteses de busca...',
    'Estratégia: Árvore de Decisão Reflexiva com Test-Time Compute.',
  ]);

  const runAutoReasoning = async () => {
    if (isSolving) return;
    setIsSolving(true);
    setIsWon(false);
    setDeadEndReached(null);
    setRobotPos({ r: 4, c: 0 });
    setVisitedPath([{ r: 4, c: 0 }]);

    setThinkLogs([
      '<think>',
      'Iniciando exploração estruturada do labirinto...',
      'Avaliando caminhos candidatos a partir de (4,0)...',
    ]);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Passo 1: Avança para a direita
    await sleep(350);
    setRobotPos({ r: 4, c: 1 });
    setVisitedPath((p) => [...p, { r: 4, c: 1 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 4, c: 2 });
    setVisitedPath((p) => [...p, { r: 4, c: 2 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 4, c: 3 });
    setVisitedPath((p) => [...p, { r: 4, c: 3 }]);
    arcadeAudio.playClick();
    setThinkLogs((l) => [...l, 'Bifurcação identificada em (4,3). Hipótese A: Norte.']);

    // Passo 2: Entra no beco sem saída em (3,3)
    await sleep(450);
    setRobotPos({ r: 3, c: 3 });
    setVisitedPath((p) => [...p, { r: 3, c: 3 }]);
    setDeadEndReached({ r: 3, c: 3 });
    arcadeAudio.playDeadEnd();
    setThinkLogs((l) => [
      ...l,
      '⚠ Beco sem saída em (3,3): Hipótese A inválida.',
      'Executando BACKTRACKING: Retornando ao ponto de decisão anterior...',
    ]);

    // Passo 3: Backtracking
    await sleep(550);
    arcadeAudio.playBacktrack();
    setRobotPos({ r: 4, c: 3 });
    setDeadEndReached(null);

    // Passo 4: Caminho alternativo
    await sleep(350);
    setRobotPos({ r: 4, c: 4 });
    setVisitedPath((p) => [...p, { r: 4, c: 4 }]);
    arcadeAudio.playClick();
    setThinkLogs((l) => [...l, 'Explorando Hipótese B (Leste / Norte)...']);

    await sleep(350);
    setRobotPos({ r: 2, c: 3 });
    setVisitedPath((p) => [...p, { r: 2, c: 3 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 1, c: 3 });
    setVisitedPath((p) => [...p, { r: 1, c: 3 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 0, c: 3 });
    setVisitedPath((p) => [...p, { r: 0, c: 3 }]);
    arcadeAudio.playClick();

    // Vitória
    await sleep(450);
    setRobotPos({ r: 0, c: 4 });
    setVisitedPath((p) => [...p, { r: 0, c: 4 }]);
    setIsWon(true);
    arcadeAudio.playVictoryFanfare();
    fireStarBurst(0.5, 0.4);
    addScore(250);

    setThinkLogs((l) => [
      ...l,
      '✓ SOLUÇÃO VALIDADA: Troféu alcançado em (0,4)!',
      '</think>',
      'Resposta Final: O caminho ótimo foi confirmado após auto-correção.',
    ]);

    setIsSolving(false);
  };

  const handleReset = () => {
    setRobotPos({ r: 4, c: 0 });
    setVisitedPath([{ r: 4, c: 0 }]);
    setDeadEndReached(null);
    setIsWon(false);
    setIsSolving(false);
    setThinkLogs(['<think>', 'Labirinto redefinido. Pronto para raciocinar.']);
    arcadeAudio.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 04 • RACIOCÍNIO PROFUNDO & BACKTRACKING
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Árvores de Raciocínio & A Tag &lt;think&gt;
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Modelos como DeepSeek-R1 e OpenAI o1 testam hipóteses e dão meia-volta ao encontrar becos sem saída.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={runAutoReasoning}
            disabled={isSolving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Executar raciocínio e demonstração automática"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            <span>{isSolving ? 'Raciocinando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🧩 ÁREA: GRID MINIMALISTA + TERMINAL DE REFLEXÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Tabuleiro Minimalista */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-5 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
            <div className="grid grid-cols-5 gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              {MAZE_GRID.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isRobot = robotPos.r === rIdx && robotPos.c === cIdx;
                  const isWall = cell === 1;
                  const isTrophy = cell === 3;
                  const isDeadEnd = deadEndReached?.r === rIdx && deadEndReached?.c === cIdx;
                  const isVisited = visitedPath.some((p) => p.r === rIdx && p.c === cIdx);

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center relative transition-all duration-200 ${
                        isWall
                          ? 'bg-zinc-800/80 border border-zinc-700/60'
                          : isDeadEnd
                          ? 'bg-rose-500/20 border border-rose-500/60'
                          : isWon && isVisited
                          ? 'bg-emerald-500/20 border border-emerald-500/40'
                          : isVisited
                          ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'bg-zinc-950/40 border border-zinc-800/60'
                      }`}
                    >
                      {/* Parede */}
                      {isWall && <div className="w-3 h-1 bg-zinc-600 rounded" />}

                      {/* Troféu */}
                      {isTrophy && !isRobot && (
                        <Trophy className="w-5 h-5 text-amber-400 drop-shadow" />
                      )}

                      {/* Alerta de beco sem saída */}
                      {isDeadEnd && (
                        <AlertCircle className="w-6 h-6 text-rose-400 animate-pulse" />
                      )}

                      {/* Robô Vetorial Estilizado em SVG */}
                      {isRobot && (
                        <motion.div
                          layoutId="clean-robot"
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-md ${
                            isWon
                              ? 'bg-emerald-500 text-zinc-950'
                              : isDeadEnd
                              ? 'bg-rose-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <circle cx="12" cy="5" r="2" />
                            <path d="M12 7v4" />
                            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
                            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all text-xs font-mono flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Posição</span>
              </button>
            </div>
          </div>

          {/* Terminal de Reflexão */}
          <div className="lg:col-span-6 h-[300px] p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-zinc-400">
              <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                <span>Monólogo de Raciocínio em Tempo Real</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                Test-Time Compute
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin text-zinc-300 leading-relaxed">
              {thinkLogs.map((log, idx) => {
                const isTag = log === '<think>' || log === '</think>';
                const isError = log.includes('Beco sem saída') || log.includes('BACKTRACKING');
                const isSuccess = log.includes('SOLUÇÃO') || log.includes('Resposta Final');

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-1.5 ${
                      isTag
                        ? 'text-blue-400 font-bold'
                        : isError
                        ? 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded'
                        : isSuccess
                        ? 'text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded'
                        : 'text-zinc-300'
                    }`}
                  >
                    <CornerDownRight className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-500 flex items-center justify-between">
              <span>DeepSeek-R1 • OpenAI o1</span>
              <span className="text-blue-400 font-medium">+250 Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
