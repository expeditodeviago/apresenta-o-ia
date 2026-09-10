// src/components/Games/Level2_VectorCompass.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Compass,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface VectorPoint {
  label: string;
  x: number; // Coordenada -100 a +100
  y: number; // Coordenada -100 a +100
  color: string;
}

interface VectorPreset {
  id: string;
  title: string;
  subtitle: string;
  points: VectorPoint[];
  connections: [number, number][]; // Pares de índices para desenhar o vetor
  formula: string;
  explanation: string;
}

const PRESETS: VectorPreset[] = [
  {
    id: 'royalty',
    title: 'Rei - Homem + Mulher = Rainha',
    subtitle: 'A clássica analogia de álgebra vetorial (Word2Vec)',
    points: [
      { label: 'Homem', x: -65, y: -45, color: '#60a5fa' },
      { label: 'Mulher', x: -65, y: 55, color: '#f472b6' },
      { label: 'Rei', x: 50, y: -45, color: '#fbbf24' },
      { label: 'Rainha', x: 50, y: 55, color: '#a78bfa' },
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
      { label: 'Código', x: -70, y: -20, color: '#38bdf8' },
      { label: 'Bug', x: -30, y: 60, color: '#f43f5e' },
      { label: 'Médico', x: 30, y: -20, color: '#34d399' },
      { label: 'Doença', x: 70, y: 60, color: '#f87171' },
    ],
    connections: [
      [0, 1], // Código -> Bug
      [2, 3], // Médico -> Doença
    ],
    formula: 'Vetor("Código") : Vetor("Bug") :: Vetor("Médico") : Vetor("Doença")',
    explanation: 'A IA capta o padrão de correspondência: a profissão ou ferramenta mapeada para o distúrbio que ela deve solucionar.',
  },
  {
    id: 'boost',
    title: 'Café ➔ Energia',
    subtitle: 'Vetor de Translação de Causa e Efeito',
    points: [
      { label: 'Sono', x: -60, y: -50, color: '#94a3b8' },
      { label: 'Café', x: -10, y: 0, color: '#d97706' },
      { label: 'Energia', x: 60, y: 60, color: '#eab308' },
    ],
    connections: [
      [0, 1],
      [1, 2],
    ],
    formula: 'Vetor("Sono") + Vetor("Café") = Vetor("Energia")',
    explanation: 'Embeddings representam transformações conceituais como trajetórias contínuas através do espaço vetorial.',
  },
];

export const Level2_VectorCompass: React.FC = () => {
  const { addScore } = useGameStore();
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const preset = PRESETS[selectedPresetIndex];

  // Converte coordenadas normalizadas (-100 a +100) para coordenadas de pixel SVG (centro em 250, 160)
  const toSvgX = (x: number) => 250 + x * 2.1;
  const toSvgY = (y: number) => 160 - y * 1.3;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    arcadeAudio.playElectricAttract();
    fireStarBurst(0.5, 0.45);
    addScore(100);
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    // Cicla os presets automaticamente
    const nextIdx = (selectedPresetIndex + 1) % PRESETS.length;
    setTimeout(() => {
      setSelectedPresetIndex(nextIdx);
      arcadeAudio.playElectricAttract();
      fireStarBurst(0.5, 0.45);
      addScore(150);
      setIsAutoPlaying(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 02 • BÚSSOLA VETORIAL & EMBEDDINGS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The Semantic Vector Compass: A Geometria das Palavras
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Palavras não são apenas texto: são coordenadas geométricas em um hiperespaço com direção, sentido e álgebra.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática de rotação de presets"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoPlaying ? 'Demonstrando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🧭 O RADAR CARTESIANO LIMPO EM SVG (100% LIVRE DE ERROS DE FÍSICA) */}
        <div className="w-full p-4 sm:p-6 rounded-xl bg-zinc-950/70 border border-zinc-800/70 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
          <div className="w-full max-w-2xl h-[280px] sm:h-[310px] relative">
            <svg
              viewBox="0 0 500 320"
              className="w-full h-full drop-shadow-md"
            >
              {/* Círculos de Radar Concêntricos */}
              <circle cx="250" cy="160" r="130" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="250" cy="160" r="85" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="250" cy="160" r="40" fill="none" stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />

              {/* Eixos Cartesianos Estilizados */}
              <line x1="40" y1="160" x2="460" y2="160" stroke="#3f3f46" strokeWidth="1.5" />
              <line x1="250" y1="30" x2="250" y2="290" stroke="#3f3f46" strokeWidth="1.5" />

              {/* Legendas dos Eixos */}
              <text x="460" y="155" fill="#71717a" fontSize="10" fontFamily="monospace" textAnchor="end">
                Eixo X: Contexto Semântico ➔
              </text>
              <text x="255" y="42" fill="#71717a" fontSize="10" fontFamily="monospace">
                ▲ Eixo Y: Polaridade & Relação
              </text>

              {/* Linhas / Vetores de Conexão */}
              {preset.connections.map(([idxA, idxB], i) => {
                const ptA = preset.points[idxA];
                const ptB = preset.points[idxB];
                if (!ptA || !ptB) return null;

                const x1 = toSvgX(ptA.x);
                const y1 = toSvgY(ptA.y);
                const x2 = toSvgX(ptB.x);
                const y2 = toSvgY(ptB.y);

                return (
                  <g key={i}>
                    {/* Linha com gradiente */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                      className="animate-pulse opacity-90"
                    />
                    {/* Marcador de seta */}
                    <circle cx={x2} cy={y2} r="5" fill="#3b82f6" className="animate-ping opacity-60" />
                  </g>
                );
              })}

              {/* Pontos de Palavras no Hiperespaço */}
              {preset.points.map((pt, i) => {
                const cx = toSvgX(pt.x);
                const cy = toSvgY(pt.y);

                return (
                  <g key={i} className="transition-all duration-300">
                    {/* Halo de luz */}
                    <circle cx={cx} cy={cy} r="14" fill={pt.color} opacity="0.15" />
                    {/* Ponto central */}
                    <circle cx={cx} cy={cy} r="6" fill={pt.color} stroke="#ffffff" strokeWidth="1.5" />
                    {/* Texto da palavra */}
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill="#f4f4f5"
                      fontSize="12"
                      fontWeight="600"
                      fontFamily="system-ui, sans-serif"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Fórmula Dinâmica */}
          <div className="mt-3 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-center flex flex-col sm:flex-row items-center gap-2">
            <span className="text-zinc-500 font-sans">Fórmula Ativa:</span>
            <span className="text-blue-400 font-bold">{preset.formula}</span>
          </div>
        </div>

        {/* 🔘 SELETORES DE PRESETS INTERATIVOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((p, idx) => {
            const isSelected = selectedPresetIndex === idx;

            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all active:scale-98 ${
                  isSelected
                    ? 'border-blue-500/80 bg-blue-500/10 shadow-md ring-1 ring-blue-500/30'
                    : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-200">
                    Preset 0{idx + 1}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm text-white font-sans">
                  {p.title}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {p.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Didático */}
        <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span>
            💡 <strong>Explicação Matemática:</strong> {preset.explanation}
          </span>
          <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-2">+100 Score</span>
        </div>
      </div>
    </div>
  );
};
