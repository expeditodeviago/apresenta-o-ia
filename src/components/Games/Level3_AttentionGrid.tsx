// src/components/Games/Level3_AttentionGrid.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Network,
  Sparkles,
  Play,
  Eye,
  Layers,
  ArrowRight,
} from 'lucide-react';

const SENTENCE = ['O', 'animal', 'não', 'atravessou', 'a', 'rua', 'porque', 'estava', 'muito', 'cansado'];

const ATTENTION_WEIGHTS: Record<number, Record<number, number>> = {
  1: { 0: 0.2, 1: 0.9, 3: 0.5, 7: 0.6, 9: 0.7 }, // animal
  3: { 1: 0.75, 3: 0.9, 5: 0.85 }, // atravessou
  5: { 3: 0.8, 4: 0.3, 5: 0.9 }, // rua
  7: { 1: 0.82, 6: 0.4, 7: 0.9, 9: 0.78 }, // estava
  9: { 1: 0.89, 5: 0.05, 7: 0.81, 8: 0.65, 9: 0.95 }, // cansado
};

export const Level3_AttentionGrid: React.FC = () => {
  const { addScore } = useGameStore();
  const [hoveredIdx, setHoveredIdx] = useState<number>(9); // Padrão em 'cansado'
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const currentAttention = ATTENTION_WEIGHTS[hoveredIdx] || {};

  const handleHoverWord = (idx: number) => {
    setHoveredIdx(idx);
    arcadeAudio.playClick();
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playLaserShot();

    // Demonstra a transição de foco: "atravessou" -> "estava" -> "cansado" (o momento eureka)
    const sequence = [3, 7, 9];
    let step = 0;

    const interval = setInterval(() => {
      setHoveredIdx(sequence[step]);
      arcadeAudio.playLaserShot();
      step++;

      if (step >= sequence.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.4);
        addScore(150);
        setIsAutoPlaying(false);
      }
    }, 700);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 03 • MECANISMO DE AUTO-ATENÇÃO (TRANSFORMERS)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Attention Laser Grid: Como a IA Contextualiza o Mundo
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Passe o mouse sobre os termos para ver os feixes de atenção conectando palavras simultaneamente.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática da conexão de atenção"
          >
            <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
            <span>{isAutoPlaying ? 'Disparando Lasers...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* ⚡ ARENA DO GRID DE LASER DE ATENÇÃO */}
        <div className="w-full p-6 rounded-xl bg-zinc-950/70 border border-zinc-800/70 relative overflow-hidden flex flex-col items-center justify-center space-y-6 shadow-inner">
          <div className="flex items-center justify-between w-full text-xs text-zinc-400 pb-2 border-b border-zinc-800/80">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Palavra sob Foco Ativo:</span>
              <strong className="text-purple-300 font-mono">"{SENTENCE[hoveredIdx]}"</strong>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              Cálculo Matricial: Q × Kᵀ / √d_k
            </span>
          </div>

          {/* Fita de Palavras da Frase */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 py-4">
            {SENTENCE.map((word, idx) => {
              const isOrigin = hoveredIdx === idx;
              const weight = currentAttention[idx] || 0;
              const isHigh = weight > 0.4;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => handleHoverWord(idx)}
                  className="relative flex flex-col items-center cursor-pointer group"
                >
                  {/* Badge de Porcentagem de Atenção */}
                  <div
                    className={`text-[10px] font-mono mb-1.5 px-1.5 py-0.5 rounded transition-all ${
                      isHigh
                        ? 'bg-purple-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                        : isOrigin
                        ? 'bg-white text-zinc-950 font-bold'
                        : 'opacity-0 text-zinc-600'
                    }`}
                  >
                    {isOrigin ? 'Origem' : `${Math.round(weight * 100)}%`}
                  </div>

                  {/* Card da Palavra */}
                  <motion.div
                    animate={{
                      scale: isOrigin ? 1.08 : isHigh ? 1.03 : 1,
                      y: isOrigin ? -3 : 0,
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      isOrigin
                        ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                        : isHigh
                        ? 'bg-purple-950/50 text-purple-200 border-purple-500/50'
                        : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {word}
                  </motion.div>

                  {/* Barra de Energia Laser de Atenção */}
                  <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-400"
                      animate={{ width: `${weight * 100}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explicação Didática */}
          <div className="w-full max-w-2xl p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 text-center leading-relaxed">
            {hoveredIdx === 9 ? (
              <span>
                🎯 <strong>O Enigma da Resolução Contextual:</strong> Ao focar na palavra <strong className="text-purple-300">"cansado"</strong>, o feixe de atenção direciona <strong>89% para "animal"</strong> e apenas <strong>5% para "rua"</strong>. O Transformer resolve ambiguidades instantaneamente sem regras estáticas!
              </span>
            ) : hoveredIdx === 3 ? (
              <span>
                Ao inspecionar <strong>"atravessou"</strong>, o feixe conecta o agente (<strong>"animal"</strong>, 75%) ao complemento (<strong>"rua"</strong>, 80%), mapeando toda a estrutura relacional da oração.
              </span>
            ) : (
              <span>
                Passe o mouse sobre qualquer palavra da frase para ver o cálculo do produto escalar Query × Key em tempo real.
              </span>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span>
            💡 <strong>Por que revolucionou o mundo:</strong> Ao contrário das antigas redes sequenciais (RNNs), o Transformer calcula a atenção de todas as palavras em paralelo nas GPUs.
          </span>
          <span className="text-purple-400 font-mono text-[11px] shrink-0 ml-2">+150 Score</span>
        </div>
      </div>
    </div>
  );
};
