import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Sparkles, Layers, Eye, ArrowRight } from 'lucide-react';

const SENTENCE = ['O', 'animal', 'não', 'atravessou', 'a', 'rua', 'porque', 'estava', 'muito', 'cansado'];

// Attention weight matrix map (how much word i attends to word j)
// Key example: 'cansado' or 'estava' heavily attends to 'animal' (0.84), not 'rua' (0.04)
const ATTENTION_WEIGHTS: Record<number, Record<number, number>> = {
  // 'animal'
  1: { 0: 0.2, 1: 0.9, 3: 0.5, 7: 0.6, 9: 0.7 },
  // 'atravessou'
  3: { 1: 0.75, 3: 0.9, 5: 0.85 },
  // 'rua'
  5: { 3: 0.8, 4: 0.3, 5: 0.9 },
  // 'estava'
  7: { 1: 0.82, 6: 0.4, 7: 0.9, 9: 0.78 },
  // 'cansado'
  9: { 1: 0.89, 5: 0.05, 7: 0.81, 8: 0.65, 9: 0.95 },
};

export const Act04_Transformers: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(9); // default to 'cansado'
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3);

  const currentAttention = hoveredIdx !== null && ATTENTION_WEIGHTS[hoveredIdx] ? ATTENTION_WEIGHTS[hoveredIdx] : {};

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Ato 04 • Arquitetura Transformer
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Network className="w-3.5 h-3.5 text-purple-400" /> "Attention Is All You Need" (2017)
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            A Mágica dos Transformers & Auto-Atenção
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Como a IA contextualiza o mundo
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Antes dos Transformers, a máquina lia palavra por palavra em linha e esquecia o início da frase. A <strong className="text-purple-300">Auto-Atenção</strong> permite que cada palavra se conecte instantaneamente a todas as outras simultaneamente.
          </p>
        </div>

        {/* Pipeline Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          Pipeline de 4 Estágios
        </div>
      </div>

      {/* 4-Stage Transformer Pipeline Diagram */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {[
          { id: 1, label: '1. Prompt Entrada', desc: 'Frase bruta digitada' },
          { id: 2, label: '2. Vetores & Posição', desc: 'Embeddings + Positional' },
          { id: 3, label: '3. Auto-Atenção', desc: 'Conexões Q × K × V' },
          { id: 4, label: '4. Próxima Palavra', desc: 'Previsão Softmax' },
        ].map((step) => {
          const isSelected = activePipelineStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActivePipelineStep(step.id)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{step.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Interactive Attention Heatmap Arena */}
      <div className="flex-1 min-h-[340px] obsidian-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Passe o mouse sobre as palavras para ver a Atenção disparar:
            </span>
          </div>
          <span className="text-xs font-mono text-purple-300">
            Foco ativo: "{hoveredIdx !== null ? SENTENCE[hoveredIdx] : 'nenhum'}"
          </span>
        </div>

        {/* Word Chips Row with Attention Links */}
        <div className="my-auto py-6">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 relative z-10">
            {SENTENCE.map((word, idx) => {
              const isHovered = hoveredIdx === idx;
              const weight = currentAttention[idx] || 0;
              const hasHighAttention = weight > 0.4;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="relative flex flex-col items-center cursor-pointer group"
                >
                  {/* Attention score pill indicator above word */}
                  <div
                    className={`text-[10px] font-mono mb-2 px-1.5 py-0.5 rounded transition-all ${
                      hasHighAttention
                        ? 'bg-purple-500 text-white font-bold scale-110 shadow-[0_0_10px_#a855f7]'
                        : isHovered
                        ? 'bg-white text-slate-950 font-bold'
                        : 'opacity-0 text-slate-500'
                    }`}
                  >
                    {isHovered ? 'Origem' : `${Math.round(weight * 100)}%`}
                  </div>

                  {/* Word Badge */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.15 : hasHighAttention ? 1.05 : 1,
                      y: isHovered ? -4 : 0,
                    }}
                    className={`px-4 py-2.5 rounded-xl border text-sm md:text-base font-semibold transition-all ${
                      isHovered
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                        : hasHighAttention
                        ? 'bg-purple-950/70 text-purple-200 border-purple-500/60 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {word}
                  </motion.div>

                  {/* Attention bar below */}
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
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

          {/* Explanation Box */}
          <div className="mt-8 p-4 rounded-xl bg-[#0b0f19] border border-purple-500/20 max-w-3xl mx-auto text-xs text-slate-300 leading-relaxed text-center">
            {hoveredIdx === 9 ? (
              <span>
                🎯 <strong>O Momento 'Eureka' da Auto-Atenção:</strong> Ao ler a palavra <strong className="text-purple-300">"cansado"</strong>, a rede joga <strong>89% de atenção para "animal"</strong> e apenas <strong>5% para "rua"</strong>. Ela sabe exatamente quem estava cansado sem precisar de regras manuais!
              </span>
            ) : hoveredIdx === 3 ? (
              <span>
                Ao analisar <strong>"atravessou"</strong>, a atenção conecta o sujeito (<strong>"animal"</strong>, 75%) e o complemento (<strong>"rua"</strong>, 80%), compreendendo a gramática relacional inteira.
              </span>
            ) : (
              <span>
                Mova o cursor pelas palavras da frase para observar como as matrizes Query (Q) e Key (K) calculam o peso de afinidade contextual em tempo real.
              </span>
            )}
          </div>
        </div>

        {/* Bottom Didactic Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
          <span>Softmax(QKᵀ / √d_k) V</span>
          <span className="text-purple-400">Complexidade O(N²) paralelizável em GPUs</span>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>
            Por que o Transformer dominou o mundo? Porque ele pode ser <strong>treinado em paralelo em milhares de GPUs ao mesmo tempo</strong>, devorando toda a internet.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Base de ChatGPT, Claude & Gemini
        </span>
      </div>
    </div>
  );
};
