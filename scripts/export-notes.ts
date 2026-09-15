import { mkdir, writeFile } from 'node:fs/promises';
import { LESSONS, FORMAL_LESSONS, QUIZ } from '../shared/curriculum.ts';
import { NOTE_SECTIONS } from '../shared/noteSections.ts';
import { getNotes } from '../server/notes.ts';

// Presenter material stays outside public/ and dist/.
await mkdir('docs', { recursive: true });
const lines = [
  '# SYNAPSE — guia completo do apresentador',
  '',
  'Roteiro de 120 minutos para preparar e conduzir a apresentação, mesmo sem conhecimento prévio do assunto.',
  '',
  '## Como usar',
  '',
  '- Antes do ensaio, leia o conceito, o exemplo, os termos e as dúvidas de cada capítulo.',
  '- Durante a apresentação, use a fala da etapa atual e o passo a passo da demonstração. As falas entre aspas podem ser lidas; as instruções fora das aspas são para você.',
  '- Não leia todo o material de apoio em voz alta. Ele serve para explicar com segurança e responder a perguntas.',
  '- Pause Auto-Play enquanto explica. Inicie o cronômetro separadamente no controle.',
  '- As animações são preparadas, e os experimentos matemáticos são locais. Não anuncie uma resposta de IA gerada ao vivo.',
  '- A matemática é opcional. Seu roteiro está na segunda parte deste documento e nas notas quando você abre “Explorar a matemática”. Ela usa o tempo do capítulo correspondente; fazer todos os aprofundamentos completos acrescentará tempo ao encontro.',
  '',
  '## Índice',
  '',
  ...LESSONS.map(l => '- [Capítulo ' + l.id + ' — ' + l.title + '](#capitulo-' + l.id + ')'),
  '- [Experimentos matemáticos: contas e demonstrações](#matematica)',
  '',
];
const studyKeys = new Set(['foundations', 'example', 'glossary', 'demonstration', 'question', 'expected', 'questions', 'math', 'commonMistake', 'shortcut', 'pacing']);
function study(notes: Record<string, string>) {
  for (const [key, title] of NOTE_SECTIONS) if (studyKeys.has(key)) lines.push('### ' + title, '', notes[key], '');
}
function stages(module: number, mathMode = false) {
  lines.push('### Falas para cada etapa', '');
  for (let stage = 0; stage < 8; stage++) {
    const n = getNotes(module, stage, mathMode);
    lines.push('#### ' + (stage + 1) + '. ' + n.stage, '', n.speech, '', '**Próxima ação:** ' + n.nextAction, '');
  }
}
let minute = 0;
for (const lesson of LESSONS) {
  const notes = getNotes(lesson.id, 0);
  lines.push('<a id="capitulo-' + lesson.id + '"></a>', '', '## ' + minute + '–' + (minute + lesson.minutes) + ' min · ' + lesson.title, '');
  if (lesson.id === 13) {
    lines.push('### Condução do quiz', '', notes.foundations, '', notes.demonstration, '', notes.pacing, '');
    for (let quizIndex = 0; quizIndex < QUIZ.length; quizIndex++) {
      const n = getNotes(13, 0, false, { quizIndex });
      lines.push('### Pergunta ' + (quizIndex + 1) + ' — ' + n.question, '', n.speech, '', '**Resposta e justificativas:** ' + n.expected, '', '**Se perguntarem:** ' + n.questions, '', '**Próxima ação:** ' + n.nextAction, '');
    }
  } else { study(notes); stages(lesson.id); }
  lines.push('### Fala de transição', '', notes.transition, '');
  if (lesson.id > 0 && lesson.id < 13) lines.push('[Abrir o roteiro matemático deste capítulo](#matematica-' + lesson.id + ')', '');
  minute += lesson.minutes;
}
lines.push('<a id="matematica"></a>', '', '## Experimentos matemáticos — aprofundamento opcional', '', 'Abra o aprofundamento em Comandos e siga os valores iniciais descritos. Volte à explicação de IA depois. O material abaixo ensina a conta e o procedimento; não é um segundo percurso obrigatório de 120 minutos.', '');
for (const lesson of FORMAL_LESSONS.slice(1, 13)) {
  const notes = getNotes(lesson.id, 0, true);
  lines.push('<a id="matematica-' + lesson.id + '"></a>', '', '## Experimento ' + lesson.id + ' — ' + lesson.title, '');
  study(notes); stages(lesson.id, true);
  lines.push('### Retomar a explicação principal', '', notes.transition, '', '[Voltar ao capítulo principal](#capitulo-' + lesson.id + ')', '');
}
lines.push('## Referências para estudo', '', getNotes(1, 0).sources, '');
await writeFile('docs/ROTEIRO-PRIVADO.md', lines.join('\n'), 'utf8');
const mapping = ['# Mapeamento dos experimentos', '', 'Mapeamento descritivo do conteúdo implementado. A ementa do professor não foi fornecida; aderência curricular ainda precisa ser validada.', '', '| Módulo | Conteúdo matemático | Conexão com IA | Limite da analogia |', '| --- | --- | --- | --- |', ...LESSONS.slice(1, 13).map(l => '| ' + l.id + '. ' + l.short + ' | ' + FORMAL_LESSONS[l.id].math + ' | ' + l.application + ' | ' + l.limit + ' |')];
await writeFile('docs/MAPEAMENTO.md', mapping.join('\n') + '\n', 'utf8');
console.log('Guia privado atualizado: abertura, 12 capítulos, 6 perguntas, encerramento e 12 aprofundamentos matemáticos.');
