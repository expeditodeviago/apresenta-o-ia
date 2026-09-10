// src/components/navigation/LevelOverviewModal.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, PRESENTATION_ACTS } from '../../store/usePresentationStore';
import { X, Layers, ArrowRight } from 'lucide-react';

interface LevelOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelOverviewModal: React.FC<LevelOverviewModalProps> = ({ isOpen, onClose }) => {
  const { currentAct, setAct } = usePresentationStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      // Atalhos numéricos 1 a 9, e 0 para o ato 10
      if (isOpen && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        const act = parseInt(e.key, 10);
        setAct(act);
        onClose();
      } else if (isOpen && e.key === '0') {
        setAct(10);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, setAct]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Glassy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-5xl rounded-3xl liquid-glass border border-white/15 p-6 sm:p-8 shadow-2xl shadow-black ring-1 ring-white/10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Mapa dos 13 Atos • SYNAPSE Keynote
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Clique em qualquer ato para pular instantaneamente.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid dos 13 Atos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {PRESENTATION_ACTS.map((act) => {
                const isCurrent = act.id === currentAct;

                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      setAct(act.id);
                      onClose();
                    }}
                    className={`tactile-btn p-3.5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {act.actNumberStr}
                      </span>
                      <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                        {act.id === 10 ? '0' : act.id}
                      </kbd>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">{act.icon}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {act.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {act.subtitle}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                      <span>Entrar no ato</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
