import React from 'react';
import { X, Sparkles, Terminal, Network, Cpu, GitFork, Rocket, Play } from 'lucide-react';
import { ACTS, NODES } from '../../data/presentationData';

interface ActsOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
}

export const ActsOverviewModal: React.FC<ActsOverviewModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  onSelectStep,
}) => {
  if (!isOpen) return null;

  const getActIcon = (actNumber: number) => {
    switch (actNumber) {
      case 1:
        return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <Network className="w-5 h-5 text-purple-400" />;
      case 3:
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 4:
        return <GitFork className="w-5 h-5 text-emerald-400" />;
      case 5:
        return <Rocket className="w-5 h-5 text-foreground" />;
      default:
        return <Sparkles className="w-5 h-5 text-foreground" />;
    }
  };

  const getActBorderColor = (actNumber: number) => {
    switch (actNumber) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      default:
        return 'border-border hover:border-foreground/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary border border-border text-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">
                VISÃO GERAL — OS 5 ATOS DA APRESENTAÇÃO
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                Pressione a tecla [O] ou ESC para fechar • Clique em qualquer módulo para saltar imediatamente
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Matrix */}
        <div className="p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {ACTS.map((act) => {
              const actNodes = NODES.filter((n) => n.actId === act.id);
              const isCurrentAct = actNodes.some((n) => n.stepNumber === currentStep);

              return (
                <div
                  key={act.id}
                  className={`flex flex-col rounded-xl p-4 bg-secondary/30 border transition-all duration-300 ${getActBorderColor(
                    act.actNumber
                  )} ${isCurrentAct ? 'ring-1 ring-primary bg-secondary/60' : ''}`}
                >
                  {/* Act Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getActIcon(act.actNumber)}
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        ATO {act.actNumber}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1">{act.title.split(':')[1] || act.title}</h3>
                  <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2">{act.subtitle}</p>

                  <div className="mt-auto space-y-2">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block border-t border-border pt-2 mb-1">
                      Módulos & Sliders
                    </span>
                    {actNodes.map((node) => {
                      const isActive = node.stepNumber === currentStep;

                      return (
                        <button
                          key={node.id}
                          onClick={() => {
                            onSelectStep(node.stepNumber);
                            onClose();
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all flex items-center justify-between group ${
                            isActive
                              ? 'bg-primary text-primary-foreground font-semibold border-primary shadow-sm'
                              : 'bg-card border-border text-card-foreground hover:bg-muted'
                          }`}
                        >
                          <span className="truncate pr-2">{node.title}</span>
                          <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Shortcuts Hint Banner */}
          <div className="p-4 rounded-xl bg-secondary/40 border border-border flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-bold">⚡ ATALHOS RÁPIDOS:</span>
              <span>[Espaço / →] Próximo</span>
              <span>•</span>
              <span>[←] Voltar</span>
              <span>•</span>
              <span>[F] Tela Cheia</span>
              <span>•</span>
              <span>[L] Foco</span>
              <span>•</span>
              <span>[S] Spotlight</span>
            </div>
            <div className="text-muted-foreground">
              Duração estimada: <span className="text-foreground font-bold">2 Horas</span> • Foco: Inteligência Artificial Prática
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
