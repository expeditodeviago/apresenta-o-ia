// src/components/acts/Act04_MazeRunner.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  Terminal,
  AlertCircle,
  Sparkles,
  Bot,
  CornerDownRight,
  Brain,
} from 'lucide-react';

interface Position {
  r: number;
  c: number;
}

// 0: Caminho Livre, 1: Parede de Vidro, 2: Beco Coral, 3: Troféu
const MAZE_GRID = [
  [0, 0, 1, 0, 3],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [0, 1, 1, 2, 1],
  [0, 0, 0, 0, 0],
];

export const Act04_MazeRunner: React.FC = () => {
  const { addScore } = usePresentationStore();
  const [robotPos, setRobotPos] = useState<Position>({ r: 4, c: 0 });
  const [visitedPath, setVisitedPath] = useState<Position[]>([{ r: 4, c: 0 }]);
  const [deadEndReached, setDeadEndReached] = useState<Position | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [robotMood, setRobotMood] = useState<'thinking' | 'alarm' | 'backtracking' | 'happy'>('thinking');
  const [thinkLogs, setThinkLogs] = useState<string[]>([
    '<think>',
    'Mapeando o grafo de estados do problema...',
    'Estratégia: Test-Time Compute com Árvore de Decisão Reflexiva.',
  ]);

  const runAutoReasoning = async () => {
    if (isSolving) return;
    setIsSolving(true);
    setIsWon(false);
    setDeadEndReached(null);
    setRobotPos({ r: 4, c: 0 });
    setVisitedPath([{ r: 4, c: 0 }]);
    setRobotMood('thinking');

    setThinkLogs([
      '<think>',
      'Iniciando exploração estruturada pelo espaço de hipóteses...',
      'Avaliando caminhos candidatos a partir de (4, 0)...',
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
    setThinkLogs((l) => [...l, 'Bifurcação identificada em (4, 3). Hipótese A: explorar ramo Norte.']);

    // Passo 2: Entra no beco sem saída em (3, 3)
    await sleep(450);
    setRobotPos({ r: 3, c: 3 });
    setVisitedPath((p) => [...p, { r: 3, c: 3 }]);
    setDeadEndReached({ r: 3, c: 3 });
    setRobotMood('alarm');
    arcadeAudio.playDeadEnd();
    setThinkLogs((l) => [
      ...l,
      '⚠ CONTRADIÇÃO / BECO SEM SAÍDA em (3, 3)!',
      'Hipótese A descartada: executando BACKTRACKING...',
    ]);

    // Passo 3: Backtracking
    await sleep(650);
    arcadeAudio.playBacktrack();
    setRobotMood('backtracking');
    setRobotPos({ r: 4, c: 3 });
    setDeadEndReached(null);

    // Passo 4: Caminho alternativo
    await sleep(400);
    setRobotPos({ r: 4, c: 4 });
    setVisitedPath((p) => [...p, { r: 4, c: 4 }]);
    setRobotMood('thinking');
    arcadeAudio.playClick();
    setThinkLogs((l) => [...l, 'Explorando Hipótese B (Leste -> Norte)...']);

    await sleep(350);
    setRobotPos({ r: 3, c: 4 }); // se livre
    setRobotPos({ r: 2, c: 3 });
    setVisitedPath((p) => [...p, { r: 2, c: 3 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 2, c: 1 });
    setVisitedPath((p) => [...p, { r: 2, c: 1 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 1, c: 1 });
    setVisitedPath((p) => [...p, { r: 1, c: 1 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 0, c: 1 });
    setVisitedPath((p) => [...p, { r: 0, c: 1 }]);
    arcadeAudio.playClick();

    await sleep(350);
    setRobotPos({ r: 0, c: 3 });
    setVisitedPath((p) => [...p, { r: 0, c: 3 }]);
    arcadeAudio.playClick();
    setThinkLogs((l) => [...l, 'Corredor final identificado: caminho livre até a meta.']);

    // Vitória!
    await sleep(400);
    setRobotPos({ r: 0, c: 4 });
    setVisitedPath((p) => [...p, { r: 0, c: 4 }]);
    setIsWon(true);
    setRobotMood('happy');
    arcadeAudio.playVictoryFanfare();
    fireStarBurst(0.5, 0.4);
    addScore(300);
    setThinkLogs((l) => [
      ...l,
      '✓ SOLUÇÃO VALIDADA COM SUCESSO!',
      '</think>',
      'Resposta final formulada com alta coerência.',
    ]);
    setIsSolving(false);
  };

  const handleReset = () => {
    setIsSolving(false);
    setIsWon(false);
    setDeadEndReached(null);
    setRobotPos({ r: 4, c: 0 });
    setVisitedPath([{ r: 4, c: 0 }]);
    setRobotMood('thinking');
    setThinkLogs([
      '<think>',
      'Labirinto resetado.',
      'Aguardando comando de raciocínio...',
    ]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider">
              <span>ATO 04</span>
              <span>•</span>
              <span>MAZE RUNNER: REASONING ROBOT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>A Jornada do Raciocínio, Backtracking & Tag &lt;think&gt;</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Veja o mascote Bit testar hipóteses lógicas, recuar ao encontrar contradições (backtracking) e encontrar a resposta certa.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isSolving}
              className="tactile-btn p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-40"
              title="Resetar labirinto"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={runAutoReasoning}
              disabled={isSolving}
              className="tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 disabled:opacity-50 active:scale-95 shrink-0"
              title="Executar raciocínio com backtracking"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSolving ? 'Raciocinando...' : '▶️ Auto-Play / Iniciar Raciocínio'}</span>
            </button>
          </div>
        </div>

        {/* 🤖 LABIRINTO 2D VIBRANTE & LOGS DO <think> */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* O Labirinto Grid 5x5 */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative p-4 rounded-3xl bg-slate-950/90 border border-white/15 shadow-2xl">
              {/* O Grid de Células */}
              <div className="grid grid-cols-5 gap-2.5">
                {MAZE_GRID.map((row, r) =>
                  row.map((cellType, c) => {
                    const isRobotHere = robotPos.r === r && robotPos.c === c;
                    const isVisited = visitedPath.some((p) => p.r === r && p.c === c);
                    const isDeadEnd = deadEndReached && deadEndReached.r === r && deadEndReached.c === c;
                    const isGoal = cellType === 3;
                    const isWall = cellType === 1;

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center relative transition-all duration-300 ${
                          isWall
                            ? 'bg-slate-900 border border-white/5 shadow-inner'
                            : isDeadEnd
                            ? 'bg-rose-500/30 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                            : isGoal
                            ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.4)]'
                            : isVisited
                            ? 'bg-emerald-500/20 border border-emerald-500/40 shadow-sm'
                            : 'bg-slate-900/60 border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Meta: Troféu de Ouro */}
                        {isGoal && (
                          <div className="flex flex-col items-center">
                            <Trophy className="w-6 h-6 text-amber-400 drop-shadow-md animate-bounce" />
                            <span className="text-[8px] font-mono font-bold text-amber-300">META</span>
                          </div>
                        )}

                        {/* Ponto de Início */}
                        {r === 4 && c === 0 && !isRobotHere && (
                          <span className="text-[9px] font-mono text-zinc-500 font-bold">INÍCIO</span>
                        )}

                        {/* Mascote "Bit" Animado */}
                        {isRobotHere && (
                          <motion.div
                            layoutId="robot"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: isWon ? 1.25 : 1 }}
                            className="relative flex flex-col items-center justify-center z-10"
                          >
                            {/* Halo Luminoso */}
                            <div
                              className={`absolute w-12 h-12 rounded-full blur-md ${
                                isWon
                                  ? 'bg-amber-400/60'
                                  : robotMood === 'alarm'
                                  ? 'bg-rose-500/60'
                                  : 'bg-emerald-400/40'
                              }`}
                            />

                            {/* Corpo SVG do Robô Bit */}
                            <div
                              className={`relative p-2 rounded-xl border-2 shadow-xl ${
                                isWon
                                  ? 'bg-amber-500 border-white text-slate-950'
                                  : robotMood === 'alarm'
                                  ? 'bg-rose-600 border-white text-white'
                                  : 'bg-emerald-600 border-emerald-300 text-white'
                              }`}
                            >
                              <Bot className="w-6 h-6" />
                            </div>

                            {/* Emoji de Expressão */}
                            <span className="text-[10px] font-bold mt-0.5">
                              {isWon ? '🏆 Venceu!' : robotMood === 'alarm' ? '😳 Beco!' : robotMood === 'backtracking' ? '🔄 Volta' : '🧐 Bit'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Terminal da Tag <think> (Test-Time Compute) */}
          <div className="lg:col-span-5 h-[340px] rounded-3xl bg-slate-950/95 border border-white/15 p-4 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <Brain className="w-4 h-4" />
                <span>FLUXO DE RACIOCÍNIO (&lt;think&gt;)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 font-bold">
                {isSolving ? 'ANALISANDO...' : isWon ? 'RESOLVIDO ✓' : 'STANDBY'}
              </span>
            </div>

            {/* Caixa de Logs com Rolagem Automática */}
            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {thinkLogs.map((log, idx) => {
                const isTag = log.startsWith('<think>') || log.startsWith('</think>');
                const isAlarm = log.includes('CONTRADIÇÃO') || log.includes('BECO');
                const isSuccess = log.includes('SOLUÇÃO VALIDADA');

                return (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      isTag
                        ? 'text-cyan-400 font-bold'
                        : isAlarm
                        ? 'text-rose-400 font-bold bg-rose-500/10 p-1 rounded'
                        : isSuccess
                        ? 'text-amber-400 font-bold bg-amber-500/10 p-1 rounded'
                        : 'text-zinc-300'
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>

            {/* Rodapé do Terminal */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Test-Time Compute: Ativo</span>
              <span className="text-emerald-400 font-bold">Backtracking O(1)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
