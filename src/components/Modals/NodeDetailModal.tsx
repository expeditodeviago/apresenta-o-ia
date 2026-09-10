import React, { useState } from 'react';
import { MindMapNodeData } from '../../types/presentation';
import { CHALK_COLORS } from '../../utils/chalkMath';
import { TokenExplorer } from '../Simulators/TokenExplorer';
import { LiveKnowledgeGalaxy } from '../Simulators/LiveKnowledgeGalaxy';
import { HoloToolsDeck } from '../Simulators/HoloToolsDeck';
import { ReasoningTreeSim } from '../Simulators/ReasoningTreeSim';
import { CyberGraphDefender } from '../Games/CyberGraphDefender';
import {
  X,
  Sparkles,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Play,
  Lightbulb,
  Cpu,
  Layers,
} from 'lucide-react';

interface NodeDetailModalProps {
  node: MindMapNodeData | null;
  onClose: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  totalSteps: number;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onNextStep,
  onPrevStep,
  totalSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'tech' | 'dynamic' | 'tools' | 'simulator'>('details');

  if (!node) return null;

  const colorMeta = CHALK_COLORS[node.color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#111a14] border-2 border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div
          className="px-6 py-4 border-b border-white/10 flex items-start justify-between gap-4"
          style={{
            backgroundColor: `${colorMeta.hex}10`,
          }}
        >
          <div className="flex items-start gap-3">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-base border shadow-md shrink-0 mt-0.5"
              style={{
                backgroundColor: colorMeta.hex,
                color: '#0d1510',
                borderColor: '#ffffff',
              }}
            >
              {node.stepNumber}
            </span>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${colorMeta.badgeBg} ${colorMeta.badgeBorder} ${colorMeta.badgeText}`}
                >
                  Passo {node.stepNumber} de {totalSteps}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {node.zoneId ? `Zona ${node.zoneId.replace('zone-', '')}` : `Ato ${node.actId?.replace('act-', '')}`}
                </span>
              </div>
              <h3
                className="font-chalk text-2xl md:text-3xl font-bold leading-tight"
                style={{ color: colorMeta.hex }}
              >
                {node.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-300 font-friendly">
                {node.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/10"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-black/40 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analogia & Conceitos
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tech'
                ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-300" />
            Por Baixo dos Panos
          </button>

          <button
            onClick={() => setActiveTab('dynamic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dynamic'
                ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-300" />
            Dinâmica com a Turma
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tools'
                ? 'bg-sky-500/25 text-sky-200 border border-sky-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-300" />
            Ferramentas Reais ({node.tools.length})
          </button>

          {node.simulatorType && (
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-purple-300" />
              Simulador Interativo
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {/* TAB 1: ANALOGY & CONCEPTS */}
          {activeTab === 'details' && (
            <div className="space-y-5 animate-fade-in">
              {/* Analogy Card */}
              <div className="p-4 md:p-5 bg-black/40 rounded-xl border border-white/15">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold font-mono text-sm">
                  <Lightbulb className="w-4 h-4" />
                  <span>Metáfora Visual Direta:</span>
                </div>
                <h4 className="font-chalk text-xl md:text-2xl font-bold text-white mb-2">
                  {node.analogy.title}
                </h4>
                <p className="text-sm md:text-base text-slate-200 font-friendly leading-relaxed">
                  {node.analogy.description}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">
                  Pontos-Chave Essenciais:
                </h4>
                <div className="space-y-2">
                  {node.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-black/30 rounded-lg border border-white/10 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <span className="text-xs md:text-sm text-slate-200 font-friendly">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH UNDER THE HOOD */}
          {activeTab === 'tech' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 bg-amber-950/40 rounded-xl border border-amber-500/40">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <h4 className="font-chalk text-xl font-bold text-amber-300">
                    {node.techUnderTheHood?.concept || 'Como Funciona por Dentro'}
                  </h4>
                </div>

                <div className="p-4 bg-black/60 rounded-lg border border-amber-500/30 mb-3">
                  <span className="text-xs text-amber-300 font-mono font-bold uppercase tracking-wider block mb-1">
                    Mecânica Tecnológica:
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-friendly">
                    {node.techUnderTheHood?.howItWorks}
                  </p>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <span className="text-xs text-amber-300 font-mono font-bold block mb-1">
                    💡 Dica Prática de Demonstração no Palco:
                  </span>
                  <p className="text-xs text-slate-300 font-friendly">
                    {node.techUnderTheHood?.stageTip}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-300 font-friendly">
                🎯 <strong>Foco Prático:</strong> Zero matematiquês ou teorias de faculdade. Mostre como as peças de software, APIs e arquiteturas modernas de IA resolvem problemas no mundo real!
              </div>
            </div>
          )}

          {/* TAB 3: CLASSROOM DYNAMIC */}
          {activeTab === 'dynamic' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 bg-rose-950/40 rounded-xl border border-rose-500/40">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5 text-rose-400" />
                  <h4 className="font-chalk text-xl font-bold text-rose-300">
                    Momento Pergunta / Debate com a Turma
                  </h4>
                </div>

                <div className="p-4 bg-black/60 rounded-xl border border-rose-500/30 mb-4">
                  <span className="text-xs text-rose-300 font-bold uppercase tracking-wider font-mono block mb-1">
                    ❓ Lance esta pergunta para os alunos:
                  </span>
                  <p className="text-base text-white font-friendly font-bold">
                    "{node.classroomDynamic.prompt}"
                  </p>
                </div>

                <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider font-mono block mb-1">
                    💡 Resposta e Explicação Sugerida:
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 font-friendly leading-relaxed">
                    {node.classroomDynamic.suggestedAnswer}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOOLS */}
          {activeTab === 'tools' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-400">
                Ferramentas Práticas de Mercado:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {node.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-black/50 rounded-xl border border-white/15 flex flex-col justify-between hover:border-sky-400/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-bold text-base text-white font-mono">{tool.name}</h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-friendly mb-3">
                        {tool.description}
                      </p>
                    </div>

                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 font-bold text-xs border border-sky-400/40 transition-all"
                    >
                      <span>Acessar {tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SIMULATOR (If available) */}
          {activeTab === 'simulator' && node.simulatorType && (
            <div className="animate-fade-in">
              {node.simulatorType === 'token-explorer' && <TokenExplorer />}
              {node.simulatorType === 'knowledge-galaxy' && <LiveKnowledgeGalaxy />}
              {node.simulatorType === 'holo-deck' && <HoloToolsDeck />}
              {node.simulatorType === 'reasoning-tree' && <ReasoningTreeSim />}
              {node.simulatorType === 'matrix-protocol' && <CyberGraphDefender />}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between gap-3">
          <button
            onClick={onPrevStep}
            disabled={node.stepNumber <= 1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Passo Anterior
          </button>

          <div className="flex items-center gap-2">
            {node.simulatorType && activeTab !== 'simulator' && (
              <button
                onClick={() => setActiveTab('simulator')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40 hover:bg-purple-500/40 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Abrir Simulador
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 transition-all"
            >
              Fechar
            </button>
          </div>

          <button
            onClick={onNextStep}
            disabled={node.stepNumber >= totalSteps}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
          >
            Próximo Passo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
