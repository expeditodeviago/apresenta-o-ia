// src/components/acts/Act06_BuilderMatrix.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
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
  ShieldCheck,
  Layers,
  ArrowRight,
  Cpu,
  CornerDownLeft,
} from 'lucide-react';

type ToolTab = 'cursor' | 'obsidian' | 'v0' | 'notebooklm';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  connections: string[];
}

export const Act06_BuilderMatrix: React.FC = () => {
  const { addScore } = usePresentationStore();
  const [activeTab, setActiveTab] = useState<ToolTab>('cursor');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // 💻 Cursor & Windsurf State
  const [cursorActiveFile, setCursorActiveFile] = useState<'App.tsx' | 'api.ts'>('App.tsx');
  const [hasAcceptedTab, setHasAcceptedTab] = useState<boolean>(false);

  // 🔮 Obsidian Graph State (Nós da constelação interativa)
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: '1', label: 'Segundo Cérebro', x: 260, y: 150, color: '#8b5cf6', connections: ['2', '3', '4'] },
    { id: '2', label: 'Embeddings', x: 120, y: 80, color: '#06b6d4', connections: ['1', '5'] },
    { id: '3', label: 'Self-Attention', x: 400, y: 90, color: '#ec4899', connections: ['1', '6'] },
    { id: '4', label: 'Agentes Autônomos', x: 270, y: 260, color: '#10b981', connections: ['1', '5', '6'] },
    { id: '5', label: 'RAG Vetorial', x: 90, y: 230, color: '#3b82f6', connections: ['2', '4'] },
    { id: '6', label: 'Modelos de Raciocínio', x: 440, y: 220, color: '#f59e0b', connections: ['3', '4'] },
  ]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 🎨 v0.dev State
  const [v0Stage, setV0Stage] = useState<'wireframe' | 'compiling' | 'compiled'>('wireframe');

  // 🛡️ NotebookLM State
  const [selectedCitation, setSelectedCitation] = useState<number>(1);

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    const sequence: ToolTab[] = ['cursor', 'v0', 'notebooklm', 'obsidian'];
    let step = 0;

    const interval = setInterval(() => {
      const nextTab = sequence[step];
      setActiveTab(nextTab);
      arcadeAudio.playClick();

      if (nextTab === 'cursor') {
        setHasAcceptedTab(true);
      } else if (nextTab === 'v0') {
        setV0Stage('compiled');
      }

      step++;
      if (step >= sequence.length) {
        clearInterval(interval);
        fireStarBurst(0.5, 0.4);
        addScore(300);
        setIsAutoPlaying(false);
      }
    }, 1200);
  };

  const handleAcceptTab = () => {
    setHasAcceptedTab(true);
    arcadeAudio.playLegoSnap();
    fireStarBurst(0.5, 0.45);
    addScore(150);
  };

  const handleCompileV0 = () => {
    if (v0Stage === 'compiling') return;
    setV0Stage('compiling');
    arcadeAudio.playLaserBeam();

    setTimeout(() => {
      setV0Stage('compiled');
      arcadeAudio.playVictoryFanfare();
      fireStarBurst(0.5, 0.45);
      addScore(200);
    }, 900);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl rounded-3xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wider">
              ATO 06 • O ECOSSISTEMA DE FERRAMENTAS DE IA
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>The Builder's Matrix: Cursor, Obsidian, v0 & NotebookLM</span>
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              O ecossistema que multiplica a produtividade humana: autocompletar multi-arquivo, grafos de conhecimento, síntese de UI e RAG blindado.
            </p>
          </div>

          {/* Botão Auto-Play */}
          <button
            onClick={handleAutoPlay}
            disabled={isAutoPlaying}
            className="tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600/30 hover:bg-blue-600/40 border border-blue-400/40 text-xs font-semibold text-blue-200 hover:text-white transition-all active:scale-95 disabled:opacity-50 shrink-0"
            title="Demonstração automática das 4 ferramentas"
          >
            <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
            <span>{isAutoPlaying ? 'Demonstrando...' : 'Modo Demonstração'}</span>
          </button>
        </div>

        {/* 🗂️ SELETORES DAS 4 FERRAMENTAS (ABAS TÁTEIS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              setActiveTab('cursor');
              arcadeAudio.playClick();
            }}
            className={`tactile-btn flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'cursor'
                ? 'bg-blue-600/25 border-blue-400/50 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-zinc-400'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'cursor' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-zinc-500'}`}>
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Cursor / Windsurf</div>
              <div className="text-[10px] text-zinc-400">Agentic IDE (Tab Multi-file)</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('obsidian');
              arcadeAudio.playClick();
            }}
            className={`tactile-btn flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'obsidian'
                ? 'bg-purple-600/25 border-purple-400/50 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-zinc-400'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'obsidian' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-zinc-500'}`}>
              <Network className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Obsidian</div>
              <div className="text-[10px] text-zinc-400">Constelação do Segundo Cérebro</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('v0');
              arcadeAudio.playClick();
            }}
            className={`tactile-btn flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'v0'
                ? 'bg-emerald-600/25 border-emerald-400/50 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-zinc-400'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'v0' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-zinc-500'}`}>
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">v0.dev / Lovable</div>
              <div className="text-[10px] text-zinc-400">Wireframe ➔ UI React Viva</div>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('notebooklm');
              arcadeAudio.playClick();
            }}
            className={`tactile-btn flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'notebooklm'
                ? 'bg-amber-600/25 border-amber-400/50 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 text-zinc-400'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'notebooklm' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-zinc-500'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">NotebookLM</div>
              <div className="text-[10px] text-zinc-400">RAG Blindado contra Alucinação</div>
            </div>
          </button>
        </div>

        {/* 🪟 PAINEL DINÂMICO DA FERRAMENTA SELECIONADA */}
        <div className="min-h-[360px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* 1. CURSOR / WINDSURF */}
            {activeTab === 'cursor' && (
              <motion.div
                key="cursor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Editor estilo VS Code / Cursor com abas */}
                <div className="rounded-2xl liquid-glass-subtle border border-white/10 overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <div className="ml-3 flex items-center gap-1 text-xs text-zinc-400">
                        <button
                          onClick={() => setCursorActiveFile('App.tsx')}
                          className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                            cursorActiveFile === 'App.tsx' ? 'bg-slate-800 text-cyan-300 font-semibold border-b-2 border-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          App.tsx
                        </button>
                        <button
                          onClick={() => setCursorActiveFile('api.ts')}
                          className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                            cursorActiveFile === 'api.ts' ? 'bg-slate-800 text-cyan-300 font-semibold border-b-2 border-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          api/chat.ts
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      <Cpu className="w-3 h-3" />
                      <span>Cursor Tab Engine (Claude 3.5 Sonnet)</span>
                    </div>
                  </div>

                  <div className="p-5 font-mono text-xs sm:text-sm bg-slate-950/80 leading-relaxed overflow-x-auto min-h-[170px]">
                    {cursorActiveFile === 'App.tsx' ? (
                      <div className="space-y-1">
                        <p className="text-zinc-500">// Simulação: O modelo prevê 4 linhas à frente com o contexto do repositório</p>
                        <p className="text-purple-400">const <span className="text-blue-300">chatSession</span> = useChatClient();</p>
                        <p className="text-purple-400">async function <span className="text-amber-300">streamResponse</span>(prompt: string) {'{'}</p>
                        <div className="pl-4">
                          <span className="text-emerald-400">const</span> response = await chatSession.stream(prompt);
                        </div>

                        {hasAcceptedTab ? (
                          <motion.div
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="pl-4 bg-emerald-500/10 border-l-2 border-emerald-400 py-1"
                          >
                            <p className="text-emerald-300 font-semibold">for await (const chunk of response) {'{'}</p>
                            <p className="text-emerald-300 pl-4">setLiveTokens((prev) =&gt; [...prev, chunk]);</p>
                            <p className="text-emerald-300">{'}'}</p>
                          </motion.div>
                        ) : (
                          <div className="pl-4 bg-cyan-500/10 border-l-2 border-cyan-400/80 py-1 text-cyan-300/80 flex items-center justify-between">
                            <span>
                              for await (const chunk of response) {'{'} setLiveTokens((prev) =&gt; [...prev, chunk]); {'}'}
                            </span>
                            <span className="text-[10px] font-mono bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-200 animate-pulse flex items-center gap-1">
                              [ Pressione TAB ] <CornerDownLeft className="w-3 h-3" />
                            </span>
                          </div>
                        )}
                        <p className="text-purple-400">{'}'}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-zinc-400">
                        <p className="text-zinc-500">// api/chat.ts (Cross-file indexing context)</p>
                        <p className="text-purple-400">export const <span className="text-amber-300">SYSTEM_PROMPT</span> = `You are a high-speed reasoning agent`;</p>
                        <p className="text-blue-400">export type <span className="text-cyan-300">ChatStreamPayload</span> = {'{'} token: string; confidence: number; {'}'};</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações e Métricas */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptTab}
                      disabled={hasAcceptedTab}
                      className="tactile-btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{hasAcceptedTab ? 'Código Aceito ✓ (Tab aplicado)' : 'Aceitar Sugestão [Tab]'}</span>
                    </button>
                    {hasAcceptedTab && (
                      <button
                        onClick={() => setHasAcceptedTab(false)}
                        className="text-xs text-zinc-400 hover:text-white underline ml-2"
                      >
                        Resetar
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Velocidade: 125 tokens/s
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span>Contexto: 24 arquivos indexados</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. OBSIDIAN GRAPH (CONSTELAÇÃO DO SEGUNDO CÉREBRO) */}
            {activeTab === 'obsidian' && (
              <motion.div
                key="obsidian"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="relative w-full h-[240px] rounded-2xl liquid-glass-subtle border border-purple-500/20 overflow-hidden bg-slate-950/70 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Linhas de Conexão */}
                    {nodes.map((node) =>
                      node.connections.map((targetId) => {
                        const target = nodes.find((n) => n.id === targetId);
                        if (!target || parseInt(node.id) > parseInt(targetId)) return null;
                        const isHighlighted = hoveredNode === node.id || hoveredNode === target.id;
                        return (
                          <line
                            key={`${node.id}-${target.id}`}
                            x1={node.x}
                            y1={node.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={isHighlighted ? '#c084fc' : '#475569'}
                            strokeWidth={isHighlighted ? 2.5 : 1.2}
                            strokeOpacity={isHighlighted ? 0.9 : 0.4}
                            strokeDasharray={isHighlighted ? '4 2' : undefined}
                          />
                        );
                      })
                    )}
                  </svg>

                  {/* Nós Interativos */}
                  {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    return (
                      <motion.div
                        key={node.id}
                        drag
                        dragConstraints={{ left: 20, right: 520, top: 20, bottom: 200 }}
                        onHoverStart={() => {
                          setHoveredNode(node.id);
                          arcadeAudio.playHover();
                        }}
                        onHoverEnd={() => setHoveredNode(null)}
                        style={{ left: node.x - 40, top: node.y - 18 }}
                        className="absolute cursor-grab active:cursor-grabbing select-none"
                      >
                        <div
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold shadow-lg transition-transform flex items-center gap-1.5 backdrop-blur-md ${
                            isHovered
                              ? 'scale-110 border-white text-white shadow-purple-500/40'
                              : 'border-white/10 text-zinc-200'
                          }`}
                          style={{
                            backgroundColor: `${node.color}33`,
                            borderColor: isHovered ? '#ffffff' : `${node.color}88`,
                          }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                          <span>{node.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}

                  <div className="absolute top-3 right-4 text-[10px] font-mono text-purple-300/80 bg-purple-900/30 px-2.5 py-1 rounded-full border border-purple-500/30">
                    Arraste os nós • Grafo Bidirecional Markdown
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
                  <span className="font-semibold">
                    💡 Princípio do Segundo Cérebro: A inteligência não reside em decorar dados, mas em conectar ideias cross-domain via links wiki [[Conceito]].
                  </span>
                  <span className="font-mono text-purple-400 shrink-0 ml-2">6 Notas • 9 Conexões</span>
                </div>
              </motion.div>
            )}

            {/* 3. V0.DEV & LOVABLE (WIREFRAME ➔ REACT) */}
            {activeTab === 'v0' && (
              <motion.div
                key="v0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lado Esquerdo: Rascunho / Wireframe */}
                  <div className="p-5 rounded-2xl liquid-glass-subtle border border-dashed border-zinc-600/80 bg-slate-950/60 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                        Prompt em Linguagem Natural
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs text-zinc-300">
                        "Crie um botão de assinatura Pro com gradiente esmeralda, tag 'Popular', preço $29/mês e efeito de brilho ao passar o mouse."
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Esboço conceitual</span>
                      <button
                        onClick={handleCompileV0}
                        disabled={v0Stage === 'compiling'}
                        className="tactile-btn flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{v0Stage === 'compiling' ? 'Sintetizando UI...' : 'Compilar para React'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Lado Direito: Componente React Vivo */}
                  <div className="p-5 rounded-2xl liquid-glass-subtle border border-emerald-500/30 bg-slate-950/60 flex flex-col items-center justify-center relative overflow-hidden min-h-[190px]">
                    {v0Stage === 'wireframe' && (
                      <div className="text-center text-zinc-500 text-xs font-mono space-y-1">
                        <Layout className="w-8 h-8 mx-auto text-zinc-600 mb-2" />
                        <p>Aguardando compilação do rascunho...</p>
                        <p className="text-[10px] text-zinc-600">Clique em "Compilar para React"</p>
                      </div>
                    )}

                    {v0Stage === 'compiling' && (
                      <div className="text-center space-y-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto"
                        />
                        <p className="text-xs font-mono text-emerald-400 animate-pulse">
                          Gerando AST React + Classes TailwindCSS...
                        </p>
                      </div>
                    )}

                    {v0Stage === 'compiled' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xs p-4 rounded-2xl liquid-glass border border-emerald-400/40 shadow-xl shadow-emerald-500/10 space-y-3 text-center"
                      >
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                          ★ Mais Popular
                        </div>
                        <div className="text-lg font-extrabold text-white">Plano Pro Dev</div>
                        <div className="text-2xl font-black text-emerald-400">
                          $29<span className="text-xs font-normal text-zinc-400">/mês</span>
                        </div>
                        <button
                          onClick={() => {
                            arcadeAudio.playVictoryFanfare();
                            fireStarBurst(0.5, 0.45);
                          }}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
                        >
                          Assinar Agora (Componente Funcional)
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. NOTEBOOKLM (RAG BLINDADO CONTRA ALUCINAÇÃO) */}
            {activeTab === 'notebooklm' && (
              <motion.div
                key="notebooklm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fontes Carregadas / Ground Truth */}
                  <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 bg-slate-950/60 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-300 pb-2 border-b border-white/10">
                      <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <BookOpen className="w-3.5 h-3.5" />
                        Fontes Primárias (Ground Truth)
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        100% Blindado
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div
                        onClick={() => setSelectedCitation(1)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedCitation === 1
                            ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                            : 'bg-slate-900/50 border-white/5 text-zinc-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>[Fonte 1] Relatorio_Financeiro_Q4.pdf</span>
                          <span className="text-[10px] font-mono text-amber-400">Pág. 42</span>
                        </div>
                        <p className="text-[11px] mt-1 text-zinc-400">
                          "A redução de custos com infraestrutura após a migração para instâncias locais foi de 63.4%."
                        </p>
                      </div>

                      <div
                        onClick={() => setSelectedCitation(2)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedCitation === 2
                            ? 'bg-amber-500/15 border-amber-400/40 text-amber-200'
                            : 'bg-slate-900/50 border-white/5 text-zinc-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>[Fonte 2] SLA_Arquitetura_Cloud.pdf</span>
                          <span className="text-[10px] font-mono text-amber-400">Pág. 18</span>
                        </div>
                        <p className="text-[11px] mt-1 text-zinc-400">
                          "Disponibilidade mantida em 99.98% sem degradação de latência média (p95 &lt; 85ms)."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resposta RAG com Citação Estrita */}
                  <div className="p-4 rounded-2xl liquid-glass-subtle border border-amber-500/30 bg-slate-950/60 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-amber-400" />
                        Pergunta do Usuário:
                      </div>
                      <p className="text-xs font-semibold text-white">
                        "Qual foi a economia real obtida com a mudança de infraestrutura?"
                      </p>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-zinc-200 leading-relaxed space-y-2">
                        <p>
                          De acordo com os relatórios corporativos, a redução de custo atingiu{' '}
                          <strong className="text-emerald-400">63.4%</strong> ao migrar para instâncias locais{' '}
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono font-bold cursor-pointer hover:bg-amber-500/50">
                            [1, Pág. 42]
                          </span>
                          , enquanto a disponibilidade sustentada foi de 99.98%{' '}
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-mono font-bold cursor-pointer hover:bg-amber-500/50">
                            [2, Pág. 18]
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>Zero Alucinação: O modelo é proibido de responder sem fonte direta.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
