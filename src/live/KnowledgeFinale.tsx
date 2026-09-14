import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Download, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react';
import type { Command, Sim } from '../../shared/engine';
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES, NETWORK_GROUPS, NETWORK_QUESTIONS, type KnowledgeNode } from '../../shared/knowledge';
import { LESSONS } from '../../shared/curriculum';
import './knowledge.css';

const W = 1200, H = 440;
const positioned = KNOWLEDGE_NODES.map((node, i) => {
  if (!node.group) return { ...node, x: W / 2, y: H / 2, radius: 10 };
  const angle = -Math.PI / 2 + (node.group - 1) % 6 * Math.PI / 3;
  const center = { x: (node.group <= 6 ? 330 : 870) + Math.cos(angle) * 165, y: 220 + Math.sin(angle) * 113 };
  if (node.kind === 'hub') return { ...node, ...center, radius: 6 };
  const bits = node.id.split('-'), index = Number(bits[2]), a = index * Math.PI / 4 + node.group * .19;
  const topic = { x: center.x + Math.cos(a) * 64, y: center.y + Math.sin(a) * 61 };
  if (node.kind === 'idea') return { ...node, ...topic, radius: 3.2 };
  const leaf = Number(bits[3]), b = a + leaf * Math.PI / 2 + .35;
  return { ...node, x: topic.x + Math.cos(b) * (21 + i % 3 * 5), y: topic.y + Math.sin(b) * (23 + i % 4 * 4), radius: 1.6 + i % 3 * .25 };
});
const byId = new Map(positioned.map(node => [node.id, node]));
const links = KNOWLEDGE_EDGES.map(([a, b]) => [byId.get(a)!, byId.get(b)!] as const);
const color = (group: number) => group ? LESSONS[group].color : '#d6fa87';
const visible = (node: KnowledgeNode, stage: number) => stage >= 2 || node.kind === 'root' || node.kind === 'hub' || stage >= 1 && node.kind === 'idea';

function KnowledgeCanvas({ stage, focus, question, reduced, onSelect }: { stage: number; focus: number; question: number; reduced: boolean; onSelect: (node: KnowledgeNode) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null), host = useRef<HTMLDivElement>(null);
  const camera = useRef({ x: 0, y: 0, zoom: 1 }), paint = useRef<() => void>(() => {});
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const geometry = useRef({ scale: 1, offsetX: 0, offsetY: 0 });
  const [zoomLabel, setZoomLabel] = useState(100);
  const zoom = (factor: number) => { camera.current.zoom = Math.max(.65, Math.min(3, camera.current.zoom * factor)); setZoomLabel(Math.round(camera.current.zoom * 100)); paint.current(); };
  useEffect(() => {
    const element = canvas.current!, container = host.current!, ctx = element.getContext('2d');
    if (!ctx) return;
    let frame = 0, stopped = false, last = 0;
    const born = performance.now(), activeGroups = stage >= 4 ? NETWORK_QUESTIONS[question].groups : [];
    const selected = (group: number) => focus ? group === focus || group === 0 : activeGroups.includes(group);
    const draw = (now: number) => {
      const width = container.clientWidth, height = container.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      if (!width || !height) return;
      if (element.width !== Math.round(width * dpr) || element.height !== Math.round(height * dpr)) { element.width = Math.round(width * dpr); element.height = Math.round(height * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height);
      const scale = Math.min(width / W, height / H) * camera.current.zoom;
      const offsetX = (width - W * scale) / 2 + camera.current.x, offsetY = (height - H * scale) / 2 + camera.current.y;
      geometry.current = { scale, offsetX, offsetY };
      ctx.translate(offsetX, offsetY); ctx.scale(scale, scale);
      const progress = reduced ? 1 : Math.min(1, (now - born) / 1600);
      const lit = focus > 0 || activeGroups.length > 0;
      for (const [a, b] of links) {
        if (!visible(a, stage) || !visible(b, stage)) continue;
        const highlight = lit && selected(a.group) && selected(b.group);
        ctx.globalAlpha = (highlight ? .7 : lit ? .07 : a.kind === 'hub' && b.kind === 'hub' ? .44 : .28) * (a.kind === 'card' || b.kind === 'card' ? progress : 1);
        ctx.strokeStyle = highlight ? color(a.group || b.group) : '#7dacc5';
        ctx.lineWidth = (highlight ? 1.1 : .65) / Math.sqrt(scale);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      for (let i = 0; i < positioned.length; i++) {
        const node = positioned[i]; if (!visible(node, stage)) continue;
        const highlight = selected(node.group), hub = node.kind === 'hub' || node.kind === 'root';
        const reveal = node.kind === 'card' ? Math.max(0, Math.min(1, progress * 2 - (i % 41) / 41)) : 1;
        ctx.globalAlpha = (lit && !highlight ? .24 : hub ? 1 : .95) * reveal;
        ctx.fillStyle = color(node.group); ctx.shadowColor = color(node.group); ctx.shadowBlur = hub || highlight && node.kind === 'idea' ? 12 : 0;
        ctx.beginPath(); ctx.arc(node.x, node.y, node.radius * (highlight ? 1.2 : 1), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
        if (hub) {
          ctx.globalAlpha = lit && !highlight ? .4 : 1; ctx.fillStyle = '#e6edf5'; ctx.textAlign = 'center';
          ctx.font = (node.kind === 'root' ? '600 ' : '500 ') + (node.kind === 'root' ? 16 : 12) / scale + 'px Segoe UI, sans-serif';
          ctx.fillText(node.kind === 'root' ? 'SYNAPSE' : node.title, node.x, node.y + node.radius + 19 / scale);
        }
      }
      // These travelling lights illustrate links; they do not pretend to run a trained model.
      if (stage >= 3 && !reduced) {
        links.forEach(([a, b], index) => {
          if (index % 23 || lit && (!selected(a.group) || !selected(b.group))) return;
          const t = (now / 2400 + index * .13) % 1;
          ctx.globalAlpha = .85; ctx.fillStyle = color(b.group); ctx.shadowColor = color(b.group); ctx.shadowBlur = 9;
          ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 2 / Math.sqrt(scale), 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    };
    paint.current = () => draw(performance.now());
    const loop = (now: number) => { if (stopped) return; if (now - last >= 32 && !document.hidden) { draw(now); last = now; } if (!reduced && (stage >= 3 || now - born < 1800)) frame = requestAnimationFrame(loop); };
    const resize = new ResizeObserver(() => paint.current()); resize.observe(container);
    const resume = () => { if (!document.hidden) paint.current(); };
    document.addEventListener('visibilitychange', resume);
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.1 : 1 / 1.1); };
    element.addEventListener('wheel', wheel, { passive: false });
    draw(born); if (!reduced) frame = requestAnimationFrame(loop);
    return () => { stopped = true; cancelAnimationFrame(frame); resize.disconnect(); document.removeEventListener('visibilitychange', resume); element.removeEventListener('wheel', wheel); paint.current = () => {}; };
  }, [stage, focus, question, reduced]);
  return <div className="knowledge-canvas" ref={host}>
    <canvas ref={canvas} role="img" aria-label="Mapa de conhecimento com ideias conectadas em dois grandes conjuntos. Use os botões de temas para explorar sem o mouse."
      onPointerDown={event => { drag.current = { x: event.clientX, y: event.clientY, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={event => { if (!drag.current) return; const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y; if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true; camera.current.x += dx; camera.current.y += dy; drag.current.x = event.clientX; drag.current.y = event.clientY; paint.current(); }}
      onPointerCancel={() => { drag.current = null; }}
      onPointerUp={event => { const wasDrag = drag.current?.moved; drag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); if (wasDrag) return; const rect = event.currentTarget.getBoundingClientRect(), { scale, offsetX, offsetY } = geometry.current; const x = (event.clientX - rect.left - offsetX) / scale, y = (event.clientY - rect.top - offsetY) / scale; let nearest = 18 / scale, found: KnowledgeNode | undefined; for (const node of positioned) { if (!visible(node, stage)) continue; const distance = Math.hypot(x - node.x, y - node.y); if (distance < nearest) { nearest = distance; found = node; } } if (found) onSelect(found); }} />
    <div className="knowledge-zoom"><button onClick={() => zoom(1 / 1.2)} aria-label="Diminuir a rede"><Minus size={15} /></button><span>{zoomLabel}%</span><button onClick={() => zoom(1.2)} aria-label="Ampliar a rede"><Plus size={15} /></button><button onClick={() => { camera.current = { x: 0, y: 0, zoom: 1 }; setZoomLabel(100); paint.current(); }} aria-label="Centralizar a rede"><RotateCcw size={14} /></button></div>
    <span className="knowledge-hint">Arraste para explorar · clique em um ponto</span>
  </div>;
}

export function KnowledgeFinale({ send, sim, stage, reduced = false }: { send: (command: Command) => void; sim: Sim; stage: number; reduced?: boolean }) {
  const focus = Number(sim.values.networkFocus || 0), question = Number(sim.values.networkQuestion || 0);
  const [selected, setSelected] = useState<KnowledgeNode | null>(null);
  const active = selected?.group === focus ? selected : focus ? KNOWLEDGE_NODES.find(n => n.id === 'grupo-' + focus)! : null;
  const shown = KNOWLEDGE_NODES.filter(node => visible(node, stage)).length;
  const titles = ['Você viu as peças. Agora veja o todo.', 'Uma ideia puxa a próxima.', 'O conhecimento ganha outra dimensão.', 'Uma pergunta acende caminhos.'];
  const ask = (index: number) => { setSelected(null); send({ type: 'set', key: 'networkFocus', value: 0 }); send({ type: 'set', key: 'networkQuestion', value: index }); send({ type: 'stage', value: 4 }); };
  return <section className="knowledge-finale" data-network-stage={stage} data-network-count={shown} data-network-focus={focus}>
    <div className="knowledge-heading"><div><span className="show-kicker"><Sparkles size={14} /> A ÚLTIMA CONEXÃO</span><h1>{titles[Math.min(stage, 3)]}</h1><p>Cada ponto é uma nota. Cada linha conecta duas ideias.</p></div><div className="knowledge-count"><strong>{shown}</strong><span>{stage >= 2 ? 'notas conectadas' : 'pontos acesos'}<small>{stage >= 2 ? KNOWLEDGE_EDGES.length + ' ligações · 12 temas' : 'o mapa ainda está crescendo'}</small></span></div></div>
    <div className={'knowledge-space' + (active ? ' has-note' : '')}>
      <KnowledgeCanvas stage={stage} focus={focus} question={question} reduced={reduced} onSelect={node => { setSelected(node); send({ type: 'set', key: 'networkFocus', value: node.group }); }} />
      {active && <aside className="knowledge-note"><span>UMA IDEIA, DE PERTO</span><h2>{active.title}</h2><p>{active.text}</p><blockquote>{active.example}</blockquote><button onClick={() => { setSelected(null); send({ type: 'set', key: 'networkFocus', value: 0 }); }}>Voltar à rede inteira</button></aside>}
    </div>
    <nav className="knowledge-groups" aria-label="Temas da rede">{NETWORK_GROUPS.map((name, index) => <button key={name} aria-pressed={focus === index + 1} onClick={() => { setSelected(null); send({ type: 'set', key: 'networkFocus', value: focus === index + 1 ? 0 : index + 1 }); }}><i style={{ background: color(index + 1) }} />{name}</button>)}</nav>
    {stage >= 3 && <div className="knowledge-questions"><span>ESCOLHA UMA PERGUNTA</span>{NETWORK_QUESTIONS.map((item, index) => <button key={item.title} aria-pressed={stage >= 4 && question === index} onClick={() => ask(index)}>{item.title}</button>)}</div>}
    {stage >= 4 && !focus && <p className="knowledge-answer" role="status">{NETWORK_QUESTIONS[question].answer}</p>}
    <div className="knowledge-bottom"><p>O “cérebro” é uma metáfora: um mapa de conhecimento inspirado no Obsidian.</p>{stage < 3 ? <button className="knowledge-reveal" onClick={() => send({ type: 'stage', value: stage + 1 })}>{['Conectar as ideias', 'Revelar a rede inteira', 'Fazer a rede acender'][stage]}<ArrowRight size={17} /></button> : <a href="/downloads/SYNAPSE-Obsidian.zip" download><Download size={16} />Levar esta rede para o Obsidian</a>}</div>
  </section>;
}

export function KnowledgeRemote({ send, sim }: { send: (command: Command) => void; sim: Sim }) {
  return <div className="knowledge-remote"><h2>Encerramento surpresa</h2><p>Revele uma parte de cada vez. Faça uma pausa antes da rede inteira.</p>{['Mostrar as primeiras ideias', 'Conectar as ideias', 'Revelar a rede inteira', 'Fazer a rede acender'].map((label, stage) => <button className="live-primary" key={label} onClick={() => send({ type: 'stage', value: stage })}>{label}</button>)}<h3>Uma pergunta para a turma</h3>{NETWORK_QUESTIONS.map((item, index) => <button key={item.title} onClick={() => { send({ type: 'set', key: 'networkFocus', value: 0 }); send({ type: 'set', key: 'networkQuestion', value: index }); send({ type: 'stage', value: 4 }); }}>{item.title}</button>)}<label>Explorar um tema<select value={Number(sim.values.networkFocus || 0)} onChange={event => send({ type: 'set', key: 'networkFocus', value: Number(event.target.value) })}><option value="0">Rede inteira</option>{NETWORK_GROUPS.map((title, i) => <option value={i + 1} key={title}>{title}</option>)}</select></label></div>;
}
