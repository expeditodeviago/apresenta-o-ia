// src/components/acts/Act03_RotaryClock.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCw,
  Sparkles,
  Play,
  Pause,
  Compass,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/arcadeAudio';

interface TokenPreset {
  id: string;
  name: string;
  word1: string;
  pos1: number;
  word2: string;
  pos2: number;
  explanation: string;
}

const TOKEN_PRESETS: TokenPreset[] = [
  {
    id: 'neighbor',
    name: 'Tokens Adjacentes (Δ = 1)',
    word1: 'O',
    pos1: 0,
    word2: 'Gato',
    pos2: 1,
    explanation: 'Tokens vizinhos têm defasagem angular mínima: cos(Δθ) ≈ 1. O modelo reconhece que estão grudados na frase.',
  },
  {
    id: 'distance_3',
    name: 'Distância Curta (Δ = 3)',
    word1: 'Programar',
    pos1: 2,
    word2: 'Código',
    pos2: 5,
    explanation: 'Diferença de 3 posições mod 12 gera um ângulo de 90° (π/2). A rotação preserva a distância relativa exata.',
  },
  {
    id: 'modular_wrap',
    name: 'Congruência Modular (14 ≡ 2 mod 12)',
    word1: 'Loop',
    pos1: 2,
    word2: 'Volta',
    pos2: 14,
    explanation: '14 e 2 caem na mesma posição angular mod 12! Em altas dimensões, RoPE usa múltiplas frequências para evitar colisão.',
  },
];

export const Act03_RotaryClock: React.FC = () => {
  const [modulus, setModulus] = useState<number>(12);
  const [posQuery, setPosQuery] = useState<number>(2);
  const [posKey, setPosKey] = useState<number>(5);
  const [wordQuery, setWordQuery] = useState<string>('Programar');
  const [wordKey, setWordKey] = useState<string>('Código');
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('distance_3');

  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Raio e centro do relógio SVG
  const clockRadius = 140;
  const centerX = 160;
  const centerY = 160;

  // 📐 CÁLCULO TRIGONOMÉTRICO NORMALIZADO (Garante que os ponteiros NUNCA sumam da tela)
  const safeModulus = Math.max(1, modulus || 12);
  const normalizedKeyPos = ((posKey % safeModulus) + safeModulus) % safeModulus;
  const normalizedQueryPos = ((posQuery % safeModulus) + safeModulus) % safeModulus;

  // Topo do relógio = 270° (ou -90°)
  const queryAngleRaw = (normalizedQueryPos * 360) / safeModulus - 90;
  const normalizedQueryAngle = ((queryAngleRaw % 360) + 360) % 360;
  const queryRad = (normalizedQueryAngle * Math.PI) / 180;

  const keyAngleRaw = (normalizedKeyPos * 360) / safeModulus - 90;
  const normalizedKeyAngle = ((keyAngleRaw % 360) + 360) % 360;
  const keyRad = (normalizedKeyAngle * Math.PI) / 180;

  // Raio dos ponteiros
  const handRadius = clockRadius * 0.75;
  const queryX = Number((centerX + handRadius * Math.cos(queryRad)).toFixed(3));
  const queryY = Number((centerY + handRadius * Math.sin(queryRad)).toFixed(3));

  const keyX = Number((centerX + handRadius * Math.cos(keyRad)).toFixed(3));
  const keyY = Number((centerY + handRadius * Math.sin(keyRad)).toFixed(3));

  // Graus para exibição visual (0° a 360°)
  const angleQueryDeg = ((normalizedQueryPos * 360) / safeModulus);
  const angleKeyDeg = ((normalizedKeyPos * 360) / safeModulus);

  // Diferença angular discreta mod N
  const deltaRaw = posKey - posQuery;
  const deltaMod = ((deltaRaw % safeModulus) + safeModulus) % safeModulus;
  const deltaAngleRad = (deltaMod * 2 * Math.PI) / safeModulus;
  const cosineSimilarity = Math.cos(deltaAngleRad);

  // Efeito sonoro sutil na mudança de posição
  const handleQueryChange = (val: number) => {
    setPosQuery(val);
    arcadeAudio.playClockTick();
  };

  const handleKeyChange = (val: number) => {
    setPosKey(val);
    arcadeAudio.playClockTick();
  };

  const applyPreset = (preset: TokenPreset) => {
    setActivePreset(preset.id);
    setWordQuery(preset.word1);
    setWordKey(preset.word2);
    setPosQuery(preset.pos1);
    setPosKey(preset.pos2);
    arcadeAudio.playModularGear();
  };

  // Modo Auto-Play / Demonstração contínua
  useEffect(() => {
    if (isPlayingDemo) {
      demoIntervalRef.current = setInterval(() => {
        setPosKey((prev) => {
          const next = (prev + 1) % (safeModulus * 2);
          arcadeAudio.playClockTick();
          return next;
        });
      }, 1100);
    } else if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
    }

    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isPlayingDemo, safeModulus]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 select-none flex flex-col gap-4">
      {/* 🏷️ CABEÇALHO DO ATO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase">
              ATO 04 • MATEMÁTICA DISCRETA & ROPE
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              Aritmética Modular & Rotary Position Embeddings
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            The Rotary Clock of Attention
          </h2>
        </div>

        {/* Botão Auto-Play */}
        <button
          onClick={() => {
            setIsPlayingDemo(!isPlayingDemo);
            arcadeAudio.playModularGear();
          }}
          className={`tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isPlayingDemo
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
              : 'bg-slate-800/80 text-amber-300 border border-amber-500/30 hover:bg-slate-700'
          }`}
        >
          {isPlayingDemo ? (
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

      {/* 🧩 PRESETS TÁTEIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {TOKEN_PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`tactile-btn p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400/80 shadow-lg shadow-amber-500/15 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                <span>{preset.name}</span>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  {preset.word1} ➔ {preset.word2}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {preset.explanation}
              </p>
            </button>
          );
        })}
      </div>

      {/* ⚡ ÁREA PRINCIPAL: O RELÓGIO MODULAR SVG & CONTROLES TÁTEIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUNA ESQUERDA: O RELÓGIO MODULAR ROTATIVO (7 COLS) */}
        <div className="lg:col-span-7 liquid-glass rounded-3xl p-5 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Fundo de grade geométrica sutil */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* O Relógio SVG */}
          <div className="relative w-full max-w-[350px] aspect-square">
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full overflow-visible select-none"
            >
              <defs>
                {/* Gradiente Laser Query */}
                <linearGradient id="queryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                {/* Gradiente Laser Key */}
                <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                {/* Brilho do Laser de Conexão */}
                <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Anel Exterior da Engrenagem Modular */}
              <circle
                cx={centerX}
                cy={centerY}
                r={clockRadius}
                fill="rgba(15, 23, 42, 0.7)"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Anel Interno */}
              <circle
                cx={centerX}
                cy={centerY}
                r={clockRadius * 0.45}
                fill="rgba(11, 15, 29, 0.9)"
                stroke="rgba(245, 158, 11, 0.25)"
                strokeWidth="1.5"
              />

              {/* Marcações Discretas (0, 1, 2, ... mod N) */}
              {Array.from({ length: modulus }).map((_, i) => {
                const tickAngle = (i * 2 * Math.PI) / modulus - Math.PI / 2;
                const innerR = clockRadius - 10;
                const outerR = clockRadius;
                const textR = clockRadius - 24;

                const x1 = centerX + innerR * Math.cos(tickAngle);
                const y1 = centerY + innerR * Math.sin(tickAngle);
                const x2 = centerX + outerR * Math.cos(tickAngle);
                const y2 = centerY + outerR * Math.sin(tickAngle);
                const tx = centerX + textR * Math.cos(tickAngle);
                const ty = centerY + textR * Math.sin(tickAngle);

                const isQueryTick = i === (posQuery % modulus);
                const isKeyTick = i === (posKey % modulus);

                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={
                        isQueryTick
                          ? '#06b6d4'
                          : isKeyTick
                          ? '#f59e0b'
                          : 'rgba(255,255,255,0.25)'
                      }
                      strokeWidth={isQueryTick || isKeyTick ? '3' : '1.5'}
                    />
                    <text
                      x={tx}
                      y={ty + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill={
                        isQueryTick
                          ? '#38bdf8'
                          : isKeyTick
                          ? '#fbbf24'
                          : 'rgba(255,255,255,0.45)'
                      }
                      fontFamily="monospace"
                    >
                      {i}
                    </text>
                  </g>
                );
              })}

              {/* Arco da Diferença Angular Δθ */}
              <path
                d={`M ${queryX} ${queryY} Q ${centerX} ${centerY} ${keyX} ${keyY}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                filter="url(#laserGlow)"
              />

              {/* Feixe de Laser Radial Query (Posição m) */}
              <line
                x1={centerX}
                y1={centerY}
                x2={queryX}
                y2={queryY}
                stroke="url(#queryGrad)"
                strokeWidth="3.5"
                filter="url(#laserGlow)"
              />
              <circle
                cx={queryX}
                cy={queryY}
                r="7"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Feixe de Laser Radial Key (Posição n) - O Ponteiro Laranja NUNCA some */}
              <line
                x1={centerX}
                y1={centerY}
                x2={keyX}
                y2={keyY}
                stroke="#f59e0b"
                strokeWidth="4.5"
                strokeLinecap="round"
                opacity="1"
                filter="url(#laserGlow)"
              />
              <line
                x1={centerX}
                y1={centerY}
                x2={keyX}
                y2={keyY}
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="1"
              />
              <circle
                cx={keyX}
                cy={keyY}
                r="7.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="1"
              />

              {/* Centro do Relógio: Hub Central de Rotação */}
              <circle
                cx={centerX}
                cy={centerY}
                r="14"
                fill="#0f172a"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
              <circle cx={centerX} cy={centerY} r="5" fill="#f59e0b" />
            </svg>

            {/* Legenda Flutuante dos Dois Ponteiros */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Query: "{wordQuery}" (m = {posQuery})
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Key: "{wordKey}" (n = {posKey})
              </span>
            </div>

            {/* Badge Central do Cálculo Relativo */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold shadow-xl flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Δm,n = ({posKey} - {posQuery}) ≡ {deltaMod} (mod {modulus})</span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CONTROLES INTERATIVOS & MATEMÁTICA DISCRETA (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Card dos Sliders de Posição */}
          <div className="liquid-glass rounded-3xl p-4 border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Ajustar Posição dos Tokens no Texto</span>
            </h3>

            {/* Slider 1: Token Query (m) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-400 font-bold">
                  Token 1 (Query): "{wordQuery}"
                </span>
                <span className="font-mono text-zinc-300">
                  m = {posQuery} ➔ {angleQueryDeg.toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={modulus * 2 - 1}
                value={posQuery}
                onChange={(e) => handleQueryChange(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Slider 2: Token Key (n) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-amber-400 font-bold">
                  Token 2 (Key): "{wordKey}"
                </span>
                <span className="font-mono text-zinc-300">
                  n = {posKey} ➔ {angleKeyDeg.toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={modulus * 2 - 1}
                value={posKey}
                onChange={(e) => handleKeyChange(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Seletor de Base Modular (mod 8, 12, 16) */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Tamanho do Ciclo Modular (N):</span>
              <div className="flex gap-1.5">
                {[8, 12, 16].map((mVal) => (
                  <button
                    key={mVal}
                    onClick={() => {
                      setModulus(mVal);
                      arcadeAudio.playModularGear();
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                      modulus === mVal
                        ? 'bg-amber-500 text-black shadow'
                        : 'bg-slate-800 text-zinc-300 hover:bg-slate-700'
                    }`}
                  >
                    mod {mVal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card da Métrica de Similaridade Trigonométrica */}
          <div className="liquid-glass rounded-3xl p-4 border border-emerald-500/20 bg-emerald-950/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Produto Escalar Relativo:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                cos(Δθ) = {cosineSimilarity.toFixed(3)}
              </span>
            </div>

            {/* Barra de Intensidade da Atenção baseada na Rotação */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                animate={{ width: `${Math.max(5, ((cosineSimilarity + 1) / 2) * 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              O produto interno depende <strong>apenas da diferença (m - n)</strong>, e não da posição absoluta no documento. É assim que o LLM entende contextos de mais de 100.000 tokens!
            </p>
          </div>

          {/* Card Didático: A Fórmula do RoPE */}
          <div className="liquid-glass rounded-3xl p-3.5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Conexão com a Matemática Discreta</span>
            </div>
            <div className="bg-black/50 p-2 rounded-xl font-mono text-[11px] text-zinc-300 border border-white/5 overflow-x-auto">
              R_θ,m · R_θ,n^T = R_θ,(m - n mod N)
            </div>
            <p className="text-[10px] text-zinc-400">
              A congruência modular garante rotações cíclicas periódicas em múltiplos planos ortogonais, permitindo generalização de comprimento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
