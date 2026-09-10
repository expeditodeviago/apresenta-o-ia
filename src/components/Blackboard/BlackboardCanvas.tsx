import React from 'react';
import { NODES, ZONES, CONNECTIONS } from '../../data/presentationData';
import { MindMapNodeData } from '../../types/presentation';
import { MindMapNode } from './MindMapNode';
import { ChalkConnection } from './ChalkConnection';
import { CHALK_COLORS, generateRoughRectPath } from '../../utils/chalkMath';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles, Eye, EyeOff } from 'lucide-react';

interface BlackboardCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  viewport: { x: number; y: number; zoom: number };
  currentStep: number;
  progressiveMode: boolean;
  onToggleProgressive: () => void;
  onNodeClick: (node: MindMapNodeData) => void;
  onOpenSimulator: (simType: any) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset100: () => void;
  onFitOverview: () => void;
  isDragging: boolean;
  theme?: 'slate' | 'green' | 'blueprint' | 'cyber';
}

export const BlackboardCanvas: React.FC<BlackboardCanvasProps> = ({
  containerRef,
  viewport,
  currentStep,
  progressiveMode,
  onToggleProgressive,
  onNodeClick,
  onOpenSimulator,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomIn,
  onZoomOut,
  onReset100,
  onFitOverview,
  isDragging,
  theme = 'slate',
}) => {
  const activeNode = NODES.find((n) => n.stepNumber === currentStep);

  const getThemeClass = () => {
    switch (theme) {
      case 'green':
        return 'chalkboard-green';
      case 'blueprint':
        return 'chalkboard-blueprint';
      case 'slate':
      default:
        return 'chalkboard-slate';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden chalkboard-texture ${getThemeClass()} ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Transformed 2D World Layer */}
      <div
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
          width: '3800px',
          height: '1900px',
        }}
      >
        {/* Zone Chalk Frames */}
        {ZONES.map((zone) => {
          const colorMeta = CHALK_COLORS[zone.color];
          const roughBorder = generateRoughRectPath(
            zone.bounds.x,
            zone.bounds.y,
            zone.bounds.width,
            zone.bounds.height,
            4
          );

          // In progressive mode, only show zone if at least one node in zone is reached
          const zoneNodes = NODES.filter((n) => n.zoneId === zone.id);
          const isZoneVisible =
            !progressiveMode ||
            currentStep === 0 ||
            zoneNodes.some((n) => n.stepNumber <= currentStep);

          if (!isZoneVisible) return null;

          return (
            <div key={zone.id} className="pointer-events-none animate-fade-in transition-opacity duration-700">
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                <path
                  d={roughBorder}
                  fill={colorMeta.rgba(0.02)}
                  stroke={colorMeta.hex}
                  strokeWidth="2.5"
                  strokeDasharray="10,10"
                  strokeOpacity="0.4"
                />
              </svg>

              {/* Zone Header Label in Chalk Style */}
              <div
                style={{
                  transform: `translate(${zone.bounds.x + 24}px, ${zone.bounds.y + 18}px)`,
                }}
                className="absolute"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs uppercase font-mono px-2.5 py-0.5 rounded-lg border font-bold ${colorMeta.badgeBg} ${colorMeta.badgeBorder} ${colorMeta.badgeText}`}
                  >
                    Zona {zone.zoneNumber}
                  </span>
                  <h3
                    className="font-chalk text-2xl md:text-3xl font-bold tracking-wide"
                    style={{ color: colorMeta.hex }}
                  >
                    {zone.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 font-friendly mt-1 max-w-lg">
                  {zone.subtitle}
                </p>
              </div>
            </div>
          );
        })}

        {/* Chalk Connections SVG Layer */}
        <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          {CONNECTIONS.map((conn) => {
            const fromNode = NODES.find((n) => n.id === conn.fromNodeId);
            const toNode = NODES.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const isRevealed =
              !progressiveMode ||
              currentStep === 0 ||
              (fromNode.stepNumber <= currentStep && toNode.stepNumber <= currentStep);

            const isConnActive =
              activeNode?.id === fromNode.id || activeNode?.id === toNode.id;

            return (
              <ChalkConnection
                key={conn.id}
                connection={conn}
                fromNode={fromNode}
                toNode={toNode}
                isActive={isConnActive}
                isRevealed={isRevealed}
              />
            );
          })}
        </svg>

        {/* Mind Map Nodes */}
        {NODES.map((node) => {
          const isActive = node.stepNumber === currentStep;
          const isRevealed =
            !progressiveMode || currentStep === 0 || node.stepNumber <= currentStep;
          const isCompleted = currentStep > node.stepNumber;

          return (
            <MindMapNode
              key={node.id}
              node={node}
              isActive={isActive}
              isRevealed={isRevealed}
              isCompleted={isCompleted}
              onClick={onNodeClick}
              onOpenSimulator={onOpenSimulator}
            />
          );
        })}
      </div>

      {/* Floating Canvas Controls (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2 no-pan select-none">
        {/* Progressive Reveal Toggle */}
        <button
          onClick={onToggleProgressive}
          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all shadow-sm ${
            progressiveMode
              ? 'text-foreground border-primary bg-secondary'
              : 'text-muted-foreground hover:text-foreground bg-card border-border'
          }`}
          title="Alternar Modo Revelação Progressiva"
        >
          {progressiveMode ? <Sparkles className="w-4 h-4 text-foreground" /> : <Eye className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {progressiveMode ? 'Modo Progressivo Ativo' : 'Ver Todos os Nós'}
          </span>
        </button>

        {/* Pan/Zoom Controls HUD */}
        <div className="p-1.5 rounded-xl bg-card border border-border flex items-center gap-1 shadow-sm">
          <button
            onClick={onZoomIn}
            className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            title="Aproximar Zoom (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            title="Afastar Zoom (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onReset100}
            className="px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-muted text-xs font-mono font-semibold text-muted-foreground hover:text-foreground border border-border transition-colors"
            title="Resetar Zoom para 100%"
          >
            100%
          </button>
          <button
            onClick={onFitOverview}
            className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            title="Ajustar Mapa à Tela (Home)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
