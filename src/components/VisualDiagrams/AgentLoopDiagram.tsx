import React, { useState, useEffect } from 'react';
import { Bot, Play, Pause, RotateCcw, ChevronRight, Terminal, Globe, CheckCircle2, AlertCircle, RefreshCw, Cpu, Sparkles } from 'lucide-react';

interface AgentLoopDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

export const AgentLoopDiagram: React.FC<AgentLoopDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;
  const [isPlaying, setIsPlaying] = useState(false);

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(3, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((step + 1) % 4);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, step]);

  const STAGES = [
    {
      id: 0,
      title: '1. PENSAR (Planejamento)',
      subtitle: 'Decomposição em pequenas metas',
      badge: 'Planejamento',
      color: '#0ea5e9',
      robotTask: 'Analisando o objetivo: "Criar página de checkout com confirmação via e-mail"',
      terminalLogs: [
        'AGENT > Objetivo recebido: Criar checkout e envio de confirmação',
        'AGENT > Raciocínio: Preciso de 3 etapas:',
        '  1. Criar componente React com formulário de pagamento',
        '  2. Rodar build e verificar erros de sintaxe',
        '  3. Disparar teste de integração de webhook',
      ],
      terminalStatus: 'Planejamento concluído (3 subtarefas criadas)',
      icon: Cpu,
    },
    {
      id: 1,
      title: '2. AGIR (Execução de Ferramentas)',
      subtitle: 'Mãos virtuais no computador',
      badge: 'Ação Real',
      color: '#8b5cf6',
      robotTask: 'Digitando no terminal e criando os arquivos reais no projeto',
      terminalLogs: [
        '$ npm install @stripe/stripe-js lucide-react',
        'FETCH > Baixando componentes de interface...',
        'WRITE > Criando src/components/CheckoutModal.tsx [OK]',
        'EXEC > Executando: npm run build para validar código',
      ],
      terminalStatus: 'Executando comando no sistema operacional...',
      icon: Terminal,
    },
    {
      id: 2,
      title: '3. OBSERVAR (Leitura de Resultados)',
      subtitle: 'Avaliar saídas e mensagens de erro',
      badge: 'Feedback',
      color: '#f59e0b',
      robotTask: 'Lendo a saída do compilador: erro detectado no arquivo de configuração!',
      terminalLogs: [
        'BUILD OUTPUT: src/components/CheckoutModal.tsx',
        'ERROR TS2307: Cannot find module "stripe-key" in .env.local',
        'AGENT > Erro identificado! A chave da API não foi declarada nas variáveis de ambiente.',
        'AGENT > Iniciando plano de autocorreção imediato...',
      ],
      terminalStatus: 'Falha detectada: iniciando autocorreção autônoma',
      icon: AlertCircle,
    },
    {
      id: 3,
      title: '4. AJUSTAR (Auto-Correção & Entrega)',
      subtitle: 'Conserto sem intervenção humana',
      badge: 'Vitória',
      color: '#10b981',
      robotTask: 'Corrigindo o .env, re-executando o build e entregando o app 100% funcional!',
      terminalLogs: [
        'WRITE > Declarando STRIPE_PUBLIC_KEY em .env.local [CORRIGIDO]',
        '$ npm run build',
        '✓ 42 modules transformed in 420ms.',
        '✓ Build success: dist/index.html gerado com sucesso!',
        'STATUS > Aplicação funcionando e pronta para entrega ao usuário!',
      ],
      terminalStatus: 'SUCESSO TOTAL: Tarefa concluída sem intervenção manual!',
      icon: CheckCircle2,
    },
  ];

  const currentStage = STAGES[step];

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-foreground shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Header with Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              O Ciclo do Agente Autônomo: Pensar ➔ Agir ➔ Observar ➔ Ajustar
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              A diferença entre um chatbot passivo e um agente inteligente equipado com ferramentas reais
            </p>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all border ${
              isPlaying
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar' : 'Auto-Play'}</span>
          </button>

          <button
            onClick={() => setStep((step + 1) % 4)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold flex items-center gap-1 transition-all"
          >
            <span>Fase {step + 1}/4</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700"
            title="Reiniciar loop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Loop Quadrants / Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-secondary border-primary ring-1 ring-border shadow-sm'
                  : 'bg-card border-border opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-foreground" />
                <span
                  className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border"
                >
                  {s.badge}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold block text-foreground">{s.title}</span>
                <span className="text-[10px] text-muted-foreground block">{s.subtitle}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Virtual Workspace Simulator (Robot at Desktop) */}
      <div className="rounded-xl bg-secondary/30 border border-border p-5 min-h-[380px] grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative overflow-hidden">
        {/* Left: Robot Status & Visual Avatar (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center text-center space-y-4 p-4 rounded-xl bg-card border border-border shadow-sm">
          <div className="relative">
            <div
              className="relative w-20 h-20 rounded-xl border flex items-center justify-center shadow-sm bg-secondary border-border"
            >
              <Bot className="w-10 h-10 text-foreground" />
            </div>
          </div>

          <div>
            <span
              className="px-2.5 py-0.5 rounded text-xs font-mono font-medium uppercase tracking-wider inline-block mb-1.5 bg-secondary text-muted-foreground border border-border"
            >
              STATUS: {currentStage.badge}
            </span>
            <h4 className="text-sm font-semibold text-foreground">
              {currentStage.robotTask}
            </h4>
          </div>

          <div className="w-full pt-2 border-t border-border flex items-center justify-around text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-foreground" /> Shell Ativo
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-foreground" /> Web APIs
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-foreground" /> Loop Aberto
            </span>
          </div>
        </div>

        {/* Right: Live Simulated Terminal Screen (7 cols) */}
        <div className="md:col-span-7 rounded-xl bg-background border border-border p-4 font-mono text-xs shadow-sm flex flex-col justify-between min-h-[290px]">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[11px] text-slate-400 ml-2">agent-terminal ~ /workspace</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">PID: 4982</span>
          </div>

          {/* Terminal Body Logs */}
          <div className="py-4 space-y-2.5 text-slate-200">
            {currentStage.terminalLogs.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="text-slate-600 select-none">&gt;</span>
                <span
                  className={
                    line.includes('ERROR') || line.includes('Falha')
                      ? 'text-rose-400 font-bold'
                      : line.includes('SUCCESS') || line.includes('CORRIGIDO') || line.includes('concluída')
                      ? 'text-emerald-300 font-bold'
                      : line.includes('AGENT >')
                      ? 'text-cyan-300'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1 pt-1">
              <span className="text-emerald-400">$</span>
              <span className="w-2 h-4 bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Terminal Status Bar */}
          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">{currentStage.terminalStatus}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Loop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
