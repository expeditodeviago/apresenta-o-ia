import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Network, Plus, RotateCcw, Tag, Link2, Play, Pause, Sparkles } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  tag: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphLink {
  source: string;
  target: string;
}

const INITIAL_NODES: GraphNode[] = [
  { id: '1', label: 'Matemática Discreta', tag: 'Teoria', color: '#fbbf24', x: 250, y: 180, vx: 0, vy: 0, radius: 24 },
  { id: '2', label: 'Teoria dos Grafos', tag: 'Teoria', color: '#fbbf24', x: 180, y: 120, vx: 0, vy: 0, radius: 20 },
  { id: '3', label: 'Árvores de Decisão', tag: 'Teoria', color: '#fbbf24', x: 320, y: 120, vx: 0, vy: 0, radius: 20 },
  { id: '4', label: 'Engenharia de Software', tag: 'Engenharia', color: '#38bdf8', x: 420, y: 260, vx: 0, vy: 0, radius: 24 },
  { id: '5', label: 'Arquitetura Limpa', tag: 'Engenharia', color: '#38bdf8', x: 500, y: 220, vx: 0, vy: 0, radius: 18 },
  { id: '6', label: 'Modelos de Linguagem', tag: 'IA', color: '#4ade80', x: 260, y: 320, vx: 0, vy: 0, radius: 26 },
  { id: '7', label: 'Obsidian Second Brain', tag: 'Produtividade', color: '#c084fc', x: 150, y: 260, vx: 0, vy: 0, radius: 22 },
  { id: '8', label: 'Compiladores & AST', tag: 'Engenharia', color: '#38bdf8', x: 380, y: 180, vx: 0, vy: 0, radius: 20 },
  { id: '9', label: 'DeepSeek-R1 (MCTS)', tag: 'IA', color: '#4ade80', x: 350, y: 360, vx: 0, vy: 0, radius: 22 },
  { id: '10', label: 'Zettelkasten Atomic', tag: 'Produtividade', color: '#c084fc', x: 100, y: 320, vx: 0, vy: 0, radius: 18 },
];

const INITIAL_LINKS: GraphLink[] = [
  { source: '1', target: '2' },
  { source: '1', target: '3' },
  { source: '2', target: '4' },
  { source: '2', target: '6' },
  { source: '3', target: '9' },
  { source: '4', target: '5' },
  { source: '4', target: '8' },
  { source: '8', target: '3' },
  { source: '6', target: '9' },
  { source: '6', target: '7' },
  { source: '7', target: '10' },
  { source: '7', target: '1' },
];

export const ObsidianGraphSim: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<GraphLink[]>(INITIAL_LINKS);
  const [activeTag, setActiveTag] = useState<string>('Todos');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Engenharia');
  const [connectToNodeId, setConnectToNodeId] = useState('1');
  const [isRunning, setIsRunning] = useState(true);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const tags = ['Todos', 'Teoria', 'Engenharia', 'IA', 'Produtividade'];

  // Physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const simulate = () => {
      if (isRunning) {
        setNodes((prevNodes) => {
          const nextNodes = prevNodes.map((n) => ({ ...n }));

          // 1. Repulsion between all node pairs (Coulomb's Law)
          for (let i = 0; i < nextNodes.length; i++) {
            for (let j = i + 1; j < nextNodes.length; j++) {
              const n1 = nextNodes[i];
              const n2 = nextNodes[j];
              const dx = n2.x - n1.x;
              const dy = n2.y - n1.y;
              const dist = Math.hypot(dx, dy) || 1;

              if (dist < 220) {
                const force = 1800 / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (n1.id !== draggedNodeId) {
                  n1.vx -= fx;
                  n1.vy -= fy;
                }
                if (n2.id !== draggedNodeId) {
                  n2.vx += fx;
                  n2.vy += fy;
                }
              }
            }
          }

          // 2. Spring attraction along links (Hooke's Law)
          links.forEach((link) => {
            const n1 = nextNodes.find((n) => n.id === link.source);
            const n2 = nextNodes.find((n) => n.id === link.target);
            if (!n1 || !n2) return;

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const desiredDist = 100;
            const force = (dist - desiredDist) * 0.035;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n1.id !== draggedNodeId) {
              n1.vx += fx;
              n1.vy += fy;
            }
            if (n2.id !== draggedNodeId) {
              n2.vx -= fx;
              n2.vy -= fy;
            }
          });

          // 3. Center gravity & damping
          nextNodes.forEach((node) => {
            if (node.id === draggedNodeId) return;

            const dx = centerX - node.x;
            const dy = centerY - node.y;
            node.vx += dx * 0.008;
            node.vy += dy * 0.008;

            // Apply friction/damping
            node.vx *= 0.88;
            node.vy *= 0.88;

            node.x += node.vx;
            node.y += node.vy;

            // Constrain within bounds
            node.x = Math.max(node.radius + 10, Math.min(width - node.radius - 10, node.x));
            node.y = Math.max(node.radius + 10, Math.min(height - node.radius - 10, node.y));
          });

          return nextNodes;
        });
      }

      // Render Graph on Canvas
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach((link) => {
        const n1 = nodes.find((n) => n.id === link.source);
        const n2 = nodes.find((n) => n.id === link.target);
        if (!n1 || !n2) return;

        const isDimmed = activeTag !== 'Todos' && n1.tag !== activeTag && n2.tag !== activeTag;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isDimmed ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = isDimmed ? 1 : 2;
        ctx.stroke();
      });

      // Draw Nodes
      nodes.forEach((node) => {
        const isDimmed = activeTag !== 'Todos' && node.tag !== activeTag;

        // Glow ring
        if (!isDimmed) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}22`;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed ? '#242b35' : node.color;
        ctx.fill();
        ctx.strokeStyle = isDimmed ? '#475569' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label
        ctx.fillStyle = isDimmed ? '#64748b' : '#f8fafc';
        ctx.font = 'bold 11px "Patrick Hand", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      });

      animFrameRef.current = requestAnimationFrame(simulate);
    };

    animFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, links, nodes, activeTag, draggedNodeId]);

  // Mouse drag handlers on canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickedNode = nodes.find(
      (n) => Math.hypot(n.x - mouseX, n.y - mouseY) <= n.radius + 5
    );

    if (clickedNode) {
      setDraggedNodeId(clickedNode.id);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNodeId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggedNodeId ? { ...n, x: mouseX, y: mouseY, vx: 0, vy: 0 } : n
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const colors: Record<string, string> = {
      Teoria: '#fbbf24',
      Engenharia: '#38bdf8',
      IA: '#4ade80',
      Produtividade: '#c084fc',
    };

    const newId = String(Date.now());
    const newNode: GraphNode = {
      id: newId,
      label: newNoteTitle.trim(),
      tag: newNoteTag,
      color: colors[newNoteTag] || '#fbbf24',
      x: 300 + (Math.random() - 0.5) * 80,
      y: 200 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      radius: 20,
    };

    const newLink: GraphLink = {
      source: newId,
      target: connectToNodeId,
    };

    setNodes((prev) => [...prev, newNode]);
    setLinks((prev) => [...prev, newLink]);
    setNewNoteTitle('');
  };

  const handleReset = () => {
    setNodes(INITIAL_NODES);
    setLinks(INITIAL_LINKS);
    setActiveTag('Todos');
  };

  return (
    <div className="bg-[#0f1712] border-2 border-amber-500/40 rounded-xl p-5 text-slate-100 font-sans shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold font-chalk text-amber-300">
              Simulador do Grafo de Conhecimento do Obsidian (Force-Directed)
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-friendly">
            Clique e arraste os nós para sentir a física de atração e repulsão das suas anotações!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isRunning ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-white/10 border-white/20 text-slate-300'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Pausar Física' : 'Retomar Física'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Filtrar Tag:
        </span>
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTag(t)}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
              activeTag === t
                ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-sm'
                : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/30'
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div className="relative border border-amber-500/30 rounded-xl overflow-hidden bg-black/60 shadow-inner mb-4">
        <canvas
          ref={canvasRef}
          width={650}
          height={380}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="w-full h-[360px] cursor-grab active:cursor-grabbing"
        />
        <div className="absolute top-2 right-2 text-[10px] font-mono bg-black/70 px-2 py-1 rounded border border-white/10 text-slate-400">
          Nós: {nodes.length} | Conexões: {links.length}
        </div>
      </div>

      {/* Add New Note Section */}
      <form onSubmit={handleAddNote} className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Nova Nota:
        </span>
        <input
          type="text"
          placeholder="Ex: Teoria de Grafos em IA"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="flex-1 min-w-[160px] bg-slate-900/80 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <select
          value={newNoteTag}
          onChange={(e) => setNewNoteTag(e.target.value)}
          className="bg-slate-900/80 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
        >
          <option value="Teoria">#Teoria</option>
          <option value="Engenharia">#Engenharia</option>
          <option value="IA">#IA</option>
          <option value="Produtividade">#Produtividade</option>
        </select>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link2 className="w-3.5 h-3.5" /> Conectar a:
          <select
            value={connectToNodeId}
            onChange={(e) => setConnectToNodeId(e.target.value)}
            className="bg-slate-900/80 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-amber-500/20"
        >
          Criar Nota
        </button>
      </form>
    </div>
  );
};
