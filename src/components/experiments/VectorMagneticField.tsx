import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Compass, Sparkles, RefreshCw, Plus, Info } from 'lucide-react';

interface SemanticNode {
  id: string;
  label: string;
  category: 'fauna' | 'flora' | 'royalty' | 'tech';
  baseX: number;
  baseY: number;
  color: string;
  accent: string;
}

const INITIAL_NODES: SemanticNode[] = [
  // Cluster Fauna (Animais)
  { id: '1', label: 'Cachorro', category: 'fauna', baseX: 160, baseY: 140, color: '#38bdf8', accent: '#0284c7' },
  { id: '2', label: 'Lobo', category: 'fauna', baseX: 240, baseY: 110, color: '#38bdf8', accent: '#0284c7' },
  { id: '3', label: 'Gato', category: 'fauna', baseX: 180, baseY: 220, color: '#38bdf8', accent: '#0284c7' },
  { id: '4', label: 'Leão', category: 'fauna', baseX: 270, baseY: 200, color: '#38bdf8', accent: '#0284c7' },

  // Cluster Flora (Frutas)
  { id: '5', label: 'Banana', category: 'flora', baseX: 540, baseY: 120, color: '#f59e0b', accent: '#d97706' },
  { id: '6', label: 'Maçã', category: 'flora', baseX: 620, baseY: 160, color: '#f59e0b', accent: '#d97706' },
  { id: '7', label: 'Laranja', category: 'flora', baseX: 580, baseY: 230, color: '#f59e0b', accent: '#d97706' },

  // Cluster Realeza (Soberania)
  { id: '8', label: 'Rei', category: 'royalty', baseX: 200, baseY: 420, color: '#a855f7', accent: '#7e22ce' },
  { id: '9', label: 'Rainha', category: 'royalty', baseX: 290, baseY: 450, color: '#a855f7', accent: '#7e22ce' },
  { id: '10', label: 'Coroa', category: 'royalty', baseX: 240, baseY: 360, color: '#a855f7', accent: '#7e22ce' },

  // Cluster Tech (Código & IA)
  { id: '11', label: 'Código', category: 'tech', baseX: 560, baseY: 400, color: '#10b981', accent: '#059669' },
  { id: '12', label: 'Algoritmo', category: 'tech', baseX: 660, baseY: 380, color: '#10b981', accent: '#059669' },
  { id: '13', label: 'Robô', category: 'tech', baseX: 610, baseY: 470, color: '#10b981', accent: '#059669' },
];

export const VectorMagneticField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<SemanticNode[]>(INITIAL_NODES);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>(() => {
    const init: { [id: string]: { x: number; y: number } } = {};
    INITIAL_NODES.forEach((n) => {
      init[n.id] = { x: n.baseX, y: n.baseY };
    });
    return init;
  });

  const [newWord, setNewWord] = useState('');
  const [newCategory, setNewCategory] = useState<'fauna' | 'flora' | 'royalty' | 'tech'>('fauna');

  // Track position updates during drag
  const handleDrag = useCallback((id: string, info: { point: { x: number; y: number } }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 50, info.point.x - rect.left));
    const y = Math.max(30, Math.min(rect.height - 50, info.point.y - rect.top));

    setPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  }, []);

  const resetPositions = () => {
    const reset: { [id: string]: { x: number; y: number } } = {};
    nodes.forEach((n) => {
      reset[n.id] = { x: n.baseX, y: n.baseY };
    });
    setPositions(reset);
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    const colors: Record<string, { color: string; accent: string }> = {
      fauna: { color: '#38bdf8', accent: '#0284c7' },
      flora: { color: '#f59e0b', accent: '#d97706' },
      royalty: { color: '#a855f7', accent: '#7e22ce' },
      tech: { color: '#10b981', accent: '#059669' },
    };

    const newId = `node-${Date.now()}`;
    const randX = Math.random() * 400 + 200;
    const randY = Math.random() * 300 + 150;

    const newNode: SemanticNode = {
      id: newId,
      label: newWord.trim(),
      category: newCategory,
      baseX: randX,
      baseY: randY,
      color: colors[newCategory].color,
      accent: colors[newCategory].accent,
    };

    setNodes((prev) => [...prev, newNode]);
    setPositions((prev) => ({ ...prev, [newId]: { x: randX, y: randY } }));
    setNewWord('');
  };

  // Find connections between nodes in the same category
  const connections = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      if (nodeA.category === nodeB.category) {
        const posA = positions[nodeA.id] || { x: nodeA.baseX, y: nodeA.baseY };
        const posB = positions[nodeB.id] || { x: nodeB.baseX, y: nodeB.baseY };
        const dist = Math.hypot(posA.x - posB.x, posA.y - posB.y);

        connections.push({
          id: `${nodeA.id}-${nodeB.id}`,
          nodeA,
          nodeB,
          posA,
          posB,
          distance: dist,
          color: nodeA.color,
        });
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Módulo 02 • Espaço Vetorial
            </span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-zinc-400" /> Física de Mola Semântica
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Vector Magnetic Field
            <span className="text-sm font-normal text-zinc-400 hidden sm:inline">
              — Embeddings & Relações Semânticas 2D
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Palavras com significados próximos vivem vizinhas no espaço vetorial.
            <strong className="text-zinc-200"> Arraste qualquer nó com o mouse</strong> para demonstrar a elasticidade e como o modelo agrupa conceitos afins por proximidade cósmica.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetPositions}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Restaurar Posições
          </button>
        </div>
      </div>

      {/* Main 2D Magnetic Vector Field */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[440px] my-5 bg-[#0f0f13] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Radar & Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Subtle Cartesian Axes */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-800/70 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800/70 pointer-events-none" />
        <div className="absolute top-3 left-4 text-[10px] font-mono text-zinc-600">
          DIMENSÃO Y (VETOR V2)
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-zinc-600">
          DIMENSÃO X (VETOR V1)
        </div>

        {/* Semantic Cluster Label Overlays */}
        <div className="absolute top-5 left-10 pointer-events-none opacity-40 text-xs font-mono text-sky-400 tracking-wider uppercase">
          ✦ Grupo Animais
        </div>
        <div className="absolute top-5 right-20 pointer-events-none opacity-40 text-xs font-mono text-amber-400 tracking-wider uppercase">
          ✦ Grupo Frutas
        </div>
        <div className="absolute bottom-8 left-14 pointer-events-none opacity-40 text-xs font-mono text-purple-400 tracking-wider uppercase">
          ✦ Grupo Realeza
        </div>
        <div className="absolute bottom-8 right-24 pointer-events-none opacity-40 text-xs font-mono text-emerald-400 tracking-wider uppercase">
          ✦ Grupo Tecnologia
        </div>

        {/* SVG Dynamic Elastic Spring Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="grad-spring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {connections.map((conn) => {
            // Elastic tension calculation: closer = thicker and brighter
            const maxDist = 350;
            const tension = Math.max(0.1, 1 - conn.distance / maxDist);
            const strokeWidth = Math.max(1, tension * 3);
            const opacity = Math.max(0.15, tension * 0.7);

            return (
              <g key={conn.id}>
                {/* Elastic Spring Line */}
                <line
                  x1={conn.posA.x}
                  y1={conn.posA.y}
                  x2={conn.posB.x}
                  y2={conn.posB.y}
                  stroke={conn.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={conn.distance > 220 ? '4 3' : 'none'}
                />

                {/* Midpoint distance / cosine similarity indicator on hover/drag */}
                {activeDragId && (activeDragId === conn.nodeA.id || activeDragId === conn.nodeB.id) && (
                  <text
                    x={(conn.posA.x + conn.posB.x) / 2}
                    y={(conn.posA.y + conn.posB.y) / 2 - 6}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    cos θ: {(Math.max(0, 1 - conn.distance / 400)).toFixed(2)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Draggable Word Nodes */}
        {nodes.map((node) => {
          const pos = positions[node.id] || { x: node.baseX, y: node.baseY };

          return (
            <motion.div
              key={node.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.15}
              dragMomentum={false}
              onDragStart={() => setActiveDragId(node.id)}
              onDragEnd={() => setActiveDragId(null)}
              onDrag={(_, info) => handleDrag(node.id, info)}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                x: '-50%',
                y: '-50%',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95, cursor: 'grabbing' }}
              className="cursor-grab z-10 select-none group"
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-shadow duration-200"
                style={{
                  backgroundColor: 'rgba(20, 20, 24, 0.92)',
                  borderColor: node.color,
                  boxShadow: activeDragId === node.id ? `0 0 20px ${node.color}66` : '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                {/* Node glowing orb */}
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: node.color,
                    boxShadow: `0 0 8px ${node.color}`,
                  }}
                />
                <span className="text-xs md:text-sm font-semibold text-zinc-100 tracking-tight">
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Add Word & Live Instruction Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#141417] border border-zinc-800/80 rounded-xl p-3 md:p-4">
        {/* Quick Didactic Tip */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Dica didática: No espaço vetorial, "Rei" - "Homem" + "Mulher" se aproxima magneticamente de "Rainha".
          </span>
        </div>

        {/* Add custom node form */}
        <form onSubmit={handleAddWord} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Nova palavra..."
            className="bg-[#1a1a1f] border border-zinc-700/60 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-sky-500 w-36"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="bg-[#1a1a1f] border border-zinc-700/60 rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="fauna">Animais</option>
            <option value="flora">Frutas</option>
            <option value="royalty">Realeza</option>
            <option value="tech">Tech</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/50 text-white transition-colors"
          >
            <Plus className="w-3 h-3" /> Inserir Nó
          </button>
        </form>
      </div>
    </div>
  );
};
