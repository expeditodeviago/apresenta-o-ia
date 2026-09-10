import React from 'react';
import {
  X,
  Keyboard,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Home,
  PenTool,
  Volume2,
  Presentation,
  Trophy,
  Mic,
  LayoutGrid,
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['Espaço', 'ou', '→'],
      label: 'Avançar para o Próximo Passo da Apresentação',
      icon: ArrowRight,
    },
    {
      keys: ['←'],
      label: 'Voltar para o Passo Anterior',
      icon: ArrowLeft,
    },
    {
      keys: ['M'],
      label: 'Alternar entre Lousa a Giz 2D e Modo Slides',
      icon: Presentation,
    },
    {
      keys: ['Q'],
      label: 'Ativar Enquete / Desafio ao Vivo com a Turma',
      icon: Trophy,
    },
    {
      keys: ['P'],
      label: 'Abrir / Fechar Roteiro Secreto do Apresentador',
      icon: Mic,
    },
    {
      keys: ['O', 'ou', 'Home'],
      label: 'Visão Geral (Enquadrar todo o Mapa Mental)',
      icon: LayoutGrid,
    },
    {
      keys: ['F'],
      label: 'Alternar Modo Tela Cheia (Fullscreen)',
      icon: Maximize2,
    },
    {
      keys: ['D'],
      label: 'Ativar / Desativar Modo Rabisco Livre com Giz',
      icon: PenTool,
    },
    {
      keys: ['S'],
      label: 'Ligar / Mutar Efeitos Sonoros de Giz',
      icon: Volume2,
    },
    {
      keys: ['1', '2', '3', '4', '5'],
      label: 'Pular diretamente para as Zonas 1 a 5',
      icon: Keyboard,
    },
    {
      keys: ['Esc'],
      label: 'Fechar Modais / Voltar à Lousa',
      icon: X,
    },
    {
      keys: ['Scroll Mouse'],
      label: 'Zoom In / Out centrado no cursor',
      icon: Keyboard,
    },
    {
      keys: ['Arrastar'],
      label: 'Pan (Navegar livremente pelo espaço da lousa)',
      icon: Keyboard,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#111a14] border-2 border-emerald-500/40 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400" />
            <h3 className="font-chalk text-2xl font-bold text-emerald-300">
              Atalhos de Teclado & Navegação
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between gap-3"
              >
                <span className="text-xs text-slate-200 font-friendly flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  {sc.label}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {sc.keys.map((k, kIdx) =>
                    k === 'ou' ? (
                      <span key={kIdx} className="text-[10px] text-slate-400 mx-0.5">
                        ou
                      </span>
                    ) : (
                      <kbd
                        key={kIdx}
                        className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-emerald-300 border border-white/20 rounded shadow-sm"
                      >
                        {k}
                      </kbd>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Dica: Use as setas para uma condução limpa e sem olhar para o teclado.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
