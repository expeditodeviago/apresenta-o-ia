import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scissors, Cpu, RotateCcw } from 'lucide-react';

// Palette requested: soft red, pastel blue, amber, sage green
const LEGO_COLORS = [
  { bg: '#38bdf8', text: '#082f49', border: '#0284c7', stud: '#7dd3fc', name: 'Azul Pastel' },
  { bg: '#ef4444', text: '#450a0a', border: '#b91c1c', stud: '#f87171', name: 'Vermelho Suave' },
  { bg: '#f59e0b', text: '#451a03', border: '#d97706', stud: '#fbbf24', name: 'Âmbar' },
  { bg: '#10b981', text: '#022c22', border: '#059669', stud: '#34d399', name: 'Verde Sálvia' },
  { bg: '#a855f7', text: '#3b0764', border: '#7e22ce', stud: '#c084fc', name: 'Roxo Lavanda' },
];

interface TokenBlock {
  id: string;
  text: string;
  tokenId: number;
  colorIdx: number;
}

// Deterministic token ID generator
function hashToken(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash % 90000) + 10000;
}

// Simple didactical subword/token splitter
function sliceIntoTokens(text: string): TokenBlock[] {
  if (!text.trim()) return [];

  // Match words, spaces, punctuations
  const regex = /[\wÀ-ú]+|[^\s\wÀ-ú]+|\s+/g;
  const matches = text.match(regex) || [];
  const tokens: TokenBlock[] = [];

  matches.forEach((segment, idx) => {
    // If word is longer than 5 chars, split into 2 subword lego pieces for didactic BPE feel
    if (segment.length > 5 && !/^\s+$/.test(segment)) {
      const mid = Math.ceil(segment.length / 2);
      const part1 = segment.slice(0, mid);
      const part2 = segment.slice(mid);

      tokens.push({
        id: `tok-${idx}-a-${part1}`,
        text: part1,
        tokenId: hashToken(part1),
        colorIdx: tokens.length % LEGO_COLORS.length,
      });

      tokens.push({
        id: `tok-${idx}-b-${part2}`,
        text: part2,
        tokenId: hashToken(part2),
        colorIdx: tokens.length % LEGO_COLORS.length,
      });
    } else {
      tokens.push({
        id: `tok-${idx}-${segment}`,
        text: segment,
        tokenId: hashToken(segment),
        colorIdx: tokens.length % LEGO_COLORS.length,
      });
    }
  });

  return tokens;
}

// Next token prediction candidates based on input text context
function getNextTokenPredictions(text: string) {
  const clean = text.trim().toLowerCase();
  if (clean.includes('inteligência') || clean.includes('ia') || clean.includes('llm')) {
    return [
      { word: 'artificial', prob: 78, color: LEGO_COLORS[0], id: 18492 },
      { word: 'generativa', prob: 14, color: LEGO_COLORS[2], id: 24901 },
      { word: 'humana', prob: 8, color: LEGO_COLORS[3], id: 11203 },
    ];
  }
  if (clean.includes('computador') || clean.includes('código') || clean.includes('programa')) {
    return [
      { word: 'executa', prob: 64, color: LEGO_COLORS[1], id: 31094 },
      { word: 'processa', prob: 24, color: LEGO_COLORS[0], id: 19823 },
      { word: 'compila', prob: 12, color: LEGO_COLORS[3], id: 44021 },
    ];
  }
  return [
    { word: 'transforma', prob: 62, color: LEGO_COLORS[0], id: 15932 },
    { word: 'conecta', prob: 26, color: LEGO_COLORS[2], id: 33491 },
    { word: 'simplifica', prob: 12, color: LEGO_COLORS[3], id: 28410 },
  ];
}

const PRESET_PHRASES = [
  'A Inteligência Artificial pensa em blocos',
  'LLMs transformam palavras em números',
  'Tokens são peças de Lego da linguagem',
];

export const LegoTokenSlicer: React.FC = () => {
  const [inputText, setInputText] = useState('A inteligência artificial pensa em blocos');
  const [isSlicing, setIsSlicing] = useState(false);

  const tokens = useMemo(() => sliceIntoTokens(inputText), [inputText]);
  const predictions = useMemo(() => getNextTokenPredictions(inputText), [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setIsSlicing(true);
    setTimeout(() => setIsSlicing(false), 260);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Módulo 01 • Tokenização
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" /> Processamento em Tempo Real
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Lego Token Slicer
            <span className="text-sm font-normal text-zinc-400 hidden sm:inline">
              — A Máquina de Peças de LEGO da IA
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Modelos de IA não leem palavras como humanos: eles usam uma guilhotina de alta velocidade para fatiar frases em pedaços atômicos (<strong className="text-zinc-200">Tokens</strong>) e atribuir um código de barras numérico a cada um.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500 font-mono">Exemplos:</span>
          {PRESET_PHRASES.map((phrase, i) => (
            <button
              key={i}
              onClick={() => setInputText(phrase)}
              className="text-xs px-2.5 py-1 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 transition-colors"
            >
              {phrase.slice(0, 18)}...
            </button>
          ))}
          {inputText && (
            <button
              onClick={() => setInputText('')}
              className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"
              title="Limpar texto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Input area with animated laser slicer indicator */}
      <div className="my-5 relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Digite qualquer texto para fatiar em peças de LEGO..."
            className="w-full bg-[#121215] border border-zinc-700/70 focus:border-sky-500/80 rounded-xl px-5 py-3.5 text-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-all shadow-inner font-sans"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700/40">
              {tokens.length} {tokens.length === 1 ? 'bloco' : 'blocos'}
            </span>
          </div>
        </div>

        {/* Dynamic Slicer Blade Glow */}
        <AnimatePresence>
          {isSlicing && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Industrial Conveyor Belt (Esteira Gráfica de Blocos de LEGO) */}
      <div className="relative flex-1 min-h-[220px] bg-[#111114] border border-zinc-800 rounded-2xl p-6 overflow-hidden flex flex-col justify-center">
        {/* Conveyor Belt Background Graphic Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Conveyor Tracks Top and Bottom */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-b border-zinc-900" />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 border-t border-zinc-900" />

        {/* Slicer Blade Indicator */}
        <div className="absolute top-2 bottom-2 left-10 w-0.5 bg-sky-500/40 border-r border-dashed border-sky-400/60 pointer-events-none flex flex-col justify-between items-center py-2">
          <div className="bg-sky-500 text-zinc-950 p-1 rounded-full shadow-lg -translate-x-1/2">
            <Scissors className="w-3 h-3" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400/80 rotate-90 origin-left whitespace-nowrap">
            GUILHOTINA BPE
          </span>
          <div className="w-2 h-2 rounded-full bg-sky-400 -translate-x-1/2 animate-ping" />
        </div>

        {/* Tokens Container */}
        <div className="flex items-center gap-3 overflow-x-auto py-6 pl-14 pr-6 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {tokens.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-600 italic text-sm text-center w-full py-8 font-mono"
              >
                A esteira industrial está vazia. Digite algo acima para começar a produção de blocos.
              </motion.div>
            ) : (
              tokens.map((tok, idx) => {
                const color = LEGO_COLORS[tok.colorIdx];
                const isSpace = /^\s+$/.test(tok.text);

                return (
                  <motion.div
                    key={tok.id}
                    layout
                    initial={{ opacity: 0, y: -25, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26, delay: idx * 0.02 }}
                    className="flex-shrink-0 flex flex-col items-center group cursor-default"
                  >
                    {/* SVG Lego Brick Component */}
                    <div
                      className="relative rounded-lg p-3 transition-transform duration-150 group-hover:-translate-y-1 shadow-md"
                      style={{
                        backgroundColor: color.bg,
                        border: `1.5px solid ${color.border}`,
                      }}
                    >
                      {/* LEGO Studs on top of the brick */}
                      <div className="absolute -top-2 left-2 right-2 flex justify-around">
                        <div
                          className="w-3 h-2 rounded-t-sm shadow-sm"
                          style={{ backgroundColor: color.stud, borderTop: `1px solid ${color.border}` }}
                        />
                        <div
                          className="w-3 h-2 rounded-t-sm shadow-sm"
                          style={{ backgroundColor: color.stud, borderTop: `1px solid ${color.border}` }}
                        />
                      </div>

                      {/* Content inside Lego Brick */}
                      <div className="flex flex-col items-center min-w-[54px] pt-1">
                        <span
                          className="font-bold text-base md:text-lg leading-none tracking-tight"
                          style={{ color: color.text }}
                        >
                          {isSpace ? '␣' : tok.text}
                        </span>
                        <span
                          className="text-[10px] font-mono mt-1 px-1.5 py-0.5 rounded bg-black/20 text-white font-medium tracking-tighter"
                        >
                          #{tok.tokenId}
                        </span>
                      </div>
                    </div>

                    {/* Step order index indicator */}
                    <span className="text-[10px] text-zinc-500 font-mono mt-2">
                      #{idx + 1}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Leque de Probabilidade da Próxima Peça de LEGO */}
      <div className="mt-5 bg-[#141417] border border-zinc-800/80 rounded-xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
              Medidor Preditivo: Qual será a próxima peça de LEGO?
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Amostragem via Softmax & Probabilidade
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {predictions.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#18181c] border border-zinc-700/50 hover:border-zinc-600 rounded-lg p-3 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color.bg }}
                  />
                  <span className="font-semibold text-sm text-zinc-100">
                    "{item.word}"
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    #{item.id}
                  </span>
                </div>
                <span className="text-sm font-bold font-mono text-sky-400">
                  {item.prob}%
                </span>
              </div>

              {/* Animated probability bar */}
              <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.prob}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color.bg }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
