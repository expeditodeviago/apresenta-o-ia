// src/components/acts/Act_ContextWindowTetris.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  AlertTriangle,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Minimize2,
  FileText,
  MessageSquare,
  Code2,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/arcadeAudio';

interface ContextBlock {
  id: string;
  name: string;
  category: string;
  originalTokens: number;
  compressedTokens: number;
  color: string;
  icon: string;
}

const INITIAL_BLOCKS: ContextBlock[] = [
  {
    id: 'sys',
    name: 'Instruções do Sistema (System Prompt)',
    category: 'Regras',
    originalTokens: 4000,
    compressedTokens: 2000,
    color: 'from-cyan-500 to-blue-600',
    icon: '⚙️',
  },
  {
    id: 'history',
    name: 'Histórico da Sessão (20 Mensagens)',
    category: 'Chat',
    originalTokens: 8000,
    compressedTokens: 2500,
    color: 'from-blue-500 to-indigo-600',
    icon: '💬',
  },
  {
    id: 'pdf',
    name: 'Manual Técnico de 50 Páginas',
    category: 'Documentos',
    originalTokens: 16000,
    compressedTokens: 2000,
    color: 'from-amber-500 to-orange-600',
    icon: '📄',
  },
  {
    id: 'code',
    name: 'Arquivos do Repositório (10 scripts)',
    category: 'Código',
    originalTokens: 12000,
    compressedTokens: 1500,
    color: 'from-purple-500 to-fuchsia-600',
    icon: '💻',
  },
  {
    id: 'prompt',
    name: 'Pergunta Atual do Usuário',
    category: 'Prompt',
    originalTokens: 4000,
    compressedTokens: 500,
    color: 'from-emerald-500 to-teal-600',
    icon: '❓',
  },
];

const MAX_WINDOW_TOKENS = 32000;

export const Act_ContextWindowTetris: React.FC = () => {
  const [activeBlocks, setActiveBlocks] = useState<ContextBlock[]>([
    INITIAL_BLOCKS[0],
    INITIAL_BLOCKS[1],
    INITIAL_BLOCKS[2],
  ]);
  const [isCompressed, setIsCompressed] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calcular total de tokens atual
  const totalTokens = activeBlocks.reduce(
    (acc, b) => acc + (isCompressed ? b.compressedTokens : b.originalTokens),
    0
  );

  const isOverflow = totalTokens > MAX_WINDOW_TOKENS;
  const percentage = Math.min(100, (totalTokens / MAX_WINDOW_TOKENS) * 100);

  // Adicionar próximo bloco
  const addBlock = (block: ContextBlock) => {
    if (!activeBlocks.some((b) => b.id === block.id)) {
      setActiveBlocks((prev) => [...prev, block]);
      arcadeAudio.playLegoSnap();
    }
  };

  // Remover bloco
  const removeBlock = (id: string) => {
    setActiveBlocks((prev) => prev.filter((b) => b.id !== id));
    arcadeAudio.playHover();
  };

  // Comprimir com RAG
  const compressWithRAG = () => {
    setIsCompressed(true);
    arcadeAudio.playVictoryFanfare();
  };

  // Resetar
  const resetWindow = () => {
    setActiveBlocks([INITIAL_BLOCKS[0], INITIAL_BLOCKS[1]]);
    setIsCompressed(false);
    arcadeAudio.playModularGear();
  };

  // Disparar som de alarme quando estourar
  useEffect(() => {
    if (isOverflow) {
      arcadeAudio.playDeadlockAlarm();
    }
  }, [isOverflow]);

  // Auto-Play
  useEffect(() => {
    if (isAutoPlaying) {
      let step = 0;
      autoPlayTimerRef.current = setInterval(() => {
        step++;
        if (step === 1) {
          setActiveBlocks(INITIAL_BLOCKS);
          setIsCompressed(false);
        } else if (step === 2) {
          setIsCompressed(true);
          arcadeAudio.playVictoryFanfare();
        } else if (step === 3) {
          setActiveBlocks([INITIAL_BLOCKS[0], INITIAL_BLOCKS[1]]);
          setIsCompressed(false);
          step = 0;
        }
      }, 3000);
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
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 uppercase">
              GESTÃO DE MEMÓRIA • CONTEXT WINDOW
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              Limites de Atenção & Compressão Vetorial com RAG
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            Context Window Tetris
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
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-slate-800/80 text-indigo-300 border border-indigo-500/30 hover:bg-slate-700'
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

      {/* 🧩 SELETORES DE INJEÇÃO DE BLOCOS DE DADOS */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {INITIAL_BLOCKS.map((block) => {
            const isAdded = activeBlocks.some((b) => b.id === block.id);
            return (
              <button
                key={block.id}
                onClick={() => (isAdded ? removeBlock(block.id) : addBlock(block))}
                className={`tactile-btn px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isAdded
                    ? 'bg-slate-800 text-white border-white/20 shadow'
                    : 'bg-slate-900/50 text-zinc-400 border-white/5 hover:border-white/20'
                }`}
              >
                <span>{block.icon}</span>
                <span>{block.name.split(' (')[0]}</span>
                <span className="font-mono text-[10px] text-cyan-400">
                  +{block.originalTokens / 1000}k
                </span>
                {isAdded ? (
                  <span className="text-[10px] text-rose-400 ml-1">×</span>
                ) : (
                  <span className="text-[10px] text-emerald-400 ml-1">+</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={resetWindow}
          className="tactile-btn p-2 rounded-xl text-zinc-400 hover:text-white bg-slate-800 border border-white/10"
          title="Resetar Janela"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ⚡ PALCO DO TETRIS: CONTAINER VERTICAL + PAINEL DE CONTROLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUNA ESQUERDA: O CONTAINER VERTICAL DE MEMÓRIA (7 COLS) */}
        <div
          className={`lg:col-span-7 liquid-glass rounded-3xl p-5 border transition-all duration-500 relative flex flex-col justify-between min-h-[360px] overflow-hidden ${
            isOverflow
              ? 'border-rose-500/80 shadow-2xl shadow-rose-500/30 bg-rose-950/20'
              : 'border-white/10'
          }`}
        >
          {/* Header do Container */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">
                Capacidade da Janela de Contexto (Context Window)
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-300">
              Limite: 32.000 Tokens (32k)
            </span>
          </div>

          {/* Banner de Overflow se estourar o limite */}
          <AnimatePresence>
            {isOverflow && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="my-2 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>
                    ⚠️ CONTEXT OVERFLOW! ({totalTokens.toLocaleString()} / 32.000 tokens). O modelo começou a esquecer o início da conversa!
                  </span>
                </div>
                <button
                  onClick={compressWithRAG}
                  className="px-2.5 py-1 rounded-lg bg-rose-500 text-black font-bold text-[11px]"
                >
                  Comprimir Agora
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pilha dos Blocos Tipo Tetris */}
          <div className="flex-1 flex flex-col-reverse justify-start gap-2 py-3">
            <AnimatePresence>
              {activeBlocks.map((block) => {
                const tokens = isCompressed ? block.compressedTokens : block.originalTokens;
                const blockHeight = Math.max(38, (tokens / 4000) * 16);

                return (
                  <motion.div
                    key={block.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{ height: `${blockHeight}px` }}
                    className={`rounded-2xl p-3 border border-white/20 bg-gradient-to-r ${block.color} flex items-center justify-between text-white shadow-lg shadow-black/40`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold truncate">
                      <span>{block.icon}</span>
                      <span className="truncate">{block.name}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs font-bold shrink-0">
                      {isCompressed ? (
                        <span className="text-emerald-300 flex items-center gap-1">
                          <Minimize2 className="w-3 h-3" />
                          {(tokens / 1000).toFixed(1)}k (RAG Chunks)
                        </span>
                      ) : (
                        <span>{(tokens / 1000).toFixed(0)}k tokens</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Barra de Progresso de Ocupação da Memória */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-400">Ocupação da Janela:</span>
              <span
                className={`font-bold ${
                  isOverflow
                    ? 'text-rose-400'
                    : isCompressed
                    ? 'text-emerald-400'
                    : 'text-cyan-400'
                }`}
              >
                {totalTokens.toLocaleString()} / 32.000 tokens ({percentage.toFixed(0)}%)
              </span>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/10">
              <motion.div
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full rounded-full ${
                  isOverflow
                    ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                    : isCompressed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: BOTÃO DE COMPRESSÃO RAG & EXPLICAÇÃO (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Card da Ação de Compressão RAG */}
          <div className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>A Solução: Fatiamento & RAG</span>
            </h3>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Em vez de despejar documentos inteiros na memória de inferência (o que custa fortunas e causa perda de atenção), o <strong>RAG</strong> fatia o conteúdo em <em>chunks</em> e injeta apenas os trechos que têm alta similaridade vetorial com a pergunta.
            </p>

            <button
              onClick={compressWithRAG}
              disabled={isCompressed}
              className="w-full tactile-btn py-3 rounded-2xl font-bold text-xs text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              <Minimize2 className="w-4 h-4 fill-current" />
              <span>{isCompressed ? '✅ Contexto Otimizado com RAG' : '🗜️ Comprimir Janela com RAG'}</span>
            </button>

            {isCompressed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1"
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Economia de {(((44000 - totalTokens) / 44000) * 100).toFixed(0)}% nos Tokens!</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  O modelo agora processa 4x mais rápido com zero risco de esquecer comandos fundamentais.
                </p>
              </motion.div>
            )}
          </div>

          {/* Card Didático */}
          <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>O Paradoxo "Lost in the Middle"</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pesquisas de Stanford provaram que LLMs lembram muito bem do início e do fim do contexto, mas esquecem detalhes no meio quando a janela passa de 20k tokens. O RAG resolve esse problema entregando foco cirúrgico!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
