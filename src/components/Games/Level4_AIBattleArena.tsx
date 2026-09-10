// src/components/Games/Level4_AIBattleArena.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  DollarSign,
  Code2,
  BrainCircuit,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';

interface FloatingText {
  id: number;
  text: string;
  colorClass: string;
  side: 'left' | 'right';
}

export const Level4_AIBattleArena: React.FC = () => {
  const { addScore } = useGameStore();

  const [hpDeepSeek, setHpDeepSeek] = useState<number>(100);
  const [hpGPT, setHpGPT] = useState<number>(100);
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>(['Arena inicializada. Selecione um confronto ou ative o Modo Demonstração.']);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isKnockout, setIsKnockout] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const triggerAttack = (type: 'code' | 'logic' | 'cost' | 'speed') => {
    if (isKnockout) return;

    arcadeAudio.playLaserShot();
    const newId = Date.now();

    if (type === 'code') {
      setActiveAttack('code');
      setTimeout(() => arcadeAudio.playHitDamage(), 180);
      setHpGPT((prev) => {
        const next = Math.max(0, prev - 30);
        if (next === 0) handleVictory('DeepSeek-R1');
        return next;
      });
      setFloatingTexts((f) => [
        ...f,
        { id: newId, text: '-30 HP • Algoritmo Reflexivo', colorClass: 'text-amber-400', side: 'right' },
      ]);
      setCombatLog((l) => [
        'DeepSeek-R1 acertou teste de código: 96.3% no MATH Benchmark. GPT-4o sofreu 30 de dano.',
        ...l.slice(0, 2),
      ]);
    } else if (type === 'logic') {
      setActiveAttack('logic');
      setTimeout(() => arcadeAudio.playHitDamage(), 180);
      setHpDeepSeek((prev) => {
        const next = Math.max(0, prev - 25);
        if (next === 0) handleVictory('GPT-4o');
        return next;
      });
      setFloatingTexts((f) => [
        ...f,
        { id: newId, text: '-25 HP • Visão Multimodal', colorClass: 'text-blue-400', side: 'left' },
      ]);
      setCombatLog((l) => [
        'GPT-4o respondeu com processamento visual nativo e voz de baixíssima latência. DeepSeek perdeu 25 HP.',
        ...l.slice(0, 2),
      ]);
    } else if (type === 'cost') {
      setActiveAttack('cost');
      setTimeout(() => arcadeAudio.playHitDamage(), 200);
      setHpGPT((prev) => {
        const next = Math.max(0, prev - 45);
        if (next === 0) handleVictory('DeepSeek-R1');
        return next;
      });
      setFloatingTexts((f) => [
        ...f,
        { id: newId, text: 'CRÍTICO! $0.14 vs $5.00 (-45 HP)', colorClass: 'text-emerald-400', side: 'right' },
      ]);
      setCombatLog((l) => [
        'DANO CRÍTICO DE CUSTO: DeepSeek-R1 opera a $0.14 por milhão de tokens contra $5.00 do GPT-4o!',
        ...l.slice(0, 2),
      ]);
    } else if (type === 'speed') {
      setActiveAttack('speed');
      setTimeout(() => arcadeAudio.playHitDamage(), 180);
      setHpDeepSeek((prev) => Math.max(0, prev - 15));
      setHpGPT((prev) => Math.max(0, prev - 15));
      setFloatingTexts((f) => [
        ...f,
        { id: newId, text: 'Empate: 110 tokens/s', colorClass: 'text-zinc-300', side: 'right' },
      ]);
      setCombatLog((l) => [
        'Equilíbrio em taxa de transferência: Ambos os modelos atingiram 110 tokens/segundo.',
        ...l.slice(0, 2),
      ]);
    }

    setTimeout(() => {
      setActiveAttack(null);
      setFloatingTexts((f) => f.filter((item) => item.id !== newId));
    }, 1100);
  };

  const handleVictory = (winner: string) => {
    setIsKnockout(true);
    arcadeAudio.playVictoryFanfare();
    fireStarBurst(0.5, 0.4);
    addScore(300);
    setCombatLog((l) => [`🏆 Vitória de ${winner} na arena!`, ...l]);
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying || isKnockout) return;
    setIsAutoPlaying(true);

    triggerAttack('code');
    setTimeout(() => {
      triggerAttack('cost');
      setTimeout(() => {
        triggerAttack('cost');
        setIsAutoPlaying(false);
      }, 1200);
    }, 1200);
  };

  const handleReset = () => {
    setHpDeepSeek(100);
    setHpGPT(100);
    setIsKnockout(false);
    setActiveAttack(null);
    setFloatingTexts([]);
    setCombatLog(['Arena reiniciada.']);
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
              MÓDULO 05 • ARQUITETURA DE MODELOS & BENCHMARKS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              O Duelo dos Gigantes: Open-Source vs Proprietário
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              DeepSeek-R1 (raciocínio aberto e custo ultrabaixo) vs GPT-4o (titã comercial e multimodal).
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying || isKnockout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática da batalha"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoPlaying ? 'Demonstrando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🥊 ARENA: CARDS ESTILO CARD-GAME MODERNO (APPLE ARCADE / HEARTHSTONE CLEAN) */}
        <div className="w-full p-6 rounded-xl bg-zinc-950/60 border border-zinc-800/70 relative overflow-hidden flex flex-col justify-between">
          {/* Efeito sutil de ataque no centro */}
          {activeAttack && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0.6 }}
              animate={{ scaleX: 1, opacity: 0.9 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/4 right-1/4 h-1 -translate-y-1/2 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20"
            />
          )}

          {/* Textos de dano flutuantes */}
          <AnimatePresence>
            {floatingTexts.map((f) => (
              <motion.div
                key={f.id}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: -25, opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-1/3 z-30 font-mono font-bold text-xs sm:text-sm ${
                  f.side === 'left' ? 'left-16' : 'right-16'
                } ${f.colorClass}`}
              >
                {f.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Grid com os 2 Cards de Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            {/* Card 1: DeepSeek-R1 */}
            <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                    🐉
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">DeepSeek-R1</h3>
                    <span className="text-[11px] font-mono text-amber-400">Open-Source</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  $0.14 / 1M
                </span>
              </div>

              {/* Barra de HP Suave */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Pontos de Vida</span>
                  <span>{hpDeepSeek}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    animate={{ width: `${hpDeepSeek}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Arquitetura:</span>
                  <span className="text-zinc-200">MoE Reflexivo puro</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospedagem:</span>
                  <span className="text-zinc-200">Local (Ollama) / Cloud</span>
                </div>
              </div>
            </div>

            {/* Card 2: GPT-4o */}
            <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">GPT-4o</h3>
                    <span className="text-[11px] font-mono text-blue-400">Proprietário</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                  $5.00 / 1M
                </span>
              </div>

              {/* Barra de HP Suave */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                  <span>Pontos de Vida</span>
                  <span>{hpGPT}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    animate={{ width: `${hpGPT}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div className="flex justify-between">
                  <span>Arquitetura:</span>
                  <span className="text-zinc-200">Omni Multimodal Nativo</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospedagem:</span>
                  <span className="text-zinc-200">OpenAI Cloud API</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de K.O. */}
          {isKnockout && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3 p-4 text-center"
            >
              <h3 className="text-2xl font-bold text-white">Confronto Concluído</h3>
              <p className="text-xs text-zinc-300 font-mono">
                {hpGPT === 0 ? 'DeepSeek-R1 venceu com eficiência superior!' : 'GPT-4o venceu o benchmark!'}
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Repetir Confronto
              </button>
            </motion.div>
          )}
        </div>

        {/* ⚔️ SELETORES DE AÇÃO REFINADOS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => triggerAttack('code')}
            disabled={isKnockout}
            className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-zinc-700 text-left transition-all active:scale-98 disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-blue-400 font-mono text-xs font-semibold mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Desafio Código</span>
            </div>
            <p className="text-[11px] text-zinc-400">DeepSeek ataca com lógica reflexiva.</p>
          </button>

          <button
            onClick={() => triggerAttack('logic')}
            disabled={isKnockout}
            className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-zinc-700 text-left transition-all active:scale-98 disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-blue-400 font-mono text-xs font-semibold mb-1">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Teste Lógica</span>
            </div>
            <p className="text-[11px] text-zinc-400">GPT-4o ataca com síntese multimodal.</p>
          </button>

          <button
            onClick={() => triggerAttack('cost')}
            disabled={isKnockout}
            className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-zinc-700 text-left transition-all active:scale-98 disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Shock de Custo</span>
            </div>
            <p className="text-[11px] text-zinc-400">Dano crítico: Custo 95% menor!</p>
          </button>

          <button
            onClick={() => triggerAttack('speed')}
            disabled={isKnockout}
            className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/50 hover:border-zinc-700 text-left transition-all active:scale-98 disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Speed Test</span>
            </div>
            <p className="text-[11px] text-zinc-400">Empate técnico a 110 tokens/s.</p>
          </button>
        </div>

        {/* Narração discreta */}
        <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span className="truncate">
            📢 <strong>Observação:</strong> {combatLog[0]}
          </span>
          <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-2">+300 Score</span>
        </div>
      </div>
    </div>
  );
};
