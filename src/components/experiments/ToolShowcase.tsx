import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Layout,
  Network,
  BookOpen,
  Sparkles,
  Play,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  FileText,
} from 'lucide-react';

type ToolId = 'cursor' | 'v0' | 'obsidian' | 'notebooklm';

interface ToolDef {
  id: ToolId;
  name: string;
  tagline: string;
  category: string;
  icon: React.ElementType;
  badgeColor: string;
}

const TOOLS: ToolDef[] = [
  {
    id: 'cursor',
    name: 'Cursor / Windsurf',
    tagline: 'Editor de Código Nativo com Predição de Próxima Linha',
    category: 'Engenharia de Software',
    icon: Code2,
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  },
  {
    id: 'v0',
    name: 'v0.dev / Lovable',
    tagline: 'Prompt-to-UI: Da Linguagem Natural para React em Segundos',
    category: 'Design & Prototipagem',
    icon: Layout,
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Canvas & Graph',
    tagline: 'Segundo Cérebro: Conexões Não-Lineares & Pensamento em Rede',
    category: 'Gestão do Conhecimento',
    icon: Network,
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'notebooklm',
    name: 'Google NotebookLM',
    tagline: 'RAG Confiável: Análise de Documentos com Citações Blindadas',
    category: 'Pesquisa & Síntese',
    icon: BookOpen,
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export const ToolShowcase: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('cursor');

  // --- 1. Cursor / Windsurf Interactive Demo State ---
  const [cursorInput, setCursorInput] = useState('');
  const [cursorAccepted, setCursorAccepted] = useState(false);
  const GHOST_SUGGESTION = 'const discountedPrice = price * (1 - discountPercentage / 100);';

  // --- 2. v0 / Lovable Interactive Demo State ---
  const [v0Prompt, setV0Prompt] = useState('Crie um card de faturamento Pro com badge');
  const [isV0Generating, setIsV0Generating] = useState(false);
  const [v0ComponentType, setV0ComponentType] = useState<'pro-card' | 'stats-card'>('pro-card');

  const handleGenerateV0 = () => {
    setIsV0Generating(true);
    setTimeout(() => {
      setIsV0Generating(false);
      setV0ComponentType((prev) => (prev === 'pro-card' ? 'stats-card' : 'pro-card'));
    }, 450);
  };

  // --- 3. Obsidian Interactive Graph State ---
  const [activeObsidianNode, setActiveObsidianNode] = useState<string>('llm');
  const OBSIDIAN_NODES = [
    { id: 'llm', label: 'Modelos de Linguagem (LLM)', connections: ['attention', 'tokens', 'rag', 'agents'] },
    { id: 'attention', label: 'Mecanismo de Atenção', connections: ['llm', 'transformer'] },
    { id: 'tokens', label: 'Tokenização BPE', connections: ['llm', 'embeddings'] },
    { id: 'embeddings', label: 'Espaço Vetorial', connections: ['tokens', 'rag'] },
    { id: 'rag', label: 'RAG (Busca Aumentada)', connections: ['llm', 'embeddings', 'notebooklm'] },
    { id: 'agents', label: 'Agentes Autônomos (ReAct)', connections: ['llm', 'tools'] },
  ];

  // --- 4. NotebookLM Interactive Demo State ---
  const [searchQuery, setSearchQuery] = useState('Qual a redução de custo do modelo?');
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(1);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Módulo 04 • Ferramentas de Ponta
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" /> O Arsenal do Desenvolvedor & Cientista
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Interactive Tool Catalog
            <span className="text-sm font-normal text-zinc-400 hidden sm:inline">
              — Casos Reais de Cursor, v0, Obsidian & NotebookLM
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Explore abaixo as ferramentas de maior produtividade do ecossistema atual com demonstrações interativas de cada paradigma.
          </p>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center bg-[#131317] p-1 rounded-xl border border-zinc-800">
          {TOOLS.map((tool) => {
            const isSelected = activeTool === tool.id;
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tool.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Demo Container */}
      <div className="my-5 flex-1 min-h-[420px] bg-[#111115] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col">
        {/* Active Tool Banner */}
        {(() => {
          const current = TOOLS.find((t) => t.id === activeTool)!;
          const CurrentIcon = current.icon;
          return (
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/70 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-white">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{current.name}</h3>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
                      {current.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{current.tagline}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Dynamic Interactive Demo Views */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. CURSOR / WINDSURF DEMO */}
            {activeTool === 'cursor' && (
              <motion.div
                key="cursor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    Simulador de Autocomplete Preditivo (Copilot++ / Next Edit Prediction)
                  </span>
                  <button
                    onClick={() => setCursorAccepted(!cursorAccepted)}
                    className="text-xs px-3 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-colors font-mono"
                  >
                    {cursorAccepted ? 'Limpar e Tentar Novamente' : 'Apertar [ Tab ] para Aceitar'}
                  </button>
                </div>

                {/* Code Window */}
                <div className="bg-[#09090c] border border-zinc-800 rounded-xl p-5 font-mono text-sm shadow-inner relative">
                  <div className="text-zinc-500 text-xs mb-3">// src/billing/calculateDiscount.ts</div>
                  <div className="space-y-1 leading-relaxed">
                    <div>
                      <span className="text-purple-400">function</span>{' '}
                      <span className="text-sky-400">applyPromotion</span>(
                      <span className="text-amber-300">price: number</span>,{' '}
                      <span className="text-amber-300">discountPercentage: number</span>
                      ): <span className="text-amber-300">number</span> {'{'}
                    </div>
                    <div className="pl-6 flex items-center flex-wrap">
                      <span className="text-zinc-500">// Calcular valor líquido com desconto</span>
                    </div>
                    <div className="pl-6 flex items-center flex-wrap">
                      {cursorAccepted ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20"
                        >
                          {GHOST_SUGGESTION}
                        </motion.span>
                      ) : (
                        <span className="text-zinc-600 bg-zinc-900/60 px-1 rounded border border-dashed border-zinc-700 select-none">
                          {GHOST_SUGGESTION}{' '}
                          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded ml-2">
                            Pressione Tab ⇥
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="pl-6 text-zinc-300">
                      <span className="text-purple-400">return</span> discountedPrice;
                    </div>
                    <div>{'}'}</div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 <strong>O diferencial do Cursor/Windsurf:</strong> O modelo lê todo o grafo de dependências do repositório e prevê a intenção do desenvolvedor antes mesmo dele terminar de digitar a função.
                </p>
              </motion.div>
            )}

            {/* 2. V0.DEV / LOVABLE DEMO */}
            {activeTool === 'v0' && (
              <motion.div
                key="v0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={v0Prompt}
                      onChange={(e) => setV0Prompt(e.target.value)}
                      className="w-full bg-[#16161b] border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleGenerateV0}
                    disabled={isV0Generating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isV0Generating ? 'animate-spin' : ''}`} />
                    {isV0Generating ? 'Compilando JSX...' : 'Gerar UI com IA'}
                  </button>
                </div>

                {/* Rendered Component Canvas */}
                <div className="bg-[#09090c] border border-zinc-800 rounded-xl p-6 min-h-[220px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {v0ComponentType === 'pro-card' ? (
                      <motion.div
                        key="pro"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#18181e] border border-zinc-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Plano Enterprise AI
                          </span>
                          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                            Mais Popular
                          </span>
                        </div>
                        <div className="text-3xl font-extrabold text-white">
                          R$ 289 <span className="text-xs text-zinc-400 font-normal">/ mês</span>
                        </div>
                        <ul className="text-xs text-zinc-300 space-y-1.5 font-sans">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-purple-400" /> Acesso ilimitado a Claude 3.5 & GPT-4o
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-purple-400" /> Indexação local de código com vetores
                          </li>
                        </ul>
                        <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md">
                          Fazer Upgrade Agora
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="stats"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#18181e] border border-zinc-700/80 rounded-2xl p-5 max-w-md w-full shadow-2xl grid grid-cols-2 gap-4"
                      >
                        <div className="bg-[#131317] p-3.5 rounded-xl border border-zinc-800">
                          <div className="text-zinc-400 text-xs">Tempo Economizado</div>
                          <div className="text-2xl font-bold text-white mt-1">4.8h / dia</div>
                          <div className="text-[10px] text-emerald-400 mt-1">+38% vs semana anterior</div>
                        </div>
                        <div className="bg-[#131317] p-3.5 rounded-xl border border-zinc-800">
                          <div className="text-zinc-400 text-xs">Linhas Sintetizadas</div>
                          <div className="text-2xl font-bold text-purple-400 mt-1">12.450</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Via Tailwind & React</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 <strong>O diferencial do v0 / Lovable:</strong> Elimina o gargalo entre design e código gerando interfaces prontas para produção com TailwindCSS e componentes acessíveis.
                </p>
              </motion.div>
            )}

            {/* 3. OBSIDIAN INTERACTIVE GRAPH DEMO */}
            {activeTool === 'obsidian' && (
              <motion.div
                key="obsidian"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    Clique em qualquer nota para explorar suas conexões bidirecionais:
                  </span>
                  <span className="text-xs text-amber-400 font-mono">
                    Nota ativa: [[{OBSIDIAN_NODES.find((n) => n.id === activeObsidianNode)?.label}]]
                  </span>
                </div>

                {/* Interactive Node Graph */}
                <div className="bg-[#09090c] border border-zinc-800 rounded-xl p-6 min-h-[220px] flex flex-wrap items-center justify-center gap-4 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

                  {OBSIDIAN_NODES.map((node) => {
                    const isSelected = activeObsidianNode === node.id;
                    const isConnected = OBSIDIAN_NODES.find((n) => n.id === activeObsidianNode)?.connections.includes(
                      node.id
                    );

                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveObsidianNode(node.id)}
                        className={`relative z-10 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105'
                            : isConnected
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm'
                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        [[ {node.label} ]]
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-zinc-400">
                  💡 <strong>O diferencial do Obsidian:</strong> Seus pensamentos não são pastas isoladas, mas sim uma teia viva de conexões neuronais que cresce com o tempo.
                </p>
              </motion.div>
            )}

            {/* 4. NOTEBOOKLM DEMO */}
            {activeTool === 'notebooklm' && (
              <motion.div
                key="notebooklm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#16161b] border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">Fonte: whitepaper-llm-2025.pdf</span>
                </div>

                {/* Document Viewer with Grounded Citations */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: AI Grounded Answer */}
                  <div className="md:col-span-6 bg-[#09090c] border border-zinc-800 rounded-xl p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Resposta Sintetizada com RAG
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      "Com a destilação de conhecimento e quantização para 4-bits, o custo de inferência diminuiu em{' '}
                      <button
                        onClick={() => setHighlightedCitation(1)}
                        className="font-bold text-emerald-400 bg-emerald-500/20 px-1 rounded hover:underline inline-flex items-center gap-0.5"
                      >
                        82% [Citação 1]
                      </button>
                      , permitindo executar modelos de fronteira em servidores convencionais sem perda mensurável de raciocínio lógico."
                    </p>
                  </div>

                  {/* Right: Original Grounded Document Excerpt */}
                  <div className="md:col-span-6 bg-[#141419] border border-zinc-800 rounded-xl p-4 font-mono text-[11px] text-zinc-400 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-zinc-400" /> Página 14 • Whitepaper
                      </span>
                      <span>Trecho Verificado</span>
                    </div>
                    <p className={`p-2 rounded transition-colors ${highlightedCitation === 1 ? 'bg-emerald-500/15 border border-emerald-500/30 text-zinc-200' : ''}`}>
                      [1] Section 4.2: "Empirical benchmarks demonstrate an 82% inference cost reduction when deploying quantized 4-bit weights across distributed clusters."
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">
                  💡 <strong>O diferencial do NotebookLM:</strong> Alucinação zero: toda afirmação gerada pela IA aponta exatamente para a página e linha do documento original carregado.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer summary */}
      <div className="bg-[#141417] border border-zinc-800/80 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span>
            A fronteira moderna não é apenas saber programar ou escrever texto, mas <strong>orquestrar as melhores ferramentas de IA para multiplicar o impacto</strong>.
          </span>
        </div>
        <span className="font-mono text-[11px] text-zinc-500 whitespace-nowrap">
          Stack Moderna • 2025+
        </span>
      </div>
    </div>
  );
};
