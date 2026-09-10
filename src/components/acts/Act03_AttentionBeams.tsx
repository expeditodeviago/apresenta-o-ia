// src/components/acts/Act03_AttentionBeams.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Sparkles,
  Play,
  RotateCcw,
  Zap,
  Eye,
  Layers,
  ArrowRight,
  Split,
} from 'lucide-react';

interface SentenceOption {
  id: string;
  label: string;
  words: string[];
  weights: Record<number, Record<number, number>>;
  eurekaWordIndex: number;
  eurekaTargetIndex: number;
  insight: string;
}

const SENTENCES: SentenceOption[] = [
  {
    id: 'animal',
    label: 'O animal e a rua cansada',
    words: ['O', 'animal', 'não', 'atravessou', 'a', 'rua', 'porque', 'estava', 'muito', 'cansado'],
    weights: {
      1: { 0: 0.2, 1: 0.9, 3: 0.5, 7: 0.6, 9: 0.7 }, // animal
      3: { 1: 0.75, 3: 0.9, 5: 0.85 }, // atravessou
      5: { 3: 0.8, 4: 0.3, 5: 0.9 }, // rua
      7: { 1: 0.82, 6: 0.4, 7: 0.9, 9: 0.78 }, // estava
      9: { 1: 0.89, 5: 0.05, 7: 0.81, 8: 0.65, 9: 0.95 }, // cansado
    },
    eurekaWordIndex: 9, // cansado
    eurekaTargetIndex: 1, // animal
    insight: 'Ao analisar "cansado", o Transformer direciona 89% de atenção para "animal" e apenas 5% para "rua", desfazendo a ambiguidade sintática.',
  },
  {
    id: 'bank',
    label: 'O banco e a fraude',
    words: ['O', 'banco', 'bloqueou', 'o', 'cartão', 'porque', 'identificou', 'uma', 'fraude'],
    weights: {
      1: { 0: 0.3, 1: 0.95, 2: 0.8, 8: 0.75 }, // banco
      2: { 1: 0.85, 4: 0.9, 8: 0.65 }, // bloqueou
      4: { 1: 0.7, 2: 0.85, 8: 0.6 }, // cartão
      6: { 1: 0.8, 4: 0.5, 8: 0.92 }, // identificou
      8: { 1: 0.88, 2: 0.75, 4: 0.82, 6: 0.91, 8: 0.98 }, // fraude
    },
    eurekaWordIndex: 8, // fraude
    eurekaTargetIndex: 1, // banco
    insight: '"Banco" aqui recebe forte projeção de "fraude" e "bloqueou", eliminando o sentido de banco de sentar na praça.',
  },
];

export const Act03_AttentionBeams: React.FC = () => {
  const { addScore } = usePresentationStore();
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [hoveredWordIdx, setHoveredWordIdx] = useState<number>(9);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const currentSentence = SENTENCES[activeSentenceIndex];
  const attentionWeights = currentSentence.weights[hoveredWordIdx] || {};

  // Converte índice de palavra para coordenada X em arco SVG (520px de largura)
  const getWordPosition = (index: number, total: number) => {
    const spacing = 480 / (total - 1);
    const x = 20 + index * spacing;
    // Curvatura suave em arco
    const normalized = (index / (total - 1)) * 2 - 1; // -1 a +1
    const y = 200 - Math.abs(normalized) * 25;
    return { x, y };
  };

  const handleWordSelect = (idx: number) => {
    setHoveredWordIdx(idx);
    arcadeAudio.playLaserShot();
    addScore(25);
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playLaserShot();

    const sequence = [1, 3, 7, currentSentence.eurekaWordIndex];
    let step = 0;

    const interval = setInterval(() => {
      setHoveredWordIdx(sequence[step]);
      arcadeAudio.playLaserShot();
      step++;

      if (step >= sequence.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.45);
        addScore(250);
        setIsAutoPlaying(false);
      }
    }, 700);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold tracking-wider">
              <span>ATO 03</span>
              <span>•</span>
              <span>ATTENTION BEAMS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>A Teia de Lasers dos Transformers (Self-Attention)</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Passe o mouse ou toque nos termos para disparar os feixes de atenção que conectam palavras simultaneamente.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 disabled:opacity-50 active:scale-95 shrink-0"
            title="Disparo automático dos feixes de atenção"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAutoPlaying ? 'Disparando...' : '▶️ Auto-Play / Disparar Lasers'}</span>
          </button>
        </div>

        {/* 🗂️ Seletores de Frases Táteis */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Cenário de Teste:
          </span>
          {SENTENCES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSentenceIndex(idx);
                setHoveredWordIdx(s.eurekaWordIndex);
                arcadeAudio.playClick();
              }}
              className={`tactile-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                idx === activeSentenceIndex
                  ? 'border-purple-400 bg-purple-500/20 text-white shadow-md shadow-purple-500/20'
                  : 'border-white/10 bg-slate-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 🕸️ A TEIA HOLOGRÁFICA DE LASERS SVG */}
        <div className="relative w-full h-[300px] rounded-3xl bg-slate-950/90 border border-white/15 overflow-hidden shadow-inner flex items-center justify-center p-4">
          {/* Brilho de Fundo Violeta */}
          <div className="absolute w-72 h-40 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

          <svg viewBox="0 0 520 240" className="w-full h-full overflow-visible">
            {/* Feixes de Laser conectando o termo selecionado aos outros */}
            {currentSentence.words.map((_, targetIdx) => {
              const weight = attentionWeights[targetIdx] || 0;
              if (weight <= 0.05 || targetIdx === hoveredWordIdx) return null;

              const src = getWordPosition(hoveredWordIdx, currentSentence.words.length);
              const dst = getWordPosition(targetIdx, currentSentence.words.length);

              // Curvatura Bezier do Laser no Topo
              const midX = (src.x + dst.x) / 2;
              const midY = Math.min(src.y, dst.y) - 60 * weight - 20;

              return (
                <g key={`beam-${targetIdx}`}>
                  {/* Brilho Difuso do Laser */}
                  <path
                    d={`M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth={weight * 8}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                  {/* Núcleo Incandescente do Laser */}
                  <path
                    d={`M ${src.x} ${src.y} Q ${midX} ${midY} ${dst.x} ${dst.y}`}
                    fill="none"
                    stroke={weight > 0.7 ? '#f472b6' : '#a855f7'}
                    strokeWidth={Math.max(1.5, weight * 4)}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Rótulo de Percentual de Atenção flutuando no arco */}
                  <rect
                    x={midX - 16}
                    y={midY - 10}
                    width="32"
                    height="16"
                    rx="4"
                    fill="rgba(15,23,42,0.9)"
                    stroke="#a855f7"
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {Math.round(weight * 100)}%
                  </text>
                </g>
              );
            })}

            {/* As Palavras Posicionadas no Arco Holográfico */}
            {currentSentence.words.map((word, idx) => {
              const pos = getWordPosition(idx, currentSentence.words.length);
              const isSource = idx === hoveredWordIdx;
              const weight = attentionWeights[idx] || 0;

              return (
                <g
                  key={idx}
                  onClick={() => handleWordSelect(idx)}
                  onMouseEnter={() => handleWordSelect(idx)}
                  className="cursor-pointer group"
                >
                  {/* Ponto de Ancoragem */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSource ? 8 : 5}
                    fill={isSource ? '#f472b6' : weight > 0.6 ? '#c084fc' : '#475569'}
                    stroke="#fff"
                    strokeWidth={isSource ? 2 : 1}
                  />

                  {/* Caixa de Texto da Palavra */}
                  <rect
                    x={pos.x - 30}
                    y={pos.y + 12}
                    width="60"
                    height="26"
                    rx="8"
                    fill={isSource ? 'rgba(244,114,182,0.3)' : 'rgba(15,23,42,0.85)'}
                    stroke={isSource ? '#f472b6' : weight > 0.6 ? '#c084fc' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isSource ? 1.5 : 1}
                    className="transition-all group-hover:stroke-purple-400"
                  />

                  <text
                    x={pos.x}
                    y={pos.y + 28}
                    textAnchor="middle"
                    fill={isSource ? '#fff' : weight > 0.6 ? '#e9d5ff' : '#94a3b8'}
                    fontSize="11"
                    fontWeight={isSource || weight > 0.6 ? 'bold' : 'normal'}
                    fontFamily="sans-serif"
                  >
                    {word}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 💡 PAINEL DE INSIGHT DIDÁTICO & FÓRMULA Q, K, V */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
              <Eye className="w-4 h-4" />
              <span>Foco Atual: &quot;{currentSentence.words[hoveredWordIdx]}&quot;</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {currentSentence.insight}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
              <Split className="w-4 h-4" />
              <span>Tensores Q, K, V</span>
            </div>
            <div className="p-2 rounded-xl bg-black/40 font-mono text-[11px] text-zinc-300 font-semibold leading-normal">
              Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ)·V
            </div>
            <p className="text-[11px] text-zinc-400">
              Cada token projeta uma pergunta (Query) e busca quem possui a melhor resposta (Key).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Paralelismo Radical</span>
            </div>
            <p className="text-xs text-purple-100/90 leading-relaxed">
              Diferente de RNNs antigas que liam palavra por palavra, a atenção calcula todos os pares simultaneamente em matrizes GPU.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
