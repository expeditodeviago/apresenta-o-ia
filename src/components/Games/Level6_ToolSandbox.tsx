// src/components/Games/Level6_ToolSandbox.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';
import {
  Code2,
  Network,
  Layout,
  BookOpen,
  Sparkles,
  Play,
  CheckCircle2,
  FileCode,
  Search,
  Check,
} from 'lucide-react';

type ToolTab = 'cursor' | 'obsidian' | 'v0' | 'notebooklm';

export const Level6_ToolSandbox: React.FC = () => {
  const { addScore } = useGameStore();
  const [activeTab, setActiveTab] = useState<ToolTab>('cursor');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Cursor state
  const [hasAcceptedTab, setHasAcceptedTab] = useState<boolean>(false);

  // v0.dev state
  const [v0Compiled, setV0Compiled] = useState<boolean>(false);

  // NotebookLM state
  const [ragSearchQuery, setRagSearchQuery] = useState<string>(
    'Qual a economia de infraestrutura ao migrar para modelos locais?'
  );

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    // Cicla entre as ferramentas demonstrando as capacidades
    const sequence: ToolTab[] = ['cursor', 'v0', 'notebooklm', 'obsidian'];
    let step = 0;

    const interval = setInterval(() => {
      const nextTab = sequence[step];
      setActiveTab(nextTab);
      arcadeAudio.playClick();

      if (nextTab === 'cursor') {
        setHasAcceptedTab(true);
      } else if (nextTab === 'v0') {
        setV0Compiled(true);
      }

      step++;
      if (step >= sequence.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.4);
        addScore(300);
        setIsAutoPlaying(false);
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 06 • O ECOSSISTEMA DE FERRAMENTAS DE IA
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The Tool Sandbox: Obsidian, Cursor, v0 & NotebookLM
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              O ecossistema que multiplica a capacidade humana: do Segundo Cérebro à geração instantânea de software.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática das 4 ferramentas"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoPlaying ? 'Demonstrando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🗂️ SELETORES DAS 4 FERRAMENTAS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              setActiveTab('cursor');
              arcadeAudio.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 'cursor'
                ? 'border-blue-500 bg-blue-500/10 shadow-md'
                : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-white mb-1">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Cursor / Windsurf</span>
            </div>
            <p className="text-[11px] text-zinc-400">Previsão em múltiplos arquivos</p>
          </button>

          <button
            onClick={() => {
              setActiveTab('v0');
              arcadeAudio.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 'v0'
                ? 'border-purple-500 bg-purple-500/10 shadow-md'
                : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-white mb-1">
              <Layout className="w-4 h-4 text-purple-400" />
              <span>v0.dev / Lovable</span>
            </div>
            <p className="text-[11px] text-zinc-400">Prompt virando UI React</p>
          </button>

          <button
            onClick={() => {
              setActiveTab('notebooklm');
              arcadeAudio.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 'notebooklm'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-md'
                : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-white mb-1">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>NotebookLM (RAG)</span>
            </div>
            <p className="text-[11px] text-zinc-400">Fontes ancoradas sem alucinação</p>
          </button>

          <button
            onClick={() => {
              setActiveTab('obsidian');
              arcadeAudio.playClick();
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activeTab === 'obsidian'
                ? 'border-amber-500 bg-amber-500/10 shadow-md'
                : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/40'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-white mb-1">
              <Network className="w-4 h-4 text-amber-400" />
              <span>Obsidian Graph</span>
            </div>
            <p className="text-[11px] text-zinc-400">Segundo cérebro interligado</p>
          </button>
        </div>

        {/* 💻 CONTEÚDO DA FERRAMENTA SELECIONADA */}
        <div className="w-full min-h-[280px] p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 relative overflow-hidden flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* 1. CURSOR / WINDSURF */}
            {activeTab === 'cursor' && (
              <motion.div
                key="tab-cursor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>// src/engine/pricing.ts (Indexado via Grafo AST)</span>
                  </span>
                  <button
                    onClick={() => {
                      setHasAcceptedTab(!hasAcceptedTab);
                      arcadeAudio.playClick();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[11px] font-mono hover:bg-blue-600/30 transition-colors"
                  >
                    {hasAcceptedTab ? 'Redefinir Sugestão' : 'Pressione [ Tab ⇥ ] para Aceitar'}
                  </button>
                </div>

                {/* Editor Simulado */}
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1.5 leading-relaxed">
                  <div>
                    <span className="text-purple-400">export function</span> calculateTotal(price: number, tax: number) {'{'}
                  </div>
                  <div className="pl-4 text-zinc-500">
                    // Previsão de Próxima Edição calculada em 100k arquivos do repositório:
                  </div>
                  <div className="pl-4 flex items-center flex-wrap gap-2">
                    {hasAcceptedTab ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                        return price * (1 + tax) - calculateLoyaltyDiscount(user.id);
                      </span>
                    ) : (
                      <span className="text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-dashed border-zinc-700">
                        return price * (1 + tax) - calculateLoyaltyDiscount(user.id);{' '}
                        <span className="text-[10px] text-blue-400 ml-1">Tab ⇥</span>
                      </span>
                    )}
                  </div>
                  <div>{'}'}</div>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 O Cursor não apenas completa a linha: ele prevê a próxima função que você vai editar em outro arquivo antes de você abri-lo.
                </p>
              </motion.div>
            )}

            {/* 2. V0.DEV / LOVABLE */}
            {activeTab === 'v0' && (
              <motion.div
                key="tab-v0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-zinc-300">Prompt: "Crie um card de métricas SaaS com gráfico e badge"</span>
                  <button
                    onClick={() => {
                      setV0Compiled(!v0Compiled);
                      arcadeAudio.playClick();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono transition-colors"
                  >
                    {v0Compiled ? 'Ver Código' : 'Gerar Interface em 1 Clique'}
                  </button>
                </div>

                {/* Componente Renderizado */}
                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center min-h-[140px]">
                  {v0Compiled ? (
                    <div className="w-full max-w-sm p-4 rounded-xl bg-zinc-950 border border-purple-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium">Conversão Semanal</span>
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-mono">
                          +42.8%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">98.4%</div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="w-[84%] h-full bg-purple-500 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-500 font-mono">
                      [ Clique em "Gerar Interface em 1 Clique" para sintetizar o componente React ]
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-400">
                  💡 v0.dev e Lovable transformam linguagem natural diretamente em JSX e Tailwind em menos de 20 segundos.
                </p>
              </motion.div>
            )}

            {/* 3. NOTEBOOKLM (RAG) */}
            {activeTab === 'notebooklm' && (
              <motion.div
                key="tab-notebooklm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
                  <Search className="w-4 h-4 text-zinc-500 ml-1" />
                  <span className="text-zinc-200 font-mono">{ragSearchQuery}</span>
                  <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Fonte: Whitepaper-Infra-2025.pdf (Pág 18)
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                    <Check className="w-3.5 h-3.5" />
                    <span>CITAÇÃO ANCORADA (ZERO ALUCINAÇÃO):</span>
                  </div>
                  <blockquote className="italic border-l-2 border-emerald-500/60 pl-3 text-zinc-300">
                    "Na Seção 3.2, a transição para clusters open-source locais reduziu os custos operacionais em <strong>82%</strong> mantendo 99.4% de disponibilidade."
                  </blockquote>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 RAG (Retrieval-Augmented Generation) faz a IA consultar manuais confiáveis antes de redigir cada resposta.
                </p>
              </motion.div>
            )}

            {/* 4. OBSIDIAN GRAPH */}
            {activeTab === 'obsidian' && (
              <motion.div
                key="tab-obsidian"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono text-amber-400">Rede Neural de Notas do Segundo Cérebro</span>
                  <span className="text-[11px] font-mono text-zinc-500">6 nós • 9 links bi-direcionais</span>
                </div>

                <div className="h-[150px] rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
                  <svg viewBox="0 0 400 140" className="w-full h-full">
                    {/* Linhas */}
                    <line x1="100" y1="70" x2="200" y2="40" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
                    <line x1="200" y1="40" x2="300" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
                    <line x1="200" y1="40" x2="200" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.6" />
                    <line x1="100" y1="70" x2="200" y2="110" stroke="#71717a" strokeWidth="1" strokeOpacity="0.4" />
                    <line x1="300" y1="70" x2="200" y2="110" stroke="#71717a" strokeWidth="1" strokeOpacity="0.4" />

                    {/* Nós */}
                    <circle cx="200" cy="40" r="12" fill="#f59e0b" className="animate-pulse" />
                    <text x="200" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                      [[ RAG ]]
                    </text>

                    <circle cx="100" cy="70" r="9" fill="#3b82f6" />
                    <text x="100" y="92" fill="#d4d4d8" fontSize="9" textAnchor="middle">
                      [[ Vetores ]]
                    </text>

                    <circle cx="300" cy="70" r="9" fill="#10b981" />
                    <text x="300" y="92" fill="#d4d4d8" fontSize="9" textAnchor="middle">
                      [[ PDFs ]]
                    </text>

                    <circle cx="200" cy="110" r="9" fill="#a855f7" />
                    <text x="200" y="130" fill="#d4d4d8" fontSize="9" textAnchor="middle">
                      [[ Agentes ]]
                    </text>
                  </svg>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 Seus arquivos locais no Obsidian são o banco de dados pessoal que alimenta seu copiloto de inteligência.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span>
            💡 <strong>Conceito Central:</strong> A IA não substitui o engenheiro; ela transforma um desenvolvedor em uma equipe de 10 pessoas.
          </span>
          <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-2">+300 Score</span>
        </div>
      </div>
    </div>
  );
};
