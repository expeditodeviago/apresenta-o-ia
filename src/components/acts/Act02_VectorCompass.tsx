// src/components/acts/Act02_VectorCompass.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Compass,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Calculator,
} from 'lucide-react';

interface VectorPoint {
  id: string;
  label: string;
  x: number; // -100 a +100
  y: number; // -100 a +100
  color: string;
}

interface VectorPreset {
  id: string;
  title: string;
  subtitle: string;
  points: VectorPoint[];
  connections: [number, number][]; // Pares de índices ligando pontos
  formula: string;
  explanation: string;
}

const PRESETS: VectorPreset[] = [
  {
    id: 'royalty',
    title: 'Rei - Homem + Mulher = Rainha',
    subtitle: 'A clássica analogia de álgebra vetorial (Word2Vec)',
    points: [
      { id: 'p0', label: 'Homem', x: -65, y: -45, color: '#60a5fa' },
      { id: 'p1', label: 'Mulher', x: -65, y: 55, color: '#f472b6' },
      { id: 'p2', label: 'Rei', x: 50, y: -45, color: '#fbbf24' },
      { id: 'p3', label: 'Rainha', x: 50, y: 55, color: '#c084fc' },
    ],
    connections: [
      [0, 1], // Homem -> Mulher
      [2, 3], // Rei -> Rainha
    ],
    formula: 'Vetor("Rei") - Vetor("Homem") + Vetor("Mulher") ≈ Vetor("Rainha")',
    explanation: 'A distância e direção angular entre "Homem" e "Mulher" é matematicamente idêntica à de "Rei" e "Rainha" no hiperespaço.',
  },
  {
    id: 'problems',
    title: 'Código ➔ Bug vs Médico ➔ Doença',
    subtitle: 'Relação semântica de Especialista & Problema',
    points: [
      { id: 'p0', label: 'Código', x: -70, y: -20, color: '#38bdf8' },
      { id: 'p1', label: 'Bug', x: -30, y: 60, color: '#f43f5e' },
      { id: 'p2', label: 'Médico', x: 30, y: -20, color: '#34d399' },
      { id: 'p3', label: 'Doença', x: 70, y: 60, color: '#f87171' },
    ],
    connections: [
      [0, 1], // Código -> Bug
      [2, 3], // Médico -> Doença
    ],
    formula: 'Vetor("Código") : Vetor("Bug") :: Vetor("Médico") : Vetor("Doença")',
    explanation: 'A IA capta a analogia funcional: a ferramenta ou profissão mapeada para o distúrbio que ela é responsável por solucionar.',
  },
  {
    id: 'boost',
    title: 'Café ➔ Energia',
    subtitle: 'Vetor de Translação de Causa e Efeito',
    points: [
      { id: 'p0', label: 'Sono', x: -60, y: -50, color: '#94a3b8' },
      { id: 'p1', label: 'Café', x: -10, y: 0, color: '#d97706' },
      { id: 'p2', label: 'Energia', x: 60, y: 60, color: '#eab308' },
    ],
    connections: [
      [0, 1],
      [1, 2],
    ],
    formula: 'Vetor("Sono") + Vetor("Café") = Vetor("Energia")',
    explanation: 'Embeddings capturam trajetórias contínuas de transformação conceitual e causalidade.',
  },
];

export const Act02_VectorCompass: React.FC = () => {
  const { addScore } = usePresentationStore();
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const preset = PRESETS[selectedPresetIndex];

  // Converte coordenadas -100 a +100 para coordenadas de tela SVG (centro em 260, 160)
  const toSvgX = (x: number) => 260 + x * 2.2;
  const toSvgY = (y: number) => 160 - y * 1.35;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    arcadeAudio.playElectricAttract();
    fireStarBurst(0.5, 0.45);
    addScore(150);
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    let step = 0;
    const interval = setInterval(() => {
      setSelectedPresetIndex(step);
      arcadeAudio.playElectricAttract();
      step++;

      if (step >= PRESETS.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.45);
        addScore(300);
        setIsAutoPlaying(false);
      }
    }, 1400);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
              <span>ATO 02</span>
              <span>•</span>
              <span>THE SEMANTIC VECTOR COMPASS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>A Bússola Vetorial Semântica & Álgebra Espacial</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Palavras não são apenas texto: são coordenadas no hiperespaço. Explore analogias calculando vetores em tempo real.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 disabled:opacity-50 active:scale-95 shrink-0"
            title="Demonstração automática da bússola vetorial"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAutoPlaying ? 'Navegando...' : '▶️ Auto-Play / Demonstração'}</span>
          </button>
        </div>

        {/* 🧭 OS 3 SELETORES TÁTEIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((p, idx) => {
            const isSelected = idx === selectedPresetIndex;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(idx)}
                className={`tactile-btn p-3.5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Preset {idx + 1}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {p.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* 🛰️ RADAR CIRCULAR VETORIAL SVG & PAINEL MATEMÁTICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* O Radar Circular SVG */}
          <div className="lg:col-span-2 relative w-full h-[320px] rounded-3xl bg-slate-950/90 border border-white/15 overflow-hidden shadow-inner flex items-center justify-center p-2">
            {/* Brilho Radial no Centro da Bússola */}
            <div className="absolute w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <svg viewBox="0 0 520 320" className="w-full h-full">
              {/* Círculos Concêntricos do Radar */}
              <circle cx="260" cy="160" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="260" cy="160" r="100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="260" cy="160" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <circle cx="260" cy="160" r="20" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />

              {/* Eixos Luminous X & Y */}
              <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="260" y1="20" x2="260" y2="300" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              {/* Rótulos de Coordenadas */}
              <text x="490" y="164" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">+X (Realeza)</text>
              <text x="25" y="164" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">-X (Comum)</text>
              <text x="265" y="30" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">+Y (Feminino)</text>
              <text x="265" y="295" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">-Y (Masculino)</text>

              {/* Agulhas Magnéticas / Vetores de Conexão */}
              {preset.connections.map(([srcIdx, dstIdx], i) => {
                const src = preset.points[srcIdx];
                const dst = preset.points[dstIdx];
                const x1 = toSvgX(src.x);
                const y1 = toSvgY(src.y);
                const x2 = toSvgX(dst.x);
                const y2 = toSvgY(dst.y);

                return (
                  <g key={`conn-${i}`}>
                    {/* Linha de Brilho */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={dst.color}
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      className="animate-pulse opacity-80"
                    />
                    {/* Ponta da Seta Magnética */}
                    <circle cx={x2} cy={y2} r="4" fill={dst.color} />
                  </g>
                );
              })}

              {/* Nós das Palavras no Radar */}
              {preset.points.map((pt) => {
                const px = toSvgX(pt.x);
                const py = toSvgY(pt.y);
                const isSelected = activePointId === pt.id;

                return (
                  <g
                    key={pt.id}
                    onClick={() => {
                      setActivePointId(pt.id);
                      arcadeAudio.playClick();
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Halo de Brilho */}
                    <circle
                      cx={px}
                      cy={py}
                      r="18"
                      fill={pt.color}
                      opacity={isSelected ? '0.35' : '0.15'}
                      className="transition-all group-hover:scale-125"
                    />
                    {/* Ponto Central */}
                    <circle
                      cx={px}
                      cy={py}
                      r="7"
                      fill={pt.color}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    {/* Etiqueta da Palavra */}
                    <rect
                      x={px - 36}
                      y={py - 30}
                      width="72"
                      height="20"
                      rx="6"
                      fill="rgba(15, 23, 42, 0.85)"
                      stroke={pt.color}
                      strokeWidth="1"
                    />
                    <text
                      x={px}
                      y={py - 16}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Painel Matemático & Similaridade de Cosseno */}
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-4 h-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Geometria do Hiperespaço</span>
              </div>

              {/* Fórmula Matemática */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-amber-300 font-bold leading-relaxed break-words">
                {preset.formula}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                {preset.explanation}
              </p>
            </div>

            {/* Métrica de Cosseno & Distância Euclidiana */}
            <div className="space-y-2.5 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Similaridade de Cosseno cos(θ):</span>
                <span className="text-emerald-400 font-bold text-sm">0.892 (Quase Paralelos)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[89%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Erro de Translação Δv:</span>
                <span className="text-cyan-400 font-bold text-sm">&lt; 0.04 rad</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
              💡 <strong>Insight Chave:</strong> Modelos não leem sentimentos ou significados abstratos; eles operam produtos escalares em matrizes de pesos densas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
