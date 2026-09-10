import React, { useState } from 'react';
import { Network, Sparkles, Zap, Compass, RotateCcw, ChevronRight, Share2, Info } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  line: 'blue' | 'green' | 'amber' | 'rose';
  x: number;
  y: number;
  isTransfer?: boolean;
  degree: number;
  connectedTo: string[];
  description: string;
}

interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
}

interface BrainMetroMapDiagramProps {
  currentSubStep?: number;
  onStepChange?: (step: number) => void;
  isLightTheme?: boolean;
}

export const BrainMetroMapDiagram: React.FC<BrainMetroMapDiagramProps> = ({
  currentSubStep,
  onStepChange,
  isLightTheme = false,
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const step = currentSubStep !== undefined ? currentSubStep : internalStep;

  const setStep = (s: number) => {
    const clamped = Math.max(0, Math.min(3, s));
    if (onStepChange) onStepChange(clamped);
    else setInternalStep(clamped);
  };

  const [activeStationId, setActiveStationId] = useState<string>('math');
  const [pulseLine, setPulseLine] = useState<boolean>(true);

  const STATIONS: Station[] = [
    {
      id: 'math',
      name: 'Matemática Discreta',
      line: 'blue',
      x: 380,
      y: 200,
      isTransfer: true,
      degree: 5,
      connectedTo: ['graphs', 'logic', 'ai', 'ast', 'pkm'],
      description: 'Hub Central G=(V,E): O ponto de transferência onde convergem lógica, combinatória e grafos.',
    },
    {
      id: 'graphs',
      name: 'Teoria dos Grafos',
      line: 'blue',
      x: 230,
      y: 130,
      isTransfer: true,
      degree: 4,
      connectedTo: ['math', 'pkm', 'ai', 'algo'],
      description: 'Modela conexões semânticas, matrizes de adjacência e caminhos mínimos.',
    },
    {
      id: 'logic',
      name: 'Lógica Proposicional',
      line: 'blue',
      x: 140,
      y: 220,
      degree: 2,
      connectedTo: ['math', 'algo'],
      description: 'Tabelas-verdade, autômatos determinísticos e invariantes de software.',
    },
    {
      id: 'algo',
      name: 'Algoritmos & Big-O',
      line: 'blue',
      x: 250,
      y: 310,
      degree: 3,
      connectedTo: ['logic', 'graphs', 'arch'],
      description: 'Análise assintótica de complexidade e busca em espaços discretos.',
    },
    {
      id: 'ai',
      name: 'Redes Neurais & LLMs',
      line: 'green',
      x: 540,
      y: 130,
      isTransfer: true,
      degree: 4,
      connectedTo: ['math', 'graphs', 'mcts', 'pkm'],
      description: 'Espaços vetoriais, camadas de atenção e predição probabilística de tokens.',
    },
    {
      id: 'mcts',
      name: 'Raciocínio & MCTS',
      line: 'green',
      x: 680,
      y: 180,
      degree: 2,
      connectedTo: ['ai', 'math'],
      description: 'Busca em árvore com poda e backtracking em tempo de inferência (o1 / DeepSeek-R1).',
    },
    {
      id: 'ast',
      name: 'Compiladores & AST',
      line: 'amber',
      x: 480,
      y: 310,
      degree: 3,
      connectedTo: ['math', 'arch', 'ai'],
      description: 'Árvores Sintáticas Abstratas que alimentam ferramentas como Cursor e Windsurf.',
    },
    {
      id: 'arch',
      name: 'Arquitetura Limpa',
      line: 'amber',
      x: 370,
      y: 380,
      degree: 2,
      connectedTo: ['algo', 'ast'],
      description: 'Contratos de software, DAGs de dependência e modularidade de sistemas.',
    },
    {
      id: 'pkm',
      name: 'Obsidian & Zettelkasten',
      line: 'rose',
      x: 290,
      y: 70,
      isTransfer: true,
      degree: 4,
      connectedTo: ['math', 'graphs', 'ai'],
      description: 'Notas atômicas interligadas por [[wiki-links]]. Conhecimento associativo sem pastas.',
    },
  ];

  const LINES: MetroLine[] = [
    { id: 'blue', name: 'Linha Azul: Fundamentos de Computação', color: '#0ea5e9', stations: ['logic', 'math', 'graphs', 'algo'] },
    { id: 'green', name: 'Linha Verde: Inteligência Artificial', color: '#10b981', stations: ['math', 'ai', 'mcts'] },
    { id: 'amber', name: 'Linha Âmbar: Sistemas & Compiladores', color: '#f59e0b', stations: ['algo', 'arch', 'ast', 'math'] },
    { id: 'rose', name: 'Linha Coral: Segundo Cérebro (Obsidian)', color: '#f43f5e', stations: ['pkm', 'graphs', 'math', 'ai'] },
  ];

  const activeStation = STATIONS.find((s) => s.id === activeStationId) || STATIONS[0];

  const handleSelectStation = (stationId: string) => {
    setActiveStationId(stationId);
    setPulseLine(false);
    setTimeout(() => setPulseLine(true), 50);
  };

  return (
    <div
      className={`w-full rounded-3xl p-6 transition-all duration-300 ${
        isLightTheme
          ? 'bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/50 text-slate-800'
          : 'glass-panel border border-purple-500/25 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Header & Mode Steps */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6 border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold tracking-tight">
              O Mapa de Metrô do Cérebro: Gestão do Conhecimento em Grafo
            </h3>
            <p className="text-xs text-slate-400">
              Estações = Notas da faculdade • Linhas = Arestas semânticas • Luz viajando = Pensamento sem pastas
            </p>
          </div>
        </div>

        {/* Stepped progression buttons */}
        <div className="flex items-center gap-2">
          {[
            { idx: 0, label: '1. As 4 Linhas' },
            { idx: 1, label: '2. Hubs & Centralidade' },
            { idx: 2, label: '3. Sinapse Sem Pastas' },
          ].map((s) => (
            <button
              key={s.idx}
              onClick={() => setStep(s.idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                step === s.idx
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30 font-bold'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-700/50'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            onClick={() => setStep((step + 1) % 3)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/40 text-xs font-bold flex items-center gap-1 transition-all"
            title="Avançar passo"
          >
            <span>Avançar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Metro Canvas + Station Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* METRO MAP SVG CANVAS (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-center items-center min-h-[420px]">
          {/* Subtle London Tube style grid lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* SVG Transit Map */}
          <svg viewBox="0 0 800 460" className="w-full h-auto max-h-[420px] select-none">
            <defs>
              <filter id="glow-station" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="line-pulse" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* METRO TRACKS (ARESTAS DO GRAFO) */}
            {/* Blue Line: Logic -> Math -> Graphs -> Algo */}
            <path
              d="M 140 220 L 260 220 L 380 200 L 230 130 L 250 310"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-75"
            />
            {/* Green Line: Math -> AI -> MCTS */}
            <path
              d="M 380 200 L 540 130 L 680 180"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-75"
            />
            {/* Amber Line: Algo -> Arch -> AST -> Math */}
            <path
              d="M 250 310 L 370 380 L 480 310 L 380 200"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-75"
            />
            {/* Rose Line: PKM -> Graphs -> Math -> AI */}
            <path
              d="M 290 70 L 230 130 L 380 200 L 540 130"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-75"
            />

            {/* ANIMATED LIGHT PULSE TRAVELING ON CONNECTED EDGES */}
            {pulseLine &&
              activeStation.connectedTo.map((targetId) => {
                const target = STATIONS.find((s) => s.id === targetId);
                if (!target) return null;
                return (
                  <g key={`pulse-${activeStation.id}-${target.id}`}>
                    <line
                      x1={activeStation.x}
                      y1={activeStation.y}
                      x2={target.x}
                      y2={target.y}
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeDasharray="8 12"
                      className="animate-[dash_1.5s_linear_infinite]"
                    />
                    <circle r="4" fill="#ffffff" filter="url(#glow-station)">
                      <animateMotion
                        path={`M ${activeStation.x} ${activeStation.y} L ${target.x} ${target.y}`}
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}

            {/* STATIONS (VÉRTICES DO GRAFO) */}
            {STATIONS.map((station) => {
              const isSelected = station.id === activeStationId;
              const isConnected = activeStation.connectedTo.includes(station.id);

              return (
                <g
                  key={station.id}
                  onClick={() => handleSelectStation(station.id)}
                  className="cursor-pointer group"
                  transform={`translate(${station.x}, ${station.y})`}
                >
                  {/* Station glow halo when selected or connected */}
                  {(isSelected || isConnected) && (
                    <circle
                      r={station.isTransfer ? 24 : 18}
                      fill={isSelected ? '#c084fc' : '#38bdf8'}
                      opacity={isSelected ? 0.4 : 0.2}
                      className="animate-ping"
                      style={{ animationDuration: '2.5s' }}
                    />
                  )}

                  {/* Outer station ring */}
                  <circle
                    r={station.isTransfer ? 16 : 11}
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                    stroke={
                      station.line === 'blue'
                        ? '#0ea5e9'
                        : station.line === 'green'
                        ? '#10b981'
                        : station.line === 'amber'
                        ? '#f59e0b'
                        : '#f43f5e'
                    }
                    strokeWidth={station.isTransfer ? '4' : '3'}
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Inner station dot */}
                  <circle
                    r={station.isTransfer ? 7 : 4}
                    fill={isSelected ? '#0f172a' : '#ffffff'}
                  />

                  {/* Station Label */}
                  <text
                    y={station.y > 280 ? 28 : -22}
                    textAnchor="middle"
                    className={`text-[11px] font-mono tracking-tight transition-all font-bold ${
                      isSelected
                        ? 'fill-white font-extrabold text-[13px]'
                        : isConnected
                        ? 'fill-cyan-300'
                        : 'fill-slate-400 group-hover:fill-slate-200'
                    }`}
                  >
                    {station.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Hint */}
          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Clique em qualquer estação para ver o pulso de luz percorrer as ideias sem pastas!</span>
          </div>
        </div>

        {/* STATION INSPECTOR CARD (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Station Card */}
          <div className="rounded-2xl p-5 bg-slate-900/80 border border-purple-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ESTAÇÃO SELECIONADA
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Grau deg(v) = {activeStation.degree}
              </span>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">
                {activeStation.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeStation.description}
              </p>
            </div>

            {/* Direct Connections Pill List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                Conexões Semânticas Diretas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeStation.connectedTo.map((cId) => {
                  const s = STATIONS.find((x) => x.id === cId);
                  return (
                    <button
                      key={cId}
                      onClick={() => handleSelectStation(cId)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition-all flex items-center gap-1"
                    >
                      <span>➔</span>
                      <span>{s?.name || cId}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Why graphs beat folders callout */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 leading-relaxed font-sans">
              <strong className="text-white block mb-0.5">Por que o Grafo Vence as Pastas?</strong>
              Pastas forçam 1 única gaveta. No metrô do cérebro, você chega em "{activeStation.name}" por qualquer uma das {activeStation.degree} linhas conectadas!
            </div>
          </div>

          {/* Color Line Legend */}
          <div className="rounded-2xl p-4 bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
              Linhas da Malha de Conhecimento:
            </span>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {LINES.map((line) => (
                <div key={line.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                  <span className="text-slate-300 text-[11px] font-medium">{line.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Math Secret Pill on Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Teoria dos Grafos: Vértices V, Arestas E & Centralidade de Intermediação</span>
        </div>
        <span className="text-slate-500">Pressione [Espaço] para avançar o passo do desenho</span>
      </div>
    </div>
  );
};
