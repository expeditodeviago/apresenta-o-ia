import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, LayoutGrid, Sparkles, FileText } from 'lucide-react';
import { NODES } from '../../data/presentationData';
import { CHALK_COLORS } from '../../utils/chalkMath';

interface PresentationHUDProps {
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onJumpToStep: (stepNumber: number) => void;
  onOverview: () => void;
  onOpenCurrentModal: () => void;
  onToggleNotes?: () => void;
  isNotesOpen?: boolean;
}

export const PresentationHUD: React.FC<PresentationHUDProps> = ({
  currentStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  onJumpToStep,
  onOverview,
  onOpenCurrentModal,
  onToggleNotes,
  isNotesOpen,
}) => {
  const activeNode = NODES.find((n) => n.stepNumber === currentStep);
  const colorMeta = activeNode ? CHALK_COLORS[activeNode.color] : CHALK_COLORS.green;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-4xl no-pan">
      <div className="chalk-hud rounded-2xl px-4 py-3 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 select-none">
        {/* Left: Overview Button & Step Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOverview}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-all shadow-sm"
            title="Visão Geral do Mapa Mental (Home)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                currentStep > 0
                  ? `${colorMeta.badgeBg} ${colorMeta.badgeText} ${colorMeta.badgeBorder}`
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
            >
              {currentStep > 0 ? `Passo ${currentStep} / ${totalSteps}` : 'Visão Geral'}
            </span>

            {onToggleNotes && (
              <button
                onClick={onToggleNotes}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                  isNotesOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/10'
                }`}
                title="Colinha do Apresentador (Tecla P)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Colinha (P)</span>
              </button>
            )}
          </div>
        </div>

        {/* Center: Current Step Title & Chalk Dots */}
        <div className="flex-1 text-center px-2">
          {currentStep > 0 && activeNode ? (
            <div
              onClick={onOpenCurrentModal}
              className="cursor-pointer group flex flex-col items-center"
              title="Clique para abrir detalhes ricos deste nó"
            >
              <h4
                className="font-chalk text-lg md:text-xl font-bold truncate max-w-md group-hover:underline transition-all flex items-center gap-1.5"
                style={{ color: colorMeta.hex }}
              >
                {activeNode.title}
                <Sparkles className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </h4>
              <p className="text-[11px] text-slate-300 font-friendly truncate max-w-sm">
                {activeNode.subtitle}
              </p>
            </div>
          ) : (
            <div className="text-sm font-chalk text-slate-300">
              Explore o mapa livremente ou use as setas para iniciar o modo guiado
            </div>
          )}

          {/* Chalk Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-1.5 overflow-x-auto max-w-full py-0.5">
            {NODES.map((node) => {
              const isCurrent = node.stepNumber === currentStep;
              const isPast = node.stepNumber < currentStep;
              const dotColor = CHALK_COLORS[node.color];

              return (
                <button
                  key={node.id}
                  onClick={() => onJumpToStep(node.stepNumber)}
                  className={`transition-all duration-300 rounded-full ${
                    isCurrent
                      ? 'w-5 h-2.5 border border-white shadow-sm'
                      : isPast
                      ? 'w-2 h-2 opacity-80'
                      : 'w-1.5 h-1.5 opacity-30 hover:opacity-70'
                  }`}
                  style={{
                    backgroundColor: isCurrent || isPast ? dotColor.hex : '#94a3b8',
                  }}
                  title={`Passo ${node.stepNumber}: ${node.title}`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Previous & Next Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevStep}
            disabled={currentStep <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/70 hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none text-foreground border border-border transition-all"
            title="Passo Anterior (Seta Esquerda)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none text-primary-foreground shadow-sm transition-all border border-primary/20"
            title="Próximo Passo (Espaço / Seta Direita)"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
