import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Layout, Sparkles, Check, Play, Terminal, Layers, FileCode, CheckCircle2 } from 'lucide-react';

export const Act08_SoftwareDev: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'cursor' | 'v0'>('cursor');
  
  // Cursor simulation state
  const [hasAcceptedTab, setHasAcceptedTab] = useState(false);
  const GHOST_CODE = 'const totalWithTax = subtotal * (1 + taxRate) - appliedCoupon;';

  // v0.dev simulation state
  const [prompt, setPrompt] = useState('Crie um card de métricas de SaaS com gráfico e badge');
  const [isCompiling, setIsCompiling] = useState(false);
  const [v0Variant, setV0Variant] = useState<'metrics' | 'checkout'>('metrics');

  const handleCompileUI = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setV0Variant((prev) => (prev === 'metrics' ? 'checkout' : 'metrics'));
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Ato 08 • Engenharia de Software 10x
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-sky-400" /> A Nova Era dos Desenvolvedores
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            A Revolução no Desenvolvimento de Software
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Cursor, Windsurf, v0.dev & Lovable
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A inteligência artificial não está tirando o emprego dos desenvolvedores: ela está <strong className="text-sky-300">eliminando o trabalho braçal e repetitivo</strong>, permitindo que uma única pessoa construa sistemas inteiros em dias.
          </p>
        </div>

        {/* Tool Switcher */}
        <div className="flex items-center bg-[#0b0f19] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('cursor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'cursor' ? 'bg-sky-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Cursor / Windsurf</span>
          </button>
          <button
            onClick={() => setActiveTool('v0')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTool === 'v0' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>v0.dev / Lovable</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Playground */}
      <div className="my-5 flex-1 min-h-[380px] obsidian-glass rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-2xl">
        <AnimatePresence mode="wait">
          {activeTool === 'cursor' ? (
            <motion.div
              key="cursor-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  Simulador de Next Edit Prediction & Repo-Indexing
                </span>
                <button
                  onClick={() => setHasAcceptedTab(!hasAcceptedTab)}
                  className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 text-xs font-mono transition-colors"
                >
                  {hasAcceptedTab ? 'Limpar e Testar Novamente' : 'Pressione [ Tab ] para Aceitar Sugestão'}
                </button>
              </div>

              {/* Code Editor Window */}
              <div className="bg-[#070a12] border border-slate-800 rounded-xl p-5 font-mono text-xs md:text-sm shadow-inner relative leading-relaxed">
                <div className="text-slate-500 text-xs mb-3 flex items-center justify-between">
                  <span>// src/engine/pricingCalculator.ts</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Indexado via AST + Vetores</span>
                </div>
                <div>
                  <span className="text-purple-400">export function</span>{' '}
                  <span className="text-sky-400">calculateCartFinalTotal</span>(
                  <span className="text-amber-300">items: CartItem[]</span>,{' '}
                  <span className="text-amber-300">couponCode?: string</span>
                  ) {'{'}
                </div>
                <div className="pl-6 text-slate-400">
                  <span className="text-purple-400">const</span> subtotal = items.reduce((acc, i) =&gt; acc + i.price * i.qty, 0);
                </div>
                <div className="pl-6 text-slate-400">
                  <span className="text-purple-400">const</span> taxRate = 0.085;
                </div>
                <div className="pl-6 flex items-center flex-wrap my-1">
                  {hasAcceptedTab ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold"
                    >
                      {GHOST_CODE}
                    </motion.span>
                  ) : (
                    <span className="text-slate-600 bg-slate-900/80 px-2 py-0.5 rounded border border-dashed border-slate-700 select-none">
                      {GHOST_CODE}{' '}
                      <span className="text-[10px] text-sky-400 bg-slate-800 px-1.5 py-0.5 rounded ml-2 font-mono">
                        Pressione Tab ⇥
                      </span>
                    </span>
                  )}
                </div>
                <div className="pl-6 text-slate-300">
                  <span className="text-purple-400">return</span> Math.max(0, totalWithTax);
                </div>
                <div>{'}'}</div>
              </div>

              <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                💡 <strong>Como o Cursor supera o Copilot tradicional:</strong> Ele não lê apenas o arquivo aberto; ele constrói um índice de busca semântica em todos os 100.000 arquivos do seu projeto.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="v0-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              {/* Prompt Bar */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-[#090d16] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                />
                <button
                  onClick={handleCompileUI}
                  disabled={isCompiling}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                  {isCompiling ? 'Compilando React...' : 'Gerar UI em 1 Clique'}
                </button>
              </div>

              {/* Rendered Component Arena */}
              <div className="bg-[#070a12] border border-slate-800 rounded-xl p-6 min-h-[220px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {v0Variant === 'metrics' ? (
                    <motion.div
                      key="metrics"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Taxa de Conversão da Equipe
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          +42.8% este mês
                        </span>
                      </div>
                      <div className="text-3xl font-extrabold text-white font-mono">
                        98.4% <span className="text-xs text-slate-400 font-normal">acurácia</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-400 to-purple-500 w-[84%]" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>Tempo médio economizado:</span>
                        <span className="font-bold text-white">6.2 horas / semana</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="checkout"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3"
                    >
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        Plano Pro Developer AI
                      </div>
                      <div className="text-2xl font-bold text-purple-400 font-mono">
                        R$ 149 <span className="text-xs text-slate-400 font-normal">/ mês</span>
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Acesso irrestrito a Claude 3.5 Sonnet
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Indexação local via vetores
                        </li>
                      </ul>
                      <button className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md">
                        Iniciar Teste Grátis
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-xs text-slate-400 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                💡 <strong>O diferencial do v0 / Lovable:</strong> Elimina o abismo entre rascunho de Figma e código pronto em produção.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Insight */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Mensagem-chave: <strong>O melhor programador não é quem digita mais caracteres por minuto, mas quem melhor expressa a arquitetura e orquestra seus copilotos</strong>.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Produtividade Exponencial
        </span>
      </div>
    </div>
  );
};
