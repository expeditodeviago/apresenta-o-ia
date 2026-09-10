// src/components/acts/Act05_AIArena.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Swords,
  Play,
  RotateCcw,
  Sparkles,
  Code2,
  BrainCircuit,
  DollarSign,
  Zap,
  ShieldAlert,
  Trophy,
} from 'lucide-react';

interface TitanCard {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  borderGlow: string;
  stats: {
    code: number;
    math: number;
    speed: number; // tokens/s
    costPerM: string;
  };
  specialMove: string;
  description: string;
}

const TITANS: TitanCard[] = [
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    badge: 'OPEN SOURCE TITAN',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    gradient: 'from-amber-600/30 via-slate-900 to-slate-950',
    borderGlow: 'border-amber-400/60 shadow-amber-500/20',
    stats: { code: 89, math: 97, speed: 110, costPerM: '$0.14' },
    specialMove: 'Reflexive Tree of Thought',
    description: 'Arquitetura aberta de baixo custo que chocou o mercado global ao superar benchmarks de raciocínio proprietários.',
  },
  {
    id: 'claude-35-sonnet',
    name: 'Claude 3.5 Sonnet',
    badge: 'SUPREME CODER',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    gradient: 'from-purple-600/30 via-slate-900 to-slate-950',
    borderGlow: 'border-purple-400/60 shadow-purple-500/20',
    stats: { code: 96, math: 91, speed: 95, costPerM: '$3.00' },
    specialMove: 'Architectural Artifact Refactor',
    description: 'O líder absoluto em SWE-bench e refatoração de código com profunda compreensão de repositórios inteiros.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    badge: 'OMNIMODAL VETERAN',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    gradient: 'from-cyan-600/30 via-slate-900 to-slate-950',
    borderGlow: 'border-cyan-400/60 shadow-cyan-500/20',
    stats: { code: 88, math: 89, speed: 120, costPerM: '$5.00' },
    specialMove: 'Real-time Native Vision & Voice',
    description: 'A referência em versatilidade multimodal com latência quase humana para visão, voz e processamento geral.',
  },
];

export const Act05_AIArena: React.FC = () => {
  const { addScore } = usePresentationStore();
  const [selectedTitan, setSelectedTitan] = useState<string>('deepseek-r1');
  const [clashCategory, setClashCategory] = useState<'code' | 'math' | 'cost' | 'speed' | null>('code');
  const [combatLog, setCombatLog] = useState<string[]>([
    'Arena inicializada. Selecione um confronto para iniciar o duelo.',
  ]);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const handleClash = (cat: 'code' | 'math' | 'cost' | 'speed') => {
    setClashCategory(cat);
    arcadeAudio.playLaserShot();

    setTimeout(() => {
      arcadeAudio.playHitDamage();
      fireStarBurst(0.5, 0.45);
      addScore(150);
    }, 200);

    if (cat === 'code') {
      setCombatLog((prev) => [
        '⚔️ TESTE DE CÓDIGO (SWE-bench): Claude 3.5 Sonnet assume a dianteira com 96% de precisão sintática!',
        ...prev.slice(0, 2),
      ]);
    } else if (cat === 'math') {
      setCombatLog((prev) => [
        '⚔️ LÓGICA PURA & MATH: DeepSeek-R1 ativa o modo <think> e atinge 97.3% no benchmark MATH!',
        ...prev.slice(0, 2),
      ]);
    } else if (cat === 'cost') {
      setCombatLog((prev) => [
        '⚔️ CHOQUE DE CUSTOS: DeepSeek-R1 entrega inferência a $0.14/1M (35x mais barato que o GPT-4o)!',
        ...prev.slice(0, 2),
      ]);
    } else if (cat === 'speed') {
      setCombatLog((prev) => [
        '⚔️ VELOCIDADE & MULTIMODAL: GPT-4o crava 120 tokens/s com streaming de áudio nativo!',
        ...prev.slice(0, 2),
      ]);
    }
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    const sequence: ('code' | 'math' | 'cost' | 'speed')[] = ['code', 'math', 'cost', 'speed'];
    let step = 0;

    const interval = setInterval(() => {
      handleClash(sequence[step]);
      step++;

      if (step >= sequence.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.45);
        addScore(300);
        setIsAutoPlaying(false);
      }
    }, 1100);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-wider">
              <span>ATO 05</span>
              <span>•</span>
              <span>AI ARENA: CLASH OF TITANS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Batalha de Cards Holográficos: DeepSeek vs Claude vs GPT</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Passe o mouse sobre os cards colecionáveis para inclinação holográfica 3D e compare o poder de fogo de cada gigante.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 disabled:opacity-50 active:scale-95 shrink-0"
            title="Batalha automática de titãs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAutoPlaying ? 'Batalhando...' : '▶️ Batalha Automática'}</span>
          </button>
        </div>

        {/* 🃏 AS 3 CARTAS COLECIONÁVEIS 3D HOLOGRÁFICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TITANS.map((titan) => {
            const isSelected = selectedTitan === titan.id;

            return (
              <motion.div
                key={titan.id}
                onClick={() => {
                  setSelectedTitan(titan.id);
                  arcadeAudio.playClick();
                }}
                whileHover={{ y: -6, rotateY: 3, scale: 1.02 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`tactile-btn relative rounded-3xl p-5 border-2 bg-gradient-to-b ${titan.gradient} ${
                  isSelected ? `${titan.borderGlow} shadow-2xl` : 'border-white/10'
                } cursor-pointer flex flex-col justify-between space-y-4 overflow-hidden group`}
              >
                {/* Linha de Brilho Holográfico no Topo */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Topo do Card: Badge & Nome */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${titan.badgeColor}`}
                    >
                      {titan.badge}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 font-bold">
                      {titan.stats.costPerM} / 1M
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                    {titan.name}
                  </h3>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {titan.description}
                  </p>
                </div>

                {/* Barras de Atributos do Titã */}
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                  {/* Código */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-purple-400" /> Código (SWE)
                      </span>
                      <span className="font-bold text-white">{titan.stats.code}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${titan.stats.code}%` }}
                      />
                    </div>
                  </div>

                  {/* Lógica / Math */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-amber-400" /> Matemática
                      </span>
                      <span className="font-bold text-white">{titan.stats.math}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${titan.stats.math}%` }}
                      />
                    </div>
                  </div>

                  {/* Velocidade */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" /> Velocidade
                      </span>
                      <span className="font-bold text-white">{titan.stats.speed} t/s</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${(titan.stats.speed / 130) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ataque Especial do Modelo */}
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center justify-between">
                  <span className="text-zinc-400">Special Move:</span>
                  <span className="font-bold text-amber-300">{titan.specialMove}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ⚔️ BOTOES DE CONFRONTO & LOG DE COMBATE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-2">
          {/* Botões de Ação de Combate */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleClash('code')}
              className="tactile-btn flex items-center justify-center gap-2 p-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>[ Teste de Código ]</span>
            </button>

            <button
              onClick={() => handleClash('math')}
              className="tactile-btn flex items-center justify-center gap-2 p-3 rounded-2xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95"
            >
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>[ Lógica Pura & Math ]</span>
            </button>

            <button
              onClick={() => handleClash('cost')}
              className="tactile-btn flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>[ Duelo de Custo / 1M ]</span>
            </button>

            <button
              onClick={() => handleClash('speed')}
              className="tactile-btn flex items-center justify-center gap-2 p-3 rounded-2xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-white font-bold text-xs shadow-md shadow-cyan-600/20 active:scale-95"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>[ Velocidade de Stream ]</span>
            </button>
          </div>

          {/* Log de Combate Holográfico */}
          <div className="lg:col-span-6 p-4 rounded-2xl bg-slate-950/90 border border-white/15 space-y-2 h-[105px] flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
              <Swords className="w-3.5 h-3.5" />
              <span>FEED DE COMBATE EM TEMPO REAL</span>
            </div>
            <div className="space-y-1 overflow-hidden font-mono text-xs">
              {combatLog.map((log, idx) => (
                <div key={idx} className="text-zinc-300 leading-snug line-clamp-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
