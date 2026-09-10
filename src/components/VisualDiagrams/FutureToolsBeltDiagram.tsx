import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  Code2,
  Layers,
  Search,
  Network,
  Sparkles,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface FutureToolsBeltDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

export const FutureToolsBeltDiagram: React.FC<FutureToolsBeltDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(4, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  const TOOLS = [
    {
      id: 0,
      name: 'NotebookLM',
      company: 'Google',
      category: 'Estudo & Síntese RAG',
      badge: 'Grounded RAG',
      color: '#00f2fe',
      tagline: '500 Páginas de Documentos e Livros condensados em 1 Podcast Interativo',
      practicalInsight: 'Você faz o upload de PDFs complexos e dois apresentadores virtuais debatem os tópicos em formato de rádio, citando cada página.',
    },
    {
      id: 1,
      name: 'Cursor & Windsurf',
      company: 'Anysphere / Codeium',
      category: 'IDEs Agênticas',
      badge: 'Engenharia 10x',
      color: '#9d4edd',
      tagline: 'Visão de Raio-X: A IA indexa o projeto inteiro e edita múltiplos arquivos',
      practicalInsight: 'Ao invés de copiar e colar pedaços de código no chat, o Cursor entende a arquitetura completa e faz as alterações diretamente no seu projeto.',
    },
    {
      id: 2,
      name: 'v0 & Lovable',
      company: 'Vercel / Lovable',
      category: 'Generative UI',
      badge: 'Do Rabisco ao App',
      color: '#10b981',
      tagline: 'Do rascunho em papel guardanapo para o app React funcional em 20 segundos',
      practicalInsight: 'Transforma comandos em português ou fotos de rascunhos em páginas completas com Tailwind CSS e componentes prontos para deploy.',
    },
    {
      id: 3,
      name: 'Obsidian',
      company: 'Segundo Cérebro',
      category: 'Gestão de Ideias',
      badge: 'Rede de Conhecimento',
      color: '#a855f7',
      tagline: 'Pastas matam o conhecimento; links criam constelações vivas de ideias',
      practicalInsight: 'Cria conexões bidirecionais entre suas anotações, gerando um grafo visual idêntico à teia de neurônios da sua memória.',
    },
    {
      id: 4,
      name: 'Perplexity AI',
      company: 'Perplexity',
      category: 'Pesquisa com Fatos',
      badge: 'Web em Tempo Real',
      color: '#f59e0b',
      tagline: 'Adeus aos 10 links cheios de anúncios do Google: síntese com fontes citadas',
      practicalInsight: 'Varre dezenas de páginas da internet em 3 segundos e entrega a resposta final com números de rodapé clicáveis para você auditar a fonte.',
    },
  ];

  const currentTool = TOOLS[step];

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-foreground shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Header & Tool Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              O Cinturão de Ferramentas do Futuro
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                Superpoderes 10x
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              As 5 ferramentas essenciais para estudo profundo, codificação, interfaces e pesquisa
            </p>
          </div>
        </div>

        {/* Next / Previous Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep((step + 1) % 5)}
            className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 text-xs font-mono font-semibold flex items-center gap-1 transition-all shadow-sm"
          >
            <span>Próxima Ferramenta</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setStep(0)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700"
            title="Reiniciar ferramentas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Tool Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {TOOLS.map((t) => {
          const isActive = step === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setStep(t.id)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[72px] ${
                isActive
                  ? 'bg-secondary border-primary ring-1 ring-border shadow-sm'
                  : 'bg-card border-border opacity-70 hover:opacity-100'
              }`}
            >
              <span className="text-xs font-semibold block text-foreground truncate">{t.name}</span>
              <span className="text-[10px] font-mono block truncate text-muted-foreground">
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Feature Illustration Stage */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
        {/* Tool Header Callout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${currentTool.color}25`, color: currentTool.color }}
              >
                {currentTool.category}
              </span>
              <h4 className="text-xl font-bold text-white">{currentTool.name}</h4>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-friendly">
              {currentTool.tagline}
            </p>
          </div>
        </div>

        {/* Dynamic Tool Visual Presentation */}
        <div className="my-auto py-6 flex items-center justify-center">
          {/* TOOL 0: NOTEBOOKLM (Book -> Audio/Podcast) */}
          {step === 0 && (
            <div className="w-full max-w-3xl flex flex-col md:flex-row items-center justify-around gap-6 animate-in zoom-in-95 duration-300">
              {/* Giant Book */}
              <div className="flex flex-col items-center group">
                <div className="relative w-40 h-52 rounded-xl bg-card border border-border p-4 shadow-sm flex flex-col justify-between text-foreground">
                  <div className="absolute left-1.5 top-0 bottom-0 w-2.5 bg-secondary rounded-l-md" />
                  <div className="pl-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                      PDF / APOSTILA
                    </span>
                    <h5 className="font-semibold text-sm mt-1 text-foreground">Manual Técnico de Engenharia</h5>
                  </div>
                  <div className="pl-3 space-y-1">
                    <div className="w-full h-1 bg-border rounded" />
                    <div className="w-3/4 h-1 bg-border rounded" />
                    <span className="text-[10px] font-mono text-muted-foreground block pt-1">
                      500 páginas
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground mt-2">Material Denso de Estudo</span>
              </div>

              {/* Conversion Wave & Soundbars */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-foreground font-mono text-xs font-semibold">
                  <span>Síntese RAG</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end gap-1.5 h-12 px-4 py-2 rounded-xl bg-secondary border border-border">
                  {[20, 50, 90, 40, 95, 65, 35, 80, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-foreground"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Dois Hosts em Debate de Áudio</span>
              </div>

              {/* Headphones */}
              <div className="flex flex-col items-center group">
                <div className="relative w-44 h-52 rounded-xl bg-card border border-border p-5 shadow-sm flex flex-col justify-center items-center text-center">
                  <div className="p-3.5 rounded-full bg-secondary border border-border text-foreground mb-3">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-foreground block">Áudio Overview</span>
                  <span className="text-[11px] font-mono text-muted-foreground mt-1">"Deep Dive Podcast"</span>
                  <div className="mt-3 px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-foreground border border-border">
                    Citações de Página Exatas
                  </div>
                </div>
                <span className="text-xs font-mono text-muted-foreground mt-2">Pronto para Ouvir sem Alucinar</span>
              </div>
            </div>
          )}

          {/* TOOL 1: CURSOR & WINDSURF (Multi-file IDE Context) */}
          {step === 1 && (
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in zoom-in-95 duration-300">
              {/* Simulated IDE Left */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-purple-500/40 font-mono text-xs shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-purple-300 font-bold">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span>App.tsx &bull; index.ts &bull; api.ts</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded text-purple-300">
                    3 arquivos em paralelo
                  </span>
                </div>
                <pre className="text-purple-200 leading-relaxed text-[11px] overflow-x-auto">
{`// O Cursor detecta a alteração no tipo do banco
// e atualiza automaticamente todos os componentes:
export async function handleCheckout(cart: CartItem[]) {
  const session = await createStripeSession(cart);
  return session.url; // Autocomplete completo do projeto!
}`}
                </pre>
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200">
                  ⚡ <strong>Diff Inline:</strong> Você vê a alteração sugerida em verde/vermelho e aceita com <code>Cmd + K</code>.
                </div>
              </div>

              {/* IDE Features Right */}
              <div className="space-y-3">
                <h5 className="text-base font-bold text-white">Por que o Cursor mudou a programação?</h5>
                <div className="space-y-2">
                  {[
                    'Lê o repositório inteiro via indexação de dependências',
                    'Edita 5 arquivos ao mesmo tempo com o Composer',
                    'Acessa o terminal e corrige scripts com 1 clique',
                    'Zero necessidade de copiar e colar código no ChatGPT',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: V0 & LOVABLE (Napkin -> Modern UI) */}
          {step === 2 && (
            <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center animate-in zoom-in-95 duration-300">
              {/* Paper Wireframe */}
              <div className="rounded-2xl bg-[#fffdf0] text-slate-800 p-6 border-2 border-amber-300 shadow-xl relative font-sans">
                <div className="absolute top-2 right-3 text-[10px] font-mono text-amber-800 bg-amber-200 px-2 py-0.5 rounded font-bold">
                  RASCUNHO A LÁPIS
                </div>
                <div className="space-y-3 border-2 border-dashed border-slate-400 p-3 rounded-lg">
                  <div className="h-5 border-b-2 border-slate-700 italic text-xs text-slate-700 font-bold">
                    [ Dashboard com Barra de Busca ]
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-12 border border-slate-500 rounded flex items-center justify-center text-[10px] text-slate-600">
                      [ Vendas Hoje ]
                    </div>
                    <div className="h-12 border border-slate-500 rounded flex items-center justify-center text-[10px] text-slate-600">
                      [ Gráfico ]
                    </div>
                  </div>
                  <div className="h-7 bg-slate-200 border border-slate-600 rounded flex items-center justify-center text-[10px] font-bold text-slate-700">
                    [ Botão: Confirmar Pedido ]
                  </div>
                </div>
                <span className="text-[11px] text-amber-900 font-mono block text-center mt-3">
                  Prompt: "Crie um painel moderno com métricas e checkout"
                </span>
              </div>

              {/* Rendered Production App */}
              <div className="rounded-xl bg-card p-6 border border-border shadow-sm relative">
                <div className="absolute top-2 right-3 text-[10px] font-mono text-primary-foreground bg-primary px-2 py-0.5 rounded font-bold">
                  TELA V0 COMPILADA
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-semibold text-foreground font-mono">StoreAnalytics Pro</span>
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-secondary border border-border">
                      <span className="text-[10px] text-muted-foreground block font-mono">Faturamento Hoje</span>
                      <span className="text-base font-bold text-foreground font-mono">R$ 14.820</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-secondary border border-border">
                      <span className="text-[10px] text-muted-foreground block font-mono">Conversão</span>
                      <span className="text-base font-bold text-foreground font-mono">98.4%</span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold font-mono text-xs shadow-sm hover:bg-primary/90 transition-all border border-primary/20">
                    ✓ FINALIZAR PEDIDO COM 1 CLIQUE
                  </button>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono block text-center mt-3">
                  Código Tailwind + React gerado em 20 segundos!
                </span>
              </div>
            </div>
          )}

          {/* TOOL 3: OBSIDIAN (Mind Map / Second Brain) */}
          {step === 3 && (
            <div className="w-full max-w-3xl flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="w-full rounded-2xl bg-slate-950 p-6 border border-purple-500/40 relative overflow-hidden">
                <span className="text-xs font-mono text-purple-300 font-bold block text-center mb-4 uppercase tracking-wider">
                  Constelação de Conhecimento com Links Bidirecionais
                </span>

                {/* SVG Visual Galaxy */}
                <svg viewBox="0 0 600 220" className="w-full h-auto select-none">
                  {/* Connection Lines */}
                  <line x1="300" y1="110" x2="160" y2="60" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="300" y1="110" x2="440" y2="60" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="300" y1="110" x2="200" y2="170" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="300" y1="110" x2="400" y2="170" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="160" y1="60" x2="200" y2="170" stroke="#6366f1" strokeWidth="1.5" />
                  <line x1="440" y1="60" x2="400" y2="170" stroke="#6366f1" strokeWidth="1.5" />

                  {/* Central Node */}
                  <circle cx="300" cy="110" r="24" fill="#8b5cf6" opacity="0.3" className="animate-pulse" />
                  <circle cx="300" cy="110" r="16" fill="#8b5cf6" stroke="#c084fc" strokeWidth="2" />
                  <text x="300" y="114" textAnchor="middle" fill="#ffffff" className="text-[10px] font-mono font-bold">
                    Segundo Cérebro
                  </text>

                  {/* Connected Topic Nodes */}
                  <g transform="translate(160, 60)">
                    <circle r="12" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
                    <text x="0" y="24" textAnchor="middle" fill="#93c5fd" className="text-[10px] font-mono">
                      Engenharia de Software
                    </text>
                  </g>
                  <g transform="translate(440, 60)">
                    <circle r="12" fill="#10b981" stroke="#34d399" strokeWidth="2" />
                    <text x="0" y="24" textAnchor="middle" fill="#a7f3d0" className="text-[10px] font-mono">
                      Arquitetura de LLMs
                    </text>
                  </g>
                  <g transform="translate(200, 170)">
                    <circle r="12" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
                    <text x="0" y="24" textAnchor="middle" fill="#fde68a" className="text-[10px] font-mono">
                      Projetos Práticos
                    </text>
                  </g>
                  <g transform="translate(400, 170)">
                    <circle r="12" fill="#ec4899" stroke="#f472b6" strokeWidth="2" />
                    <text x="0" y="24" textAnchor="middle" fill="#fbcfe8" className="text-[10px] font-mono">
                      Ideias de Negócio
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          )}

          {/* TOOL 4: PERPLEXITY (Live Search with Citations) */}
          {step === 4 && (
            <div className="w-full max-w-3xl rounded-2xl bg-slate-950 p-6 border border-amber-500/40 shadow-xl space-y-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-amber-300 font-mono text-xs">
                <Search className="w-4 h-4" />
                <span>Busca: "Quais os benchmarks mais recentes de modelos abertos em 2025?"</span>
              </div>

              {/* Verified Answer with footnotes */}
              <div className="space-y-3 font-friendly text-sm text-slate-200 leading-relaxed">
                <p>
                  O modelo <strong>DeepSeek-V3</strong> e a versão de raciocínio <strong>R1</strong> demonstraram paridade técnica com modelos fechados da OpenAI em tarefas de código e lógica <sup className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold cursor-pointer">[1]</sup>.
                </p>
                <p>
                  A redução de custos de inferência chegou a quase <strong>90%</strong> comparada aos preços de API tradicionais, viabilizando soluções locais com Ollama <sup className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold cursor-pointer">[2]</sup>.
                </p>
              </div>

              {/* Citations Row */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-xs font-mono">
                <span className="text-slate-500">Fontes Auditáveis:</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
                  [1] deepseek.com/benchmarks <ExternalLink className="w-3 h-3 text-amber-400" />
                </span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
                  [2] arxiv.org/abs/2501.12948 <ExternalLink className="w-3 h-3 text-amber-400" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Practical Insight Callout at Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-friendly">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTool.color }} />
            <span>
              <strong>Dica de Uso:</strong> {currentTool.practicalInsight}
            </span>
          </div>
          <span className="text-slate-500 font-mono shrink-0 ml-3">{step + 1} de 5 ferramentas</span>
        </div>
      </div>
    </div>
  );
};
