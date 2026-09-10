import React from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Cpu,
  Layers,
  ExternalLink,
  ChevronRight,
  Terminal,
  Trophy,
  Mic,
  Maximize2,
  Bot,
  Zap,
} from 'lucide-react';
import { MindMapNodeData } from '../../types/presentation';
import { ACTS } from '../../data/presentationData';
import { BlockFactoryDiagram } from '../VisualDiagrams/BlockFactoryDiagram';
import { LLMPipelineDiagram } from '../VisualDiagrams/LLMPipelineDiagram';
import { AgentLoopDiagram } from '../VisualDiagrams/AgentLoopDiagram';
import { RobotMazeTreeDiagram } from '../VisualDiagrams/RobotMazeTreeDiagram';
import { FutureToolsBeltDiagram } from '../VisualDiagrams/FutureToolsBeltDiagram';
import { ClassroomVisualQuiz } from '../VisualDiagrams/ClassroomVisualQuiz';

interface SlideDeckViewProps {
  currentNode: MindMapNodeData;
  onOpenNeuralRoom: () => void;
  onOpenMatrixProtocol: () => void;
  isLightTheme?: boolean;
  isQuizActive?: boolean;
  onToggleQuiz?: () => void;
  currentSubStep?: number;
  onSubStepChange?: (subStep: number) => void;
  onOpenPresenterNotes?: () => void;
}

export const SlideDeckView: React.FC<SlideDeckViewProps> = ({
  currentNode,
  onOpenNeuralRoom,
  onOpenMatrixProtocol,
  isLightTheme = false,
  isQuizActive = false,
  onToggleQuiz,
  currentSubStep = 0,
  onSubStepChange,
  onOpenPresenterNotes,
}) => {
  const currentAct = ACTS.find((a) => a.id === currentNode.actId) || ACTS[0];

  // Render the large interactive visual infographic based on current step
  const renderVisualInfographic = () => {
    if (isQuizActive) {
      return (
        <ClassroomVisualQuiz
          onClose={onToggleQuiz}
          isLightTheme={isLightTheme}
        />
      );
    }

    const step = currentNode.stepNumber;

    // STEP 1: Pipeline Completo das LLMs
    if (step === 1) {
      return (
        <LLMPipelineDiagram
          currentSubStep={currentSubStep}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEP 2: A Fábrica de Peças de LEGO (Tokens)
    if (step === 2) {
      return (
        <BlockFactoryDiagram
          currentSubStep={currentSubStep}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEP 3: O Mapa Mental de Ideias & Embeddings
    if (step === 3) {
      return (
        <LLMPipelineDiagram
          currentSubStep={2}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEPS 4, 5, 6: O Ecossistema de Modelos (Nuvem vs Local)
    if (step >= 4 && step <= 6) {
      return (
        <FutureToolsBeltDiagram
          currentSubStep={step === 4 ? 4 : step === 5 ? 1 : 2}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEPS 7, 8, 9: O Arsenal Moderno de Programação (Cursor, v0, Assistentes)
    if (step >= 7 && step <= 9) {
      return (
        <FutureToolsBeltDiagram
          currentSubStep={step === 7 ? 1 : step === 8 ? 1 : 2}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEPS 10, 11, 12: Segundo Cérebro & Síntese de Conteúdo (Obsidian, NotebookLM, Perplexity)
    if (step >= 10 && step <= 12) {
      return (
        <FutureToolsBeltDiagram
          currentSubStep={step === 10 ? 3 : step === 11 ? 0 : 4}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEP 13: O Ciclo do Agente Autônomo (Pensar ➔ Agir ➔ Observar ➔ Ajustar)
    if (step === 13) {
      return (
        <AgentLoopDiagram
          currentSubStep={currentSubStep}
          onStepChange={onSubStepChange}
          isLightTheme={isLightTheme}
        />
      );
    }

    // STEP 14: Modelos de Raciocínio & Showstoppers ao Vivo
    if (step === 14) {
      return (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          {/* Visual Maze Thinking Diagram */}
          <RobotMazeTreeDiagram
            currentSubStep={currentSubStep}
            onStepChange={onSubStepChange}
            isLightTheme={isLightTheme}
          />

          {/* Showstopper Live Stage Buttons */}
          <div className="rounded-3xl p-6 md:p-8 bg-zinc-950/80 border border-zinc-800 text-center space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="max-w-2xl mx-auto space-y-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 border border-primary/20 text-primary">
                EXPERIÊNCIAS AO VIVO NO PALCO
              </span>
              <h3 className="text-xl md:text-3xl font-black text-white font-display tracking-tight">
                Os Dois Grandes Momentos de Clímax da Apresentação
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 font-light">
                Transforme o celular de cada pessoa da sala numa rede neural viva ou dispare 3 agentes criando um app em 15 segundos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto pt-2">
              {/* Showstopper A: The Neural Room */}
              <div className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-left space-y-4 shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-400">SHOWSTOPPER A</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      📱 QR Code Coletivo
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">The Neural Room</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Toda a plateia escaneia o QR Code e os nós com os nomes dos alunos surgem voando e se conectando no telão com física em tempo real!
                  </p>
                </div>
                <button
                  onClick={onOpenNeuralRoom}
                  className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-mono text-xs tracking-wider shadow-lg transition-all"
                >
                  📱 ABRIR THE NEURAL ROOM
                </button>
              </div>

              {/* Showstopper B: The Matrix Protocol */}
              <div className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-left space-y-4 shadow-md transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-400">SHOWSTOPPER B</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      ⚡ 3 Agentes Autônomos
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">The Matrix Protocol</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Enxame de 3 agentes de IA trabalhando em equipe (Arquiteto, Desenvolvedor e Auditor) construindo um jogo completo ao vivo no palco!
                  </p>
                </div>
                <button
                  onClick={onOpenMatrixProtocol}
                  className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-mono text-xs tracking-wider shadow-lg transition-all"
                >
                  ⚡ ATIVAR ENXAME MATRIX
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // STEP 15: Finale & Os 4 Pilares Práticos
    return (
      <div className="w-full rounded-2xl p-8 bg-card/90 border border-border text-center space-y-6 shadow-sm">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-secondary text-muted-foreground border border-border">
            O VEREDITO FINAL
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            O Futuro Pertence aos Engenheiros Práticos
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Você não está sendo substituído por inteligência artificial: você está se tornando o arquiteto que orquestra ferramentas e comanda agentes!
          </p>
        </div>

        {/* 4 Practical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-2 text-left shadow-sm">
            <span className="text-xl">🛠️</span>
            <span className="text-sm font-semibold text-foreground block">Engenharia de Contexto</span>
            <span className="text-xs text-muted-foreground block leading-snug">
              Alimentar a IA com dados limpos, precisos e arquivos certos.
            </span>
          </div>
          <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-2 text-left shadow-sm">
            <span className="text-xl">🤖</span>
            <span className="text-sm font-semibold text-foreground block">Orquestração de Agentes</span>
            <span className="text-xs text-muted-foreground block leading-snug">
              Coordenar robôs autônomos que realizam tarefas completas.
            </span>
          </div>
          <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-2 text-left shadow-sm">
            <span className="text-xl">⚡</span>
            <span className="text-sm font-semibold text-foreground block">IDEs & Ferramentas 10x</span>
            <span className="text-xs text-muted-foreground block leading-snug">
              Dominar Cursor, v0, Lovable e assistentes de terminal.
            </span>
          </div>
          <div className="p-4 rounded-xl bg-secondary/40 border border-border space-y-2 text-left shadow-sm">
            <span className="text-xl">🔒</span>
            <span className="text-sm font-semibold text-foreground block">Modelos Locais & Offline</span>
            <span className="text-xs text-muted-foreground block leading-snug">
              Rodar IAs abertas com Ollama no próprio computador sem nuvem.
            </span>
          </div>
        </div>

        <div className="pt-2 max-w-xl mx-auto">
          <div className="p-3.5 rounded-xl bg-secondary/60 border border-border font-mono text-xs text-foreground shadow-sm">
            <code>Produtividade(2025) = Criatividade × Ferramentas de IA × Ação Rápida</code>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full pt-16 pb-12 px-4 md:px-10 overflow-y-auto z-10 relative flex flex-col justify-between select-none">
      <div className="max-w-7xl w-full mx-auto space-y-6 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
        {/* Cinema-Grade Keynote Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 border border-primary/20 text-primary tracking-wide">
                {currentAct.title}
              </span>
              <span className="text-zinc-600 text-xs font-mono">•</span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Passo {currentNode.stepNumber} / 15
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display leading-tight">
              {isQuizActive ? 'Desafio Interativo para a Turma' : currentNode.title}
            </h1>

            <p className="text-sm md:text-base text-zinc-400 font-light max-w-4xl leading-relaxed">
              {isQuizActive
                ? 'Qual estratégia a inteligência artificial moderna escolhe para resolver problemas difíceis?'
                : currentNode.subtitle}
            </p>
          </div>

          {/* Quick HUD Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {onToggleQuiz && (
              <button
                onClick={onToggleQuiz}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 ${
                  isQuizActive
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                }`}
                title="Ativar Enquete ao Vivo (Tecla Q)"
              >
                <Trophy className="w-4 h-4" />
                <span>[Q] Quiz da Turma</span>
              </button>
            )}

            {onOpenPresenterNotes && (
              <button
                onClick={onOpenPresenterNotes}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-sm"
                title="Abrir Roteiro do Apresentador (Tecla P)"
              >
                <Mic className="w-4 h-4 text-primary" />
                <span>[P] Roteiro</span>
              </button>
            )}
          </div>
        </div>

        {/* The 85%+ Hero Visual Presentation Arena */}
        <div className="w-full flex-1 relative flex flex-col justify-center my-auto">
          {renderVisualInfographic()}
        </div>
      </div>

      {/* Sleek Stage Navigation Footer */}
      <div className="max-w-7xl w-full mx-auto pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-500 border-t border-zinc-800/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400 font-semibold">Palco ao Vivo</span>
          <span className="text-zinc-600">•</span>
          <span>{currentNode.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Pressione</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">Espaço</kbd>
          <span>ou</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">→</kbd>
          <span>para avançar •</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">P</kbd>
          <span>Roteiro •</span>
          <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold">M</kbd>
          <span>Lousa 2D</span>
        </div>
      </div>
    </div>
  );
};
