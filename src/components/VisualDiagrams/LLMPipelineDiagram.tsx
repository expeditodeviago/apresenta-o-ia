import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Pause, RotateCcw, ChevronRight, Layers, MessageSquare, Cpu, Compass, CheckCircle2, Zap } from 'lucide-react';

interface LLMPipelineDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

export const LLMPipelineDiagram: React.FC<LLMPipelineDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;
  const [isPlaying, setIsPlaying] = useState(false);
  const [promptText, setPromptText] = useState('Explique como criar um app moderno');
  const [streamedAnswer, setStreamedAnswer] = useState('Para criar um app moderno em 2025, o caminho mais rápido é');

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(4, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((step + 1) % 5);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, step]);

  const PROMPT_PRESETS = [
    'Explique como criar um app moderno',
    'O que é inteligência artificial?',
    'Escreva uma função que calcula fibonacci',
    'Como os robôs autônomos tomam decisões?',
  ];

  // Dynamic token slicer for prompt text
  const getPromptTokens = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const colors = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    return words.map((w, idx) => {
      const hashId = Math.abs(w.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 13)) % 90000 + 1000;
      return {
        text: idx === 0 ? w : ` ${w}`,
        id: hashId,
        color: colors[idx % colors.length],
      };
    });
  };

  const tokens = getPromptTokens(promptText);

  const STAGES = [
    {
      id: 0,
      title: '1. Prompt',
      badge: 'Linguagem Natural',
      icon: MessageSquare,
      headline: 'A mensagem original digitada pelo usuário',
    },
    {
      id: 1,
      title: '2. Fatiador LEGO',
      badge: 'Tokens com IDs',
      icon: Layers,
      headline: 'Divisão em blocos numéricos que o processador entende',
    },
    {
      id: 2,
      title: '3. Bússola Semântica',
      badge: 'Embeddings 2D',
      icon: Compass,
      headline: 'Palavras de sentido similar no mesmo bairro de significado',
    },
    {
      id: 3,
      title: '4. Motor Neural',
      badge: 'Atenção Multicamada',
      icon: Cpu,
      headline: 'Cruzamento profundo de contexto entre todas as palavras',
    },
    {
      id: 4,
      title: '5. Próxima Peça',
      badge: 'Predição ao Vivo',
      icon: Sparkles,
      headline: 'Cálculo estatístico da palavra mais coerente a seguir',
    },
  ];

  const CANDIDATES = [
    { word: ' usar', prob: 88, isWinner: true },
    { word: ' começar', prob: 9, isWinner: false },
    { word: ' entender', prob: 3, isWinner: false },
  ];

  return (
    <div className="w-full rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-foreground shadow-2xl backdrop-blur-xl flex flex-col justify-between">
      {/* Top Bar with Stage Header and Transport Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-primary shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
              O Pipeline das LLMs
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                Do Prompt ao Token
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Jornada em tempo real da intenção humana até a resposta gerada em milissegundos
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
            onClick={() => setStep((step + 1) % 5)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Passo {step + 1}/5</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-700"
            title="Reiniciar pipeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Station Interactive Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isPassed = step > s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[82px] ${
                isActive
                  ? 'bg-zinc-900 border-primary ring-1 ring-primary/40 shadow-lg shadow-primary/10'
                  : isPassed
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-zinc-400'}`} />
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div>
                <span className={`text-xs font-bold block ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                  {s.title}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block truncate">
                  {s.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hero Interactive Stage Canvas (Dynamic based on active stage) */}
      <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-6 md:p-8 min-h-[380px] flex flex-col justify-between relative overflow-hidden">
        {/* Stage Headline */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
              {STAGES[step].badge}
            </span>
            <span className="text-sm md:text-base font-semibold text-white">
              {STAGES[step].headline}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            Etapa {step + 1} de 5
          </span>
        </div>

        {/* STAGE 0: Live User Input Prompt */}
        {step === 0 && (
          <div className="w-full max-w-3xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300 my-auto">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Linguagem Natural em Tempo Real
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Digite sua pergunta para a IA..."
                  className="w-full px-6 py-4 rounded-2xl bg-zinc-950 border border-zinc-700 text-white font-mono text-lg md:text-xl text-center focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
                />
              </div>
            </div>

            {/* Quick Chips Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-mono text-zinc-500 mr-1">Experimente:</span>
              {PROMPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPromptText(preset)}
                  className="px-3 py-1 rounded-xl text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 1: 3D Tactile LEGO Token Slicer */}
        {step === 1 && (
          <div className="w-full max-w-4xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300 my-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-500">
              <span>Esteira de Fatiamento</span>
              <span>•</span>
              <span className="text-primary font-bold">{tokens.length} Peças de LEGO Identificadas</span>
            </div>

            {/* LEGO Bricks with Studs and IDs */}
            <div className="flex flex-wrap items-center justify-center gap-3 py-4">
              {tokens.map((token, idx) => (
                <div key={idx} className="flex flex-col items-center group transition-transform hover:scale-105">
                  {/* Real LEGO Studs */}
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-1.5 rounded-t-sm shadow-sm" style={{ backgroundColor: token.color }} />
                    <div className="w-3 h-1.5 rounded-t-sm shadow-sm" style={{ backgroundColor: token.color }} />
                  </div>
                  {/* Tactile 3D Brick */}
                  <div
                    className="px-5 py-3.5 rounded-xl border-2 font-mono font-black text-base shadow-lg transition-all"
                    style={{
                      backgroundColor: `${token.color}20`,
                      borderColor: token.color,
                      color: '#ffffff',
                    }}
                  >
                    <span>"{token.text}"</span>
                    <span className="block text-[11px] font-mono text-zinc-300 mt-1 font-normal opacity-90">
                      ID #{token.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs font-mono text-zinc-400">
              O computador não lê letras: ele processa os IDs numéricos dessas peças em matrizes matemáticas.
            </p>
          </div>
        )}

        {/* STAGE 2: 2D Semantic Galaxy (Embeddings) */}
        {step === 2 && (
          <div className="w-full max-w-4xl mx-auto space-y-4 animate-in zoom-in-95 duration-300 my-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase">Cluster: Criação / Código</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['app', 'software', 'código', 'criar', 'construir'].map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-sky-500/10 text-sky-200 border border-sky-500/20">
                      {w}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block">Coordenada semântica: (0.84, 0.91)</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-violet-400 uppercase">Cluster: Explicação</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['explicar', 'ensinar', 'resumir', 'didático'].map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-violet-500/10 text-violet-200 border border-violet-500/20">
                      {w}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block">Coordenada semântica: (-0.42, 0.77)</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Cluster: Tempo / Era</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['moderno', 'atual', '2025', 'futuro', 'rápido'].map((w, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-emerald-500/10 text-emerald-200 border border-emerald-500/20">
                      {w}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-zinc-500 block">Coordenada semântica: (0.12, -0.65)</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="px-4 py-1.5 rounded-full bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-700">
                💡 No espaço semântico, palavras com sentidos parecidos gravitam para o mesmo bairro!
              </span>
            </div>
          </div>
        )}

        {/* STAGE 3: Attention Network Matrix */}
        {step === 3 && (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 my-auto">
            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
              {['Entrada com Tokens', 'Atenção Cruzada', 'Camada Profunda', 'Filtro de Contexto', 'Saída'].map((layer, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-4 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-700 text-white font-mono text-xs font-bold shadow-md flex flex-col items-center min-w-[120px]">
                    <span className="text-[10px] text-primary block mb-1">NÍVEL {idx + 1}</span>
                    <span>{layer}</span>
                  </div>
                  {idx < 4 && <ArrowRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 max-w-xl mx-auto text-center space-y-1.5">
              <span className="text-xs font-mono text-zinc-400 block">
                O mecanismo de Atenção pergunta: "Qual palavra é mais importante para entender 'app'?"
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400 block">
                'criar' (94%) • 'moderno' (89%) • 'como' (72%)
              </span>
            </div>
          </div>
        )}

        {/* STAGE 4: Next Token Probability & Live Streaming */}
        {step === 4 && (
          <div className="w-full max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 my-auto">
            <div className="space-y-3 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
                Distribuição de Probabilidade do Próximo Token
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CANDIDATES.map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStreamedAnswer((prev) => `${prev} ${cand.word.trim()}`)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      cand.isWinner
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:bg-emerald-500/20'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold font-mono text-white">"{cand.word}"</span>
                      {cand.isWinner && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-zinc-950">
                          ELEITO
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cand.isWinner ? 'bg-emerald-400' : 'bg-zinc-500'}`}
                        style={{ width: `${cand.prob}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{cand.prob}% de probabilidade estatística</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Streaming Terminal Output */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-left font-mono text-sm shadow-inner space-y-1">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Resposta em Streaming:</span>
              <p className="text-white font-medium flex items-center gap-1.5 leading-relaxed">
                <span>{streamedAnswer}</span>
                <span className="w-2.5 h-5 bg-primary animate-pulse inline-block" />
              </p>
            </div>
          </div>
        )}

        {/* Stage Footnote */}
        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3 text-xs font-mono text-zinc-500">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>Zero Mágica: Apenas matemática pura e predição estatística de próximo bloco em milissegundos.</span>
          </span>
          <span className="text-white font-semibold">Passo {step + 1} de 5</span>
        </div>
      </div>
    </div>
  );
};
