export type Sim = { values: Record<string, number | string | boolean>; tick: number; counts: number[]; log: string[]; edges: string[]; bins: number[]; visited: string[]; path: string[]; frontier: string[][]; done: boolean; selected: number | null; revealed: boolean; seed: number; status: string };
export type State = { version: number; module: number; stage: number; stageMode?: boolean; mathMode?: boolean; storyPlaying?: boolean; sims: Record<number, Sim>; autoplay: boolean; nextTickAt: number; running: boolean; elapsed: number; moduleElapsed: number; clockAt: number; pointer: { x: number; y: number; until: number } | null; volume: number; reduced: boolean };
export type Command = { type: string; key?: string; value?: any };
export const MAZE = ['.......', '.#####.', '.#...#.', '.#.#.#.', '.#.#.#.', '.#...#.', '.......'];
export const START = '0,0';
export const GOAL = '0,6';
export const DEFAULT_EDGES = ['A>B', 'A>C', 'B>D', 'C>E', 'D>F', 'E>F'];
export const TASK_EDGES = ['P>V', 'P>E', 'V>R', 'E>R'];
export const TASKS = ['P', 'V', 'E', 'R'];
export const TRANSITIONS: Record<string, Record<string, string>> = { inicial: { receber: 'recebido' }, recebido: { validar: 'validado', rejeitar: 'revisao' }, validado: { enviar: 'respondido', rejeitar: 'revisao' }, revisao: { corrigir: 'recebido' }, respondido: { concluir: 'finalizado' }, finalizado: { reiniciar: 'inicial' } };
export function createSim(module: number): Sim {
  const values: Sim['values'] = { options: 3, length: 3, algorithm: 'bfs', badge: true, permission: false, blocked: false, operator: 'and', directed: true, source: 'A', target: 'F', stones: 7, strategy: 'minimax', modulus: 12, position: 2, offset: 14, drawers: 4, objects: 5, temperature: .7, n: 8, family: 'exponential', authorized: false, sourceAvailable: true, cyclic: true, capacity: 2 };
  return { values, tick: 0, counts: [0, 0, 0, 0], log: [], edges: module === 7 ? [...TASK_EDGES] : [...DEFAULT_EDGES], bins: [], visited: [], path: [], frontier: [[START]], done: false, selected: null, revealed: false, seed: 42, status: 'inicial' };
}
export function initialState(now = Date.now()): State { return { version: 0, module: 0, stage: 0, sims: {}, autoplay: false, nextTickAt: 0, running: false, elapsed: 0, moduleElapsed: 0, clockAt: now, pointer: null, volume: 0, reduced: false }; }
export function currentSim(s: State): Sim { return s.sims[s.module] ?? createSim(s.module); }
export function nextRandom(seed: number) { const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return { seed: next, value: next / 4294967296 }; }
export function probabilities(temperature: number) { const weights = [2.7, 2.1, 1.6, 1].map(x => Math.exp((x - 2.7) / temperature)); const sum = weights.reduce((a, b) => a + b, 0); return weights.map(x => x / sum); }
export function neighbors(node: string): string[] { const [r, c] = node.split(',').map(Number); return [[r + 1, c], [r, c + 1], [r - 1, c], [r, c - 1]].filter(([y, x]) => y >= 0 && y < 7 && x >= 0 && x < 7 && MAZE[y][x] !== '#').map(([y, x]) => y + ',' + x); }
export function searchStep(sim: Sim) {
  if (sim.done || !sim.frontier.length) { sim.done = true; return; }
  const dfs = sim.values.algorithm !== 'bfs';
  const path = dfs ? sim.frontier.pop()! : sim.frontier.shift()!;
  const node = path[path.length - 1];
  if (sim.visited.includes(node)) return;
  sim.visited.push(node); sim.path = path;
  if (node === GOAL) { sim.done = true; sim.log.push('Saída encontrada: ' + (path.length - 1) + ' arestas.'); return; }
  const next = neighbors(node).filter(n => !sim.visited.includes(n));
  if (dfs) next.reverse();
  sim.frontier.push(...next.map(n => [...path, n]));
  if (sim.values.algorithm === 'backtracking' && next.length === 0) sim.log.push('Sem saída neste ramo. Retornar à decisão anterior.');
  if (!sim.frontier.length) sim.done = true;
}
export function shortestPath(edges: string[], source: string, target: string, directed = true) {
  const frontier = [[source]], visited = new Set<string>();
  while (frontier.length) { const path = frontier.shift()!, node = path[path.length - 1]; if (node === target) return path; if (visited.has(node)) continue; visited.add(node); for (const edge of edges) { const [a, b] = edge.split('>'); if (a === node && !visited.has(b)) frontier.push([...path, b]); if (!directed && b === node && !visited.has(a)) frontier.push([...path, a]); } }
  return [];
}
export function topologicalLayers(edges: string[], nodes = TASKS) {
  const remaining = new Set(nodes), layers: string[][] = [];
  while (remaining.size) { const ready = [...remaining].filter(node => !edges.some(edge => { const [a, b] = edge.split('>'); return b === node && remaining.has(a); })); if (!ready.length) return { layers, cycle: true }; layers.push(ready); ready.forEach(n => remaining.delete(n)); }
  return { layers, cycle: false };
}
export function logic(v: Sim['values']) { return (v.operator === 'and' ? Boolean(v.badge && v.permission) : Boolean(v.badge || v.permission)) && !v.blocked; }
export function minimax(stones: number): { move: number; winning: boolean; explored: number; choices: { move: number; winning: boolean }[] } {
  let explored = 0;
  const cache = new Map<number, boolean>();
  function wins(n: number): boolean { explored++; if (n === 0) return false; if (cache.has(n)) return cache.get(n)!; const result = Array.from({ length: Math.min(n, 3) }, (_, i) => i + 1).some(move => !wins(n - move)); cache.set(n, result); return result; }
  const choices = Array.from({ length: Math.min(stones, 3) }, (_, i) => ({ move: i + 1, winning: !wins(stones - i - 1) }));
  return { move: choices.find(c => c.winning)?.move ?? 1, winning: choices.some(c => c.winning), explored, choices };
}
export function growth(n: number, family: string): bigint { if (family === 'linear') return BigInt(n); if (family === 'quadratic') return BigInt(n) ** 2n; if (family === 'factorial') { let value = 1n; for (let i = 2; i <= n; i++) value *= BigInt(i); return value; } return 2n ** BigInt(n); }
export function missionChecks(sim: Sim) { return [{ label: 'Permissão', passed: Boolean(sim.values.authorized) }, { label: 'Fonte alcançável', passed: Boolean(sim.values.sourceAvailable) && shortestPath(DEFAULT_EDGES, 'A', 'F').length > 0 }, { label: 'Dependências sem ciclo', passed: !topologicalLayers(sim.values.cyclic ? [...TASK_EDGES, 'R>P'] : TASK_EDGES).cycle }, { label: '3 evidências cabem no contexto', passed: Number(sim.values.capacity) >= 3 }]; }
const numeric: Record<string, [number, number]> = { options: [2, 6], length: [1, 6], stones: [1, 15], modulus: [3, 16], position: [0, 30], offset: [0, 40], drawers: [2, 8], objects: [1, 16], temperature: [.1, 2], n: [1, 40], capacity: [1, 6], networkFocus: [0, 12], networkQuestion: [0, 2] };
const options: Record<string, string[]> = { algorithm: ['bfs', 'dfs', 'backtracking'], operator: ['and', 'or'], source: ['A', 'B', 'C', 'D', 'E', 'F'], target: ['A', 'B', 'C', 'D', 'E', 'F'], strategy: ['random', 'greedy', 'minimax'], family: ['linear', 'quadratic', 'exponential', 'factorial'] };
function perform(sim: Sim, module: number, action: string, value?: any) {
  if (module === 1) { sim.tick++; sim.values.length = Math.min(6, Number(sim.values.length) + 1); if (Number(sim.values.length) === 6) sim.done = true; }
  else if (module === 2) searchStep(sim);
  else if (module === 3) { const row = sim.tick % 8; sim.values.badge = Boolean(row & 4); sim.values.permission = Boolean(row & 2); sim.values.blocked = Boolean(row & 1); sim.revealed = true; sim.tick++; if (sim.tick >= 8) sim.done = true; }
  else if (module === 4) { sim.path = shortestPath(sim.edges, String(sim.values.source), String(sim.values.target), Boolean(sim.values.directed)); sim.done = true; }
  else if (module === 5 && !sim.done) { const n = Number(sim.values.stones), random = nextRandom(sim.seed); sim.seed = random.seed; let move = action === 'take' ? Math.min(n, Math.max(1, Math.min(3, Math.floor(Number(value) || 1)))) : sim.values.strategy === 'greedy' ? Math.min(3, n) : sim.values.strategy === 'random' ? Math.floor(random.value * Math.min(3, n)) + 1 : minimax(n).move; sim.values.stones = n - move; sim.log.push((sim.tick % 2 === 0 ? 'Jogador 1' : 'Jogador 2') + ' retirou ' + move + '.'); sim.tick++; if (n === move) { sim.done = true; sim.status = sim.tick % 2 ? 'Jogador 1 venceu' : 'Jogador 2 venceu'; } }
  else if (module === 6) { sim.values.offset = (Number(sim.values.offset) + 1) % 41; sim.tick++; if (sim.tick >= Number(sim.values.modulus)) sim.done = true; }
  else if (module === 7) { const order = topologicalLayers(sim.edges); if (order.cycle) { sim.status = 'Ciclo detectado. Fluxo bloqueado.'; sim.done = true; } else { sim.tick = Math.min(sim.tick + 1, order.layers.length); sim.visited = order.layers.slice(0, sim.tick).flat(); sim.done = sim.tick === order.layers.length; sim.status = sim.done ? 'Todas as tarefas concluídas.' : 'Camada ' + sim.tick + ' concluída.'; } }
  else if (module === 8) { if (sim.bins.length < Number(sim.values.objects)) { sim.bins.push(action === 'place' ? Math.max(0, Math.min(Number(sim.values.drawers) - 1, Number(value) || 0)) : sim.bins.length % Number(sim.values.drawers)); } sim.done = sim.bins.length >= Number(sim.values.objects); }
  else if (module === 9) { const probs = probabilities(Number(sim.values.temperature)); for (let i = 0; i < (action === 'sample100' ? 100 : 1); i++) { const random = nextRandom(sim.seed); sim.seed = random.seed; let sum = 0, result = 3; for (let j = 0; j < 4; j++) { sum += probs[j]; if (random.value < sum) { result = j; break; } } sim.counts[result]++; sim.selected = result; } sim.tick = sim.counts.reduce((a, b) => a + b); if (sim.tick >= 1000) sim.done = true; }
  else if (module === 10) { const event = action === 'event' ? String(value) : Object.keys(TRANSITIONS[sim.status])[0]; const next = TRANSITIONS[sim.status]?.[event]; if (next) { sim.log.push(sim.status + ' → ' + event + ' → ' + next); sim.status = next; sim.done = next === 'finalizado'; } else sim.log.push('Transição inválida: ' + event + ' em ' + sim.status); }
  else if (module === 11) { const n = Math.min(Number(sim.values.n), 16); let count = 0; const start = performance.now(); for (let i = 0; i < 2 ** n; i++) { count += 1; } const duration = performance.now() - start; sim.values.measuredN = n; sim.values.measuredCount = count; sim.values.measuredMs = duration; sim.done = true; }
  else if (module === 12 && !sim.done) { const checks = missionChecks(sim), check = checks[sim.tick]; if (!check) return; sim.tick++; if (!check.passed) { sim.status = 'Bloqueio: ' + check.label; sim.done = true; } else { sim.visited.push(check.label); sim.done = sim.tick === checks.length; sim.status = sim.done ? 'Missão concluída: resposta com evidências e fluxo verificado.' : check.label + ' verificada. Próxima condição…'; } }
  else { sim.tick++; if (sim.tick >= 5) sim.done = true; }
  sim.log = sim.log.slice(-24);
}
export function reduce(state: State, command: Command, now = Date.now()): State {
  const s: State = structuredClone(state);
  if (s.running) { const delta = Math.max(0, now - s.clockAt); s.elapsed += delta; s.moduleElapsed += delta; }
  s.clockAt = now;
  const module = s.module, sim = s.sims[module] ?? (s.sims[module] = createSim(module));
  switch (command.type) {
    case 'navigate':
    case 'module': { const next = command.type === 'navigate' ? Math.max(0, Math.min(14, s.module + Math.sign(Number(command.value) || 0))) : Number(command.value); if (!Number.isInteger(next) || next < 0 || next > 14) throw Error('Módulo inválido'); s.module = next; s.mathMode = false; s.storyPlaying = false; if (s.sims[next]) s.sims[next].revealed = false; s.stage = 0; s.autoplay = false; s.moduleElapsed = 0; s.pointer = null; break; }
    case 'advance':
    case 'stage': s.storyPlaying = false; s.stage = command.type === 'advance' ? Math.max(0, Math.min(7, s.stage + Math.sign(Number(command.value) || 0))) : Math.min(7, Math.max(0, Math.floor(Number(command.value) || 0))); s.autoplay = false; if (s.stage === 5) sim.revealed = true; if (s.stage < 3) sim.revealed = false; break;
    case 'clock': s.running = Boolean(command.value); break;
    case 'autoplay': s.autoplay = Boolean(command.value); s.nextTickAt = now + 1100; if (s.autoplay && sim.done) { s.sims[module] = createSim(module); if (module !== 5) s.sims[module].values = { ...sim.values }; } break;
    case 'reset': s.storyPlaying = false; s.sims[module] = createSim(module); s.autoplay = false; break;
    case 'set': { const key = command.key!; if (numeric[key]) { const [min, max] = numeric[key]; const n = Number(command.value); if (!Number.isFinite(n)) throw Error('Valor inválido'); sim.values[key] = Math.max(min, Math.min(max, key === 'temperature' ? n : Math.round(n))); } else if (options[key]?.includes(command.value)) sim.values[key] = command.value; else if (typeof sim.values[key] === 'boolean' && typeof command.value === 'boolean') sim.values[key] = command.value; else throw Error('Parâmetro inválido'); if (module === 5 && key === 'strategy') { s.autoplay = false; break; } sim.tick = 0; sim.done = false; sim.visited = []; sim.path = []; sim.frontier = [[START]]; sim.bins = []; sim.counts = [0, 0, 0, 0]; sim.seed = 42; sim.log = []; sim.status = 'inicial'; s.autoplay = false; break; }
    case 'edge': { const edge = String(command.value); const valid = module === 7 ? /^[PVER]>[PVER]$/ : /^[A-F]>[A-F]$/; if (!valid.test(edge) || edge[0] === edge[2]) throw Error('Aresta inválida'); sim.edges = sim.edges.includes(edge) ? sim.edges.filter(e => e !== edge) : [...sim.edges, edge]; sim.tick = 0; sim.visited = []; sim.path = []; sim.done = false; s.autoplay = false; break; }
    case 'action': if (module === 12 && command.key === 'launch') { sim.revealed = false; sim.tick = 0; sim.done = false; sim.visited = []; sim.status = 'Verificando as condições da missão…'; s.autoplay = true; s.nextTickAt = now + 650; } else if (module === 13) { if (!sim.revealed) sim.revealed = true; else if (sim.tick < 5) { sim.tick++; sim.revealed = false; sim.selected = null; } } else if (module === 0 || module === 14) s.stage = Math.min(7, s.stage + 1); else perform(sim, module, command.key ?? 'step', command.value); break;
    case 'storyAutoplay': s.storyPlaying = Boolean(command.value); s.autoplay = false; s.nextTickAt = now + 8000; break;
    case 'mathMode': s.storyPlaying = false; s.mathMode = Boolean(command.value); s.autoplay = false; break;
    case 'storyVariant': if (![0, 1].includes(command.value)) throw Error('Exemplo inválido'); sim.values.aiVariant = command.value; break;
    case 'storyReplay': sim.values.aiReplay = Number(sim.values.aiReplay || 0) + 1; break;
    case 'stageMode': s.stageMode = Boolean(command.value); break;
    case 'reveal': sim.revealed = !sim.revealed; break;
    case 'answer': if (Number.isInteger(command.value) && command.value >= 0 && command.value < 3 && !sim.revealed) sim.selected = command.value; break;
    case 'quiz': sim.tick = Math.min(5, Math.max(0, Math.floor(Number(command.value) || 0))); sim.selected = null; sim.revealed = false; break;
    case 'pointer': { const { x, y } = command.value ?? {}; if (!Number.isFinite(x) || !Number.isFinite(y)) throw Error('Ponteiro inválido'); s.pointer = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), until: now + 3500 }; break; }
    case 'volume': s.volume = Math.max(0, Math.min(1, Number(command.value) || 0)); break;
    case 'reduced': s.reduced = Boolean(command.value); break;
    case 'tick': if (s.storyPlaying && now >= s.nextTickAt) { s.stage = Math.min(7, s.stage + 1); s.nextTickAt = now + 8000; if (s.stage === 7) s.storyPlaying = false; } if (s.autoplay && now >= s.nextTickAt) { if (module === 0 || module === 14) { s.stage = Math.min(7, s.stage + 1); if (s.stage === 7) s.autoplay = false; } else if (module === 13) { if (!sim.revealed) sim.revealed = true; else if (sim.tick < 5) { sim.tick++; sim.revealed = false; sim.selected = null; } else s.autoplay = false; } else perform(sim, module, module === 9 ? 'sample100' : 'step'); s.nextTickAt = now + (module === 12 ? 650 : module === 13 ? 8000 : 1100); if (sim.done) s.autoplay = false; } break;
    default: throw Error('Comando desconhecido');
  }
  if (s.module > 0 && s.module < 13 && ['set', 'edge', 'action'].includes(command.type) || s.module > 0 && s.module < 13 && command.type === 'autoplay' && command.value) s.stage = Math.max(3, s.stage);
  s.version++;
  return s;
}



