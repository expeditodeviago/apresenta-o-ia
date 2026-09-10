import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Compass, RefreshCw, Plus, Info, Sparkles } from 'lucide-react';

interface SemanticNode {
  id: string;
  label: string;
  category: 'royalty' | 'transport' | 'fauna' | 'tech';
  baseX: number;
  baseY: number;
  color: string;
  accent: string;
}

const INITIAL_NODES: SemanticNode[] = [
  // Cluster Realeza (Atração forte)
  { id: '1', label: 'Rei', category: 'royalty', baseX: 160, baseY: 140, color: '#f59e0b', accent: '#d97706' },
  { id: '2', label: 'Rainha', category: 'royalty', baseX: 240, baseY: 120, color: '#f59e0b', accent: '#d97706' },
  { id: '3', label: 'Príncipe', category: 'royalty', baseX: 200, baseY: 220, color: '#f59e0b', accent: '#d97706' },
  { id: '4', label: 'Coroa', category: 'royalty', baseX: 270, baseY: 200, color: '#f59e0b', accent: '#d97706' },

  // Cluster Transporte (Repelido da Realeza)
  { id: '5', label: 'Carro', category: 'transport', baseX: 540, baseY: 130, color: '#0ea5e9', accent: '#0284c7' },
  { id: '6', label: 'Avião', category: 'transport', baseX: 630, baseY: 170, color: '#0ea5e9', accent: '#0284c7' },
  { id: '7', label: 'Trem', category: 'transport', baseX: 580, baseY: 230, color: '#0ea5e9', accent: '#0284c7' },

  // Cluster Fauna
  { id: '8', label: 'Lobo', category: 'fauna', baseX: 190, baseY: 420, color: '#10b981', accent: '#059669' },
  { id: '9', label: 'Cachorro', category: 'fauna', baseX: 270, baseY: 440, color: '#10b981', accent: '#059669' },

  // Cluster Tech
  { id: '10', label: 'Código', category: 'tech', baseX: 560, baseY: 400, color: '#6366f1', accent: '#4f46e5' },
  { id: '11', label: 'Algoritmo', category: 'tech', baseX: 650, baseY: 390, color: '#6366f1', accent: '#4f46e5' },
];

export const Act03_Embeddings: React.FC = () => {
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
  const [newCategory, setNewCategory] = useState<'royalty' | 'transport' | 'fauna' | 'tech'>('royalty');

  const handleDrag = useCallback((id: string, info: { point: { x: number; y: number } }) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(rect.width - 60, info.point.x - rect.left));
    const y = Math.max(40, Math.min(rect.height - 60, info.point.y - rect.top));

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
      royalty: { color: '#f59e0b', accent: '#d97706' },
      transport: { color: '#0ea5e9', accent: '#0284c7' },
      fauna: { color: '#10b981', accent: '#059669' },
      tech: { color: '#6366f1', accent: '#4f46e5' },
    };

    const newId = `node-${Date.now()}`;
    const randX = Math.random() * 400 + 200;
    const randY = Math.random() * 250 + 150;

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Ato 03 • Espaço Vetorial
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> Física de Mola Semântica
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Espaço Semântico dos Embeddings
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Geometria dos Significados
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Como a máquina sabe que "Rei" e "Rainha" são correlatos, mas "Carro" pertence a outro universo?
            <strong className="text-slate-200"> Arraste os nós pelo palco</strong> para ver as linhas de atração recalcularem a elasticidade e similaridade de cosseno em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetPositions}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Resetar Posições
          </button>
        </div>
      </div>

      {/* Main 2D Magnetic Field */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[420px] my-5 bg-[#090d16] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Subtle Axes */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-800/80 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800/80 pointer-events-none" />
        <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-500">
          DIMENSÃO VETORIAL Y (SOBERANIA vs TRANSPORTE)
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500">
          DIMENSÃO VETORIAL X (BIOLOGIA vs TECNOLOGIA)
        </div>

        {/* Category Labels */}
        <div className="absolute top-5 left-10 pointer-events-none opacity-40 text-xs font-mono text-amber-400 tracking-wider uppercase">
          ✦ Campo Realeza (Atração Mútua)
        </div>
        <div className="absolute top-5 right-20 pointer-events-none opacity-40 text-xs font-mono text-sky-400 tracking-wider uppercase">
          ✦ Campo Transporte (Repelido)
        </div>
        <div className="absolute bottom-8 left-14 pointer-events-none opacity-40 text-xs font-mono text-emerald-400 tracking-wider uppercase">
          ✦ Campo Fauna
        </div>
        <div className="absolute bottom-8 right-24 pointer-events-none opacity-40 text-xs font-mono text-indigo-400 tracking-wider uppercase">
          ✦ Campo Tecnologia
        </div>

        {/* SVG Dynamic Elastic Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn) => {
            const maxDist = 350;
            const tension = Math.max(0.1, 1 - conn.distance / maxDist);
            const strokeWidth = Math.max(1, tension * 3.5);
            const opacity = Math.max(0.2, tension * 0.8);

            return (
              <g key={conn.id}>
                <line
                  x1={conn.posA.x}
                  y1={conn.posA.y}
                  x2={conn.posB.x}
                  y2={conn.posB.y}
                  stroke={conn.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={conn.distance > 230 ? '4 3' : 'none'}
                />

                {activeDragId && (activeDragId === conn.nodeA.id || activeDragId === conn.nodeB.id) && (
                  <text
                    x={(conn.posA.x + conn.posB.x) / 2}
                    y={(conn.posA.y + conn.posB.y) / 2 - 6}
                    fill="#cbd5e1"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Similaridade: {(Math.max(0, 1 - conn.distance / 400)).toFixed(2)}
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xl backdrop-blur-md transition-shadow duration-200"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  borderColor: node.color,
                  boxShadow: activeDragId === node.id ? `0 0 20px ${node.color}88` : '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: node.color,
                    boxShadow: `0 0 8px ${node.color}`,
                  }}
                />
                <span className="text-xs md:text-sm font-semibold text-slate-100 tracking-tight">
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Add Word & Tip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 obsidian-glass rounded-xl p-3 md:p-4 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            A álgebra dos vetores: <strong>Rei - Homem + Mulher = Rainha</strong>. Significados viram coordenadas calculáveis.
          </span>
        </div>

        <form onSubmit={handleAddWord} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Nova palavra..."
            className="bg-[#0b0f19] border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 w-36"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="bg-[#0b0f19] border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="royalty">Realeza</option>
            <option value="transport">Transporte</option>
            <option value="fauna">Fauna</option>
            <option value="tech">Tech</option>
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-white transition-colors"
          >
            <Plus className="w-3 h-3" /> Inserir Nó
          </button>
        </form>
      </div>
    </div>
  );
};
