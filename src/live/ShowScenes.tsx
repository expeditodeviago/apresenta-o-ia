import { ArrowDownRight, ArrowRight, Orbit, Sparkles } from 'lucide-react';
import type { Command } from '../../shared/engine';
import { LESSONS } from '../../shared/curriculum';
import { PromptToAnswer } from './AIJourney';

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
  {
    "label": "A PERGUNTA QUE TODO MUNDO FAZ",
    "value": "Ela pensa\ncomo a gente?",
    "text": "Uma conversa pode parecer humana. Vamos olhar para o processo que produz essa impressão.",
    "formula": "O foco: modelos de linguagem, como os usados em assistentes de texto."
  },
  {
    "label": "ANTES DE VOCÊ DIGITAR",
    "value": "Ela aprende\ncom exemplos.",
    "text": "No treinamento, previsões são comparadas com exemplos. Os erros orientam ajustes na rede.",
    "formula": "Treinamento → padrões aprendidos"
  },
  {
    "label": "QUANDO A PERGUNTA CHEGA",
    "value": "Palavras viram\nrepresentações.",
    "text": "O texto é dividido em tokens. A rede trabalha com representações numéricas desses pedaços.",
    "formula": "Pergunta → tokens → representações"
  },
  {
    "label": "NENHUMA PALAVRA ESTÁ SOZINHA",
    "value": "O contexto\nmuda tudo.",
    "text": "“Banco” pode ser um assento ou uma instituição. As palavras ao redor ajudam a distinguir o sentido.",
    "formula": "Troque o contexto. Observe a interpretação."
  },
  {
    "label": "A RESPOSTA APARECE",
    "value": "Uma escolha\npuxa a próxima.",
    "text": "O modelo pode gerar texto um token de cada vez, usando o contexto e o que já produziu.",
    "formula": "Calcular possibilidades → escolher → continuar"
  },
  {
    "label": "UM LIMITE QUE PRECISAMOS ENTENDER",
    "value": "Soar certo\nnão basta.",
    "text": "Uma resposta pode ser fluente e estar errada. Fontes e conferência continuam fazendo parte do trabalho.",
    "formula": "Uma explicação convincente precisa de evidência."
  },
  {
    "label": "O CONVITE ESTÁ FEITO",
    "value": "Veja. Troque.\nDescubra.",
    "text": "Vamos acompanhar o caminho de uma pergunta e experimentar o que muda a resposta.",
    "formula": "A matemática aparece como apoio, quando você quiser aprofundar."
  }
];
  const beat = beats[stage];
  return <section className="show-opening">
    <div className={'opening-copy ' + (beat ? 'opening-beat' : '')} key={stage}>
      {beat ? <><span className="show-kicker"><i />{beat.label}</span><h1>{beat.value}</h1><p>{beat.text}</p><div className="opening-formula">{beat.formula}</div><button className="launch-button" onClick={() => send(stage < 7 ? { type: 'advance', value: 1 } : { type: 'module', value: 1 })}>{stage < 7 ? 'Continuar a descoberta' : 'Entrar no experimento'}<ArrowRight size={21} /></button></> : <>
      <span className="show-kicker"><i /> UMA EXPEDIÇÃO PELA INTELIGÊNCIA ARTIFICIAL</span>
      <h1>O que acontece<br />dentro de<br /><em>uma IA?</em></h1>
      <p>Você faz uma pergunta. Ela responde.<br className="desktop-break" /> Vamos descobrir o que existe entre esses dois momentos.</p>
      <button className="launch-button" onClick={() => send({ type: 'module', value: 1 })}>Descobrir por dentro <ArrowRight size={21} /></button>
      <div className="opening-meta"><span><strong>12</strong> descobertas</span><i /><span><strong>120</strong> minutos</span><i /><span>Você no controle</span></div>
      <button className="opening-prologue" onClick={() => send({ type: 'stage', value: 1 })}>Começar pela pergunta: ela pensa como a gente? <ArrowRight size={15} /></button>
      </>}
    </div>
    <PromptToAnswer />
    <div className="opening-baseline"><span>APRENDER <b>→</b> CONECTAR <b>→</b> GERAR</span><span>UMA EXPLICAÇÃO PARA TODO MUNDO. <ArrowDownRight size={16} /></span></div>
    <nav className="show-chapters" aria-label="Atos da apresentação">
      <button onClick={() => send({ type: 'module', value: 1 })}><span>ATO 01 <small>01 — 04</small></span><strong>Como ela aprende</strong><p>Tokens, significados e redes neurais.</p><ArrowRight size={20} /></button>
      <button onClick={() => send({ type: 'module', value: 5 })}><span>ATO 02 <small>05 — 08</small></span><strong>Como ela responde</strong><p>Atenção, contexto e geração de texto.</p><ArrowRight size={20} /></button>
      <button onClick={() => send({ type: 'module', value: 9 })}><span>ATO 03 <small>09 — 12</small></span><strong>Como usar com critério</strong><p>Variação, erros, ferramentas e fontes.</p><ArrowRight size={20} /></button>
    </nav>
  </section>;
}

export function FinaleScene({ send }: SceneProps) {
  return <section className="show-finale">
    <div className="finale-banner"><img src="/images/synapse-network.png" alt="Peças e conexões matemáticas formando uma rede" /><div><span className="show-kicker"><Sparkles size={15} /> AS PEÇAS AGORA SE CONECTAM</span><h2>O próximo passo<br />é <em>sua ideia.</em></h2><p>Pergunte. Modele. Preveja. Teste. Explique.</p></div></div>
    <div className="finale-connections">{LESSONS.slice(1, 13).map(lesson => <button key={lesson.id} onClick={() => send({ type: 'module', value: lesson.id })}><span>{String(lesson.id).padStart(2, '0')}</span><strong>{lesson.short}</strong><ArrowRight size={16} /></button>)}</div>
    <div className="finale-question"><Orbit size={22} /><p>Qual problema você passa a enxergar de outro jeito?</p></div>
  </section>;
}
