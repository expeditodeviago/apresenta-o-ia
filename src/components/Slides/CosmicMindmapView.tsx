import React from 'react';
import { ACTS, NODES, CONNECTIONS } from '../../data/presentationData';
import { MindMapNodeData } from '../../types/presentation';
import { Sparkles, ZoomIn, ZoomOut, RotateCcw, ArrowRight, ExternalLink } from 'lucide-react';

interface CosmicMindmapViewProps {
  viewport: { x: number; y: number; zoom: number };
  currentStep: number;
  onSelectNode: (node: MindMapNodeData) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isDragging: boolean;
}

export const CosmicMindmapView: React.FC<CosmicMindmapViewProps> = ({
  viewport,
  currentStep,
  onSelectNode,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isDragging,
}) => {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* 2D / 3D Canvas Space */}
      <div
        className="absolute origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
          width: '3400px',
          height: '1800px',
        }}
      >
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {CONNECTIONS.map((conn) => {
            const fromNode = NODES.find((n) => n.id === conn.fromNodeId);
            const toNode = NODES.find((n) => n.id === conn.toNodeId);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x + fromNode.width / 2;
            const y1 = fromNode.y + fromNode.height / 2;
            const x2 = toNode.x + toNode.width / 2;
            const y2 = toNode.y + toNode.height / 2;

            const isCurrentActive =
              fromNode.stepNumber === currentStep || toNode.stepNumber === currentStep;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isCurrentActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isCurrentActive ? 2 : 1}
                  strokeDasharray={isCurrentActive ? '4,4' : 'none'}
                />
              </g>
            );
          })}
        </svg>

        {/* 15 Matte Nodes */}
        {NODES.map((node) => {
          const isActive = node.stepNumber === currentStep;
          const isPassed = node.stepNumber < currentStep;

          return (
            <div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
              }}
              className={`absolute rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between cursor-pointer group select-none shadow-sm ${
                isActive
                  ? 'bg-card border-2 border-primary scale-[1.02] z-20 ring-1 ring-primary/20'
                  : isPassed
                  ? 'bg-card/90 border-border hover:border-foreground/40 hover:scale-[1.01] z-10'
                  : 'bg-card/50 border-border/70 hover:border-border hover:scale-[1.01] z-10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-muted-foreground border border-border">
                    SLIDE {node.stepNumber}
                  </span>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                  )}
                </div>

                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-1">
                  {node.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{node.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="truncate pr-1 text-foreground font-medium">{node.tags[0]}</span>
                <div className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                  <span>Abrir</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-20 right-8 z-20 flex items-center gap-2 p-1.5 rounded-xl bg-card/90 border border-border shadow-sm">
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
          title="Aumentar Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onResetZoom}
          className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
          title="Resetar Câmera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
