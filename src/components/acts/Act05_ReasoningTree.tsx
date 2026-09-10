import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Play, RotateCcw, CheckCircle2, XCircle, Brain, Sparkles, AlertCircle } from 'lucide-react';

interface BranchNode {
  id: string;
  label: string;
  status: 'pending' | 'evaluating' | 'rejected' | 'approved';
  rationale: string;
  depth: number;
  x: number;
  y: number;
}

export const Act05_ReasoningTree: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [activeThought, setActiveThought] = useState<string>('Aguardando início da simulação de raciocínio profundo...');

  const NODES: BranchNode[] = [
    { id: 'root', label: 'Problema Complexo', status: step >= 1 ? 'approved' : 'pending', rationale: 'Resolver enigma lógico de otimização', depth: 0, x: 380, y: 40 },
    
    // Nível 1: 3 Hipóteses
    { id: 'h1', label: 'Hipótese A: Força Bruta', status: step >= 2 ? (step >= 3 ? 'rejected' : 'evaluating') : 'pending', rationale: 'Complexidade exponencial O(2^N) - inviável', depth: 1, x: 160, y: 140 },
    { id: 'h2', label: 'Hipótese B: Programação Dinâmica', status: step >= 4 ? (step >= 5 ? 'approved' : 'evaluating') : 'pending', rationale: 'Subproblemas sobrepostos identificados - ótimo!', depth: 1, x: 380, y: 140 },
    { id: 'h3', label: 'Hipótese C: Heurística Gulosa', status: step >= 2 ? (step >= 4 ? 'rejected' : 'evaluating') : 'pending', rationale: 'Cai em ótimo local falso na etapa 4', depth: 1, x: 600, y: 140 },

    // Nível 2: Desdobramentos da Hipótese B
    { id: 'b1', label: 'B1: Tabela Memoizada', status: step >= 6 ? 'approved' : 'pending', rationale: 'Reduz espaço de busca para O(N)', depth: 2, x: 280, y: 240 },
    { id: 'b2', label: 'B2: Solução Final O(N)', status: step >= 7 ? 'approved' : 'pending', rationale: 'Resposta matematicamente verificada 100%', depth: 2, x: 480, y: 240 },
  ];

  const THOUGHT_LOGS = [
    '1. Identificando restrições do problema e formulando 3 hipóteses divergentes...',
    '2. Testando Hipótese A (Força Bruta)... Detectada explosão combinatorial! Rejeitando caminho A.',
    '3. Testando Hipótese C (Guloso)... Simulação falhou no caso de borda 3. Rejeitando caminho C.',
    '4. Testando Hipótese B (Programação Dinâmica)... Estrutura ótima confirmada!',
    '5. Aprofundando ramo B: Alocando tabela memoizada e testando invariantes...',
    '6. Verificação concluída com sucesso: Solução ótima encontrada com reflexão!',
  ];

  const handleSimulate = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStep(1);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStep(0);
    setActiveThought('Aguardando início da simulação de raciocínio profundo...');
  };

  useEffect(() => {
    if (!isRunning) return;

    if (step < 7) {
      setActiveThought(THOUGHT_LOGS[step - 1] || '');
      const timer = setTimeout(() => {
        setStep((s) => s + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
      setActiveThought('✅ Raciocínio finalizado: Resposta exata sintetizada após descartar erros.');
    }
  }, [isRunning, step]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ato 05 • A Nova Fronteira do Raciocínio
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-emerald-400" /> DeepSeek-R1 & OpenAI o1
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            A Mente que Pensa: Árvores de Raciocínio
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Test-Time Compute & Auto-Correção Interna
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Modelos clássicos cospem a primeira palavra que vem à mente. Modelos de raciocínio gastam <strong className="text-emerald-300">tempo pensando antes de falar</strong>: formulam hipóteses, descartam caminhos errados e voltam atrás sozinhos.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
            title="Resetar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSimulate}
            disabled={isRunning || step >= 7}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs md:text-sm hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'fill-slate-950'}`} />
            {isRunning ? 'Pensando profundamente...' : 'Simular Raciocínio (Tree-of-Thought)'}
          </button>
        </div>
      </div>

      {/* Main SVG Reasoning Tree Canvas */}
      <div className="my-5 flex-1 min-h-[360px] obsidian-glass rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-2xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Reasoning Tree SVG Diagram */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          <svg viewBox="0 0 760 300" className="w-full h-full max-h-[300px]">
            {/* Tree Branch Links */}
            {/* Root -> H1, H2, H3 */}
            <path d="M 380 55 L 160 140" stroke="#334155" strokeWidth="2" fill="none" />
            <path d="M 380 55 L 380 140" stroke="#334155" strokeWidth="2" fill="none" />
            <path d="M 380 55 L 600 140" stroke="#334155" strokeWidth="2" fill="none" />

            {/* H2 -> B1, B2 */}
            <path d="M 380 165 L 280 240" stroke="#334155" strokeWidth="2" fill="none" />
            <path d="M 380 165 L 480 240" stroke="#334155" strokeWidth="2" fill="none" />

            {/* Render Nodes */}
            {NODES.map((node) => {
              const isApproved = node.status === 'approved';
              const isRejected = node.status === 'rejected';
              const isEval = node.status === 'evaluating';

              return (
                <g key={node.id} className="cursor-pointer">
                  {/* Node Background */}
                  <rect
                    x={node.x - 90}
                    y={node.y - 18}
                    width="180"
                    height="36"
                    rx="12"
                    fill={
                      isApproved
                        ? '#064e3b'
                        : isRejected
                        ? '#4c0519'
                        : isEval
                        ? '#1e1b4b'
                        : '#0f172a'
                    }
                    stroke={
                      isApproved
                        ? '#10b981'
                        : isRejected
                        ? '#f43f5e'
                        : isEval
                        ? '#818cf8'
                        : '#334155'
                    }
                    strokeWidth={isApproved || isRejected || isEval ? 2 : 1}
                    className="transition-colors duration-300 shadow-md"
                  />

                  {/* Status icon inside node */}
                  {isApproved && (
                    <foreignObject x={node.x - 82} y={node.y - 8} width="16" height="16">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </foreignObject>
                  )}
                  {isRejected && (
                    <foreignObject x={node.x - 82} y={node.y - 8} width="16" height="16">
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </foreignObject>
                  )}

                  {/* Node Label */}
                  <text
                    x={isApproved || isRejected ? node.x + 2 : node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={isApproved ? '#a7f3d0' : isRejected ? '#fecdd3' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Internal Monologue Box (<think> ... </think>) */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Brain className="w-3.5 h-3.5" /> Cadeia Oculta de Pensamento (&lt;think&gt;)
            </span>
            <span>Passo {Math.min(step, 6)} / 6</span>
          </div>
          <p className="text-xs text-slate-200 font-mono leading-relaxed min-h-[38px] flex items-center">
            {activeThought}
          </p>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            A nova lei de escala: Não basta aumentar o tamanho do modelo no treino; <strong>dar mais segundos para a IA pensar durante a resposta multiplica o QI matemático</strong>.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Reinforcement Learning puro (RL)
        </span>
      </div>
    </div>
  );
};
