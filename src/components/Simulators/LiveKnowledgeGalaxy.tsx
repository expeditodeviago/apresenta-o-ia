import React, { useState, useEffect, useRef } from 'react';
import { Network, Plus } from 'lucide-react';

interface GalaxyNode {
  id: string;
  title: string;
  cluster: 'foundations' | 'ai' | 'tools' | 'dev';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: string[];
}

const INITIAL_NODES: GalaxyNode[] = [
  { id: 'foundations', title: 'Fundamentos de IA', cluster: 'foundations', x: 280, y: 220, vx: 0, vy: 0, radius: 18, connections: ['embeddings', 'tokens', 'rag'] },
  { id: 'embeddings', title: 'Embeddings & Vetores', cluster: 'foundations', x: 380, y: 160, vx: 0, vy: 0, radius: 14, connections: ['obsidian', 'rag'] },
  { id: 'tokens', title: 'Tokens & Vocabulário', cluster: 'foundations', x: 200, y: 140, vx: 0, vy: 0, radius: 14, connections: ['r1', 'ollama'] },

  { id: 'obsidian', title: 'Obsidian (Segundo Cérebro)', cluster: 'tools', x: 480, y: 200, vx: 0, vy: 0, radius: 15, connections: ['embeddings', 'notebooklm'] },
  { id: 'cursor', title: 'Cursor / Windsurf', cluster: 'tools', x: 520, y: 320, vx: 0, vy: 0, radius: 14, connections: ['dev', 'v0'] },
  { id: 'v0', title: 'v0 (Geração de Telas)', cluster: 'tools', x: 600, y: 240, vx: 0, vy: 0, radius: 13, connections: ['dev'] },
  { id: 'notebooklm', title: 'NotebookLM (Áudio/Síntese)', cluster: 'tools', x: 500, y: 100, vx: 0, vy: 0, radius: 13, connections: ['rag', 'obsidian'] },

  { id: 'rag', title: 'RAG & Documentos', cluster: 'ai', x: 420, y: 80, vx: 0, vy: 0, radius: 13, connections: ['foundations'] },
  { id: 'r1', title: 'DeepSeek-R1 (Raciocínio)', cluster: 'ai', x: 140, y: 80, vx: 0, vy: 0, radius: 15, connections: ['tokens'] },
  { id: 'ollama', title: 'Ollama (Modelos Locais)', cluster: 'dev', x: 340, y: 400, vx: 0, vy: 0, radius: 13, connections: ['cursor'] },
  { id: 'dev', title: 'Arquiteto de Software', cluster: 'dev', x: 480, y: 420, vx: 0, vy: 0, radius: 16, connections: ['agents', 'cursor'] },
  { id: 'agents', title: 'Agentes Autônomos', cluster: 'ai', x: 220, y: 420, vx: 0, vy: 0, radius: 14, connections: ['dev'] },
];

export const LiveKnowledgeGalaxy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<GalaxyNode[]>(INITIAL_NODES);
  const [newTopicName, setNewTopicName] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<'all' | 'foundations' | 'ai' | 'tools' | 'dev'>('all');
  const [selectedNode, setSelectedNode] = useState<GalaxyNode | null>(null);

  const draggedNodeRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const nodesRef = useRef<GalaxyNode[]>(INITIAL_NODES);
  nodesRef.current = nodes;

  const clusterColors = {
    foundations: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: '#38bdf8' },
    tools: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7' },
    ai: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' },
    dev: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b' },
  };

  // Force-directed Physics loop (clean matte, zero glow)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clean matte canvas background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Subtle matte grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const currentNodes = nodesRef.current;

      // 1. Calculate Forces
      // Repulsion
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const n1 = currentNodes[i];
          const n2 = currentNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;

          if (dist < 260) {
            const force = 1200 / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNodeRef.current?.id !== n1.id) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (draggedNodeRef.current?.id !== n2.id) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }
      }

      // Attraction on connections
      for (let i = 0; i < currentNodes.length; i++) {
        const n1 = currentNodes[i];
        for (const targetId of n1.connections) {
          const n2 = currentNodes.find((n) => n.id === targetId);
          if (!n2) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;

          const springForce = (dist - 150) * 0.003;
          const fx = (dx / dist) * springForce;
          const fy = (dy / dist) * springForce;

          if (draggedNodeRef.current?.id !== n1.id) {
            n1.vx += fx;
            n1.vy += fy;
          }
          if (draggedNodeRef.current?.id !== n2.id) {
            n2.vx -= fx;
            n2.vy -= fy;
          }
        }
      }

      // Center gravity & dampening
      for (const n of currentNodes) {
        if (draggedNodeRef.current?.id === n.id) continue;

        const dx = width / 2 - n.x;
        const dy = height / 2 - n.y;
        n.vx += dx * 0.002;
        n.vy += dy * 0.002;

        n.vx *= 0.88;
        n.vy *= 0.88;

        n.x += n.vx;
        n.y += n.vy;

        n.x = Math.max(n.radius + 10, Math.min(width - n.radius - 10, n.x));
        n.y = Math.max(n.radius + 10, Math.min(height - n.radius - 10, n.y));
      }

      // 2. Draw Connections (Clean lines without glow)
      ctx.lineWidth = 1;
      for (const n1 of currentNodes) {
        for (const targetId of n1.connections) {
          const n2 = currentNodes.find((n) => n.id === targetId);
          if (!n2) continue;

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.stroke();
        }
      }

      // 3. Draw Nodes (Matte disks with clean border)
      for (const n of currentNodes) {
        const isDimmed = selectedCluster !== 'all' && n.cluster !== selectedCluster;
        const alpha = isDimmed ? 0.25 : 1.0;
        const col = clusterColors[n.cluster];

        ctx.save();
        ctx.globalAlpha = alpha;

        // Core node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#18181b';
        ctx.fill();
        ctx.strokeStyle = col.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = col.color;
        ctx.fill();

        // Title Label
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = '#f4f4f5';
        ctx.textAlign = 'center';
        ctx.fillText(n.title, n.x, n.y + n.radius + 14);

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedCluster]);

  // Mouse Interaction handlers for Dragging Nodes
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodesRef.current.find((n) => Math.hypot(n.x - x, n.y - y) <= n.radius + 6);
    if (clickedNode) {
      draggedNodeRef.current = { id: clickedNode.id, offsetX: x - clickedNode.x, offsetY: y - clickedNode.y };
      setSelectedNode(clickedNode);
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNodeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const node = nodesRef.current.find((n) => n.id === draggedNodeRef.current?.id);
    if (node) {
      node.x = x;
      node.y = y;
      node.vx = 0;
      node.vy = 0;
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  // Add new topic node
  const handleAddLiveNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    const newNode: GalaxyNode = {
      id: `custom-${Date.now()}`,
      title: newTopicName.trim(),
      cluster: 'tools',
      x: 380 + (Math.random() - 0.5) * 80,
      y: 240 + (Math.random() - 0.5) * 80,
      vx: 0,
      vy: 0,
      radius: 14,
      connections: ['foundations', 'dev'],
    };

    setNodes((prev) => [...prev, newNode]);
    setNewTopicName('');
  };

  const totalVertices = nodes.length;
  const totalEdges = Math.round(
    nodes.reduce((acc, n) => acc + n.connections.length, 0) / 2
  );
  const avgDegree = ((totalEdges * 2) / totalVertices).toFixed(1);

  return (
    <div className="rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              MAPA DE CONHECIMENTO INTERATIVO — REDE DE IDEIAS
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Arraste os nós • Adicione novos conceitos • Explore relações entre ferramentas e modelos
            </p>
          </div>
        </div>

        {/* Live Metrics HUD */}
        <div className="flex items-center gap-3 text-xs font-mono bg-secondary px-4 py-2 rounded-xl border border-border">
          <div>Conceitos: <strong className="text-foreground">{totalVertices}</strong></div>
          <span className="text-muted-foreground">•</span>
          <div>Conexões: <strong className="text-foreground">{totalEdges}</strong></div>
          <span className="text-muted-foreground">•</span>
          <div>Média de Links: <strong className="text-foreground">{avgDegree}</strong></div>
        </div>
      </div>

      {/* Cluster Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-muted-foreground">FILTRAR:</span>
          {(['all', 'foundations', 'ai', 'tools', 'dev'] as const).map((cl) => (
            <button
              key={cl}
              onClick={() => setSelectedCluster(cl)}
              className={`px-3 py-1 rounded-lg uppercase transition-all ${
                selectedCluster === cl
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {cl === 'all' ? 'TODOS' : cl === 'foundations' ? 'FUNDAMENTOS' : cl === 'tools' ? 'FERRAMENTAS' : cl === 'ai' ? 'MODELOS' : 'DEV'}
            </button>
          ))}
        </div>

        {/* Add Live Topic Form */}
        <form onSubmit={handleAddLiveNode} className="flex items-center gap-2">
          <input
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="Ex: DeepSeek-V3, Cursor..."
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-semibold transition-all shadow-sm border border-primary/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADICIONAR NÓ</span>
          </button>
        </form>
      </div>

      {/* Canvas Interactive Viewport */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-background shadow-sm">
        <canvas
          ref={canvasRef}
          width={760}
          height={460}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-[440px] cursor-grab active:cursor-grabbing block"
        />

        {/* Selected Node Details Box */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-card/90 border border-border text-xs font-mono flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Conceito Selecionado: <strong className="text-foreground">{selectedNode.title}</strong></span>
              <span className="text-muted-foreground">({selectedNode.connections.length} conexões)</span>
            </div>
            <span className="text-muted-foreground">Cluster: <strong className="text-foreground uppercase">{selectedNode.cluster}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
