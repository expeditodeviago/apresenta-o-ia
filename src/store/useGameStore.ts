// src/store/useGameStore.ts
import { create } from 'zustand';
import { arcadeAudio } from '../utils/arcadeAudio';

export interface StrokePoint {
  x: number;
  y: number;
}

export interface ArcadeStroke {
  id: string;
  points: StrokePoint[];
  color: string;
  width: number;
  isEraser: boolean;
}

export interface PresentationActMetadata {
  id: number;
  actNumberStr: string;
  levelNumberStr: string;
  title: string;
  subtitle: string;
  genre: string;
  badgeColor: string;
  icon: string;
  auroraPrimary: string;
  auroraSecondary: string;
}

export const PRESENTATION_ACTS: PresentationActMetadata[] = [
  {
    id: 1,
    actNumberStr: 'ATO 01',
    levelNumberStr: 'ATO 01',
    title: 'The Token Forge',
    subtitle: 'A Forja Mecânica de Blocos Lego & Velocímetro de Probabilidade',
    genre: 'TOKENIZAÇÃO',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: '🧱',
    auroraPrimary: 'rgba(245, 158, 11, 0.22)',
    auroraSecondary: 'rgba(249, 115, 22, 0.18)',
  },
  {
    id: 2,
    actNumberStr: 'ATO 02',
    levelNumberStr: 'ATO 02',
    title: 'The Temperature Playground',
    subtitle: 'O Termômetro da Criatividade: Frio (0.0), Ideal (0.7) e Caos (2.0)',
    genre: 'PROBABILIDADE',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    icon: '🌡️',
    auroraPrimary: 'rgba(244, 63, 94, 0.22)',
    auroraSecondary: 'rgba(245, 158, 11, 0.18)',
  },
  {
    id: 3,
    actNumberStr: 'ATO 03',
    levelNumberStr: 'ATO 03',
    title: 'The Semantic Vector Compass',
    subtitle: 'A Bússola Vetorial Semântica & Álgebra Espacial de Palavras',
    genre: 'EMBEDDINGS',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    icon: '🧭',
    auroraPrimary: 'rgba(6, 182, 212, 0.22)',
    auroraSecondary: 'rgba(37, 99, 235, 0.18)',
  },
  {
    id: 4,
    actNumberStr: 'ATO 04',
    levelNumberStr: 'ATO 04',
    title: 'The Rotary Clock of Attention',
    subtitle: 'Aritmética Modular & RoPE (Rotary Position Embeddings)',
    genre: 'MATEMÁTICA DISCRETA',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: '⚙️',
    auroraPrimary: 'rgba(245, 158, 11, 0.22)',
    auroraSecondary: 'rgba(16, 185, 129, 0.18)',
  },
  {
    id: 5,
    actNumberStr: 'ATO 05',
    levelNumberStr: 'ATO 05',
    title: 'Attention Beams',
    subtitle: 'A Teia de Lasers Holográfica dos Transformers (Self-Attention)',
    genre: 'TRANSFORMERS',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: '🕸️',
    auroraPrimary: 'rgba(168, 85, 247, 0.22)',
    auroraSecondary: 'rgba(217, 70, 239, 0.18)',
  },
  {
    id: 6,
    actNumberStr: 'ATO 06',
    levelNumberStr: 'ATO 06',
    title: 'Context Window Tetris',
    subtitle: 'O Tetris da Memória da IA & Fatiamento Vetorial com RAG',
    genre: 'MEMÓRIA & RAG',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    icon: '📦',
    auroraPrimary: 'rgba(99, 102, 241, 0.22)',
    auroraSecondary: 'rgba(6, 182, 212, 0.18)',
  },
  {
    id: 7,
    actNumberStr: 'ATO 07',
    levelNumberStr: 'ATO 07',
    title: 'Maze Runner: The Reasoning Robot',
    subtitle: 'A Jornada do Raciocínio, Backtracking & Tag <think>',
    genre: 'RACIOCÍNIO',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: '🤖',
    auroraPrimary: 'rgba(16, 185, 129, 0.22)',
    auroraSecondary: 'rgba(52, 211, 153, 0.18)',
  },
  {
    id: 8,
    actNumberStr: 'ATO 08',
    levelNumberStr: 'ATO 08',
    title: 'AI Arena: Clash of Titans',
    subtitle: 'Batalha de Cards Holográficos: DeepSeek-R1 vs Claude 3.5 vs GPT-4o',
    genre: 'BENCHMARKS',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    icon: '⚔️',
    auroraPrimary: 'rgba(244, 63, 94, 0.22)',
    auroraSecondary: 'rgba(236, 72, 153, 0.18)',
  },
  {
    id: 9,
    actNumberStr: 'ATO 09',
    levelNumberStr: 'ATO 09',
    title: "The Builder's Matrix",
    subtitle: 'Showcase Interativo: Obsidian, Cursor, v0.dev & NotebookLM (RAG)',
    genre: 'FERRAMENTAS',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    icon: '🧰',
    auroraPrimary: 'rgba(99, 102, 241, 0.22)',
    auroraSecondary: 'rgba(14, 165, 233, 0.18)',
  },
  {
    id: 10,
    actNumberStr: 'ATO 10',
    levelNumberStr: 'ATO 10',
    title: 'Hallucination Detective',
    subtitle: 'O Caça-Alucinações com Scanner RAG & Documento Fonte',
    genre: 'AUDITORIA & RAG',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    icon: '🕵️',
    auroraPrimary: 'rgba(16, 185, 129, 0.22)',
    auroraSecondary: 'rgba(6, 182, 212, 0.18)',
  },
  {
    id: 11,
    actNumberStr: 'ATO 11',
    levelNumberStr: 'ATO 11',
    title: 'The Agent Pipeline Puzzle',
    subtitle: 'Ordens Parciais, Posets & Detecção de Deadlock em DAGs',
    genre: 'MATEMÁTICA DISCRETA',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    icon: '🔀',
    auroraPrimary: 'rgba(20, 184, 166, 0.22)',
    auroraSecondary: 'rgba(244, 63, 94, 0.18)',
  },
  {
    id: 12,
    actNumberStr: 'ATO 12',
    levelNumberStr: 'ATO 12',
    title: 'Agent Swarm Tycoon',
    subtitle: 'O Escritório Autônomo & Enxame de Agentes em Ação',
    genre: 'AGENTES',
    badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    icon: '🏢',
    auroraPrimary: 'rgba(20, 184, 166, 0.22)',
    auroraSecondary: 'rgba(245, 158, 11, 0.18)',
  },
  {
    id: 13,
    actNumberStr: 'ATO 13',
    levelNumberStr: 'ATO 13',
    title: 'The Turing Showdown',
    subtitle: 'O Grande Quiz Show Interativo com a Turma: Humano ou IA?',
    genre: 'QUIZ SHOW',
    badgeColor: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
    icon: '🎯',
    auroraPrimary: 'rgba(217, 70, 239, 0.22)',
    auroraSecondary: 'rgba(168, 85, 247, 0.18)',
  },
];

export const GAME_LEVELS = PRESENTATION_ACTS;
export type GameLevelMetadata = PresentationActMetadata;

export interface PresentationStore {
  pan: StrokePoint;
  zoom: number;
  setPan: (pan: StrokePoint) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPresenterGuideOpen: (open: boolean) => void;
  setPresenterNotesOpen: (open: boolean) => void;
  // Navegação
  currentAct: number; // 1 a 13
  currentLevel: number;
  totalActs: number;
  totalLevels: number;
  nextAct: () => void;
  prevAct: () => void;
  setAct: (act: number) => void;
  nextLevel: () => void;
  prevLevel: () => void;
  setLevel: (lvl: number) => void;

  // Pontuação & Efeitos
  score: number;
  addScore: (points: number) => void;
  resetScore: () => void;

  // Áudio
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Modo Desenho (Tecla D)
  isDrawingEnabled: boolean;
  toggleDrawing: () => void;
  setDrawingEnabled: (enabled: boolean) => void;
  activeTool: 'pen' | 'eraser';
  setActiveTool: (tool: 'pen' | 'eraser') => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penWidth: number;
  setPenWidth: (width: number) => void;
  strokes: ArcadeStroke[];
  addStroke: (stroke: ArcadeStroke) => void;
  undoStroke: () => void;
  clearStrokes: () => void;

  // Notas do Apresentador (Tecla P)
  isPresenterGuideOpen: boolean;
  isPresenterNotesOpen: boolean;
  togglePresenterGuide: () => void;
  togglePresenterNotes: () => void;
}

export const useGameStore = create<PresentationStore>((set) => ({
  pan: { x: 0, y: 0 },
  zoom: 1,
  setPan: (pan) => set({ pan }),
  zoomIn: () => set(state => ({ zoom: Math.min(3, state.zoom + 0.1) })),
  zoomOut: () => set(state => ({ zoom: Math.max(0.25, state.zoom - 0.1) })),
  resetZoom: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),
  setPresenterGuideOpen: (open) => set({ isPresenterGuideOpen: open, isPresenterNotesOpen: open }),
  setPresenterNotesOpen: (open) => set({ isPresenterGuideOpen: open, isPresenterNotesOpen: open }),
  currentAct: 1,
  currentLevel: 1,
  totalActs: PRESENTATION_ACTS.length,
  totalLevels: PRESENTATION_ACTS.length,

  nextAct: () => {
    set((state) => {
      if (state.currentAct < PRESENTATION_ACTS.length) {
        arcadeAudio.playActTransition();
        const next = state.currentAct + 1;
        return { currentAct: next, currentLevel: next };
      }
      return state;
    });
  },

  prevAct: () => {
    set((state) => {
      if (state.currentAct > 1) {
        arcadeAudio.playActTransition();
        const prev = state.currentAct - 1;
        return { currentAct: prev, currentLevel: prev };
      }
      return state;
    });
  },

  setAct: (act: number) => {
    if (act >= 1 && act <= PRESENTATION_ACTS.length) {
      arcadeAudio.playActTransition();
      set({ currentAct: act, currentLevel: act });
    }
  },

  nextLevel: () => {
    set((state) => {
      if (state.currentLevel < PRESENTATION_ACTS.length) {
        arcadeAudio.playActTransition();
        const next = state.currentLevel + 1;
        return { currentAct: next, currentLevel: next };
      }
      return state;
    });
  },

  prevLevel: () => {
    set((state) => {
      if (state.currentLevel > 1) {
        arcadeAudio.playActTransition();
        const prev = state.currentLevel - 1;
        return { currentAct: prev, currentLevel: prev };
      }
      return state;
    });
  },

  setLevel: (lvl: number) => {
    if (lvl >= 1 && lvl <= PRESENTATION_ACTS.length) {
      arcadeAudio.playActTransition();
      set({ currentAct: lvl, currentLevel: lvl });
    }
  },

  score: 0,
  addScore: (pts: number) => {
    set((state) => ({ score: state.score + pts }));
  },
  resetScore: () => set({ score: 0 }),

  soundEnabled: true,
  toggleSound: () => {
    set((state) => {
      const next = !state.soundEnabled;
      arcadeAudio.setEnabled(next);
      if (next) arcadeAudio.playClick();
      return { soundEnabled: next };
    });
  },
  setSoundEnabled: (enabled: boolean) => {
    arcadeAudio.setEnabled(enabled);
    set({ soundEnabled: enabled });
  },

  isDrawingEnabled: false,
  toggleDrawing: () => {
    set((state) => {
      const next = !state.isDrawingEnabled;
      if (next) arcadeAudio.playClick();
      return { isDrawingEnabled: next };
    });
  },
  setDrawingEnabled: (enabled: boolean) => set({ isDrawingEnabled: enabled }),

  activeTool: 'pen',
  setActiveTool: (tool) => set({ activeTool: tool }),
  penColor: '#f8fafc', // Branco Pérola padrão
  setPenColor: (color) => set({ penColor: color }),
  penWidth: 3,
  setPenWidth: (w) => set({ penWidth: w }),

  strokes: [],
  addStroke: (stroke) => set((state) => ({ strokes: [...state.strokes, stroke] })),
  undoStroke: () => set((state) => ({ strokes: state.strokes.slice(0, -1) })),
  clearStrokes: () => set({ strokes: [] }),

  isPresenterGuideOpen: false,
  isPresenterNotesOpen: false,
  togglePresenterGuide: () => {
    set((state) => {
      const next = !state.isPresenterGuideOpen;
      if (next) arcadeAudio.playClick();
      return { isPresenterGuideOpen: next, isPresenterNotesOpen: next };
    });
  },
  togglePresenterNotes: () => {
    set((state) => {
      const next = !state.isPresenterNotesOpen;
      if (next) arcadeAudio.playClick();
      return { isPresenterGuideOpen: next, isPresenterNotesOpen: next };
    });
  },
}));

export const usePresentationStore = useGameStore;
