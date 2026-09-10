import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, BookOpen, Search, FileText, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface NoteNode {
  id: string;
  label: string;
  category: 'core' | 'arch' | 'tools';
  connections: string[];
  x: number;
  y: number;
}

const GRAPH_NODES: NoteNode[] = [
  { id: 'rag', label: 'RAG (Busca Aumentada)', category: 'core', connections: ['embeddings', 'chunks', 'hallucination'], x: 380, y: 150 },
  { id: 'embeddings', label: 'Vetores Semânticos', category: 'core', connections: ['rag', 'chunks'], x: 220, y: 80 },
  { id: 'chunks', label: 'Fragmentação de PDFs', category: 'arch', connections: ['rag', 'embeddings'], x: 540, y: 80 },
  { id: 'hallucination', label: 'Eliminação de Alucinações', category: 'tools', connections: ['rag', 'notebooklm'], x: 380, y: 240 },
  { id: 'notebooklm', label: 'NotebookLM Grounding', category: 'tools', connections: ['hallucination', 'rag'], x: 180, y: 220 },
  { id: 'obsidian', label: 'Obsidian Graph', category: 'tools', connections: ['rag'], x: 580, y: 220 },
];

export const Act07_SecondBrain: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('rag');
  const [activeTab, setActiveTab] = useState<'graph' | 'rag'>('rag');
  const [searchQuery, setSearchQuery] = useState('Qual a redução de custo atingida com RAG e quantização?');
  const [hasSearched, setHasSearched] = useState(true);

  const activeNode = GRAPH_NODES.find((n) => n.id === activeNodeId) || GRAPH_NODES[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Ato 07 • Gestão do Conhecimento & RAG
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Obsidian & Grounded AI
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Segundo Cérebro & RAG na Prática
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Como blindar a IA contra alucinações
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            LLMs não decoram tudo: elas precisam consultar manuais externos confiáveis em tempo real. O <strong className="text-amber-300">RAG (Retrieval-Augmented Generation)</strong> busca trechos exatos em seus PDFs antes de redigir a resposta.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#0b0f19] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('rag')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rag' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulador RAG</span>
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'graph' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Grafo Obsidian</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Showcase */}
      <div className="my-5 flex-1 min-h-[380px] obsidian-glass rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-2xl">
        <AnimatePresence mode="wait">
          {activeTab === 'rag' ? (
            <motion.div
              key="rag-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
                <div className="text-xs font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Fonte: relatorio-financeiro-q4.pdf
                </div>
              </div>

              {/* RAG Pipeline 3-step visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                {/* Step 1: Retrieval */}
                <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">1. Busca Vetorial</span>
                    <span className="text-slate-500">K-Nearest</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    O modelo calcula a similaridade do cosseno entre a pergunta e 10.000 pedaços (chunks) do PDF.
                  </p>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                    Chunk #142 encontrado (similaridade: 0.94)
                  </div>
                </div>

                {/* Step 2: Grounded Citations */}
                <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-400 font-bold">2. Trecho Original</span>
                    <span className="text-slate-500">Pág 27</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-[11px] font-mono text-slate-300">
                    "Na Seção 4.1, a migração para arquitetura quantizada gerou <strong>84% de redução de custos</strong> de inferência sem perda de acurácia."
                  </div>
                </div>

                {/* Step 3: Synthesis */}
                <div className="bg-[#090d16] border border-emerald-500/30 rounded-xl p-4 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">3. Resposta Sintetizada</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Zero Alucinação
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "Segundo a página 27 do relatório, a redução comprovada foi de <strong>84%</strong>, viabilizada pelo pipeline de quantização."
                  </p>
                </div>
              </div>

              {/* RAG Rule of Thumb */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  O poder do <strong>NotebookLM & RAG corporativo:</strong> A IA não tenta inventar fatos; ela atua como um bibliotecário com memória fotográfica citando a página e o parágrafo exatos.
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="graph-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Clique nos nós para inspecionar os links bi-direcionais no cérebro digital:</span>
                <span className="font-mono text-amber-400">Nota ativa: [[{activeNode.label}]]</span>
              </div>

              {/* SVG Interactive Obsidian Graph */}
              <div className="relative flex-1 min-h-[220px] flex items-center justify-center">
                <svg viewBox="0 0 760 300" className="w-full h-full max-h-[260px]">
                  {/* Graph Edges */}
                  {GRAPH_NODES.map((node) =>
                    node.connections.map((targetId) => {
                      const target = GRAPH_NODES.find((t) => t.id === targetId);
                      if (!target) return null;
                      const isConnectedToActive = activeNode.id === node.id || activeNode.id === target.id;
                      return (
                        <line
                          key={`${node.id}-${targetId}`}
                          x1={node.x}
                          y1={node.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={isConnectedToActive ? '#f59e0b' : '#334155'}
                          strokeWidth={isConnectedToActive ? 2 : 1}
                          strokeOpacity={isConnectedToActive ? 0.9 : 0.4}
                        />
                      );
                    })
                  )}

                  {/* Graph Nodes */}
                  {GRAPH_NODES.map((node) => {
                    const isSelected = activeNode.id === node.id;
                    const isConnected = activeNode.connections.includes(node.id);

                    return (
                      <g
                        key={node.id}
                        onClick={() => setActiveNodeId(node.id)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isSelected ? 22 : 16}
                          fill={isSelected ? '#f59e0b' : isConnected ? '#78350f' : '#0f172a'}
                          stroke={isSelected ? '#fef08a' : isConnected ? '#f59e0b' : '#475569'}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          className="transition-all duration-200"
                        />
                        <text
                          x={node.x}
                          y={node.y + 32}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : '#cbd5e1'}
                          fontSize="11"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fontFamily="sans-serif"
                        >
                          [[ {node.label} ]]
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="text-center text-xs text-slate-400 font-mono">
                Conexões ativas de [[{activeNode.label}]]: {activeNode.connections.length} links bi-direcionais
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Insight */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            A regra de ouro: <strong>"A IA é o motor de processamento; seus arquivos no Obsidian e PDFs no NotebookLM são o combustível de alta octanagem."</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Pensamento Conectado
        </span>
      </div>
    </div>
  );
};
