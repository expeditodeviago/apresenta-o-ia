import { useId } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, CheckCheck, Cpu, FileText, MessageCircle, Pause, Play, RotateCcw, Search, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { Command, Sim } from '../../shared/engine';
import { AI_CHAPTERS, storyLines } from '../../shared/aiJourney';
import { probabilities } from '../../shared/engine';

type Send = (command: Command) => void;
const delay = (i: number) => ({ '--i': i } as CSSProperties);

export function NeuralFlow({ expanded = true }: { expanded?: boolean }) {
  const id = useId().replace(/:/g, '');
  const layers = (expanded ? [5, 8, 8, 5] : [3, 4, 4, 3]).map((count, layer) => Array.from({ length: count }, (_, i) => ({ x: 68 + layer * 165, y: 180 + (i - (count - 1) / 2) * 35 })));
  return <svg className="ai-neural-flow" viewBox="0 0 640 380" role="img" aria-label="Rede neural didática: sinais percorrem conexões e são transformados em quatro camadas">
    <defs><radialGradient id={id}><stop stopColor="#8874ff" stopOpacity=".3" /><stop offset="1" stopColor="#8874ff" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="320" cy="190" rx="310" ry="175" fill={'url(#' + id + ')'} />
    {layers.slice(0, -1).flatMap((layer, l) => layer.flatMap((a, i) => layers[l + 1].map((b, j) => <g key={`${l}-${i}-${j}`}><path className="neural-wire" d={`M${a.x} ${a.y} C${a.x + 85} ${a.y},${b.x - 85} ${b.y},${b.x} ${b.y}`} /><path className="neural-signal" style={{ '--i': l * 2 + (i + j) % 3, '--speed': `${3 + (i % 3)}s` } as CSSProperties} d={`M${a.x} ${a.y} C${a.x + 85} ${a.y},${b.x - 85} ${b.y},${b.x} ${b.y}`} /></g>)))}
    {layers.flatMap((layer, l) => layer.map((p, i) => <g className="neural-unit" style={delay(l * 2 + i % 3)} key={`${l}-${i}`}><circle cx={p.x} cy={p.y} r="13" fill="#121c38" stroke={l === 3 ? '#b5a5ff' : '#65e8ed'} strokeOpacity=".7" /><circle className="neural-center" cx={p.x} cy={p.y} r="4" fill={l === 3 ? '#c9b9ff' : '#8af9e6'} /></g>))}
    {['ENTRADA', 'TRANSFORMAR', 'COMBINAR', 'SAÍDA'].map((text, i) => <text key={text} x={68 + i * 165} y="355" textAnchor="middle">{text}</text>)}
  </svg>;
}

export function PromptToAnswer({ compact = false }: { compact?: boolean }) {
  return <div className={'prompt-machine ' + (compact ? 'compact' : '')}>
    <div className="machine-orbit orbit-one" /><div className="machine-orbit orbit-two" />
    <div className="machine-message"><MessageCircle size={17} /><span>Como uma IA responde?</span><i /></div>
    <div className="machine-token-row">{['Como', ' uma', ' IA', ' responde', '?'].map((t, i) => <span style={delay(i)} key={i}>{t}</span>)}</div>
    <div className="machine-network"><NeuralFlow /><div className="machine-chip"><Cpu size={25} /><span>PADRÕES + CONTEXTO</span></div></div>
    <div className="machine-answer"><Sparkles size={18} /><div><small>UMA RESPOSTA EM CONSTRUÇÃO</small><p>{['Uma', ' escolha', ' abre', ' caminho', ' para', ' a próxima.'].map((t, i) => <span key={i} style={delay(i)}>{t}</span>)}<b className="typing-caret" /></p></div></div>
    <span className="machine-footnote">Visualização didática de um modelo de linguagem</span>
  </div>;
}

function Tokens({ variant }: { variant: number }) {
  const tokens = variant ? ['extra', 'ordin', 'ário'] : ['Por', ' que', ' o', ' céu', ' é', ' azul', '?'];
  return <div className="ai-token-scene"><div className="ai-message"><MessageCircle size={20} /><strong>{variant ? 'extraordinário' : 'Por que o céu é azul?'}</strong></div><div className="ai-drop-line"><ArrowDown size={20} /><span>dividir em pedaços</span></div><div className="ai-token-pieces">{tokens.map((t, i) => <div className="token-piece" key={i} style={delay(i)}><span>{t}</span><small>peça {i + 1}</small></div>)}</div><div className="token-code"><span>identificadores</span><div>{tokens.map((_, i) => <b style={delay(i)} key={i}>{[184, 907, 31, 820, 72, 642, 9][i]}</b>)}</div></div><p className="ai-visual-note">Recorte e identificadores ilustrativos.</p></div>;
}

function Meaning({ variant }: { variant: number }) {
  const words = variant ? [{ t: 'praça', x: 22, y: 30 }, { t: 'sentar', x: 33, y: 54 }, { t: 'banco', x: 22, y: 72 }, { t: 'conta', x: 69, y: 24 }, { t: 'depósito', x: 79, y: 49 }, { t: 'banco', x: 68, y: 72 }] : [{ t: 'gato', x: 23, y: 32 }, { t: 'cachorro', x: 38, y: 50 }, { t: 'coelho', x: 22, y: 71 }, { t: 'avião', x: 72, y: 26 }, { t: 'carro', x: 81, y: 49 }, { t: 'ônibus', x: 65, y: 71 }];
  return <div className="meaning-map"><span className="map-axis">UM MAPA DE RELAÇÕES</span><div className="meaning-cloud cloud-left" /><div className="meaning-cloud cloud-right" /><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{words.map((p, i) => i % 3 < 2 && <line key={i} x1={p.x} y1={p.y} x2={words[i + 1].x} y2={words[i + 1].y} />)}</svg>{words.map((p, i) => <span className={'meaning-word group-' + Math.floor(i / 3)} style={{ left: p.x + '%', top: p.y + '%', '--i': i } as CSSProperties} key={i}><i />{p.t}</span>)}<p className="ai-visual-note">Posições ilustrativas. O espaço real tem muitas dimensões.</p></div>;
}

function Training({ variant }: { variant: number }) {
  return <div className="training-scene"><div className="training-example"><span>EXEMPLO DE TREINO</span><p>O gato fez <b>miau.</b></p></div><div className="training-loop"><div className="training-card"><Cpu /><small>PREVER</small><strong>{variant ? 'miau' : 'au-au'}</strong></div><ArrowRight /><div className="training-card"><Search /><small>COMPARAR</small><strong>{variant ? 'Mais próximo' : 'Não encaixou'}</strong></div><ArrowRight /><div className="training-card"><WandSparkles /><small>AJUSTAR</small><strong>Os pesos</strong></div></div><div className="training-return"><RotateCcw size={18} /><span>Outro exemplo. Outra tentativa. Novos ajustes.</span></div><div className="training-bars">{[35, 42, 51, 48, 62, 70, 66, 79, 84, 89, 86, 95].map((h, i) => <i key={i} style={{ '--height': h + '%', '--i': i, height: (variant ? h : h * .35) + '%' } as CSSProperties} />)}<span>PADRÕES APRENDIDOS · ILUSTRAÇÃO</span></div></div>;
}

function Attention({ variant }: { variant: number }) {
  const sentence = variant ? ['Fui', 'ao', 'banco', 'fazer', 'um', 'depósito.'] : ['Sentei', 'no', 'banco', 'da', 'praça.'];
  return <div className="attention-scene"><span className="ai-scene-kicker">QUAL SENTIDO SE ENCAIXA AQUI?</span><div className="attention-sentence">{sentence.map((t, i) => <span key={i} className={i === 2 ? 'attention-focus' : i === sentence.length - 1 || i === 0 ? 'attention-clue' : ''} style={delay(i)}>{t}</span>)}</div><svg viewBox="0 0 600 150" aria-hidden="true"><path className="attention-link" d="M270 10 Q160 190 65 10" /><path className="attention-link" d="M270 10 Q410 185 540 10" /></svg><div className="attention-answer"><span>{variant ? '🏦' : '🌳'}</span><div><small>AS OUTRAS PALAVRAS DÃO A PISTA</small><strong>{variant ? 'Uma instituição financeira' : 'Um lugar para sentar'}</strong></div></div></div>;
}

function ContextScene({ variant }: { variant: number }) {
  return <div className="context-scene"><div className="context-prompt"><MessageCircle size={19} /><p>Explique gravidade <strong>{variant ? 'para um engenheiro.' : 'para uma criança.'}</strong></p></div><div className="context-tags"><span>Mesmo assunto</span><ArrowRight size={15} /><span>Outro público</span></div><div className="ai-response-card"><Sparkles size={24} /><div><small>EXEMPLO DE RESPOSTA</small><p key={variant} className="ai-text-enter">{variant ? 'A gravidade é uma interação entre massas. Perto da superfície da Terra, podemos aproximar a aceleração gravitacional como constante em muitos problemas.' : 'A Terra atrai as coisas para perto dela. É por isso que uma bola volta para o chão depois que você a joga para cima.'}</p></div></div><div className="context-recipe"><span>Objetivo</span><i>+</i><span>Contexto</span><i>+</i><span>Formato</span></div></div>;
}

function Generation({ variant }: { variant: number }) {
  const words = variant ? ['Imagine', 'uma', 'cidade', 'onde', 'os', 'jardins', 'crescem', 'nos', 'telhados.'] : ['Uma', 'IA', 'aprende', 'padrões', 'e', 'usa', 'o', 'contexto', 'para', 'gerar', 'uma', 'resposta.'];
  return <div className="generation-scene"><span className="ai-scene-kicker">A PRÓXIMA ESCOLHA USA O QUE VEIO ANTES</span><div className="generation-paper"><Sparkles size={24} /><p>{words.map((word, i) => <span key={i} style={delay(i)}>{word} </span>)}<b className="typing-caret" /></p></div><div className="generation-cycle"><span>Contexto</span><ArrowRight /><span>Próximo token</span><ArrowRight /><span>Contexto atualizado</span><RotateCcw /></div></div>;
}

function Memory({ variant }: { variant: number }) {
  const cards = variant ? ['Um detalhe antigo', 'Outra conversa', 'Resumo anterior', 'Seu objetivo', 'Fonte consultada', 'Pedido atual'] : ['Instruções', 'Seu objetivo', 'Fonte consultada', 'Pedido atual'];
  return <div className="memory-scene"><div className="memory-window"><span className="memory-label">CONTEXTO DISPONÍVEL NESTE EXEMPLO</span>{cards.map((t, i) => <div key={t} className={'memory-card ' + (variant && i < 2 ? 'outside' : '')} style={delay(i)}><FileText size={19} /><span>{t}</span>{variant && i < 2 ? <small>ficou de fora</small> : <Check size={16} />}</div>)}</div><div className="memory-caption"><BookOpen size={20} /><p>{variant ? 'Uma parte do histórico pode sair. Um resumo pode ajudar, mas perder detalhes.' : 'O modelo recebe um recorte da conversa e dos documentos disponíveis.'}</p></div></div>;
}

function Temperature({ variant }: { variant: number }) {
  const probs = probabilities(variant ? 1.8 : .3);
  return <div className="temperature-scene"><div className="temperature-prompt">Hoje eu quero <span>…</span></div><div className="temperature-options">{['descansar', 'viajar', 'estudar', 'dançar'].map((t, i) => <div key={t} className="temperature-option" style={delay(i)}><span>{t}</span><div><i style={{ width: probs[i] * 100 + '%' }} /></div><b>{Math.round(probs[i] * 100)}%</b></div>)}</div><div className="temperature-scale"><span>{variant ? 'Mais caminhos ganham espaço' : 'A favorita se destaca'}</span><Sparkles size={18} /></div><p className="ai-visual-note">Chances ilustrativas para uma única escolha. Não medem a verdade.</p></div>;
}

function FactCheck({ variant }: { variant: number }) {
  return <div className="fact-scene"><div className="fact-question">Quem ganhou o Prêmio Aurora de 2035?</div><div className={'fact-answer ' + (variant ? 'verified' : '')}><div>{variant ? <ShieldCheck /> : <Sparkles />}<span>{variant ? 'DEPOIS DE CONFERIR' : 'UMA RESPOSTA QUE SOA CONVINCENTE'}</span></div><p>{variant ? 'Não há uma fonte que sustente essa afirmação.' : '“Marina Costa ganhou com o projeto Oceano Vivo.”'}</p><small>{variant ? 'Sem evidência, não devemos apresentar o nome como fato.' : 'Neste exemplo fictício, o nome e o projeto foram inventados.'}</small></div><div className="fact-footer"><FileText size={20} /><span>{variant ? 'Fonte aberta → informação não confirmada' : 'Texto fluente → nenhuma evidência apresentada'}</span></div></div>;
}

function ToolsScene({ variant }: { variant: number }) {
  const steps = variant ? [{ icon: MessageCircle, title: 'Seu pedido', text: 'Quanto é 347 × 28?' }, { icon: ShieldCheck, title: 'Ferramenta', text: 'Calculadora autorizada' }, { icon: Cpu, title: 'Resultado', text: '9.716' }, { icon: CheckCheck, title: 'Resposta', text: 'Usa o resultado retornado' }] : [{ icon: MessageCircle, title: 'Seu pedido', text: 'O que diz este arquivo?' }, { icon: ShieldCheck, title: 'Ferramenta', text: 'Busca autorizada' }, { icon: FileText, title: 'Resultado', text: 'Trecho do documento' }, { icon: CheckCheck, title: 'Resposta', text: 'Explicação com a fonte' }];
  return <div className="tools-scene">{steps.map((s, i) => <div className="tool-step" style={delay(i)} key={s.title}><div className="tool-step-icon"><s.icon size={24} /></div><div><small>0{i + 1} / {s.title}</small><strong>{s.text}</strong></div>{i < 3 && <ArrowDown className="tool-connector" size={18} />}</div>)}<p className="ai-visual-note">Demonstração preparada, sem executar ferramentas externas.</p></div>;
}

function Pipeline({ variant }: { variant: number }) {
  const steps = ['Seu pedido', 'Tokens + contexto', 'Rede neural', ...(variant ? ['Consultar uma fonte'] : []), 'Gerar a resposta', 'Você confere'];
  return <div className="pipeline-scene"><div className="pipeline-center"><Cpu size={38} /><span>AGORA AS PEÇAS SE CONECTAM</span></div><div className="pipeline-steps">{steps.map((s, i) => <div className="pipeline-step" style={delay(i)} key={s}><b>{String(i + 1).padStart(2, '0')}</b><span>{s}</span>{i < steps.length - 1 && <ArrowRight size={17} />}</div>)}</div><div className="pipeline-last"><CheckCheck size={20} />Uma boa resposta termina com uma boa conferência.</div></div>;
}

export function AIExampleControls({ module, sim, send }: { module: number; sim: Sim; send: Send }) {
  const c = AI_CHAPTERS[module], variant = Number(sim.values.aiVariant || 0);
  return <div className="ai-example-controls" role="group" aria-label="Exemplo da explicação">{c.variants.map((label, i) => <button key={label} aria-pressed={variant === i} onClick={() => send({ type: 'storyVariant', value: i })}>{label}</button>)}</div>;
}

export function AIJourney({ module, sim, stage, reduced, send }: { module: number; sim: Sim; stage: number; reduced: boolean; send: Send }) {
  const c = AI_CHAPTERS[module], variant = Number(sim.values.aiVariant || 0), lines = storyLines(module, variant);
  const illustrations = [null, <Tokens variant={variant} />, <Meaning variant={variant} />, <Training variant={variant} />, <NeuralFlow expanded={Boolean(variant)} />, <Attention variant={variant} />, <ContextScene variant={variant} />, <Generation variant={variant} />, <Memory variant={variant} />, <Temperature variant={variant} />, <FactCheck variant={variant} />, <ToolsScene variant={variant} />, <Pipeline variant={variant} />];
  return <section className="ai-journey" aria-label="Como a IA funciona">
    <div className="ai-story-copy"><span className="ai-chapter-label">{c.label}</span><h1>{c.title}</h1><p className="ai-story-intro">{c.intro}</p><div className="ai-story-detail" aria-live="polite" key={stage}><span>{['A IDEIA', 'POR DENTRO', 'PENSE COM A GENTE', 'O QUE ACONTECE', 'EXPERIMENTE', 'A DESCOBERTA', 'LEVE ESTA IDEIA', 'SUA VEZ'][stage]}</span><p>{lines[stage]}</p></div><div className="ai-story-pagination" aria-label="Etapas da explicação">{lines.map((_, i) => <button key={i} aria-label={'Etapa ' + (i + 1) + ' da explicação'} aria-current={stage === i ? 'step' : undefined} onClick={() => send({ type: 'stage', value: i })}><span /></button>)}<small>{String(stage + 1).padStart(2, '0')} / 08</small></div></div>
    <div className="ai-scene-panel"><div className="ai-scene-top"><span><i />VEJA A IDEIA ACONTECER</span><div><button aria-label="Repetir animação" title="Repetir animação" onClick={() => send({ type: 'storyReplay' })}><RotateCcw size={16} /></button><button aria-label={reduced ? 'Ativar animações' : 'Pausar animações'} title={reduced ? 'Ativar animações' : 'Pausar animações'} onClick={() => send({ type: 'reduced', value: !reduced })}>{reduced ? <Play size={16} /> : <Pause size={16} />}</button></div></div><div className="ai-illustration" key={`${module}-${variant}-${sim.values.aiReplay || 0}`}>{illustrations[module]}</div><AIExampleControls module={module} sim={sim} send={send} /></div>
    <div className="ai-takeaway"><Sparkles size={18} /><p>{c.takeaway}</p><button onClick={() => send({ type: 'mathMode', value: true })}><BookOpen size={15} />Explorar a matemática<ArrowRight size={14} /></button></div>
  </section>;
}
