// src/components/acts/Act_HallucinationDetective.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { arcadeAudio } from '../../utils/arcadeAudio';

interface Statement {
  id: number;
  text: string;
  isHallucination: boolean;
  citation: string;
  explanation: string;
}

interface DetectiveCase {
  id: string;
  title: string;
  sourceDoc: string;
  statements: Statement[];
}

const CASES: DetectiveCase[] = [
  {
    id: 'case_1',
    title: 'Caso #01: A História Secreta dos Transformers',
    sourceDoc: 'Artigo Original: "Attention Is All You Need" (Vaswani et al., 2017) • Google Brain & Univ. Toronto',
    statements: [
      {
        id: 1,
        text: 'A arquitetura Transformer foi introduzida em 2017 por uma equipe de 8 pesquisadores, eliminando completamente a recorrência e convoluções.',
        isHallucination: false,
        citation: 'Pág. 1, Seção 1 (Introdução)',
        explanation: 'Fato autêntico. O paper provou que mecanismos de auto-atenção puros superam LSTMs com treinamento muito mais paralelo.',
      },
      {
        id: 2,
        text: 'Em 2021, os autores publicaram um adendo confirmando que Transformers alcançaram senciência biológica de nível 4 segundo a escala de Turing.',
        isHallucination: true,
        citation: 'NENHUMA CITAÇÃO NO DOCUMENTO FONTE (Invenção Plausível de LLM)',
        explanation: 'ALUCINAÇÃO! O modelo inventou um evento fictício com vocabulário técnico convincente para preencher a lacuna.',
      },
      {
        id: 3,
        text: 'O mecanismo de Auto-Atenção projeta os embeddings em tensores de Query (Q), Key (K) e Value (V) para calcular os pesos de relevância.',
        isHallucination: false,
        citation: 'Pág. 4, Seção 3.2 (Scaled Dot-Product Attention)',
        explanation: 'Fato autêntico. Q e K são multiplicados e divididos pela raiz de d_k antes de aplicar a função softmax.',
      },
    ],
  },
  {
    id: 'case_2',
    title: 'Caso #02: A Arquitetura do DeepSeek-R1',
    sourceDoc: 'Whitepaper: "DeepSeek-R1: Incentivizing Reasoning Capability via Reinforcement Learning" (2025)',
    statements: [
      {
        id: 1,
        text: 'O DeepSeek-R1 foi treinado com Aprendizado por Reforço em larga escala sem depender de dados supervisionados de humanos na primeira fase.',
        isHallucination: false,
        citation: 'Pág. 3, Seção 2 (DeepSeek-R1-Zero)',
        explanation: 'Fato autêntico. O modelo desenvolveu comportamentos autônomos de reflexão e backtracking via RL puro.',
      },
      {
        id: 2,
        text: 'A arquitetura Mixture-of-Experts (MoE) ativa apenas um subconjunto dos parâmetros a cada token para reduzir o custo de inferência.',
        isHallucination: false,
        citation: 'Pág. 6, Seção 3 (MoE Routing)',
        explanation: 'Fato autêntico. Apenas os especialistas mais relevantes para o contexto são acionados.',
      },
      {
        id: 3,
        text: 'Para funcionar, o DeepSeek-R1 requer que cada usuário conecte um chip quântico de grafeno à placa-mãe via barramento PCIe 7.0.',
        isHallucination: true,
        citation: 'INEXISTENTE NO DOCUMENTO (Alucinação Fabricada)',
        explanation: 'ALUCINAÇÃO! O modelo roda perfeitamente em clusters padrão de GPUs Nvidia H800 / H100.',
      },
    ],
  },
];

export const Act_HallucinationDetective: React.FC = () => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [selectedStatementId, setSelectedStatementId] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const activeCase = CASES[activeCaseIndex];
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Disparar Scanner RAG
  const runRAGScanner = () => {
    setIsScanning(true);
    arcadeAudio.playLaserBeam();

    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      arcadeAudio.playDeadlockAlarm();
    }, 1200);
  };

  const handleSelectStatement = (id: number) => {
    setSelectedStatementId(id);
    arcadeAudio.playHover();
  };

  const resetCase = () => {
    setSelectedStatementId(null);
    setIsScanning(false);
    setHasScanned(false);
    arcadeAudio.playModularGear();
  };

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        resetCase();
        setTimeout(() => {
          runRAGScanner();
        }, 1000);
      }, 5000);
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
            <span className="text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase">
              DETECTOR FORENSE • AUDITORIA DE RAG
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">
              Caça-Alucinações & Verificação em Fontes Oficiais
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            Hallucination Detective
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
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'bg-slate-800/80 text-emerald-300 border border-emerald-500/30 hover:bg-slate-700'
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

      {/* 🧩 SELETOR DE CASOS */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCaseIndex(idx);
                resetCase();
              }}
              className={`tactile-btn px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                activeCaseIndex === idx
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow'
                  : 'bg-slate-900/60 border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <button
          onClick={resetCase}
          className="tactile-btn p-2 rounded-xl text-zinc-400 hover:text-white bg-slate-800 border border-white/10"
          title="Resetar Scanner"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ⚡ PALCO DO DETETIVE: DOCUMENTO FONTE VS AFIRMAÇÕES DA IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUNA ESQUERDA: AS 3 AFIRMAÇÕES DA IA (7 COLS) */}
        <div className="lg:col-span-7 liquid-glass rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
          {/* Linha Laser do Scanner RAG descendo */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,1)] pointer-events-none z-30"
              />
            )}
          </AnimatePresence>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-400" />
                Resumo Gerado pelo LLM (Encontre a Alucinação):
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                {hasScanned ? 'Status: AUDITADO' : 'Status: AGUARDANDO SCAN'}
              </span>
            </div>

            {/* As 3 Afirmações */}
            <div className="space-y-3 mt-4">
              {activeCase.statements.map((stmt) => {
                const isSelected = selectedStatementId === stmt.id;
                const isRevealedHallucination = hasScanned && stmt.isHallucination;
                const isRevealedTrue = hasScanned && !stmt.isHallucination;

                return (
                  <button
                    key={stmt.id}
                    onClick={() => handleSelectStatement(stmt.id)}
                    className={`w-full tactile-btn p-3.5 rounded-2xl border text-left transition-all duration-300 relative ${
                      isRevealedHallucination
                        ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/20 ring-1 ring-rose-400'
                        : isRevealedTrue
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                          Afirmação #{stmt.id}
                        </span>
                        <p className="text-xs text-zinc-200 leading-relaxed">
                          {stmt.text}
                        </p>
                      </div>

                      {/* Selo Forense Pós-Scan */}
                      {hasScanned && (
                        <div className="shrink-0 pt-1">
                          {stmt.isHallucination ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500 text-rose-300 text-[10px] font-mono font-bold animate-pulse">
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              ALUCINAÇÃO!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              VERIFICADO
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Explicação da Citação após auditoria */}
                    {hasScanned && (
                      <div
                        className={`mt-2 pt-2 border-t text-[11px] font-mono ${
                          stmt.isHallucination
                            ? 'border-rose-500/20 text-rose-300'
                            : 'border-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        <span>Citação: {stmt.citation}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão de Disparo do Scanner */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              Clique nas afirmações para votar, ou acione o scanner para validar contra o PDF.
            </span>

            <button
              onClick={runRAGScanner}
              disabled={isScanning}
              className="tactile-btn px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 fill-current" />
              <span>{isScanning ? 'Escaneando RAG...' : '🔍 Ativar Scanner RAG'}</span>
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: DOCUMENTO FONTE OFICIAL & ANÁLISE FORENSE (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* O PDF Fonte Oficial */}
          <div className="liquid-glass rounded-3xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Documento Fonte Auditável (Ground Truth)
              </h3>
            </div>

            <p className="text-[11px] font-mono text-zinc-400 leading-relaxed bg-black/40 p-3 rounded-2xl border border-white/5">
              {activeCase.sourceDoc}
            </p>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Como o RAG Blindou a IA:
              </span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Ao forçar o modelo a citar o número de página exato e a ancorar as frases apenas nos vetores extraídos do PDF original, a taxa de alucinações cai para virtualmente zero.
              </p>
            </div>
          </div>

          {/* Dica Didática */}
          <div className="liquid-glass rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Por que IAs Alucinam com tanta Confiança?</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              O LLM não tem compromisso ontológico com a verdade; ele foi treinado para maximizar a verossimilhança estatística do próximo token. Sem fontes externas auditáveis (RAG), ele "inventa" com a mesma eloquência com que diz fatos reais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
