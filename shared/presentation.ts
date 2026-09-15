import { LESSONS, QUIZ, STAGES } from './curriculum.ts';
import { currentSim } from './engine.ts';
import type { State } from './engine.ts';
import { mathLesson } from './mathContent.ts';
import { AI_NOTE_STAGES } from './noteSections.ts';

export const OPENING_STAGES = ['O convite', 'Parece humano?', 'Antes da conversa', 'O texto vira números', 'O contexto', 'A resposta em construção', 'Os limites', 'Começar a descoberta'];
export const FINALE_STAGES = ['As primeiras ideias', 'Conectar as ideias', 'A rede inteira', 'O mapa acende', 'Responder uma pergunta', 'Explorar uma nota', 'Levar o cofre', 'Fechamento e perguntas'];
export const isMath = (state: State) => Boolean(state.mathMode && state.module > 0 && state.module < 13);
export const activeLesson = (state: State) => isMath(state) ? mathLesson(state.module, currentSim(state)) : LESSONS[state.module];
export function stageTitles(module: number, mathMode = false) {
  return module === 0 ? OPENING_STAGES : module === 14 ? FINALE_STAGES : module === 13 ? QUIZ.map((_, i) => 'Pergunta ' + (i + 1)) : mathMode ? STAGES : AI_NOTE_STAGES;
}
