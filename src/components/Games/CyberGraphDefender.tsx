import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, RotateCcw, Play, CheckCircle, Zap, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NodeState {
  id: string;
  name: string;
  activeRoute: number; // index of target route
  targets: string[];
  isTargetCore?: boolean;
}

export const CyberGraphDefender: React.FC = () => {
  const [score, setScore] = useState(0);
  const [packetsDelivered, setPacketsDelivered] = useState(0);
  const [packetPos, setPacketPos] = useState<string>('node-start');
  const [gameActive, setGameActive] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Nodes in the network
  const [networkNodes, setNetworkNodes] = useState<Record<string, NodeState>>({
    'node-start': { id: 'node-start', name: 'Gateway de Entrada', activeRoute: 0, targets: ['node-router-1', 'node-router-2'] },
    'node-router-1': { id: 'node-router-1', name: 'Roteador 1 (Norte)', activeRoute: 0, targets: ['node-router-3', 'node-trap'] },
    'node-router-2': { id: 'node-router-2', name: 'Roteador 2 (Sul)', activeRoute: 0, targets: ['node-router-3', 'node-core'] },
    'node-router-3': { id: 'node-router-3', name: 'Filtro Hub', activeRoute: 0, targets: ['node-core', 'node-trap'] },
    'node-trap': { id: 'node-trap', name: 'Loop Infinito (Trap)', activeRoute: 0, targets: ['node-start'] },
    'node-core': { id: 'node-core', name: 'Destino Final', activeRoute: 0, targets: [], isTargetCore: true },
  });

  // Toggle node direction on click
  const handleToggleRoute = (nodeId: string) => {
    setNetworkNodes((prev) => {
      const node = prev[nodeId];
      if (!node || node.targets.length <= 1) return prev;
      const nextRoute = (node.activeRoute + 1) % node.targets.length;
      return {
        ...prev,
        [nodeId]: { ...node, activeRoute: nextRoute },
      };
    });
    setLogs((prev) => [
      `[ROTA] Nó ${networkNodes[nodeId]?.name} redirecionado -> ${networkNodes[nodeId]?.targets[(networkNodes[nodeId]?.activeRoute + 1) % networkNodes[nodeId]?.targets.length]}`,
      ...prev.slice(0, 5),
    ]);
  };

  // Packet movement loop
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setPacketPos((current) => {
        const currentNode = networkNodes[current];
        if (!currentNode) return 'node-start';

        if (currentNode.isTargetCore) {
          // Packet reached Core!
          setPacketsDelivered((p) => {
            const next = p + 1;
            if (next >= 5) {
              setGameWon(true);
              setGameActive(false);
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            }
            return next;
          });
          setScore((s) => s + 200);
          setLogs((prev) => ['⭐ PACOTE ENTREGUE COM SUCESSO! (+200 pts) Rota rápida sem loops.', ...prev.slice(0, 5)]);
          return 'node-start';
        }

        if (current === 'node-trap') {
          setScore((s) => Math.max(0, s - 50));
          setLogs((prev) => ['⚠️ ALERTA: Pacote caiu em loop infinito! Roteando de volta.', ...prev.slice(0, 5)]);
          return 'node-start';
        }

        const nextTarget = currentNode.targets[currentNode.activeRoute];
        return nextTarget || 'node-start';
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [gameActive, networkNodes]);

  const handleStartGame = () => {
    setScore(0);
    setPacketsDelivered(0);
    setPacketPos('node-start');
    setGameWon(false);
    setGameActive(true);
    setLogs(['Iniciando transmissão de pacotes de dados pela rede...']);
  };

  return (
    <div className="rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                ROTEAMENTO INTELIGENTE — MINI-APP GERADO AO VIVO
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-foreground border border-border">
                100% JOGÁVEL
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Clique nos nós para direcionar o tráfego e guiar os pacotes até o destino sem cair em loops!
            </p>
          </div>
        </div>

        {/* Score & Delivery Status */}
        <div className="flex items-center gap-4 text-xs font-mono bg-secondary px-4 py-2 rounded-xl border border-border">
          <div>Pontuação: <strong className="text-foreground text-sm">{score}</strong></div>
          <span className="text-muted-foreground">•</span>
          <div>Pacotes Entregues: <strong className="text-foreground text-sm">{packetsDelivered}/5</strong></div>
          <button
            onClick={handleStartGame}
            className="ml-2 px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-mono transition-all flex items-center gap-1 shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{gameActive ? 'REINICIAR' : 'JOGAR AGORA'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Board */}
      <div className="rounded-xl p-6 bg-background border border-border grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Layer 1: Start */}
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs font-mono text-muted-foreground font-semibold">1. ORIGEM DOS DADOS:</span>
          <button
            onClick={() => handleToggleRoute('node-start')}
            className={`p-4 rounded-xl border text-left font-mono text-xs transition-all relative ${
              packetPos === 'node-start'
                ? 'bg-secondary border-primary ring-1 ring-primary text-foreground shadow-sm'
                : 'bg-card border-border text-foreground hover:border-foreground/30'
            }`}
          >
            {packetPos === 'node-start' && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
                PACOTE AQUI!
              </span>
            )}
            <div className="font-semibold text-sm text-foreground">{networkNodes['node-start'].name}</div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Rota Ativa: <strong className="text-foreground">{networkNodes['node-start'].targets[networkNodes['node-start'].activeRoute]}</strong>
            </div>
            <span className="text-[10px] text-muted-foreground mt-2 block">[Clique para alternar rota]</span>
          </button>
        </div>

        {/* Layer 2: Intermediate Routers */}
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs font-mono text-muted-foreground font-semibold">2. ROTEADORES INTERMEDIÁRIOS:</span>
          {['node-router-1', 'node-router-2', 'node-router-3'].map((id) => {
            const node = networkNodes[id];
            const hasPacket = packetPos === id;

            return (
              <button
                key={id}
                onClick={() => handleToggleRoute(id)}
                className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all relative ${
                  hasPacket
                    ? 'bg-secondary border-primary ring-1 ring-primary text-foreground shadow-sm'
                    : 'bg-card border-border text-foreground hover:border-foreground/30'
                }`}
              >
                {hasPacket && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
                    PACOTE AQUI!
                  </span>
                )}
                <div className="font-semibold text-foreground">{node.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Apontando para: <strong className="text-foreground">{node.targets[node.activeRoute]}</strong>
                </div>
              </button>
            );
          })}
        </div>

        {/* Layer 3: Destinations (Core or Trap) */}
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs font-mono text-muted-foreground font-semibold">3. DESTINO:</span>

          {/* Winning Core */}
          <div
            className={`p-5 rounded-xl border text-left font-mono text-xs transition-all relative ${
              packetPos === 'node-core'
                ? 'bg-secondary border-primary ring-1 ring-primary text-foreground shadow-sm'
                : 'bg-secondary/40 border-border text-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm text-foreground">DESTINO FINAL</div>
              <Shield className="w-5 h-5 text-foreground" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Entregue pacotes aqui para pontuar. Roteamento inteligente sem ciclos.
            </p>
          </div>

          {/* Loop Trap */}
          <div
            className={`p-4 rounded-xl border text-left font-mono text-xs transition-all ${
              packetPos === 'node-trap'
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                : 'bg-secondary/20 border-border text-muted-foreground'
            }`}
          >
            <div className="font-semibold text-rose-400">LOOP INFINITO (TRAP)</div>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Penaliza -50 pontos e manda o pacote de volta para o início.
            </p>
          </div>
        </div>
      </div>

      {/* Win Celebration Banner */}
      {gameWon && (
        <div className="p-4 rounded-xl bg-secondary/80 border border-primary text-center space-y-2 animate-fade-in shadow-sm">
          <div className="flex items-center justify-center gap-2 text-foreground font-bold text-base font-mono">
            <Sparkles className="w-5 h-5" />
            <span>MISSÃO CUMPRIDA COM SUCESSO! 5 PACOTES ENTREGUES!</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            O enxame de agentes de IA completou a rota com perfeição e a engenharia de software venceu mais uma vez!
          </p>
        </div>
      )}

      {/* Live Routing Log Terminal */}
      <div className="p-3 rounded-xl bg-background border border-border font-mono text-[11px] text-muted-foreground space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] border-b border-border pb-1">
          <Terminal className="w-3.5 h-3.5" />
          <span>LOG DE ROTEAMENTO EM TEMPO REAL:</span>
        </div>
        {logs.map((l, i) => (
          <div key={i} className="truncate text-foreground">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};
