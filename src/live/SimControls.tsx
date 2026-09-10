import { ArrowRight, Play, RotateCcw } from 'lucide-react';
import type { Command, Sim } from '../../shared/engine';
import { TASKS, TRANSITIONS } from '../../shared/engine';

export function SimControls({ module, sim, send }: { module: number; sim: Sim; send: (command: Command) => void }) {
  const v = sim.values;
  const range = (key: string, label: string, min: number, max: number, step = 1) => <label className="live-range" key={key}><span>{label}<output>{Number(v[key]).toLocaleString('pt-BR')}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={Number(v[key])} onChange={e => send({ type: 'set', key, value: Number(e.target.value) })} /></label>;
  const select = (key: string, label: string, items: [string, string][]) => <label className="live-select" key={key}><span>{label}</span><select aria-label={label} value={String(v[key])} onChange={e => send({ type: 'set', key, value: e.target.value })}>{items.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  const toggle = (key: string, label: string) => <label className="live-toggle" key={key}><span>{label}</span><input type="checkbox" checked={Boolean(v[key])} onChange={e => send({ type: 'set', key, value: e.target.checked })} /><span aria-hidden="true" className="toggle-track" /></label>;
  const action = (text: string, key = 'step', value?: any) => <button className="live-primary" onClick={() => send({ type: 'action', key, value })}><Play size={16} />{text}</button>;
  const nodeOptions: [string, string][] = ['A', 'B', 'C', 'D', 'E', 'F'].map(n => [n, n]);
  return <div className="sim-controls">
    {module === 1 && <>{range('options', 'Opções por posição', 2, 6)}{range('length', 'Comprimento da sequência', 1, 6)}</>}
    {module === 2 && <>{select('algorithm', 'Estratégia de busca', [['bfs', 'Largura (BFS)'], ['dfs', 'Profundidade (DFS)'], ['backtracking', 'DFS com retorno explícito']])}{action('Explorar próximo nó')}</>}
    {module === 3 && <>{toggle('badge', 'Crachá válido')}{toggle('permission', 'Autorização válida')}{toggle('blocked', 'Bloqueio de segurança')}{select('operator', 'Conector da regra', [['and', 'E (as duas credenciais)'], ['or', 'OU (ao menos uma)']])}</>}
    {module === 4 && <>{toggle('directed', 'Relação direcionada')}{select('source', 'Origem', nodeOptions)}{select('target', 'Destino', nodeOptions)}{action('Encontrar caminho')}<div className="edge-controls"><span>Referências diretas</span>{['A>B', 'A>C', 'B>D', 'C>E', 'D>F', 'E>F', 'F>A', 'B>E'].map(edge => <button aria-pressed={sim.edges.includes(edge)} key={edge} onClick={() => send({ type: 'edge', value: edge })}>{edge.replace('>', ' → ')}</button>)}</div></>}
    {module === 5 && <>{range('stones', 'Peças disponíveis', 1, 15)}{select('strategy', 'Algoritmo da próxima jogada', [['random', 'Aleatório (semente 42)'], ['greedy', 'Guloso: retirar o máximo'], ['minimax', 'Minimax: avaliar consequências']])}{action('Executar estratégia')}<div className="manual-moves">{[1, 2, 3].map(n => <button disabled={sim.done || Number(v.stones) < n} onClick={() => send({ type: 'action', key: 'take', value: n })} key={n}>Retirar {n}</button>)}</div></>}
    {module === 6 && <>{range('modulus', 'Posições no relógio', 3, 16)}{range('position', 'Posição inicial', 0, 30)}{range('offset', 'Deslocamento', 0, 40)}</>}
    {module === 7 && <>{action('Executar próxima camada')}<div className="edge-controls"><span>Dependências diretas</span>{TASKS.flatMap(a => TASKS.filter(b => b !== a).map(b => a + '>' + b)).map(edge => <button key={edge} aria-pressed={sim.edges.includes(edge)} onClick={() => send({ type: 'edge', value: edge })}>{edge.replace('>', ' → ')}</button>)}</div><small>P: pesquisar · V: verificar · E: escrever · R: revisar</small></>}
    {module === 8 && <>{range('drawers', 'Gavetas disponíveis', 2, 8)}{range('objects', 'Objetos para distribuir', 1, 16)}{action('Distribuir pelo hash')}<div className="edge-controls"><span>Colocar próximo objeto</span>{Array.from({ length: Number(v.drawers) }, (_, i) => <button key={i} disabled={sim.done} onClick={() => send({ type: 'action', key: 'place', value: i })}>Gaveta {i}</button>)}</div></>}
    {module === 9 && <>{range('temperature', 'Temperatura', .1, 2, .1)}{action('Amostrar 1 token')}{action('Amostrar 100 tokens', 'sample100')}</>}
    {module === 10 && <div className="event-controls"><span>Enviar um evento</span>{['receber', 'validar', 'enviar', 'rejeitar', 'corrigir', 'concluir', 'reiniciar'].map(event => <button key={event} onClick={() => send({ type: 'action', key: 'event', value: event })}><ArrowRight size={14} />{event}<small>{TRANSITIONS[sim.status]?.[event] ? 'permitido' : 'inválido'}</small></button>)}</div>}
    {module === 11 && <>{range('n', 'Tamanho da entrada (n)', 1, 40)}{select('family', 'Família de crescimento', [['linear', 'Linear: n'], ['quadratic', 'Quadrático: n²'], ['exponential', 'Exponencial: 2ⁿ'], ['factorial', 'Fatorial: n!']])}{action('Medir enumeração pequena')}</>}
    {module === 12 && <>{toggle('authorized', 'Pedido autorizado')}{toggle('sourceAvailable', 'Fonte alcançável')}{toggle('cyclic', 'Dependência circular')}{range('capacity', 'Capacidade para evidências', 1, 6)}{action('Executar missão', 'launch')}</>}
    {module > 0 && module < 13 && <button className="live-reset" onClick={() => send({ type: 'reset' })}><RotateCcw size={14} />Reiniciar experimento</button>}
  </div>;
}

