import { ArrowDownRight, ArrowRight, Orbit, Sparkles } from 'lucide-react';
import type { Command } from '../../shared/engine';
import { LESSONS } from '../../shared/curriculum';

type SceneProps = { send: (command: Command) => void; stage?: number };

/** Deterministic geometry: the opening also works without network or GPU canvas. */
export function SynapseOrb() {
  const points = Array.from({ length: 90 }, (_, i) => {
    const z = 1 - 2 * (i + .5) / 90;
    const r = Math.sqrt(1 - z * z), angle = i * 2.399963;
    return { x: 300 + Math.cos(angle) * r * 181, y: 300 + z * 181, depth: Math.sin(angle) * r };
  });
  return <div className="synapse-orb">
    <svg viewBox="0 0 600 600" role="img" aria-label="Esfera de pontos e conexões: uma representação visual das possibilidades da matemática">
      <defs>
        <radialGradient id="orb-aura"><stop stopColor="#53e5ce" stopOpacity=".22" /><stop offset=".7" stopColor="#34bbc1" stopOpacity=".04" /><stop offset="1" stopColor="#34bbc1" stopOpacity="0" /></radialGradient>
        <radialGradient id="orb-core"><stop stopColor="#dafff3" /><stop offset=".18" stopColor="#c9fc78" /><stop offset="1" stopColor="#53e5ce" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="300" cy="300" r="294" fill="url(#orb-aura)" />
      <g className="orb-rings" fill="none" stroke="#6cdccc">
        <circle cx="300" cy="300" r="242" strokeOpacity=".15" />
        <circle cx="300" cy="300" r="267" strokeOpacity=".16" strokeDasharray="1 12" />
        <ellipse cx="300" cy="300" rx="284" ry="87" transform="rotate(-32 300 300)" strokeOpacity=".5" />
        <ellipse cx="300" cy="300" rx="259" ry="107" transform="rotate(42 300 300)" strokeOpacity=".24" />
        <circle cx="300" cy="58" r="5" fill="#d8fc91" stroke="none" />
        <circle cx="558" cy="300" r="3" fill="#73f2df" stroke="none" />
      </g>
      <g className="orb-network">
        {points.flatMap((a, i) => points.slice(i + 1).map((b, j) => {
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          return distance < 77 && distance > 26 ? <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={i % 5 === 0 ? '#cafa85' : '#65dccd'} strokeOpacity={.08 + (a.depth + 1) * .12} strokeWidth=".8" /> : null;
        }))}
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.depth > .2 ? 2.8 : 1.5} fill={i % 5 === 0 ? '#d8fc91' : '#8ef5e5'} opacity={.32 + (p.depth + 1) * .32} />)}
      </g>
      <circle className="orb-pulse" cx="300" cy="300" r="35" fill="url(#orb-core)" />
      <path d="M289 300h22M300 289v22" stroke="#e6ffcf" strokeWidth="1.5" />
    </svg>
    <span className="orb-tag tag-top"><i />ESCOLHAS → POSSIBILIDADES</span>
    <span className="orb-tag tag-bottom">n → ∞ <b>IDEIAS QUE SE CONECTAM</b></span>
    <span className="orb-coordinate">FIG. 01 / UNIVERSO DISCRETO</span>
  </div>;
}

export function OpeningScene({ send, stage = 0 }: SceneProps) {
  const beats = [
    null,
    { label: 'UMA PERGUNTA PARA COMEÇAR', value: 'Mais opções.\nOu mais posições?', text: 'Uma senha tem 10 símbolos disponíveis em cada uma de 4 posições. O que aumenta mais as possibilidades: dobrar os símbolos ou dobrar as posições?', formula: 'A turma escolhe antes de calcular.' },
    { label: 'O PONTO DE PARTIDA', value: '10.000', text: 'Dez opções em cada uma de quatro posições. A ordem importa e os símbolos podem se repetir.', formula: '10⁴ = 10 × 10 × 10 × 10' },
    { label: 'DOBRAMOS AS OPÇÕES', value: '160.000', text: 'Agora são 20 símbolos disponíveis. Mantemos as quatro posições.', formula: '20⁴ · 16 vezes o total inicial' },
    { label: 'DOBRAMOS AS POSIÇÕES', value: '100 milhões', text: 'Voltamos aos 10 símbolos e usamos oito posições. Uma pequena mudança cria um espaço enorme.', formula: '10⁸ · 10.000 vezes o total inicial' },
    { label: 'A SURPRESA ESTÁ NO EXPOENTE', value: '625×', text: 'Neste exemplo, dobrar as posições produz 625 vezes mais sequências do que dobrar as opções.', formula: '100.000.000 ÷ 160.000 = 625' },
    { label: 'É AQUI QUE A JORNADA COMEÇA', value: 'Como escolher\nnesse universo?', text: 'Vamos explorar busca, regras e restrições que tornam esse problema tratável.', formula: 'Prever → testar → explicar' },
    { label: 'O ACORDO COM A TURMA', value: 'Você prevê.\nA gente testa.', text: 'Em cada experimento, escolha uma hipótese. Mude uma condição. Observe o que acontece.', formula: '12 experimentos. Uma ideia puxa a próxima.' },
  ];
  const beat = beats[stage];
  return <section className="show-opening">
    <div className={'opening-copy ' + (beat ? 'opening-beat' : '')} key={stage}>
      {beat ? <><span className="show-kicker"><i />{beat.label}</span><h1>{beat.value}</h1><p>{beat.text}</p><div className="opening-formula">{beat.formula}</div><button className="launch-button" onClick={() => send(stage < 7 ? { type: 'advance', value: 1 } : { type: 'module', value: 1 })}>{stage < 7 ? 'Continuar a descoberta' : 'Entrar no experimento'}<ArrowRight size={21} /></button></> : <>
      <span className="show-kicker"><i /> UMA EXPEDIÇÃO PELA INTELIGÊNCIA ARTIFICIAL</span>
      <h1>A IA não é<br />mágica.<br /><em>É matemática.</em></h1>
      <p>Por trás de uma resposta, um universo de escolhas.<br className="desktop-break" /> Hoje, você entra nele.</p>
      <button className="launch-button" onClick={() => send({ type: 'module', value: 1 })}>Entrar no experimento <ArrowRight size={21} /></button>
      <div className="opening-meta"><span><strong>12</strong> experimentos</span><i /><span><strong>120</strong> minutos</span><i /><span>Você no controle</span></div>
      <button className="opening-prologue" onClick={() => send({ type: 'stage', value: 1 })}>Antes de entrar, um desafio de 8 minutos <ArrowRight size={15} /></button>
      </>}
    </div>
    <SynapseOrb />
    <div className="opening-baseline"><span>MATEMÁTICA DISCRETA <b>×</b> INTELIGÊNCIA ARTIFICIAL</span><span>ROLE A IDEIA. TESTE A HIPÓTESE. <ArrowDownRight size={16} /></span></div>
    <nav className="show-chapters" aria-label="Atos da apresentação">
      <button onClick={() => send({ type: 'module', value: 1 })}><span>ATO 01 <small>01 — 04</small></span><strong>Das peças às conexões</strong><p>Escolhas, caminhos e regras.</p><ArrowRight size={20} /></button>
      <button onClick={() => send({ type: 'module', value: 5 })}><span>ATO 02 <small>05 — 08</small></span><strong>Quando a máquina decide</strong><p>Estratégias, posições e limites.</p><ArrowRight size={20} /></button>
      <button onClick={() => send({ type: 'module', value: 9 })}><span>ATO 03 <small>09 — 12</small></span><strong>Do acaso à inteligência</strong><p>Probabilidade, estados e uma missão.</p><ArrowRight size={20} /></button>
    </nav>
  </section>;
}

export function FinaleScene({ send }: SceneProps) {
  return <section className="show-finale">
    <div className="finale-banner"><img src="/images/synapse-network.png" alt="Peças e conexões matemáticas formando uma rede" /><div><span className="show-kicker"><Sparkles size={15} /> AS PEÇAS AGORA SE CONECTAM</span><h2>O próximo passo<br />é <em>sua ideia.</em></h2><p>Pergunte. Modele. Preveja. Teste. Explique.</p></div></div>
    <div className="finale-connections">{LESSONS.slice(1, 13).map(lesson => <button key={lesson.id} onClick={() => send({ type: 'module', value: lesson.id })}><span>{String(lesson.id).padStart(2, '0')}</span><strong>{lesson.math}</strong><ArrowRight size={16} /></button>)}</div>
    <div className="finale-question"><Orbit size={22} /><p>Qual problema você passa a enxergar de outro jeito?</p></div>
  </section>;
}
