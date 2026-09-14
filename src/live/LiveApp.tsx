import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { PairingGate, PairingSetup } from './Pairing';
import { ArrowLeft, ArrowRight, Blocks, BookOpen, Check, ChevronRight, CircleHelp, Clock3, Expand, Eye, EyeOff, Grid2X2, Link, LoaderCircle, Maximize, Pause, Play, Radio, RotateCcw, Smartphone, Volume2, VolumeX, Wifi, WifiOff, X } from 'lucide-react';
import { LESSONS, STAGES, STAGE_SECONDS } from '../../shared/curriculum';
import { currentSim, initialState } from '../../shared/engine';
import type { Command, State } from '../../shared/engine';
import { useLiveSession, credential } from './useLiveSession';
import { SimControls } from './SimControls';
import { SimVisual } from './SimVisual';
import { TransitionBit } from './TransitionBit';
import { PredictionPanel } from './PredictionPanel';
import { RevealCue } from './RevealCue';
import './live.css';
import './show.css';

const time = (ms: number) => { const sec = Math.floor(ms / 1000); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); };
const STAGE_KEYS = ['question', 'example', 'prediction', 'example', 'variant', 'reveal', 'application', 'conclusion'] as const;
function useClock(state: State, offset = 0) { const [now, setNow] = useState(Date.now()); useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(timer); }, []); return { total: state.elapsed + (state.running ? Math.max(0, now + offset - state.clockAt) : 0), module: state.moduleElapsed + (state.running ? Math.max(0, now + offset - state.clockAt) : 0) }; }
function Settings({ state, send }: { state: State; send: (command: Command) => void }) { return <div className="live-settings"><label><Volume2 size={17} />Volume<input type="range" min="0" max="1" step=".1" value={state.volume} onChange={e => send({ type: 'volume', value: Number(e.target.value) })} /></label><label>Movimento reduzido<input type="checkbox" checked={state.reduced} onChange={e => send({ type: 'reduced', value: e.target.checked })} /></label></div>; }
function useSound(state: State) { const context = useRef<AudioContext>(); const previous = useRef(state.module); useEffect(() => { if (previous.current === state.module) return; previous.current = state.module; if (!state.volume) return; try { const audio = context.current ?? (context.current = new AudioContext()); if (audio.state !== 'running') return; const osc = audio.createOscillator(), gain = audio.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(520, audio.currentTime); osc.frequency.exponentialRampToValueAtTime(780, audio.currentTime + .12); gain.gain.setValueAtTime(state.volume * .06, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .18); osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + .18); } catch { /* Audio is optional. */ } }, [state.module, state.volume]); return () => { try { context.current ??= new AudioContext(); void context.current.resume(); } catch { /* Silent fallback. */ } }; }

function Overview({ open, close, state, send }: { open: boolean; close: () => void; state: State; send: (command: Command) => void }) {
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) close(); }}><Dialog.Portal><Dialog.Overlay className="live-overlay" /><Dialog.Content className="live-overview"><div className="modal-title"><div><span className="live-eyebrow">SYNAPSE // SUA JORNADA</span><Dialog.Title>Uma ideia puxa a próxima.</Dialog.Title><Dialog.Description>120 minutos entre perguntas, experiências e descobertas.</Dialog.Description></div><Dialog.Close className="live-icon" aria-label="Fechar visão geral"><X size={22} /></Dialog.Close></div><div className="live-overview-grid">{LESSONS.map(l => <button key={l.id} aria-current={state.module === l.id ? 'step' : undefined} onClick={() => { send({ type: 'module', value: l.id }); close(); }}><span>{l.id > 0 && l.id < 13 ? 'MÓDULO ' + String(l.id).padStart(2, '0') : l.short.toUpperCase()}<small>{l.minutes} min</small></span><strong>{l.title}</strong><p>{l.math}</p></button>)}</div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function PublicStage() {
  const live = useLiveSession(false), { state, send } = live;
  const [overview, setOverview] = useState(false), [settings, setSettings] = useState(false);
  const [notice, setNotice] = useState('');
  const lesson = LESSONS[state.module], sim = currentSim(state), clock = useClock(state, live.serverOffset);
  const unlockSound = useSound(state);
  const reduced = state.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stageRef = useRef<HTMLDivElement>(null);
  const openPrivate = useCallback((setup = false) => {
    const popup = window.open((setup ? '/setup' : '/control') + (live.sessionId ? '?session=' + live.sessionId : ''), 'synapse-private', 'width=430,height=850');
    if (!popup) setNotice('O navegador bloqueou a janela privada. Libere pop-ups para este site.');
  }, [live.sessionId]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).closest('input,select,textarea,button,[role="dialog"]')) return;
      if (event.key.toLowerCase() === 'p') { event.preventDefault(); openPrivate(); return; }
      if (event.key === 'Escape') { setOverview(false); setSettings(false); if (!overview && !settings) send({ type: 'stageMode', value: false }); return; }
      if (overview || !live.canControl) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); send(event.shiftKey ? { type: 'navigate', value: 1 } : { type: 'advance', value: 1 }); }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); send(event.shiftKey ? { type: 'navigate', value: -1 } : { type: 'advance', value: -1 }); }
      if (event.key === ' ') { event.preventDefault(); unlockSound(); send({ type: 'action', key: 'step' }); }
      if (event.key.toLowerCase() === 'r') send({ type: 'reset' });
      if (event.key.toLowerCase() === 'a') send({ type: 'autoplay', value: !state.autoplay });
      if (event.key.toLowerCase() === 'v') send({ type: 'reveal' });
      if (event.key.toLowerCase() === 'm') setOverview(true);
      if (event.key.toLowerCase() === 'f') send({ type: 'stageMode', value: !state.stageMode });
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [state.module, state.stage, state.autoplay, state.stageMode, send, live.canControl, overview, settings, openPrivate]);
  useEffect(() => { stageRef.current?.scrollTo(0, 0); }, [state.module]);
  return <div className={'live-app ' + (reduced ? 'reduce-motion' : '') + (state.module === 0 ? ' is-opening' : '') + (state.module === 14 ? ' is-finale' : '') + (state.stageMode ? ' stage-mode' : '')} data-stage={state.stage} data-act={Math.min(3, Math.ceil(state.module / 4))} style={{ '--module-color': state.module === 0 ? '#d6fa87' : lesson.color } as React.CSSProperties} onPointerDown={unlockSound}>
    <div className="stage-atmosphere" aria-hidden="true"><div /><span>{state.module > 0 && state.module < 13 ? String(state.module).padStart(2, '0') : '∞'}</span></div>
    <header className="live-header"><button className="live-brand" onClick={() => send({ type: 'module', value: 0 })} aria-label="Ir para abertura"><Blocks size={24} /><strong>SYNAPSE <span>//</span></strong></button><span className="live-header-subtitle">MATEMÁTICA DISCRETA EM AÇÃO</span><div className="live-header-right"><span className={'connection-dot ' + live.connection} title={live.connection === 'online' ? 'Sessão conectada' : 'Apresentação local'}>{live.connection === 'online' ? <Wifi size={14} /> : <WifiOff size={14} />}</span><button className="live-icon" title="Configurações de som e movimento" aria-label="Configurações" onClick={() => setSettings(!settings)}>{state.volume ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><button className="live-icon" onClick={() => openPrivate(true)} title="Parear celular em janela separada" aria-label="Conectar celular"><Smartphone size={19} /></button><button className="live-icon" onClick={() => openPrivate()} title="Abrir controle e notas em janela privada" aria-label="Abrir modo apresentador"><BookOpen size={18} /></button><button className="live-icon" aria-label={state.stageMode ? "Sair do modo palco" : "Modo palco"} title="Modo palco (F)" onClick={() => send({ type: "stageMode", value: !state.stageMode })}><Maximize size={18} /></button><button className="live-present" onClick={async () => { send({ type: "stageMode", value: true }); try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { setNotice('Tela cheia indisponível neste navegador.'); } }}><Expand size={15} /><span>Apresentar</span></button></div></header>
    {settings && <div className="public-settings"><Settings state={state} send={send} /></div>}
    {(live.error || notice) && <div className="stage-notice" role="status">{live.error || notice}<button aria-label="Dispensar aviso" onClick={() => { live.clearError(); setNotice(''); }}><X size={15} /></button></div>}
    <main className="live-main" ref={stageRef}>
      {state.module !== 0 && state.module !== 14 && <>
      <section className="live-lesson-heading"><div><span className="live-eyebrow">{state.module > 0 && state.module < 13 ? 'MÓDULO ' + String(state.module).padStart(2, '0') + ' / 12' : lesson.short.toUpperCase()}<i />{lesson.math}</span><h1>{lesson.title}</h1></div><span className="lesson-duration"><Clock3 size={14} />{lesson.minutes} min</span></section>
      <nav className="stage-steps" aria-label="Etapas do módulo">{STAGES.map((stage, index) => <button key={stage} aria-current={state.stage === index ? 'step' : undefined} onClick={() => send({ type: 'stage', value: index })}><span>{index < state.stage ? <Check size={12} /> : index + 1}</span><b>{stage}</b></button>)}</nav>
      <div className="stage-prompt" aria-live="polite"><span>{STAGES[state.stage]}</span><p>{lesson[STAGE_KEYS[state.stage]]}</p></div>
      </>}
      <div className={'live-workbench ' + ([0, 13, 14].includes(state.module) ? 'wide' : '')} data-module={state.module}>
        <div className="live-visual" key={state.module}><RevealCue module={state.module} stage={state.stage} revealed={sim.revealed} reduced={reduced} />{state.module > 0 && state.module < 13 && <div className="experiment-caption"><span><i />{state.stage < 3 && !sim.revealed ? 'A TURMA DECIDE' : 'LABORATÓRIO SYNAPSE'}</span><span>EXP. {String(state.module).padStart(2, '0')} / {state.stage < 3 && !sim.revealed ? 'PREVISÃO' : 'SIMULAÇÃO'}</span></div>}{state.module > 0 && state.module < 13 && state.stage < 3 && !sim.revealed ? <PredictionPanel module={state.module} sim={sim} send={send} /> : <SimVisual module={state.module} sim={sim} send={send} stage={state.stage} />}{sim.revealed && state.stage !== 5 && state.module !== 13 && state.module !== 0 && <div className="revealed-insight"><CircleHelp size={18} /><p>{lesson.reveal}</p></div>}</div>
        {state.module > 0 && state.module < 13 && <aside className="live-console"><div className="console-heading"><span>EXPERIMENTO AO VIVO</span><span className="status-pill">LOCAL</span></div><SimControls module={state.module} sim={sim} send={command => { if (state.stage < 3) send({ type: 'stage', value: 3 }); send(command); }} /><div className="console-playback"><button className="live-icon" aria-label={state.autoplay ? 'Pausar Auto-Play' : 'Iniciar Auto-Play'} title={state.autoplay ? 'Pausar Auto-Play' : 'Iniciar Auto-Play'} onClick={() => { if (state.stage < 3) send({ type: 'stage', value: 3 }); send({ type: 'autoplay', value: !state.autoplay }); }}>{state.autoplay ? <Pause size={17} /> : <Play size={17} />}</button><span>{state.autoplay ? 'Demonstração em andamento' : 'Auto-Play'}</span></div></aside>}
      </div>
      {state.module !== 0 && state.module !== 14 && <div className="lesson-limit"><span>CONEXÃO COM IA</span><p>{lesson.application} <span>{lesson.limit}</span></p></div>}
    </main>
    <footer className="live-dock"><button className="live-icon" title="Visão geral" aria-label="Visão geral dos módulos" onClick={() => setOverview(true)}><Grid2X2 size={19} /></button><span className="dock-position">{String(state.module).padStart(2, '0')}<small> / 14</small></span><button className="live-icon" disabled={state.module === 0} title="Módulo anterior" aria-label="Módulo anterior" onClick={() => send({ type: 'navigate', value: -1 })}><ArrowLeft size={19} /></button><div className="dock-stage-controls"><button className="live-icon" disabled={state.stage === 0} title="Etapa anterior" aria-label="Etapa anterior" onClick={() => send({ type: 'advance', value: -1 })}><ArrowLeft size={15} /></button><span>{STAGES[state.stage]}</span><button className="live-icon" disabled={state.stage === 7} title="Próxima etapa" aria-label="Próxima etapa" onClick={() => send({ type: 'advance', value: 1 })}><ArrowRight size={15} /></button></div><button className="dock-reveal" onClick={() => send({ type: 'reveal' })}>{sim.revealed ? <EyeOff size={16} /> : <Eye size={16} />}<span>{sim.revealed ? 'Ocultar resposta' : 'Revelar resposta'}</span></button><button className="dock-next" disabled={state.module === 14} onClick={() => send({ type: 'navigate', value: 1 })} aria-label="Próximo módulo"><span>Próximo módulo</span><ArrowRight size={17} /></button></footer>
    <div className="show-progress" aria-hidden="true">{LESSONS.map(item => <i key={item.id} className={item.id <= state.module ? 'complete' : ''} />)}</div>
    <TransitionBit module={state.module} title={lesson.short} reduced={reduced} />
    {state.pointer && state.pointer.until > Date.now() && <div className="projection-pointer" style={{ left: state.pointer.x * 100 + '%', top: state.pointer.y * 100 + '%' }} aria-label="Destaque do apresentador" />}
    <Overview open={overview} close={() => setOverview(false)} state={state} send={send} />
  </div>;
}

function Controller() { return <PairingGate><PrivateController /></PairingGate>; }
function PrivateController() {
  const live = useLiveSession(true), { state, send } = live, sim = currentSim(state), lesson = LESSONS[state.module], clock = useClock(state, live.serverOffset);
  const [notes, setNotes] = useState<Record<string, string> | null>(null), [overview, setOverview] = useState(false), [tab, setTab] = useState('controls');
  useEffect(() => {
    if (!live.sessionId || !live.canControl) return;
    const controller = new AbortController();
    fetch('/api/sessions/' + live.sessionId + '/notes', { signal: controller.signal, headers: { Authorization: 'Bearer ' + credential(live.sessionId) } }).then(async response => { if (!response.ok) { setNotes(null); return; } const data = await response.json(); setNotes(data); }).catch(() => {});
    return () => controller.abort();
  }, [live.sessionId, live.canControl, state.module, state.stage]);
  if (!live.sessionId || !live.canControl) return <div className="private-page"><span className="live-eyebrow">SYNAPSE // CONTROLE PRIVADO</span><h1>Conecte novamente seu controle.</h1>{live.error && <p role="alert">{live.error}</p>}<p>Use a senha atual da sessão ou gere um novo código na preparação do computador.</p><button className="live-primary" onClick={() => { localStorage.removeItem('synapse-control-' + live.sessionId); sessionStorage.removeItem('synapse-owner-' + live.sessionId); location.reload(); }}>Voltar para entrar com senha</button></div>;
  return <div className="control-app" style={{ '--module-color': lesson.color } as React.CSSProperties}><header><div><span className="live-eyebrow">SYNAPSE // APRESENTADOR</span><h1>{lesson.short}</h1></div><span className={'control-connection ' + live.connection}>{live.connection === 'online' ? <Wifi size={17} /> : <WifiOff size={17} />}{live.connection === 'online' ? 'Conectado' : 'Reconectando'}</span></header>
    {live.error && <p className="control-error" role="alert">{live.error}</p>}
    <div className="private-clocks"><div><span>Total / 120 min</span><strong>{time(clock.total)}</strong></div><div className={clock.module > lesson.minutes * 60_000 ? 'over-budget' : ''}><span>Módulo / {lesson.minutes} min</span><strong>{time(clock.module)}</strong></div><button className="live-icon" aria-label={state.running ? 'Pausar cronômetro' : 'Iniciar cronômetro'} onClick={() => send({ type: 'clock', value: !state.running })}>{state.running ? <Pause size={20} /> : <Play size={20} />}</button></div>
    {clock.module > lesson.minutes * 60_000 && <p className="private-alert">Tempo previsto do módulo atingido. Considere avançar para a conexão seguinte.</p>}
    <div className="control-module-nav"><button onClick={() => send({ type: 'navigate', value: -1 })} disabled={state.module === 0} aria-label="Módulo anterior"><ArrowLeft size={20} /></button><button onClick={() => setOverview(true)}><Grid2X2 size={17} />{state.module > 0 && state.module < 13 ? 'Módulo ' + state.module + ' / 12' : lesson.short}</button><button onClick={() => send({ type: 'navigate', value: 1 })} disabled={state.module === 14} aria-label="Próximo módulo"><ArrowRight size={20} /></button></div>
    <div className="control-stage"><span>ETAPA {state.stage + 1} / 8</span><strong>{STAGES[state.stage]}</strong><div><button disabled={state.stage === 0} onClick={() => send({ type: 'advance', value: -1 })}>Anterior</button><button disabled={state.stage === 7} onClick={() => send({ type: 'advance', value: 1 })}>Próxima etapa<ArrowRight size={16} /></button></div></div>
    <nav className="control-tabs" aria-label="Controle privado"><button aria-pressed={tab === 'controls'} onClick={() => setTab('controls')}>Comandos</button><button aria-pressed={tab === 'notes'} onClick={() => setTab('notes')}>Notas privadas</button><button aria-pressed={tab === 'pointer'} onClick={() => setTab('pointer')}>Destaque</button></nav>
    {tab === 'controls' && <><div className="control-transport"><button onClick={() => send({ type: 'autoplay', value: !state.autoplay })}>{state.autoplay ? <Pause size={20} /> : <Play size={20} />}{state.autoplay ? 'Pausar' : 'Auto-Play'}</button><button onClick={() => send({ type: 'action', key: 'step' })}><ChevronRight size={20} />Um passo</button><button onClick={() => send({ type: 'reset' })}><RotateCcw size={20} />Reiniciar</button><button onClick={() => send({ type: 'reveal' })}><Eye size={20} />{sim.revealed ? 'Ocultar' : 'Revelar'}</button></div><SimControls module={state.module} sim={sim} send={send} />{state.module === 13 && <SimVisual module={13} sim={sim} send={send} />}<button className="live-primary control-stage-mode" aria-pressed={Boolean(state.stageMode)} onClick={() => send({ type: "stageMode", value: !state.stageMode })}><Maximize size={18} />{state.stageMode ? "Mostrar controles no projetor" : "Modo palco no projetor"}</button><Settings state={state} send={send} /></>}
    {tab === 'notes' && <div className="private-notes">{notes ? <>{[['speech', 'Fala sugerida'], ['question', 'Pergunta à turma'], ['expected', 'Resposta esperada'], ['math', 'Explicação matemática'], ['commonMistake', 'Erro comum / limite'], ['nextAction', 'Próxima ação'], ['transition', 'Transição'], ['shortcut', 'Atalho de ritmo'], ['deepening', 'Aprofundamento opcional'], ['pacing', 'Distribuição do tempo']].map(([key, title]) => <section key={key}><h2>{title}</h2><p>{notes[key]}</p></section>)}<button className="live-primary" onClick={() => send({ type: 'stage', value: 5 })}>Ir direto à revelação<ArrowRight size={16} /></button></> : <p>Notas indisponíveis. Reconecte o controle para carregá-las.</p>}</div>}
    {tab === 'pointer' && <div className="pointer-control"><p>Toque na posição que deseja destacar na projeção.</p><button aria-label="Área de destaque do projetor" onPointerDown={event => { const rect = event.currentTarget.getBoundingClientRect(); send({ type: 'pointer', value: { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height } }); }}><span>PROJEÇÃO 16:9</span><strong>{lesson.short}</strong><div>Toque para destacar</div></button></div>}
    <Overview open={overview} close={() => setOverview(false)} state={state} send={send} />
  </div>;
}

export default function LiveApp() { if (location.pathname === '/control') return <Controller />; if (location.pathname === '/setup') return <PairingSetup />; return <PublicStage />; }




