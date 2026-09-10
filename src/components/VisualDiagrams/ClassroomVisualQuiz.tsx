import React, { useState } from 'react';
import { HelpCircle, Sparkles, AlertTriangle, XCircle, CheckCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassroomVisualQuizProps {
  onClose?: () => void;
  isLightTheme?: boolean;
}

export const ClassroomVisualQuiz: React.FC<ClassroomVisualQuizProps> = ({
  onClose,
  isLightTheme = false,
}) => {
  const [selectedPath, setSelectedPath] = useState<'A' | 'B' | 'C' | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleChoosePath = (path: 'A' | 'B' | 'C') => {
    setSelectedPath(path);
  };

  const handleRevealAnswer = () => {
    setIsRevealed(true);
    setSelectedPath('C');

    // Confetti celebration
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#00f2fe', '#fbbf24', '#c084fc'],
    });
  };

  const handleReset = () => {
    setSelectedPath(null);
    setIsRevealed(false);
  };

  return (
    <div
      className={`w-full rounded-2xl p-6 md:p-8 transition-all duration-300 ${
        isLightTheme
          ? 'bg-white border border-slate-200 shadow-sm text-slate-800'
          : 'bg-card border border-border text-card-foreground shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6 border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary text-foreground border border-border">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-muted-foreground border border-border uppercase tracking-wider">
              ENQUETE AO VIVO COM A TURMA
            </span>
            <h3 className="text-base md:text-xl font-bold tracking-tight text-foreground mt-1">
              Desafio para o Palco: Como a IA Resolve Problemas Difíceis?
            </h3>
          </div>
        </div>

        {/* Action Reveal & Reset Buttons */}
        <div className="flex items-center gap-2">
          {!isRevealed ? (
            <button
              onClick={handleRevealAnswer}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs tracking-wider shadow-sm transition-all flex items-center gap-2 border border-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>REVELAR RESPOSTA DA TURMA</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tentar Novamente</span>
            </button>
          )}
        </div>
      </div>

      {/* Provocative Question Box */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <p className="text-base md:text-xl font-medium text-foreground leading-relaxed">
          "Quando você pede para uma IA de raciocínio profundo (como DeepSeek-R1 ou OpenAI o1) programar um sistema complexo sem alucinar, qual destas 3 estratégias ela adota?"
        </p>
        <span className="text-xs font-mono text-muted-foreground block">
          Peça para a sala levantar a mão: Quem vota na Estratégia A, B ou C?
        </span>
      </div>

      {/* 3 Illustrated Options (A, B, C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* PATH A: CHUTE CEGO */}
        <div
          onClick={() => handleChoosePath('A')}
          className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
            isRevealed
              ? 'border-rose-500/40 bg-rose-950/20 opacity-70'
              : selectedPath === 'A'
              ? 'border-primary bg-secondary/50 scale-[1.01]'
              : 'border-border bg-card/60 hover:border-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-secondary text-foreground font-bold font-mono text-sm flex items-center justify-center border border-border">
                A
              </span>
              <span className="text-xs font-mono text-muted-foreground">Geração Impulsiva</span>
            </div>

            <div className="h-32 rounded-xl bg-background/80 p-3 flex flex-col justify-center items-center border border-border relative overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full select-none">
                <circle cx="100" cy="15" r="7" fill="#64748b" />
                <line x1="100" y1="22" x2="40" y2="50" stroke="#475569" strokeWidth="2" />
                <line x1="100" y1="22" x2="80" y2="50" stroke="#475569" strokeWidth="2" />
                <line x1="100" y1="22" x2="120" y2="50" stroke="#475569" strokeWidth="2" />
                <line x1="100" y1="22" x2="160" y2="50" stroke="#475569" strokeWidth="2" />
                <circle cx="40" cy="50" r="5" fill="#f43f5e" />
                <circle cx="80" cy="50" r="5" fill="#f43f5e" />
                <circle cx="120" cy="50" r="5" fill="#f43f5e" />
                <circle cx="160" cy="50" r="5" fill="#f43f5e" />
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx={20 + i * 14} cy="85" r="3" fill="#f43f5e" opacity="0.8" />
                ))}
              </svg>
              {isRevealed && (
                <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center text-rose-400 font-mono text-xs font-bold p-2 text-center animate-fade-in">
                  <XCircle className="w-6 h-6 text-rose-400 mb-1" />
                  <span>FALHA: ALUCINAÇÃO PURA</span>
                  <span className="text-[10px] text-muted-foreground font-sans mt-0.5">
                    Cospe a 1ª palavra sem planejar!
                  </span>
                </div>
              )}
            </div>

            <h4 className="font-bold text-foreground text-base mt-3">Responder no Susto</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Digita a resposta imediatamente sem rascunhar mentalmente.
            </p>
          </div>
        </div>

        {/* PATH B: AVANÇO CEGO SEM VOLTAR */}
        <div
          onClick={() => handleChoosePath('B')}
          className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
            isRevealed
              ? 'border-amber-500/40 bg-amber-950/20 opacity-70'
              : selectedPath === 'B'
              ? 'border-primary bg-secondary/50 scale-[1.01]'
              : 'border-border bg-card/60 hover:border-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-8 h-8 rounded-full bg-secondary text-foreground font-bold font-mono text-sm flex items-center justify-center border border-border">
                B
              </span>
              <span className="text-xs font-mono text-muted-foreground">Sem Auto-Crítica</span>
            </div>

            <div className="h-32 rounded-xl bg-background/80 p-3 flex flex-col justify-center items-center border border-border relative overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full select-none">
                <line x1="30" y1="50" x2="140" y2="50" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" />
                <circle cx="30" cy="50" r="7" fill="#f59e0b" />
                <rect x="145" y="20" width="16" height="60" rx="3" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
                <text x="153" y="55" textAnchor="middle" fill="#ffffff" className="text-[10px] font-mono font-black rotate-90">
                  ERRO
                </text>
              </svg>
              {isRevealed && (
                <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center text-amber-400 font-mono text-xs font-bold p-2 text-center animate-fade-in">
                  <AlertTriangle className="w-6 h-6 text-amber-400 mb-1" />
                  <span>FALHA: BECO SEM SAÍDA</span>
                  <span className="text-[10px] text-muted-foreground font-sans mt-0.5">
                    Bate no erro e não sabe consertar.
                  </span>
                </div>
              )}
            </div>

            <h4 className="font-bold text-foreground text-base mt-3">Seguir em Frente Teimoso</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Segue uma única linha de raciocínio e trava quando encontra um erro.
            </p>
          </div>
        </div>

        {/* PATH C: RACIOCÍNIO PASSO A PASSO COM AUTO-CORREÇÃO (VENCEDOR!) */}
        <div
          onClick={() => handleChoosePath('C')}
          className={`cursor-pointer rounded-xl p-5 border transition-all duration-300 relative flex flex-col justify-between ${
            isRevealed
              ? 'border-primary bg-secondary/80 border-2 shadow-sm scale-[1.01]'
              : selectedPath === 'C'
              ? 'border-primary bg-secondary/50 scale-[1.01]'
              : 'border-border bg-card/60 hover:border-border/80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`w-8 h-8 rounded-full font-bold font-mono text-sm flex items-center justify-center border ${
                  isRevealed
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-foreground border-border'
                }`}
              >
                C
              </span>
              <span className="text-xs font-mono text-foreground font-semibold">Pensar ➔ Corrigir ➔ Entregar</span>
            </div>

            <div className="h-32 rounded-xl bg-background/80 p-3 flex flex-col justify-center items-center border border-border relative overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full select-none">
                <circle cx="40" cy="50" r="6" fill="#10b981" />
                <line x1="46" y1="50" x2="100" y2="30" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3 3" />
                <circle cx="100" cy="30" r="4" fill="#f43f5e" />
                <text x="108" y="33" fill="#f43f5e" className="text-[10px] font-mono">
                  ✕ Erro descartado
                </text>

                <line x1="46" y1="50" x2="110" y2="70" stroke="#10b981" strokeWidth="3.5" />
                <line x1="110" y1="70" x2="165" y2="70" stroke="#10b981" strokeWidth="3.5" />
                <circle cx="110" cy="70" r="5" fill="#10b981" />
                <polygon
                  points="165,62 168,68 174,68 170,72 171,78 165,74 159,78 160,72 156,68 162,68"
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
              </svg>
              {isRevealed && (
                <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center text-foreground font-mono text-xs font-bold p-2 text-center animate-fade-in">
                  <CheckCircle className="w-6 h-6 text-foreground mb-1" />
                  <span className="text-sm font-bold text-foreground">RESPOSTA CORRETA!</span>
                  <span className="text-[10px] text-muted-foreground font-sans mt-0.5">
                    Testa hipóteses e auto-corrige antes de falar!
                  </span>
                </div>
              )}
            </div>

            <h4 className="font-bold text-foreground text-base mt-3">Pensar, Testar e Consertar</h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Rascunha internamente, percebe os próprios erros e ajusta a rota.
            </p>
          </div>
        </div>
      </div>

      {/* Post-Reveal Pedagogical Badge */}
      {isRevealed && (
        <div className="p-4 rounded-xl bg-secondary/60 border border-border text-foreground text-xs md:text-sm leading-relaxed animate-fade-in flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-lg bg-secondary text-foreground border border-border flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-foreground font-mono block text-xs md:text-sm mb-1 uppercase tracking-wide">
              💡 A LIÇÃO PRÁTICA PARA LEVAR PARA CASA:
            </strong>
            <span className="text-muted-foreground font-sans leading-relaxed">
              Modelos de nova geração (como <strong>DeepSeek-R1</strong> e <strong>OpenAI o1</strong>) não respondem no susto: eles pensam antes de digitar. Durante o "Thinking...", eles criam um rascunho interno, testam a lógica, descartam hipóteses erradas e só mostram a resposta final quando têm certeza da solução. É exatamente assim que os melhores programadores trabalham!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
