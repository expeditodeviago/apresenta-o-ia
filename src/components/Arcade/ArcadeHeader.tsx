import { useEffect, useState } from 'react';
import { Blocks, BookOpen, Clock3, Expand, Gamepad2, Grid2X2, Minimize, Pause, PenTool, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { usePresentationStore } from '../../store/usePresentationStore';
import { ARCADE_CHAPTERS, ARCADE_CURRICULUM } from '../../data/arcadeCurriculum';

export function ArcadeHeader({ onOverview }: { onOverview: () => void }) {
  const { currentAct, setAct, soundEnabled, toggleSound, toggleDrawing, togglePresenterNotes, isDrawingEnabled, isPresenterNotesOpen } = usePresentationStore();
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now() - seconds * 1000;
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const present = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); setError(''); }
    catch { setError('Tela cheia indisponível neste navegador.'); }
  };
  return <>
    <header className="arcade-header"><button className="arcade-brand" onClick={() => setAct(1)} aria-label="SYNAPSE, primeiro ato"><span className="brand-symbol"><Blocks size={21} /></span><strong>SYNAPSE<span> //</span></strong></button><span className="header-edition">THE AI & DISCRETE MATH ARCADE</span>
      <div className="arcade-header-tools"><div className={`session-timer ${seconds >= 7200 ? 'overtime' : ''}`}><Clock3 size={14} /><span>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}<span> / 120 min</span></span><button className="arcade-icon" onClick={() => setRunning(!running)} aria-label={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'} title={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'}>{running ? <Pause size={13} /> : <Play size={13} />}</button>{seconds > 0 && <button className="arcade-icon" onClick={() => { setRunning(false); setSeconds(0); }} title="Zerar cronômetro" aria-label="Zerar cronômetro"><RotateCcw size={13} /></button>}</div>
        <button className="arcade-icon" onClick={toggleSound} aria-label={soundEnabled ? 'Desativar Som' : 'Ativar Som'} title={soundEnabled ? 'Desativar som' : 'Ativar som'}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
        <button className="arcade-icon" onClick={toggleDrawing} aria-pressed={isDrawingEnabled} aria-label="Lápis de Desenho" title="Desenhar sobre a apresentação"><PenTool size={17} /></button>
        <button className="arcade-icon" onClick={togglePresenterNotes} aria-pressed={isPresenterNotesOpen} aria-label="Notas do Apresentador" title="Notas do apresentador"><BookOpen size={17} /></button>
        <button className="arcade-present" onClick={present}>{fullscreen ? <Minimize size={15} /> : <Expand size={15} />}<span>{fullscreen ? 'Sair da tela cheia' : 'Apresentar'}</span></button>
      </div>
    </header>{error && <p className="fullscreen-error" role="status">{error}</p>}
    <nav className="arcade-chapters" aria-label="Blocos da apresentação">{ARCADE_CHAPTERS.map((chapter, index) => <button key={chapter.start} onClick={() => setAct(chapter.start)} aria-current={currentAct >= chapter.start && currentAct <= chapter.end ? 'step' : undefined}><span className="chapter-index">0{index + 1}</span><span>{chapter.title}</span><span className="chapter-acts">{String(chapter.start).padStart(2, '0')}–{String(chapter.end).padStart(2, '0')}</span></button>)}<button className="all-acts-button" onClick={onOverview} aria-label="Todos os atos" title="Todos os 13 atos"><Grid2X2 size={18} /></button></nav>
  </>;
}

export function ArcadeBanner() {
  return <section className="arcade-banner"><img src="/images/synapse-arcade.png" alt="Bit em uma fábrica de blocos de vidro com uma árvore de conexões matemáticas" fetchPriority="high" /><div className="arcade-banner-copy"><span className="arcade-eyebrow"><span className="live-dot" />ENGENHARIA DE SOFTWARE / EXPERIÊNCIA INTERATIVA</span><h1>SYNAPSE <span>//</span></h1><p>A matemática invisível.<br /><strong>A inteligência em suas mãos.</strong></p><div className="banner-details"><span><Gamepad2 size={14} />13 experimentos</span><span><Clock3 size={14} />Uma jornada de 2 horas</span></div></div><span className="banner-caption">FIG. 01 / PEÇAS SIMPLES. POSSIBILIDADES INFINITAS.</span></section>;
}
