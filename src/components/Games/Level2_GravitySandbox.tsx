// src/components/Games/Level2_GravitySandbox.tsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Sparkles,
  Zap,
  Play,
  Compass,
  RefreshCw,
} from 'lucide-react';

interface WordBubble {
  id: string;
  word: string;
  category: 'animal' | 'royalty' | 'code' | 'food';
  clusterId: string;
  defaultX: number;
  defaultY: number;
  autoX: number;
  autoY: number;
  colorClass: string;
  borderClass: string;
}

const INITIAL_WORDS: WordBubble[] = [
  { id: '1', word: 'Cachorro', category: 'animal', clusterId: 'animals', defaultX: -160, defaultY: -70, autoX: -70, autoY: -70, colorClass: 'bg-amber-500/10 text-amber-200', borderClass: 'border-amber-500/30' },
  { id: '2', word: 'Lobo', category: 'animal', clusterId: 'animals', defaultX: -40, defaultY: -130, autoX: -30, autoY: -70, colorClass: 'bg-amber-500/10 text-amber-200', borderClass: 'border-amber-500/30' },
  { id: '3', word: 'Rei', category: 'royalty', clusterId: 'royalty', defaultX: 120, defaultY: -80, autoX: 80, autoY: -60, colorClass: 'bg-purple-500/10 text-purple-200', borderClass: 'border-purple-500/30' },
  { id: '4', word: 'Rainha', category: 'royalty', clusterId: 'royalty', defaultX: 180, defaultY: -20, autoX: 120, autoY: -60, colorClass: 'bg-purple-500/10 text-purple-200', borderClass: 'border-purple-500/30' },
  { id: '5', word: 'Código', category: 'code', clusterId: 'code', defaultX: -140, defaultY: 70, autoX: -70, autoY: 70, colorClass: 'bg-blue-500/10 text-blue-200', borderClass: 'border-blue-500/30' },
  { id: '6', word: 'Bug', category: 'code', clusterId: 'code', defaultX: -30, defaultY: 100, autoX: -20, autoY: 70, colorClass: 'bg-blue-500/10 text-blue-200', borderClass: 'border-blue-500/30' },
  { id: '7', word: 'Pizza', category: 'food', clusterId: 'food', defaultX: 150, defaultY: 80, autoX: 80, autoY: 70, colorClass: 'bg-rose-500/10 text-rose-200', borderClass: 'border-rose-500/30' },
  { id: '8', word: 'Hambúrguer', category: 'food', clusterId: 'food', defaultX: 70, defaultY: 120, autoX: 120, autoY: 70, colorClass: 'bg-rose-500/10 text-rose-200', borderClass: 'border-rose-500/30' },
];

export const Level2_GravitySandbox: React.FC = () => {
  const { addScore } = useGameStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const initial: Record<string, { x: number; y: number }> = {};
    INITIAL_WORDS.forEach((w) => {
      initial[w.id] = { x: w.defaultX, y: w.defaultY };
    });
    return initial;
  });

  const [connectedPairs, setConnectedPairs] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const checkProximity = (currentPositions: Record<string, { x: number; y: number }>) => {
    INITIAL_WORDS.forEach((w1) => {
      INITIAL_WORDS.forEach((w2) => {
        if (w1.id >= w2.id) return;

        const pos1 = currentPositions[w1.id] || { x: w1.defaultX, y: w1.defaultY };
        const pos2 = currentPositions[w2.id] || { x: w2.defaultX, y: w2.defaultY };

        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pairKey = `${w1.id}-${w2.id}`;

        if (dist < 90) {
          if (w1.category === w2.category && !connectedPairs.includes(pairKey)) {
            setConnectedPairs((prev) => (prev.includes(pairKey) ? prev : [...prev, pairKey]));
            arcadeAudio.playElectricAttract();
            fireStarBurst(0.5, 0.45);
            addScore(100);
            setFeedbackMessage(`Similaridade Semântica Cosseno: 0.94 entre "${w1.word}" e "${w2.word}".`);
          } else if (w1.category !== w2.category && dist < 65) {
            arcadeAudio.playRepelBounce();
            setFeedbackMessage(`Repulsão de Embeddings: "${w1.word}" e "${w2.word}" possuem baixa afinidade (0.12).`);
          }
        }
      });
    });
  };

  const handleDrag = (id: string, point: { x: number; y: number }) => {
    const updated = { ...positions, [id]: point };
    setPositions(updated);
    checkProximity(updated);
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    const autoTargetPositions: Record<string, { x: number; y: number }> = {};
    INITIAL_WORDS.forEach((w) => {
      autoTargetPositions[w.id] = { x: w.autoX, y: w.autoY };
    });

    setPositions(autoTargetPositions);

    setTimeout(() => {
      setConnectedPairs(['1-2', '3-4', '5-6', '7-8']);
      arcadeAudio.playElectricAttract();
      fireStarBurst(0.5, 0.45);
      addScore(250);
      setFeedbackMessage('Demonstração concluída: 4 clusters de afinidade semântica formados com sucesso!');
      setIsAutoPlaying(false);
    }, 600);
  };

  const handleReset = () => {
    const initial: Record<string, { x: number; y: number }> = {};
    INITIAL_WORDS.forEach((w) => {
      initial[w.id] = { x: w.defaultX, y: w.defaultY };
    });
    setPositions(initial);
    setConnectedPairs([]);
    setFeedbackMessage(null);
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
              FASE 02 • ESPAÇO SEMÂNTICO & VETORES
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              O Hiperespaço Magnético dos Embeddings
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Palavras com significados próximos compartilham coordenadas e se atraem; sentidos distantes se repelem.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática sem cliques manuais"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoPlaying ? 'Demonstrando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🌌 CAMPO VETORIAL (ESFERAS TRANSLÚCIDAS ELEGANTES) */}
        <div
          ref={containerRef}
          className="w-full h-[320px] sm:h-[350px] rounded-xl bg-zinc-950/60 border border-zinc-800/70 relative overflow-hidden flex items-center justify-center shadow-inner"
        >
          {/* Eixos Cartesianos Sutis */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-full h-px bg-zinc-600" />
            <div className="h-full w-px bg-zinc-600 absolute" />
          </div>

          <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 pointer-events-none">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Coordenadas de Similaridade Angular (Similaridade de Cosseno)</span>
          </div>

          {/* Linhas de conexão para pares conectados */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connectedPairs.map((pairKey) => {
              const [id1, id2] = pairKey.split('-');
              const p1 = positions[id1] || { x: 0, y: 0 };
              const p2 = positions[id2] || { x: 0, y: 0 };

              const cx = (containerRef.current?.clientWidth || 800) / 2;
              const cy = (containerRef.current?.clientHeight || 350) / 2;

              return (
                <g key={pairKey}>
                  <line
                    x1={cx + p1.x}
                    y1={cy + p1.y}
                    x2={cx + p2.x}
                    y2={cy + p2.y}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="opacity-80 animate-pulse"
                  />
                  <circle
                    cx={(cx + p1.x + cx + p2.x) / 2}
                    cy={(cy + p1.y + cy + p2.y) / 2}
                    r="4"
                    fill="#3b82f6"
                    className="animate-ping opacity-75"
                  />
                </g>
              );
            })}
          </svg>

          {/* Esferas Translúcidas Elegantes */}
          {INITIAL_WORDS.map((node) => {
            return (
              <motion.div
                key={node.id}
                drag
                dragConstraints={containerRef}
                dragElastic={0.15}
                onDrag={(_e, info) => {
                  handleDrag(node.id, {
                    x: (positions[node.id]?.x || node.defaultX) + info.delta.x,
                    y: (positions[node.id]?.y || node.defaultY) + info.delta.y,
                  });
                }}
                animate={{
                  x: positions[node.id]?.x || node.defaultX,
                  y: positions[node.id]?.y || node.defaultY,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={{ scale: 1.08, cursor: 'grab' }}
                whileTap={{ scale: 0.96, cursor: 'grabbing' }}
                className={`absolute px-4 py-2 rounded-full border backdrop-blur-md ${node.borderClass} ${node.colorClass} font-sans font-medium text-xs sm:text-sm shadow-lg flex items-center gap-2 z-10`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                <span>{node.word}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Feedback & Equação */}
        <div className="w-full space-y-2">
          {feedbackMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
              <button
                onClick={handleReset}
                className="text-zinc-400 hover:text-white flex items-center gap-1 font-mono text-[11px] transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Redefinir
              </button>
            </motion.div>
          ) : (
            <div className="p-3 rounded-lg bg-zinc-950/40 border border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between">
              <span>
                💡 Aproxime palavras com significados similares (ex: <em>"Cachorro"</em> e <em>"Lobo"</em>) para acionar a atração.
              </span>
              <span className="font-mono text-blue-400 text-[11px]">+100 Score</span>
            </div>
          )}

          {/* Equação Semântica Elegante */}
          <div className="p-2.5 rounded-lg bg-zinc-950/30 border border-zinc-800/60 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500">Álgebra Vetorial Clássica:</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-medium">Vetor("Rei")</span>
            <span>-</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Vetor("Homem")</span>
            <span>+</span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Vetor("Mulher")</span>
            <span className="text-blue-400 font-bold">≈</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono font-bold">Vetor("Rainha")</span>
          </div>
        </div>
      </div>
    </div>
  );
};
