import React, { useState } from 'react';
import { GitFork, Play, RotateCcw, CheckCircle, XCircle, Terminal, Bot } from 'lucide-react';
import { RobotMazeTreeDiagram } from '../VisualDiagrams/RobotMazeTreeDiagram';

interface TreeNode {
  id: string;
  name: string;
  depth: number;
  qScore: number;
  status: 'pending' | 'exploring' | 'pruned' | 'optimal';
  children?: string[];
  parentId?: string;
  thoughtLog: string;
}

const PROBLEMS = [
  {
    id: 'routing',
    title: 'Roteamento Inteligente de Servidores em Nuvem',
    description: 'Encontrar a rota mais rápida e confiável entre servidores sem sofrer com gargalos de rede.',
    complexity: 'Otimização de Rotas',
  },
  {
    id: 'resources',
    title: 'Alocação Inteligente de Recursos e Memória',
    description: 'Distribuir tarefas pesadas sem concorrência ou desperdício de infraestrutura.',
    complexity: 'Planejamento Heurístico',
  },
  {
    id: 'deadlock',
    title: 'Prevenção de Loops em Pipelines Assíncronos',
    description: 'Detectar tarefas presas em círculo e corrigir o fluxo antes de travar o sistema.',
    complexity: 'Validação de Fluxos',
  },
];

export const ReasoningTreeSim: React.FC = () => {
  const [viewMode, setViewMode] = useState<'robot-maze' | 'mcts-tree'>('robot-maze');
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [thoughtLogs, setThoughtLogs] = useState<string[]>([]);

  // Tree nodes definition
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([
    { id: 'root', name: 'Objetivo do Usuário', depth: 0, qScore: 0.5, status: 'pending', children: ['b1', 'b2', 'b3'], thoughtLog: 'Recebido problema: analisando caminhos possíveis...' },
    { id: 'b1', name: 'Hipótese A: Rota Direta Sem Validação', depth: 1, qScore: 0.2, status: 'pending', parentId: 'root', children: ['b1_1', 'b1_2'], thoughtLog: 'Testando atalho rápido: nó 4 apresenta gargalo de I/O...' },
    { id: 'b2', name: 'Hipótese B: Decomposição em Etapas Seguras', depth: 1, qScore: 0.85, status: 'pending', parentId: 'root', children: ['b2_1', 'b2_2'], thoughtLog: 'Explorando estratégia balanceada: custo baixo e alta resiliência...' },
    { id: 'b3', name: 'Hipótese C: Abordagem Força Bruta', depth: 1, qScore: 0.1, status: 'pending', parentId: 'root', children: ['b3_1'], thoughtLog: 'Verificando branch C: colisão imediata com limite de memória...' },
    { id: 'b1_1', name: 'Passo A.1: Fila Saturada', depth: 2, qScore: 0.05, status: 'pending', parentId: 'b1', thoughtLog: 'FALHA: Estouro de capacidade de fila! Descartando ramo.' },
    { id: 'b1_2', name: 'Passo A.2: Timeout de Conexão', depth: 2, qScore: 0.12, status: 'pending', parentId: 'b1', thoughtLog: 'FALHA: Latência muito alta (>300ms). Descartando ramo A.' },
    { id: 'b2_1', name: 'Passo B.1: Rota Balanceada', depth: 2, qScore: 0.94, status: 'pending', parentId: 'b2', thoughtLog: 'SUCESSO: Tempo de resposta mínimo alcançado com segurança!' },
    { id: 'b2_2', name: 'Passo B.2: Rota Alternativa', depth: 2, qScore: 0.78, status: 'pending', parentId: 'b2', thoughtLog: 'Caminho viável, mas B.1 possui melhor desempenho.' },
    { id: 'b3_1', name: 'Passo C.1: Loop Infinito', depth: 2, qScore: 0.02, status: 'pending', parentId: 'b3', thoughtLog: 'FALHA CRÍTICA: Ciclo repetitivo detectado! Poda do ramo C.' },
  ]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setStepIndex(0);
    setThoughtLogs(['Iniciando exploração de hipóteses na árvore de raciocínio...']);

    // Reset nodes
    setTreeNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: n.id === 'root' ? 'exploring' : 'pending',
      }))
    );

    const timeline = [
      {
        step: 1,
        log: 'Explorando nó raiz: formulando 3 hipóteses independentes de resolução...',
        update: (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) =>
            n.id === 'root'
              ? { ...n, status: 'exploring' as const }
              : ['b1', 'b2', 'b3'].includes(n.id)
              ? { ...n, status: 'exploring' as const }
              : n
          ),
      },
      {
        step: 2,
        log: 'Avaliando Hipótese C: Confiabilidade baixa (10%). Loop repetitivo detectado. Ramo podado!',
        update: (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) =>
            ['b3', 'b3_1'].includes(n.id) ? { ...n, status: 'pruned' as const } : n
          ),
      },
      {
        step: 3,
        log: 'Avaliando Hipótese A: Confiabilidade 20%. Gargalos de tempo em A.1 e A.2. Ramo podado!',
        update: (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) =>
            ['b1', 'b1_1', 'b1_2'].includes(n.id) ? { ...n, status: 'pruned' as const } : n
          ),
      },
      {
        step: 4,
        log: 'Explorando Hipótese B: Confiabilidade 85%. Expandindo passos de verificação B.1 e B.2...',
        update: (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) =>
            ['b2', 'b2_1', 'b2_2'].includes(n.id) ? { ...n, status: 'exploring' as const } : n
          ),
      },
      {
        step: 5,
        log: 'Solução ótima encontrada: Passo B.1 alcança 94% de confiabilidade! Resposta final validada.',
        update: (nodes: TreeNode[]): TreeNode[] =>
          nodes.map((n) => {
            if (['root', 'b2', 'b2_1'].includes(n.id)) return { ...n, status: 'optimal' as const };
            if (n.id === 'b2_2') return { ...n, status: 'exploring' as const };
            return n;
          }),
      },
    ];

    timeline.forEach((item, index) => {
      setTimeout(() => {
        setThoughtLogs((prev) => [...prev, item.log]);
        setTreeNodes((prev) => item.update(prev));
        setStepIndex(item.step);
        if (index === timeline.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 1200);
    });
  };

  const handleReset = () => {
    setIsSimulating(false);
    setStepIndex(0);
    setThoughtLogs(['Simulador pronto. Clique em [RESOLVER PASSO A PASSO].']);
    setTreeNodes((prev) => prev.map((n) => ({ ...n, status: 'pending' })));
  };

  const getNodeColor = (status: TreeNode['status']) => {
    switch (status) {
      case 'optimal':
        return 'border-primary bg-secondary text-foreground font-semibold shadow-sm ring-1 ring-primary/40';
      case 'pruned':
        return 'border-rose-500/40 bg-rose-950/20 text-rose-300 line-through opacity-75';
      case 'exploring':
        return 'border-foreground/60 bg-secondary/80 text-foreground';
      case 'pending':
      default:
        return 'border-border bg-card/60 text-muted-foreground';
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              THE REASONING SIMULATOR — AUTO-CORREÇÃO & PODA
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              O motor de raciocínio de DeepSeek-R1 e OpenAI o1: exploração de hipóteses e descarte de erros
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border">
          <button
            onClick={() => setViewMode('robot-maze')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'robot-maze'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>O Robô no Labirinto</span>
          </button>
          <button
            onClick={() => setViewMode('mcts-tree')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'mcts-tree'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Árvore de Decisão & Poda</span>
          </button>
        </div>

        {viewMode === 'mcts-tree' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono bg-secondary hover:bg-muted border border-border text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono font-semibold transition-all border border-primary/20 ${
                isSimulating
                  ? 'bg-secondary text-muted-foreground cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimulating ? 'AVALIANDO HIPÓTESES...' : 'RESOLVER PASSO A PASSO'}</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'robot-maze' ? (
        <RobotMazeTreeDiagram />
      ) : (
        <>
          {/* Problem Selector Pills */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-muted-foreground">DESAFIO:</span>
            {PROBLEMS.map((prob) => (
              <button
                key={prob.id}
                onClick={() => {
                  setSelectedProblem(prob);
                  handleReset();
                }}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedProblem.id === prob.id
                    ? 'bg-secondary border-primary text-foreground font-semibold shadow-sm'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {prob.title}
              </button>
            ))}
          </div>

          {/* Visual Tree + Terminal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Visual Decision Tree (7 cols) */}
            <div className="lg:col-span-7 rounded-xl p-5 bg-background border border-border space-y-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border pb-2">
                <span>ÁRVORE DE HIPÓTESES E VALIDAÇÃO</span>
                <span>Foco: <strong className="text-foreground">{selectedProblem.complexity}</strong></span>
              </div>

              {/* Root Node */}
              <div className="flex justify-center">
                {(() => {
                  const rootNode = treeNodes.find((n) => n.id === 'root')!;
                  return (
                    <div className={`p-3 rounded-xl border text-xs font-mono max-w-xs text-center transition-all ${getNodeColor(rootNode.status)}`}>
                      <div className="font-semibold">{rootNode.name}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">Confiança: {(rootNode.qScore * 100).toFixed(0)}%</div>
                    </div>
                  );
                })()}
              </div>

              {/* Connectors Layer 1 */}
              <div className="flex justify-around px-8 text-muted-foreground text-xs font-mono">
                <span>↓ Opção A</span>
                <span>↓ Opção B</span>
                <span>↓ Opção C</span>
              </div>

              {/* Depth 1 Nodes */}
              <div className="grid grid-cols-3 gap-2">
                {treeNodes
                  .filter((n) => n.depth === 1)
                  .map((node) => (
                    <div
                      key={node.id}
                      className={`p-2.5 rounded-xl border text-[11px] font-mono transition-all flex flex-col justify-between ${getNodeColor(
                        node.status
                      )}`}
                    >
                      <div className="font-semibold line-clamp-2">{node.name}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span>{(node.qScore * 100).toFixed(0)}%</span>
                        {node.status === 'optimal' && <CheckCircle className="w-3.5 h-3.5 text-foreground" />}
                        {node.status === 'pruned' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Connectors Layer 2 */}
              <div className="flex justify-around px-4 text-muted-foreground text-xs font-mono">
                <span>↓ Testes A</span>
                <span>↓ Testes B</span>
                <span>↓ Testes C</span>
              </div>

              {/* Depth 2 Leaves (Pruned / Optimal) */}
              <div className="grid grid-cols-3 gap-2">
                {/* Branch A children */}
                <div className="space-y-1.5">
                  {treeNodes
                    .filter((n) => ['b1_1', 'b1_2'].includes(n.id))
                    .map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg border text-[10px] font-mono ${getNodeColor(n.status)}`}>
                        <div className="truncate">{n.name}</div>
                        <div className="text-rose-400 text-[9px] font-semibold mt-0.5">PODADO (ERRO)</div>
                      </div>
                    ))}
                </div>

                {/* Branch B children */}
                <div className="space-y-1.5">
                  {treeNodes
                    .filter((n) => ['b2_1', 'b2_2'].includes(n.id))
                    .map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg border text-[10px] font-mono ${getNodeColor(n.status)}`}>
                        <div className="truncate font-semibold">{n.name}</div>
                        {n.status === 'optimal' ? (
                          <div className="text-foreground text-[9px] font-bold mt-0.5">ROTA ÓTIMA ESCOLHIDA ⭐</div>
                        ) : (
                          <div className="text-muted-foreground text-[9px]">Alternativa</div>
                        )}
                      </div>
                    ))}
                </div>

                {/* Branch C children */}
                <div className="space-y-1.5">
                  {treeNodes
                    .filter((n) => ['b3_1'].includes(n.id))
                    .map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg border text-[10px] font-mono ${getNodeColor(n.status)}`}>
                        <div className="truncate">{n.name}</div>
                        <div className="text-rose-400 text-[9px] font-semibold mt-0.5">PODADO (LOOP)</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Right: Chain-of-Thought Terminal Stream (5 cols) */}
            <div className="lg:col-span-5 rounded-xl p-5 bg-background border border-border font-mono text-xs space-y-3 min-h-[380px] flex flex-col shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-foreground" />
                  <span className="font-semibold text-foreground">CHAIN-OF-THOUGHT STREAM</span>
                </div>
                <span className="text-[10px] text-foreground font-semibold">DeepSeek-R1 / o1</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-muted-foreground">
                {thoughtLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border text-[11px] leading-relaxed ${
                      log.includes('FALHA') || log.includes('podado') || log.includes('Poda')
                        ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        : log.includes('SUCESSO') || log.includes('ótima')
                        ? 'bg-secondary border-primary text-foreground font-semibold'
                        : 'bg-card border-border text-muted-foreground'
                    }`}
                  >
                    <span className="text-muted-foreground text-[10px] block mb-0.5 font-mono">
                      [{new Date().toLocaleTimeString()}] Passo #{i + 1}:
                    </span>
                    {log}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Auto-Correção: <strong className="text-foreground">Ativa</strong></span>
                <span>Ramos Descartados: <strong className="text-foreground">66%</strong></span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
