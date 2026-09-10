import React, { useState } from 'react';
import {
  Cpu,
  BookOpen,
  Code2,
  Layers,
  Search,
  Volume2,
  Terminal,
  GitBranch,
  CheckCircle2,
} from 'lucide-react';

interface ToolCard {
  id: string;
  name: string;
  badge: string;
  category: string;
  tagline: string;
  icon: any;
  practicalWorkflow: string;
  features: string[];
  demoType: 'audio' | 'ast' | 'ui' | 'citations';
}

const TOOLS: ToolCard[] = [
  {
    id: 'notebooklm',
    name: 'NotebookLM (Google)',
    badge: 'DeepMind',
    category: 'Estudo & Síntese RAG',
    tagline: 'Transforma PDFs e documentos densos em resumos estruturados e podcasts envolventes entre dois apresentadores.',
    icon: BookOpen,
    practicalWorkflow: 'Fatia seus documentos em blocos semânticos e obriga a IA a responder citando a página e parágrafo exatos.',
    features: ['Grounded RAG (zero alucinação)', 'Audio Overview (síntese conversacional)', 'Citações clicáveis com página exata'],
    demoType: 'audio',
  },
  {
    id: 'cursor',
    name: 'Cursor & Windsurf',
    badge: 'IDEs Agênticas',
    category: 'Engenharia de Software',
    tagline: 'IDEs modernas que indexam o repositório inteiro e alteram múltiplos arquivos de código com contexto completo.',
    icon: Code2,
    practicalWorkflow: 'Mapeia imports, chamadas de funções e tipos em todo o projeto para gerar edições precisas sem você copiar código.',
    features: ['Indexação de repositório completo', 'Edição multi-arquivos em paralelo', 'Terminal autônomo com auto-correção'],
    demoType: 'ast',
  },
  {
    id: 'v0',
    name: 'v0.dev / Lovable',
    badge: 'Generative UI',
    category: 'Síntese de Interfaces',
    tagline: 'Criação instantânea de sistemas completos, componentes React e dashboards a partir de comandos textuais.',
    icon: Layers,
    practicalWorkflow: 'Traduz descrições de negócio em telas modernas com Tailwind CSS e componentes prontos para produção em segundos.',
    features: ['Compilação em tempo real', 'Design System Tailwind CSS', 'Deploy instantâneo na nuvem'],
    demoType: 'ui',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    badge: 'Live Knowledge',
    category: 'Motor de Busca',
    tagline: 'Busca inteligente com sintetizador de evidências em tempo real e fontes primárias verificáveis.',
    icon: Search,
    practicalWorkflow: 'Varre dezenas de páginas da web em tempo real, extrai os fatos essenciais e resume com links clicáveis para as fontes.',
    features: ['Citações em tempo real', 'Busca acadêmica em bases indexadas', 'Pro Search com decomposição de query'],
    demoType: 'citations',
  },
];

export const HoloToolsDeck: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolCard>(TOOLS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              O ARSENAL DE SUPERPODERES — FERRAMENTAS MODERNAS DE IA
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Selecione qualquer ferramenta para inspecionar seu fluxo de funcionamento e testar a demonstração ao vivo
            </p>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOOLS.map((tool) => {
          const isSelected = selectedTool.id === tool.id;
          const Icon = tool.icon;

          return (
            <div
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className={`cursor-pointer rounded-xl p-5 border transition-all duration-200 flex flex-col justify-between group shadow-sm ${
                isSelected
                  ? 'bg-secondary border-primary ring-1 ring-primary'
                  : 'bg-card/70 border-border hover:border-foreground/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-secondary border border-border text-foreground">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-muted-foreground border border-border">
                    {tool.badge}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {tool.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-3 mb-3">{tool.tagline}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="text-foreground font-medium">Ver Detalhes</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tool Interactive Inspector & Demo */}
      <div className="rounded-xl p-6 bg-background border border-border grid grid-cols-1 md:grid-cols-2 gap-6 items-center shadow-sm">
        {/* Left: Workflow & Capabilities */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-secondary text-foreground border border-border">
              {selectedTool.name}
            </span>
            <span className="text-xs font-mono text-muted-foreground">• {selectedTool.category}</span>
          </div>

          <h4 className="text-base font-semibold text-foreground">{selectedTool.tagline}</h4>

          <div className="p-3.5 rounded-lg bg-secondary/50 border border-border text-xs font-mono space-y-1">
            <span className="text-foreground font-semibold block">⚡ COMO FUNCIONA POR DENTRO:</span>
            <p className="text-muted-foreground">{selectedTool.practicalWorkflow}</p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground block">RECURSOS PRINCIPAIS:</span>
            <div className="grid grid-cols-1 gap-1.5">
              {selectedTool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Mini-Demo Sandbox */}
        <div className="rounded-xl p-5 bg-card border border-border space-y-4 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="text-foreground font-semibold">DEMONSTRAÇÃO AO VIVO</span>
            <span className="text-[10px] text-muted-foreground">INTERATIVO</span>
          </div>

          {selectedTool.demoType === 'audio' && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-sans">
                Simulador de podcast NotebookLM sintetizado a partir de documentos técnicos:
              </p>
              <div className="p-3 rounded-lg bg-secondary/60 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="font-semibold text-foreground block">Episódio #1: Como Modelos de Linguagem Raciocinam</span>
                    <span className="text-[10px] text-muted-foreground">Vozes Neurais Sintetizadas • 2:45 min</span>
                  </div>
                </div>
                <span className="text-xs text-foreground font-semibold">{isPlayingAudio ? 'TOCANDO...' : 'PAUSADO'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-background text-[11px] text-muted-foreground border border-border italic leading-relaxed">
                "O mais impressionante no RAG aterrado é que a IA não tenta adivinhar. Ela literalmente busca no seu arquivo a evidência exata antes de formular cada frase."
              </div>
            </div>
          )}

          {selectedTool.demoType === 'ast' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-foreground">
                <GitBranch className="w-4 h-4" />
                <span>Mapeamento de Arquivos e Dependências no Projeto:</span>
              </div>
              <pre className="p-3 rounded-lg bg-background border border-border text-muted-foreground text-[11px] overflow-x-auto leading-relaxed">
{`src/
├── components/
│   ├── UI/Button.tsx (Export: Button)
│   ├── Navigation/Sidebar.tsx (Imports: Button)
│   └── Dashboard/Overview.tsx (Imports: Sidebar, useMetrics)
└── hooks/
    └── useMetrics.ts (Export: calculateLatency)`}
              </pre>
            </div>
          )}

          {selectedTool.demoType === 'ui' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-foreground">
                <Terminal className="w-4 h-4" />
                <span>Prompt: "Dashboard moderno de monitoramento de chamadas de IA"</span>
              </div>
              <div className="p-4 rounded-lg bg-background border border-border text-foreground space-y-2">
                <div className="flex justify-between items-center text-[10px] border-b border-border pb-1">
                  <span className="text-muted-foreground">STATUS: COMPILADO COM SUCESSO</span>
                  <span className="text-foreground font-semibold">200 OK</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="p-2 rounded bg-secondary border border-border">
                    <span className="text-[10px] text-muted-foreground block">REQUISIÇÕES / MIN</span>
                    <span className="text-base font-bold text-foreground">1.024</span>
                  </div>
                  <div className="p-2 rounded bg-secondary border border-border">
                    <span className="text-[10px] text-muted-foreground block">TEMPO DE RESPOSTA</span>
                    <span className="text-base font-bold text-foreground">12ms</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTool.demoType === 'citations' && (
            <div className="space-y-2">
              <span className="text-foreground font-medium">Fontes e Citações Verificadas em Tempo Real:</span>
              <div className="space-y-1.5">
                {[
                  { title: 'Kahneman (2011) — Rápido e Devagar: Duas Formas de Pensar', cert: '99%' },
                  { title: 'Attention Is All You Need (Vaswani et al.) — Transformer Architecture', cert: '98%' },
                  { title: 'DeepSeek-R1 Technical Report (2025) — Incentivizing Reasoning in LLMs', cert: '97%' },
                ].map((item, i) => (
                  <div key={i} className="p-2 rounded-lg bg-background border border-border flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground truncate pr-2">[{i + 1}] {item.title}</span>
                    <span className="text-foreground font-semibold">{item.cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
