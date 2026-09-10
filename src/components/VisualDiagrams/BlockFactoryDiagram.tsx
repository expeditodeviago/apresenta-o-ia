import React, { useState } from 'react';
import { Sparkles, ArrowRight, Scissors, Play, RotateCcw, ChevronRight, Hash, Layers, Plus } from 'lucide-react';

interface BlockFactoryDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

interface CustomToken {
  text: string;
  id: number;
  color: string;
}

const COLOR_PALETTE = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

const PRESETS = [
  'A inteligência artificial',
  'O futuro do desenvolvimento',
  'Para criar um aplicativo',
  'Os agentes autônomos',
];

export const BlockFactoryDiagram: React.FC<BlockFactoryDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(1);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;
  const [inputText, setInputText] = useState('A inteligência artificial');

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(3, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  // Dynamic tokenizer simulation: divides words & subwords into LEGO blocks
  const tokenizeText = (text: string): CustomToken[] => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const tokensList: CustomToken[] = [];
    let colorIdx = 0;

    words.forEach((word) => {
      if (word.length <= 4) {
        const hashId = Math.abs(word.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 17)) % 90000 + 1000;
        tokensList.push({ text: word, id: hashId, color: COLOR_PALETTE[colorIdx % COLOR_PALETTE.length] });
        colorIdx++;
      } else {
        const mid = Math.ceil(word.length * 0.55);
        const sub1 = word.slice(0, mid);
        const sub2 = word.slice(mid);

        const id1 = Math.abs(sub1.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 19)) % 90000 + 1000;
        tokensList.push({ text: sub1, id: id1, color: COLOR_PALETTE[colorIdx % COLOR_PALETTE.length] });
        colorIdx++;

        const id2 = Math.abs(sub2.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 23)) % 90000 + 1000;
        tokensList.push({ text: sub2, id: id2, color: COLOR_PALETTE[colorIdx % COLOR_PALETTE.length] });
        colorIdx++;
      }
    });

    return tokensList.length > 0
      ? tokensList
      : [{ text: 'IA', id: 4821, color: '#0ea5e9' }];
  };

  const tokens = tokenizeText(inputText);

  // Dynamic predictions based on current text
  const getDynamicPredictions = (text: string) => {
    const lower = text.toLowerCase().trim();
    if (lower.includes('inteligência') || lower.includes('ia')) {
      return [
        { word: 'transforma', prob: 64, color: '#10b981', badge: 'Mais Provável' },
        { word: 'ajuda', prob: 24, color: '#0ea5e9', badge: 'Alternativa' },
        { word: 'aprende', prob: 12, color: '#f59e0b', badge: 'Rápida' },
      ];
    }
    if (lower.includes('futuro') || lower.includes('desenvolvimento')) {
      return [
        { word: 'pertence', prob: 58, color: '#10b981', badge: 'Mais Provável' },
        { word: 'será', prob: 28, color: '#0ea5e9', badge: 'Alternativa' },
        { word: 'acelera', prob: 14, color: '#f59e0b', badge: 'Rápida' },
      ];
    }
    if (lower.includes('aplicativo') || lower.includes('criar')) {
      return [
        { word: 'rápido', prob: 62, color: '#10b981', badge: 'Mais Provável' },
        { word: 'moderno', prob: 26, color: '#0ea5e9', badge: 'Alternativa' },
        { word: 'agora', prob: 12, color: '#f59e0b', badge: 'Rápida' },
      ];
    }
    return [
      { word: 'funciona', prob: 60, color: '#10b981', badge: 'Mais Provável' },
      { word: 'conecta', prob: 25, color: '#0ea5e9', badge: 'Alternativa' },
      { word: 'evolui', prob: 15, color: '#f59e0b', badge: 'Rápida' },
    ];
  };

  const predictions = getDynamicPredictions(inputText);

  const handleAppendPrediction = (word: string) => {
    setInputText((prev) => `${prev.trim()} ${word}`);
  };

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-foreground shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Top Header & Stage Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              A Máquina de Peças de LEGO: Como a IA Enxerga o Texto
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Frase na esteira ➔ Guilhotina mecânica ➔ Identificadores numéricos ➔ Próxima peça provável
            </p>
          </div>
        </div>

        {/* Stage Selector Buttons */}
        <div className="flex items-center gap-2">
          {[
            { idx: 0, label: '1. Entrada' },
            { idx: 1, label: '2. Fatiador LEGO' },
            { idx: 2, label: '3. Códigos ID' },
            { idx: 3, label: '4. Próxima Peça' },
          ].map((s) => (
            <button
              key={s.idx}
              onClick={() => setStep(s.idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                step === s.idx
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setStep((step + 1) % 4)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold flex items-center gap-1 transition-all"
          >
            <span>Avançar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setInputText('A inteligência artificial');
              setStep(1);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-all"
            title="Restaurar padrão"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite qualquer frase para fatiar ao vivo..."
              className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-700 text-white font-mono text-base focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            {inputText.length > 0 && (
              <button
                onClick={() => setInputText('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono"
              >
                Limpar
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-primary font-bold whitespace-nowrap shadow-sm">
              {tokens.length} {tokens.length === 1 ? 'Token LEGO' : 'Tokens LEGO'}
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 mr-1">Exemplos:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(p)}
              className="px-3 py-1 rounded-xl text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Visual Conveyor Belt Stage */}
      <div className="relative min-h-[380px] flex flex-col justify-center items-center overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8">
        {/* Step Banner */}
        <div className="mb-6 text-center relative z-10">
          {step === 0 && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              1. A frase entra contínua na esteira de produção
            </span>
          )}
          {step === 1 && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Scissors className="w-3.5 h-3.5 text-primary" />
              2. A guilhotina mecânica fatia a frase em bloquinhos coloridos de LEGO
            </span>
          )}
          {step === 2 && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Hash className="w-3.5 h-3.5 text-primary" />
              3. Cada peça recebe uma etiqueta numérica de identificação (ID do Token)
            </span>
          )}
          {step === 3 && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              4. A IA calcula quais são as próximas peças com mais chance de encaixar!
            </span>
          )}
        </div>

        {/* Conveyor Belt System */}
        <div className="w-full max-w-4xl relative py-6 z-10">
          {/* Mechanical Guillotine */}
          <div
            className={`absolute -top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 flex flex-col items-center ${
              step >= 1 ? 'translate-y-2 opacity-100' : '-translate-y-4 opacity-30'
            }`}
          >
            <div className="px-5 py-1.5 rounded-t-xl bg-zinc-800 border-t border-x border-zinc-700 flex items-center justify-center shadow-lg">
              <span className="text-[11px] font-mono tracking-wider text-zinc-200 font-bold uppercase">
                GUILHOTINA DE TOKENS
              </span>
            </div>
            <div className="w-48 h-3 bg-zinc-900 border-x border-zinc-700" />
            <div className="w-72 h-[2px] bg-primary shadow-sm" />
          </div>

          {/* Conveyor Belt Surface */}
          <div className="relative w-full min-h-[130px] rounded-2xl bg-zinc-950 border border-zinc-700/80 flex items-center justify-center px-6 py-4 overflow-hidden shadow-inner">
            {/* Conveyor Content */}
            <div className="w-full flex items-center justify-center gap-3 relative z-20">
              {step === 0 ? (
                <div className="px-8 py-4 rounded-xl bg-zinc-900 text-white font-mono text-lg md:text-xl font-bold tracking-wide border border-zinc-700 shadow-md">
                  "{inputText}"
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {tokens.map((token, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center group transition-transform hover:scale-105"
                    >
                      {/* LEGO Studs */}
                      <div className="flex gap-1 mb-1">
                        <div className="w-3 h-1.5 rounded-t-sm shadow-sm" style={{ backgroundColor: token.color }} />
                        <div className="w-3 h-1.5 rounded-t-sm shadow-sm" style={{ backgroundColor: token.color }} />
                      </div>

                      {/* LEGO Brick */}
                      <div
                        className="px-4 py-3 rounded-xl font-mono text-sm md:text-base font-black shadow-lg flex flex-col items-center min-w-[70px] border-2"
                        style={{
                          backgroundColor: `${token.color}20`,
                          borderColor: token.color,
                          color: '#ffffff',
                        }}
                      >
                        <span>"{token.text}"</span>
                        {step >= 2 && (
                          <span
                            className="mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                            style={{
                              backgroundColor: `${token.color}30`,
                              color: '#ffffff',
                              border: `1px solid ${token.color}60`,
                            }}
                          >
                            #{token.id}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conveyor Roller Wheels */}
          <div className="flex justify-between px-8 pt-3">
            {[...Array(11)].map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center shadow-inner"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Step 3+: Interactive Prediction LEGO Pieces (Click to append!) */}
        {step >= 3 && (
          <div className="w-full max-w-4xl mt-6 pt-5 border-t border-zinc-800/80 animate-in fade-in duration-300">
            <div className="text-center mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                👉 Clique em qualquer peça abaixo para encaixar na frase e continuar gerando:
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {predictions.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAppendPrediction(p.word)}
                  className="rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.02] group border relative overflow-hidden bg-zinc-950 border-zinc-800 hover:border-emerald-500/50 shadow-md cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-300 border border-zinc-700">
                      {p.badge}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {p.prob}% de chance
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
                      <span className="text-zinc-500 group-hover:translate-x-1 transition-transform">➔</span>
                      <span>"{p.word}"</span>
                    </div>
                    <span className="p-1.5 rounded-xl bg-zinc-900 text-primary border border-zinc-700">
                      <Plus className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-900 mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-emerald-400"
                      style={{ width: `${p.prob}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Pill */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500 px-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Foco Prático: A IA não lê mentes — ela calcula a probabilidade da próxima peça linguística em milissegundos.</span>
        </div>
        <span className="text-zinc-500">Pressione [Espaço] para avançar</span>
      </div>
    </div>
  );
};

