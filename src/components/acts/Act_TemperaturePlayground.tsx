// src/components/acts/Act_TemperaturePlayground.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  Sparkles,
  Flame,
  Snowflake,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/arcadeAudio';

interface TempZone {
  label: string;
  min: number;
  max: number;
  color: string;
  bitMood: 'ice' | 'ideal' | 'chaos';
  phrase: string;
  description: string;
}

const ZONES: TempZone[] = [
  {
    label: 'Determinístico / Frio',
    min: 0.0,
    max: 0.3,
    color: 'from-cyan-500 to-blue-600',
    bitMood: 'ice',
    phrase: 'Resposta 100% mecânica e repetitiva: "O gato subiu no telhado. O gato desceu do telhado. Fim."',
    description: 'Amostragem Greedy (Argmax). A probabilidade colapsa no token mais frequente. Zero risco, zero criatividade.',
  },
  {
    label: 'Zona Ideal / Equilíbrio Criativo',
    min: 0.6,
    max: 0.8,
    color: 'from-amber-400 to-yellow-500',
    bitMood: 'ideal',
    phrase: 'Resposta equilibrada: "O felino saltou silencioso pelo telhado iluminado pelo luar prateado da madrugada."',
    description: 'Softmax calibrado. Variância poética sem quebrar a coerência sintática nem o fio do raciocínio.',
  },
  {
    label: 'Caos / Alucinação Extrema',
    min: 1.5,
    max: 2.0,
    color: 'from-rose-500 to-red-600',
    bitMood: 'chaos',
    phrase: 'Alucinação frenética: "O gato quântico holográfico hiperbólico dançou na sopa de fótons de marte 42#$@!"',
    description: 'Entropia máxima. A distribuição de probabilidade vira uniforme; tokens raros e sem sentido são sorteados.',
  },
];

export const Act_TemperaturePlayground: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.7);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>(ZONES[1].phrase);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determinar zona atual
  const currentZone =
    temperature <= 0.3
      ? ZONES[0]
      : temperature >= 1.5
      ? ZONES[2]
      : temperature >= 0.6 && temperature <= 0.8
      ? ZONES[1]
      : {
          label: 'Transição Dinâmica',
          min: 0.4,
          max: 1.4,
          color: 'from-emerald-400 to-teal-500',
          bitMood: temperature < 0.6 ? 'ice' : 'ideal',
          phrase: `Temperatura em ${temperature.toFixed(1)}: "O gato caminhou com passos ágeis sob as telhas de cerâmica vermelha."`,
          description: 'Zona de transição moderada entre determinação e flexibilidade estilística.',
        };

  // Gerar continuação
  const handleGenerate = () => {
    setIsGenerating(true);
    if (temperature <= 0.3) {
      arcadeAudio.playDeadEnd();
    } else if (temperature >= 1.5) {
      arcadeAudio.playErrorBuzzer();
    } else {
      arcadeAudio.playCorrect();
    }

    setTimeout(() => {
      setDisplayText(currentZone.phrase);
      setIsGenerating(false);
    }, 350);
  };

  const handleSliderChange = (val: number) => {
    setTemperature(val);
    arcadeAudio.playHover();
  };

  // Auto-play cíclico demonstrando as 3 faixas
  useEffect(() => {
    if (isAutoPlaying) {
      const demoSteps = [0.0, 0.7, 2.0];
      let stepIndex = 0;

      autoPlayTimerRef.current = setInterval(() => {
        stepIndex = (stepIndex + 1) % demoSteps.length;
        const nextTemp = demoSteps[stepIndex];
        setTemperature(nextTemp);
        const nextZone =
          nextTemp <= 0.3 ? ZONES[0] : nextTemp >= 1.5 ? ZONES[2] : ZONES[1];
        setDisplayText(nextZone.phrase);

        if (nextTemp <= 0.3) arcadeAudio.playDeadEnd();
        else if (nextTemp >= 1.5) arcadeAudio.playErrorBuzzer();
        else arcadeAudio.playVictoryFanfare();
      }, 2500);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 select-none flex flex-col gap-4">
      {/* 🏷️ CABEÇALHO DO ATO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full text-rose-400 bg-rose-500/10 border border-rose-500/20 uppercase">
              EXPERIMENTO INTERATIVO • SAMPLING DE PROBABILIDADES
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              Softmax, Entropia & Alucinação
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            The Temperature Playground
          </h2>
        </div>

        {/* Botão Auto-Play */}
        <button
          onClick={() => {
            setIsAutoPlaying(!isAutoPlaying);
            arcadeAudio.playModularGear();
          }}
          className={`tactile-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isAutoPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-800/80 text-rose-300 border border-rose-500/30 hover:bg-slate-700'
          }`}
        >
          {isAutoPlaying ? (
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

      {/* 🧩 SELETORES DE PRESETS RÁPIDOS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          onClick={() => {
            setTemperature(0.0);
            setDisplayText(ZONES[0].phrase);
            arcadeAudio.playDeadEnd();
          }}
          className={`tactile-btn p-3 rounded-2xl border text-left transition-all ${
            temperature <= 0.2
              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
              : 'bg-slate-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              Temperatura 0.0 (Frio)
            </span>
            <span className="font-mono text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded">
              Argmax
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Cubo de gelo determinístico. A mesma resposta mecânica para sempre.
          </p>
        </button>

        <button
          onClick={() => {
            setTemperature(0.7);
            setDisplayText(ZONES[1].phrase);
            arcadeAudio.playVictoryFanfare();
          }}
          className={`tactile-btn p-3 rounded-2xl border text-left transition-all ${
            temperature >= 0.6 && temperature <= 0.8
              ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400'
              : 'bg-slate-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Temperatura 0.7 (Ideal)
            </span>
            <span className="font-mono text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">
              Golden Ratio
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Brilho dourado equilibrado. Frase criativa, poética e estruturada.
          </p>
        </button>

        <button
          onClick={() => {
            setTemperature(2.0);
            setDisplayText(ZONES[2].phrase);
            arcadeAudio.playErrorBuzzer();
          }}
          className={`tactile-btn p-3 rounded-2xl border text-left transition-all ${
            temperature >= 1.8
              ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-500/20 ring-1 ring-rose-400'
              : 'bg-slate-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-rose-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              Temperatura 2.0 (Caos)
            </span>
            <span className="font-mono text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded">
              Alucinação
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Superaquecimento e desvario. Palavras aleatórias quicando sem nexo.
          </p>
        </button>
      </div>

      {/* ⚡ PALCO CENTRAL: SLIDER TÁTIL + MASCOTE BIT + SAÍDA DO TEXTO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUNA ESQUERDA: O TERMÔMETRO & MASCOTE BIT (5 COLS) */}
        <div className="lg:col-span-5 liquid-glass rounded-3xl p-5 border border-white/10 flex flex-col items-center justify-between relative overflow-hidden">
          {/* Efeitos de Fundo Dinâmicos */}
          <div
            className={`absolute inset-0 opacity-20 pointer-events-none transition-all duration-700 bg-gradient-to-br ${currentZone.color}`}
          />

          {/* O Mascote Bit com Reações Físicas */}
          <div className="relative py-4 flex flex-col items-center">
            {/* Se temperatura for 0.0 (Cubo de Gelo) */}
            {temperature <= 0.3 ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1, rotate: [0, -1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="relative p-6 rounded-3xl bg-cyan-950/70 border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/40 flex flex-col items-center backdrop-blur-xl"
              >
                <div className="absolute -top-3 px-2 py-0.5 rounded bg-cyan-400 text-black text-[10px] font-bold uppercase tracking-wider">
                  Congelado (0.0)
                </div>
                <div className="text-5xl my-2 select-none">🧊</div>
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Bit em Pura Repetição
                </span>
                <span className="text-[10px] text-cyan-400/70">
                  Entropia = 0.00 bits
                </span>
              </motion.div>
            ) : temperature >= 1.5 ? (
              /* Se temperatura for 2.0 (Superaquecimento e Caos) */
              <motion.div
                animate={{
                  x: [-3, 3, -2, 2, 0],
                  y: [-2, 2, -3, 1, 0],
                  rotate: [-3, 4, -4, 2, 0],
                }}
                transition={{ repeat: Infinity, duration: 0.15 }}
                className="relative p-6 rounded-3xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl shadow-rose-500/50 flex flex-col items-center backdrop-blur-xl"
              >
                <div className="absolute -top-3 px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  🔥 Superaquecido (2.0)
                </div>
                <div className="text-5xl my-2 select-none animate-spin">🌀</div>
                <span className="text-xs font-mono font-bold text-rose-300">
                  Bit em Sobrecarga!
                </span>
                <span className="text-[10px] text-rose-400">
                  Entropia = 11.42 bits (Caos)
                </span>
              </motion.div>
            ) : (
              /* Se temperatura for ideal 0.7 (Brilho Dourado) */
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative p-6 rounded-3xl bg-amber-950/60 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 flex flex-col items-center backdrop-blur-xl"
              >
                <div className="absolute -top-3 px-2 py-0.5 rounded bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider">
                  ✨ Equilíbrio Perfeito
                </div>
                <div className="text-5xl my-2 select-none">🤖</div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  Bit Criativo & Lúcido
                </span>
                <span className="text-[10px] text-amber-400/80">
                  Entropia Calibrada (4.2 bits)
                </span>
              </motion.div>
            )}
          </div>

          {/* O Slider Tátil de Temperatura */}
          <div className="w-full space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-400" />
                Temperatura de Amostragem (T):
              </span>
              <span className="font-mono text-base font-black text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-xl border border-rose-500/30">
                {temperature.toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-800 accent-rose-500"
            />

            <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1">
              <span>0.0 (Frio)</span>
              <span className="text-amber-400 font-bold">0.7 (Ideal)</span>
              <span>2.0 (Caos)</span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: GERAÇÃO DO TEXTO & FÓRMULA DO SOFTMAX (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Card de Saída do LLM */}
          <div className="liquid-glass rounded-3xl p-5 border border-white/10 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Prompt: "Complete a frase: O gato..."
                </span>
                <span className="text-[11px] font-mono font-bold text-zinc-300">
                  Status: {currentZone.label}
                </span>
              </div>

              {/* Área do Texto Gerado */}
              <div className="min-h-[100px] mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm leading-relaxed text-zinc-200">
                {isGenerating ? (
                  <span className="text-amber-400 animate-pulse">
                    Computando distribuição de probabilidade com T = {temperature.toFixed(1)}...
                  </span>
                ) : (
                  displayText
                )}
              </div>
            </div>

            {/* Ação de Gerar Novamente */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-zinc-400 max-w-sm leading-relaxed">
                {currentZone.description}
              </p>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="tactile-btn px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Gerar Novamente</span>
              </button>
            </div>
          </div>

          {/* Card Didático: Como Funciona na Matemática */}
          <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>A Matemática do Softmax Dividido por T</span>
            </div>
            <div className="bg-black/50 p-2 rounded-xl font-mono text-[11px] text-zinc-300 border border-white/5 overflow-x-auto">
              P(token_i) = exp(Logit_i / T) / Σ exp(Logit_j / T)
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Dividir os logits por um valor pequeno ($T \to 0$) amplia a distância entre o 1º e o 2º colocado, tornando o vencedor quase certo. Dividir por $T$ grande achata a curva, tornando todas as escolhas equiprováveis!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
