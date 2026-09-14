import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES, NETWORK_QUESTIONS } from '../shared/knowledge.ts';
import { initialState, reduce, currentSim } from '../shared/engine.ts';

test('Rede de conhecimento tem notas reais, ligações válidas e todos os temas alcançáveis', () => {
  assert.equal(KNOWLEDGE_NODES.length, 493);
  const ids = new Set(KNOWLEDGE_NODES.map(node => node.id));
  assert.equal(ids.size, KNOWLEDGE_NODES.length);
  const adjacency = new Map([...ids].map(id => [id, new Set<string>()]));
  const edges = new Set<string>();
  for (const [a, b] of KNOWLEDGE_EDGES) {
    assert.ok(ids.has(a) && ids.has(b)); assert.notEqual(a, b);
    const key = [a, b].sort().join('|'); assert.equal(edges.has(key), false); edges.add(key);
    adjacency.get(a)!.add(b); adjacency.get(b)!.add(a);
  }
  const visited = new Set<string>(), queue = ['inicio'];
  while (queue.length) { const id = queue.pop()!; if (visited.has(id)) continue; visited.add(id); queue.push(...adjacency.get(id)!); }
  assert.equal(visited.size, ids.size);
  for (const node of KNOWLEDGE_NODES) { assert.ok(node.text.length > 25); assert.ok(node.example.length > 25); }
  for (const question of NETWORK_QUESTIONS) for (const group of question.groups) assert.ok(ids.has('grupo-' + group));
});

test('Encerramento sincroniza pergunta e tema, limita valores e conserva os outros módulos', () => {
  let state = reduce(initialState(), { type: 'module', value: 14 });
  state = reduce(state, { type: 'set', key: 'networkQuestion', value: 1 });
  state = reduce(state, { type: 'set', key: 'networkFocus', value: 9 });
  state = reduce(state, { type: 'stage', value: 4 });
  assert.equal(state.stage, 4); assert.equal(currentSim(state).values.networkFocus, 9);
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(currentSim(restored).values.networkQuestion, 1);
  state = reduce(state, { type: 'set', key: 'networkQuestion', value: 99 });
  assert.equal(currentSim(state).values.networkQuestion, 2);
  state = reduce(state, { type: 'set', key: 'networkFocus', value: -2 });
  assert.equal(currentSim(state).values.networkFocus, 0);
  state = reduce(state, { type: 'module', value: 1 });
  assert.equal(currentSim(state).values.networkFocus, undefined);
});
