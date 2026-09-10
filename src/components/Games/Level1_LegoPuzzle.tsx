// src/components/Games/Level1_LegoPuzzle.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Sparkles,
  RefreshCw,
  Play,
  Cpu,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface LegoPiece {
  id: string;
  token: string;
  baseProb: number;
  colorClass: string;
  borderClass: string;
  studClass: string;
  textClass: string;
  description: string;
}

const PIECES: LegoPiece[] = [
  {
    id: 'dominar',
    token: 'dominar',
    baseProb: 45,
    colorClass: 'bg-blue-950/40 hover:bg-blue-900/50',
    borderClass: 'border-blue-500/50',
    studClass: 'bg-blue-500',
    textClass: 'text-blue-200',
    description: 'Previsão mais frequente em contextos de ficção científica e debates éticos.',
  },
  {
    id: 'ajudar',
    token: 'ajudar',
    baseProb: 35,
    colorClass: 'bg-emerald-950/40 hover:bg-emerald-900/50',
    borderClass: 'border-emerald-500/50',
    studClass: 'bg-emerald-500',
    textClass: 'text-emerald-200',
    description: 'Previsão positiva dominante em relatórios de produtividade e medicina.',
  },
  {
    id: 'programar',
    token: 'programar',
    baseProb: 18,
    colorClass: 'bg-amber-950/40 hover:bg-amber-900/50',
    borderClass: 'border-amber-500/50',
    studClass: 'bg-amber-500',
    textClass: 'text-amber-200',
    description: 'Alta densidade de probabilidade no ecossistema de software.',
  },
  {
    id: 'comer-pizza',
    token: 'comer pizza',
    baseProb: 2,
    colorClass: 'bg-rose-950/40 hover:bg-rose-900/50',
    borderClass: 'border-rose-500/50',
    studClass: 'bg-rose-500',
    textClass: 'text-rose-200',
    description: 'Token de cauda longa (baixa probabilidade). Emerge apenas com alta temperatura.',
  },
];

export const Level1_LegoPuzzle: React.FC = () => {
  const { addScore } = useGameStore();
  const [selectedPiece, setSelectedPiece] = useState<LegoPiece | null>(null);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [hasScored, setHasScored] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const calculateAdjustedProb = (baseProb: number) => {
    if (temperature <= 0.2) {
      return baseProb === 45 ? 94 : baseProb === 35 ? 5 : baseProb === 18 ? 1 : 0;
    }
    if (temperature >= 1.2) {
      return Math.round(25 + (baseProb - 25) * 0.35);
    }
    return baseProb;
  };

  const handleSnapPiece = (piece: LegoPiece) => {
    setSelectedPiece(piece);
    arcadeAudio.playLegoSnap();
    fireStarBurst(0.5, 0.4);

    if (!hasScored) {
      addScore(150);
      setHasScored(true);
    }
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    setSelectedPiece(null);

    // Passo 1: Ajusta a temperatura para 0.4
    setTemperature(0.4);
    arcadeAudio.playClick();

    // Passo 2: Encaixa a peça ótima "dominar" automaticamente
    setTimeout(() => {
      handleSnapPiece(PIECES[0]);
      setIsAutoPlaying(false);
    }, 600);
  };

  const handleReset = () => {
    setSelectedPiece(null);
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
              FASE 01 • TOKENIZAÇÃO & PROBABILIDADE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Como a IA quebra o texto em blocos de Lego
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              A cada passo, o modelo calcula a probabilidade matemática do próximo token mais provável.
            </p>
          </div>

          {/* Botão Auto-Play / Demonstração */}
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

        {/* 🧱 A ESTEIRA MINIMALISTA COM PEÇAS DE PLÁSTICO FOSCO */}
        <div className="w-full p-6 sm:p-8 rounded-xl bg-zinc-950/60 border border-zinc-800/70 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Esteira do Modelo de Linguagem (Next-Token Prediction)</span>
          </div>

          {/* Frase com Peças */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {/* Bloco 1: A */}
            <div className="relative px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-semibold text-sm sm:text-base shadow-sm">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-2 h-1 rounded-t bg-zinc-600" />
              </div>
              A
            </div>

            {/* Bloco 2: inteligência */}
            <div className="relative px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-semibold text-sm sm:text-base shadow-sm">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                <span className="w-2.5 h-1 rounded-t bg-zinc-600" />
                <span className="w-2.5 h-1 rounded-t bg-zinc-600" />
              </div>
              inteligência
            </div>

            {/* Bloco 3: artificial */}
            <div className="relative px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-semibold text-sm sm:text-base shadow-sm">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                <span className="w-2.5 h-1 rounded-t bg-zinc-600" />
                <span className="w-2.5 h-1 rounded-t bg-zinc-600" />
              </div>
              artificial
            </div>

            {/* Bloco 4: vai */}
            <div className="relative px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-semibold text-sm sm:text-base shadow-sm">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                <span className="w-2 h-1 rounded-t bg-zinc-600" />
              </div>
              vai
            </div>

            {/* 🎯 O SLOT VAGO / ENCAIXADO COM LINHA PONTILHADA ELEGANTE */}
            <div
              className={`relative min-w-[150px] h-[50px] rounded-xl flex items-center justify-center transition-all ${
                selectedPiece
                  ? 'border-transparent'
                  : 'border-2 border-dashed border-blue-500/50 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              }`}
            >
              <AnimatePresence mode="wait">
                {selectedPiece ? (
                  <motion.div
                    key={selectedPiece.id}
                    initial={{ scale: 0.8, y: -10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className={`relative px-4 py-2.5 rounded-lg border ${selectedPiece.borderClass} ${selectedPiece.colorClass} ${selectedPiece.textClass} font-mono font-bold text-sm sm:text-base shadow-md flex items-center gap-2`}
                  >
                    {/* Studs */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                      <span className={`w-2.5 h-1 rounded-t ${selectedPiece.studClass}`} />
                      <span className={`w-2.5 h-1 rounded-t ${selectedPiece.studClass}`} />
                    </div>
                    <span>{selectedPiece.token}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-black/40 font-mono text-zinc-300">
                      {calculateAdjustedProb(selectedPiece.baseProb)}%
                    </span>
                  </motion.div>
                ) : (
                  <span className="text-xs font-mono font-medium text-blue-400/80 flex items-center gap-1">
                    <span>[ Selecione um Bloco ]</span>
                  </span>
                )}
              </AnimatePresence>
            </div>

            <span className="text-xl font-bold text-zinc-600">.</span>
          </div>

          {/* Feedback didático */}
          {selectedPiece && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong>Token "{selectedPiece.token}":</strong> {selectedPiece.description}
              </span>
              <button
                onClick={handleReset}
                className="ml-2 text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] font-mono transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Trocar
              </button>
            </motion.div>
          )}
        </div>

        {/* 🧩 SELEÇÃO DOS BLOCOS (PLÁSTICO FOSCO LIMPO) */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Clique para testar o encaixe de cada token:</span>
            <span className="text-blue-400 font-mono font-medium">+150 Score</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PIECES.map((piece) => {
              const isSelected = selectedPiece?.id === piece.id;
              const currentProb = calculateAdjustedProb(piece.baseProb);

              return (
                <button
                  key={piece.id}
                  onClick={() => handleSnapPiece(piece)}
                  className={`relative p-3.5 rounded-xl border text-left transition-all active:scale-98 ${
                    isSelected
                      ? `${piece.borderClass} ${piece.colorClass} shadow-md ring-1 ring-white/10`
                      : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-mono font-semibold text-sm ${piece.textClass}`}>
                      {piece.token}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      {currentProb}%
                    </span>
                  </div>

                  {/* Barra suave */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      animate={{ width: `${currentProb}%` }}
                      transition={{ duration: 0.25 }}
                      className={`h-full rounded-full ${piece.studClass}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎛️ CONTROLE DISCRETO DE TEMPERATURA */}
        <div className="w-full pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-medium text-zinc-300">Temperatura (Amostragem Softmax):</span>
            <span className="font-mono text-blue-400 font-bold">{temperature.toFixed(1)}</span>
            <span className="text-[11px] text-zinc-500">
              ({temperature < 0.4 ? 'Determinístico' : temperature > 1.0 ? 'Criativo' : 'Balanceado'})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-56">
            <span className="text-[10px] font-mono text-zinc-600">0.1</span>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={temperature}
              onChange={(e) => {
                setTemperature(parseFloat(e.target.value));
                arcadeAudio.playClick();
              }}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-zinc-600">1.5</span>
          </div>
        </div>
      </div>
    </div>
  );
};
