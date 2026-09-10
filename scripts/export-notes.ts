import { mkdir, writeFile } from 'node:fs/promises';
import { LESSONS, STAGES } from '../shared/curriculum.ts';
import { getNotes } from '../server/notes.ts';

// This output stays outside public/ and dist/: it belongs to the presenter.
await mkdir('docs', { recursive: true });
const lines = ['# SYNAPSE — roteiro privado de 120 minutos', '', 'Uso do apresentador. Não projetar este documento.', '', 'O cronômetro começa ao tocar em Iniciar cronômetro no controle privado. Auto-Play anima o experimento; o avanço pedagógico é conduzido pelo apresentador.', ''];
let minute = 0;
for (const lesson of LESSONS) {
  const notes = getNotes(lesson.id, 0);
  lines.push('## ' + minute + '–' + (minute + lesson.minutes) + ' min · ' + lesson.title, '', '**Conceito:** ' + lesson.math, '', '**Ritmo:** ' + notes.pacing, '', '**Resposta esperada:** ' + notes.expected, '');
  if (lesson.id === 0) lines.push('Use “Antes de entrar, um desafio de 8 minutos”. Peça a votação antes de mostrar os números. Parta de 10⁴ = 10.000; compare 20⁴ = 160.000 com 10⁸ = 100 milhões. Faça uma pausa antes de revelar a razão de 625. Avance usando as setas ou o celular.', '');
  for (let stage = 0; stage < STAGES.length; stage++) lines.push('### ' + (stage + 1) + '. ' + STAGES[stage], '', getNotes(lesson.id, stage).speech, '');
  lines.push('**Limite / erro comum:** ' + notes.commonMistake, '', '**Se faltar tempo:** ' + notes.shortcut, '', '**Aprofundamento:** ' + notes.deepening, '');
  if (lesson.id === 12) lines.push('Comece com os bloqueios padrão. Execute: a primeira verificação para na autorização. Autorize e execute de novo: agora aparece o ciclo. Remova o ciclo e execute: falta capacidade. Aumente a capacidade para 3 e rode a última vez. Deixe a turma narrar cada verificação até a conclusão.', '');
  minute += lesson.minutes;
}
await writeFile('docs/ROTEIRO-PRIVADO.md', lines.join('\n'), 'utf8');
const mapping = ['# Mapeamento dos experimentos', '', 'Mapeamento descritivo do conteúdo implementado. A ementa do professor não foi fornecida; aderência curricular ainda precisa ser validada.', '', '| Módulo | Conteúdo matemático | Conexão com IA | Limite da analogia |', '| --- | --- | --- | --- |', ...LESSONS.slice(1, 13).map(l => '| ' + l.id + '. ' + l.short + ' | ' + l.math + ' | ' + l.application + ' | ' + l.limit + ' |')];
await writeFile('docs/MAPEAMENTO.md', mapping.join('\n') + '\n', 'utf8');
console.log('Roteiro privado e mapeamento atualizados em docs/.');
