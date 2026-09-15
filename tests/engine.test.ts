import { aiQuestion, storyLines } from '../shared/aiJourney.ts';
import { mathPrediction } from '../shared/mathContent.ts';
import { getNotes } from '../server/notes.ts';
﻿import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, STAGE_SECONDS } from '../shared/curriculum.ts';
import { createSim, initialState, currentSim, reduce, searchStep, shortestPath, topologicalLayers, probabilities, logic, minimax, growth, missionChecks, DEFAULT_EDGES, TASK_EDGES } from '../shared/engine.ts';

test('Roteiro principal soma exatamente 120 minutos e cada módulo tem oito etapas', () => {
  assert.equal(LESSONS.reduce((total, lesson) => total + lesson.minutes, 0), 120);
  assert.equal(LESSONS.slice(1, 13).length, 12);
  assert.equal(STAGE_SECONDS.reduce((a, b) => a + b, 0), 480);
  for (const lesson of LESSONS) for (const key of ['question', 'example', 'prediction', 'variant', 'reveal', 'application', 'limit', 'conclusion']) assert.ok(lesson[key]);
});
test('Fábrica usa o princípio multiplicativo e limita entradas', () => {
  let state = reduce(initialState(), { type: 'module', value: 1 });
  state = reduce(state, { type: 'set', key: 'options', value: 3 });
  state = reduce(state, { type: 'set', key: 'length', value: 4 });
  assert.equal(Number(currentSim(state).values.options) ** Number(currentSim(state).values.length), 81);
  state = reduce(state, { type: 'set', key: 'length', value: 100 });
  assert.equal(currentSim(state).values.length, 6);
});
test('BFS encontra 6 arestas; DFS e retorno explícito encontram primeira rota mais longa', () => {
  const paths: number[] = [];
  for (const algorithm of ['bfs', 'dfs', 'backtracking']) {
    const sim = createSim(2); sim.values.algorithm = algorithm;
    for (let i = 0; i < 100 && !sim.done; i++) searchStep(sim);
    assert.equal(sim.done, true); assert.equal(sim.path[sim.path.length - 1], '0,6'); paths.push(sim.path.length - 1);
  }
  assert.equal(paths[0], 6); assert.ok(paths[1] > paths[0]); assert.ok(paths[2] > paths[0]);
});
test('Contraexemplo distingue E de OU; bloqueio sempre nega', () => {
  const v = { badge: true, permission: false, blocked: false, operator: 'and' };
  assert.equal(logic(v), false); assert.equal(logic({ ...v, operator: 'or' }), true);
  for (const operator of ['and', 'or']) assert.equal(logic({ badge: true, permission: true, blocked: true, operator }), false);
});
test('Direção e remoção de arestas alteram alcançabilidade', () => {
  assert.equal(shortestPath(DEFAULT_EDGES, 'A', 'F').length, 4);
  assert.deepEqual(shortestPath(DEFAULT_EDGES, 'F', 'A'), []);
  assert.equal(shortestPath(DEFAULT_EDGES, 'F', 'A', false).length, 4);
  assert.deepEqual(shortestPath(DEFAULT_EDGES.filter(e => !e.endsWith('F')), 'A', 'F'), []);
});
test('Minimax confirma estados múltiplos de quatro perdedores', () => {
  for (let n = 1; n <= 15; n++) assert.equal(minimax(n).winning, n % 4 !== 0);
  assert.equal(minimax(7).move, 3); assert.equal(minimax(6).move, 2);
});
test('Relógio soma a posição antes de calcular o resto', () => { const sim = createSim(6); assert.equal((Number(sim.values.position) + Number(sim.values.offset)) % Number(sim.values.modulus), 4); });
test('DAG permite paralelismo; ciclo impede ordenação topológica', () => {
  assert.deepEqual(topologicalLayers(TASK_EDGES), { layers: [['P'], ['V', 'E'], ['R']], cycle: false });
  assert.equal(topologicalLayers([...TASK_EDGES, 'R>P']).cycle, true);
  assert.equal(topologicalLayers(['P>V', 'V>E', 'E>R']).layers.length, 4);
});
test('Gavetas distribuem cada objeto uma vez e tornam colisão inevitável para n > g', () => {
  let state = reduce(initialState(), { type: 'module', value: 8 });
  for (let i = 0; i < 8; i++) state = reduce(state, { type: 'action' });
  const sim = currentSim(state); assert.equal(sim.bins.length, 5); assert.equal(new Set(sim.bins).size, 4); assert.equal(sim.done, true);
});
test('Softmax normaliza; temperatura amplia diversidade; amostras reproduzíveis', () => {
  assert.ok(Math.abs(probabilities(.7).reduce((a, b) => a + b, 0) - 1) < 1e-12);
  assert.ok(probabilities(.1)[0] > probabilities(2)[0]);
  let a = reduce(initialState(), { type: 'module', value: 9 }), b = structuredClone(a);
  a = reduce(a, { type: 'action', key: 'sample100' }); b = reduce(b, { type: 'action', key: 'sample100' });
  assert.deepEqual(currentSim(a).counts, currentSim(b).counts); assert.equal(currentSim(a).counts.reduce((x, y) => x + y, 0), 100);
});
test('Máquina de estados rejeita evento inválido sem mudar estado', () => {
  let state = reduce(initialState(), { type: 'module', value: 10 });
  state = reduce(state, { type: 'action', key: 'event', value: 'enviar' }); assert.equal(currentSim(state).status, 'inicial'); assert.match(currentSim(state).log[0], /inválida/);
  for (const event of ['receber', 'validar', 'enviar', 'concluir']) state = reduce(state, { type: 'action', key: 'event', value: event });
  assert.equal(currentSim(state).status, 'finalizado');
});
test('Crescimentos exatos e enumeração medida limitada', () => {
  assert.equal(growth(10, 'factorial'), 3628800n); assert.equal(growth(40, 'exponential'), 1099511627776n);
  let state = reduce(initialState(), { type: 'module', value: 11 }); state = reduce(state, { type: 'set', key: 'n', value: 40 }); state = reduce(state, { type: 'action' });
  assert.equal(currentSim(state).values.measuredCount, 65536); assert.ok(Number(currentSim(state).values.measuredMs) >= 0);
});
test('Missão só conclui quando as quatro restrições são satisfeitas', () => {
  const sim = createSim(12); assert.equal(missionChecks(sim).every(c => c.passed), false);
  Object.assign(sim.values, { authorized: true, cyclic: false, capacity: 3 }); assert.equal(missionChecks(sim).every(c => c.passed), true);
  sim.values.sourceAvailable = false; assert.equal(missionChecks(sim).every(c => c.passed), false);
});
test('Auto-Play pausa e retoma; reset não altera outros módulos; relógio não conta tempo pausado', () => {
  let state = reduce(initialState(0), { type: 'module', value: 2 }, 0);
  state = reduce(state, { type: 'autoplay', value: true }, 0); state = reduce(state, { type: 'tick' }, 1200); assert.equal(currentSim(state).visited.length, 1);
  state = reduce(state, { type: 'autoplay', value: false }, 1200); state = reduce(state, { type: 'tick' }, 4000); assert.equal(currentSim(state).visited.length, 1);
  state = reduce(state, { type: 'autoplay', value: true }, 4000); state = reduce(state, { type: 'tick' }, 5200); assert.equal(currentSim(state).visited.length, 2);
  state = reduce(state, { type: 'module', value: 1 }, 5300); state = reduce(state, { type: 'reset' }, 5400); assert.equal(state.sims[2].visited.length, 2);
  state = reduce(state, { type: 'clock', value: true }, 6000); state = reduce(state, { type: 'clock', value: false }, 8000); state = reduce(state, { type: 'tick' }, 12000); assert.equal(state.elapsed, 2000);
});
test('Auto-Play modifica as cenas e quiz nunca ultrapassa a última rodada', () => {
  for (const module of [1, 3, 6]) { let state = reduce(initialState(0), { type: 'module', value: module }, 0); const before = structuredClone(currentSim(state).values); state = reduce(state, { type: 'autoplay', value: true }, 0); state = reduce(state, { type: 'tick' }, 1200); assert.notDeepEqual(currentSim(state).values, before); }
  let state = reduce(initialState(0), { type: 'module', value: 13 }, 0); state = reduce(state, { type: 'autoplay', value: true }, 0);
  for (let i = 1; i < 20; i++) state = reduce(state, { type: 'tick' }, i * 9000);
  assert.equal(currentSim(state).tick, 5); assert.equal(currentSim(state).revealed, true); assert.equal(state.autoplay, false);
});


test('Missão verifica em sequência e interrompe no primeiro bloqueio', () => {
  let state = reduce(initialState(0), { type: 'module', value: 12 }, 0);
  state = reduce(state, { type: 'action', key: 'launch' }, 0);
  assert.equal(currentSim(state).tick, 0);
  state = reduce(state, { type: 'tick' }, 700);
  assert.equal(currentSim(state).tick, 1);
  assert.equal(currentSim(state).done, true);
  assert.equal(state.autoplay, false);
  for (const [key, value] of [['authorized', true], ['cyclic', false], ['capacity', 3]] as const) state = reduce(state, { type: 'set', key, value }, 1000);
  state = reduce(state, { type: 'action', key: 'launch' }, 1000);
  for (let i = 1; i <= 4; i++) {
    state = reduce(state, { type: 'tick' }, 1000 + i * 700);
    assert.equal(currentSim(state).visited.length, i);
    assert.equal(currentSim(state).done, i === 4);
  }
  assert.match(currentSim(state).status, /Missão concluída/);
});

test('Trocar estratégia preserva a vez e não ressuscita uma partida terminada', () => {
  let state = reduce(initialState(), { type: 'module', value: 5 });
  state = reduce(state, { type: 'action', key: 'take', value: 3 });
  state = reduce(state, { type: 'set', key: 'strategy', value: 'greedy' });
  assert.equal(currentSim(state).tick, 1);
  assert.equal(currentSim(state).values.stones, 4);
  state = reduce(state, { type: 'action', key: 'take', value: 3 });
  state = reduce(state, { type: 'action', key: 'take', value: 1 });
  state = reduce(state, { type: 'set', key: 'strategy', value: 'minimax' });
  state = reduce(state, { type: 'action' });
  assert.equal(currentSim(state).values.stones, 0);
  assert.equal(currentSim(state).done, true);
});

test('A jornada de IA avança sem executar a matemática e cancela reprodução ao navegar', () => {
  let state = reduce(initialState(0), { type: 'module', value: 3 }, 0);
  state = reduce(state, { type: 'storyVariant', value: 1 }, 0);
  state = reduce(state, { type: 'storyAutoplay', value: true }, 0);
  state = reduce(state, { type: 'tick' }, 8000);
  assert.equal(state.stage, 1);
  assert.equal(currentSim(state).tick, 0);
  assert.equal(currentSim(state).values.aiVariant, 1);
  state = reduce(state, { type: 'mathMode', value: true }, 8001);
  assert.equal(state.storyPlaying, false);
  state = reduce(state, { type: 'module', value: 4 }, 8002);
  assert.equal(state.mathMode, false);
  assert.throws(() => reduce(state, { type: 'storyVariant', value: 9 }));
  state = reduce(state, { type: 'stage', value: 6 }, 9000);
  state = reduce(state, { type: 'storyAutoplay', value: true }, 9000);
  state = reduce(state, { type: 'tick' }, 17000);
  assert.equal(state.stage, 7);
  assert.equal(state.storyPlaying, false);
});


test('Trocar entre IA e matemática restaura a etapa de cada roteiro sem misturar respostas', () => {
  let state = reduce(initialState(), { type: 'module', value: 5 });
  state = reduce(state, { type: 'stage', value: 6 });
  state = reduce(state, { type: 'mathMode', value: true });
  assert.equal(state.stage, 0);
  state = reduce(state, { type: 'stage', value: 3 });
  state = reduce(state, { type: 'mathMode', value: false });
  assert.equal(state.stage, 6);
  state = reduce(JSON.parse(JSON.stringify(state)), { type: 'mathMode', value: true });
  assert.equal(state.stage, 3);
  assert.equal(currentSim(state).revealed, false);
});


test('Perguntas matemáticas mantêm alternativas e respostas válidas ao mudar os parâmetros', () => {
  for (let module = 1; module <= 12; module++) {
    const sim = createSim(module), q = mathPrediction(module, sim);
    assert.ok(q.options[q.answer]);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(getNotes(module, 2, true, { sim }).question.includes(q.question));
  }
  for (let choices = 2; choices <= 6; choices++) for (let length = 1; length <= 6; length++) {
    const sim = createSim(1); Object.assign(sim.values, { options: choices, length });
    const q = mathPrediction(1, sim); assert.equal(q.options[q.answer], (choices ** length).toLocaleString('pt-BR') + ' sequências');
  }
  for (let stones = 0; stones <= 15; stones++) {
    const sim = createSim(5); sim.values.stones = stones;
    const q = mathPrediction(5, sim);
    assert.equal(q.options[q.answer], stones === 0 ? 'A partida já terminou' : stones % 4 === 0 ? 'Nenhuma retirada garante vitória' : 'Retirar ' + stones % 4);
  }
  for (let modulus = 3; modulus <= 16; modulus++) for (let position = 0; position <= 30; position++) {
    const sim = createSim(6); Object.assign(sim.values, { modulus, position, offset: 40 });
    const q = mathPrediction(6, sim); assert.equal(q.options[q.answer], String((position + 40) % modulus));
    assert.equal(new Set(q.options).size, 3);
  }
  for (const status of ['inicial', 'recebido', 'validado', 'revisao', 'respondido', 'finalizado']) {
    const sim = createSim(10); sim.status = status;
    assert.equal(mathPrediction(10, sim).answer, status === 'validado' ? 0 : 1);
  }
  for (let bits = 0; bits < 16; bits++) {
    const sim = createSim(12); Object.assign(sim.values, { authorized: Boolean(bits & 1), sourceAvailable: Boolean(bits & 2), cyclic: !(bits & 4), capacity: bits & 8 ? 3 : 2 });
    const first = [1, 2, 4, 8].findIndex(bit => !(bits & bit));
    assert.equal(mathPrediction(12, sim).answer, first < 0 ? 4 : first);
  }
});


test('Perguntas da IA acompanham o exemplo escolhido e o quiz avança relativamente', () => {
  assert.match(aiQuestion(2, 1), /banco/);
  assert.match(aiQuestion(11, 1), /347 × 28/);
  for (let module = 1; module <= 12; module++) for (let variant = 0; variant < 2; variant++) {
    assert.equal(storyLines(module, variant)[2], getNotes(module, 2, false, { variant }).question);
  }
  let state = reduce(initialState(), { type: 'module', value: 13 });
  for (let i = 0; i < 3; i++) state = reduce(state, { type: 'quizAdvance', value: 1 });
  assert.equal(currentSim(state).tick, 3);
  state = reduce(state, { type: 'quizAdvance', value: -1 });
  assert.equal(currentSim(state).tick, 2);
});


test('Uma amostra ou jogada não reaproveita o voto de uma pergunta anterior', () => {
  let state = reduce(initialState(), { type: 'module', value: 9 });
  state = reduce(state, { type: 'mathMode', value: true });
  state = reduce(state, { type: 'answer', value: 1 });
  assert.equal(currentSim(state).predictionSelected, 1);
  state = reduce(state, { type: 'action', key: 'sample100' });
  assert.equal(currentSim(state).predictionSelected, null);
  assert.notEqual(currentSim(state).selected, null);
});
