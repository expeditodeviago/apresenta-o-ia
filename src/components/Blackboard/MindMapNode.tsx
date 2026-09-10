import React from 'react';
import { MindMapNodeData } from '../../types/presentation';
import { CHALK_COLORS, generateRoughRectPath } from '../../utils/chalkMath';
import {
  ObsidianLogo,
  NotebookLMLogo,
  PerplexityLogo,
  CursorLogo,
  V0Logo,
  DeepSeekLogo,
} from '../Icons/ToolLogos';
import {
  Sparkles,
  Binary,
  Network,
  BookOpen,
  Search,
  Code2,
  Layers,
  GitFork,
  Bot,
  Cpu,
  Workflow,
  Compass,
  GraduationCap,
  Play,
  Rocket,
  CheckCircle2,
} from 'lucide-react';

interface MindMapNodeProps {
  node: MindMapNodeData;
  isActive: boolean;
  isRevealed: boolean;
  isCompleted: boolean;
  onClick: (node: MindMapNodeData) => void;
  onOpenSimulator?: (simType: any) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Binary,
  Network,
  BookOpen,
  Search,
  Code2,
  Layers,
  GitFork,
  Bot,
  Cpu,
  Workflow,
  Compass,
  GraduationCap,
  Rocket,
  ObsidianLogo,
  NotebookLMLogo,
  PerplexityLogo,
  CursorLogo,
  V0Logo,
  DeepSeekLogo,
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({
  node,
  isActive,
  isRevealed,
  isCompleted,
  onClick,
  onOpenSimulator,
}) => {
  if (!isRevealed) {
    // Unrevealed placeholder in progressive mode
    return (
      <div
        style={{
          transform: `translate(${node.x}px, ${node.y}px)`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        className="absolute rounded-2xl border border-white/5 bg-white/[0.01] opacity-20 pointer-events-none transition-all duration-700 flex items-center justify-center"
      >
        <span className="font-mono text-xs text-slate-600">Passo {node.stepNumber}</span>
      </div>
    );
  }

  const colorMeta = CHALK_COLORS[node.color];
  const IconComponent = ICON_MAP[node.iconName] || Sparkles;

  // Memoize rough path
  const roughPath = React.useMemo(
    () => generateRoughRectPath(0, 0, node.width, node.height, 3),
    [node.width, node.height]
  );

  return (
    <div
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      className={`absolute select-none cursor-pointer transition-all duration-500 group animate-fade-in ${
        isActive
          ? 'scale-[1.05] z-30'
          : isCompleted
          ? 'hover:scale-[1.02] z-20 opacity-95'
          : 'hover:scale-[1.02] z-10'
      }`}
      onClick={() => onClick(node)}
    >
      {/* Active Matte Highlight Outline */}
      {isActive && (
        <div className="absolute -inset-1 rounded-2xl border-2 border-primary pointer-events-none shadow-sm" />
      )}

      {/* SVG Sketchy Hand-Drawn Chalk Border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${node.width} ${node.height}`}
      >
        <path
          d={roughPath}
          fill="#18181b"
          fillOpacity={isActive ? 0.98 : 0.92}
          stroke="none"
        />
        <path
          d={roughPath}
          fill="none"
          stroke={colorMeta.hex}
          strokeWidth={isActive ? 3 : isCompleted ? 2 : 1.5}
          strokeOpacity={isActive ? 1 : 0.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Card Body with Glassmorphism */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between backdrop-blur-sm rounded-2xl">
        {/* Header: Step Badge & Official Tool Icon */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs border shadow-sm transition-all ${
                isActive
                  ? 'bg-white text-slate-950 border-white shadow-lg scale-110'
                  : isCompleted
                  ? `${colorMeta.badgeBg} ${colorMeta.badgeText} ${colorMeta.badgeBorder}`
                  : `${colorMeta.badgeBg} ${colorMeta.badgeText} ${colorMeta.badgeBorder}`
              }`}
            >
              {isCompleted && !isActive ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                node.stepNumber
              )}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
              Passo {node.stepNumber}
            </span>
          </div>

          <div
            className={`p-1.5 rounded-xl border transition-all shadow-sm ${
              isActive
                ? 'bg-white/20 border-white/40 text-white shadow-md'
                : `${colorMeta.badgeBg} ${colorMeta.badgeBorder} ${colorMeta.badgeText}`
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
        </div>

        {/* Title & Metaphor Subtitle */}
        <div className="my-auto py-1">
          <h4
            className={`font-chalk font-bold text-lg md:text-xl leading-tight mb-1 transition-all ${
              isActive ? 'text-white underline decoration-wavy' : ''
            }`}
            style={{ color: isActive ? '#ffffff' : colorMeta.hex }}
          >
            {node.title}
          </h4>
          <p className="text-xs text-slate-300 font-friendly line-clamp-2 leading-relaxed">
            {node.subtitle}
          </p>
        </div>

        {/* Footer: Tags & Simulator Button */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/10 mt-1">
          <div className="flex flex-wrap gap-1">
            {node.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/50 text-slate-300 border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

          {node.simulatorType && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSimulator?.(node.simulatorType!);
              }}
              className="text-[10px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 transition-all shadow-sm"
              title="Abrir Simulador Interativo"
            >
              <Play className="w-3 h-3 fill-current" />
              Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
