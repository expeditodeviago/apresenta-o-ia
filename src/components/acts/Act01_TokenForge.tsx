import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Braces, Cpu, Flame, Layers, Pause, Play, RotateCcw } from 'lucide-react';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireStarBurst } from '../../utils/confetti';

const PRESETS = [
  { label: 'Português', text: 'Inteligência artificial transforma o mundo.' },
  { label: 'English', text: 'Artificial intelligence transforms the world.' },
  { label: 'Código', text: 'const futuro = humano + inteligencia;' },
];
const COLORS = ['#77cbea', '#f3bd67', '#7ad5ba', '#c3a4ec', '#f293a9'];
type Tokenizer = typeof import('gpt-tokenizer/encoding/cl100k_base');

export const Act01_TokenForge: React.FC = () => {
  const addScore = usePresentationStore(s => s.addScore);
  const [inputText, setInputText] = useState('Inteligência artificial transforma o mundo.');
  const [temperature, setTemperature] = useState(.7);
  const [tokenizer, setTokenizer] = useState<Tokenizer | null>(null);
  const [error, setError] = useState(false);
  const [showIds, setShowIds] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [lastChoice, setLastChoice] = useState('');
  const reduceMotion = useReducedMotion();
  const demoStep = useRef(0);

  useEffect(() => {
    let active = true;
    import('gpt-tokenizer/encoding/cl100k_base').then(api => { if (active) setTokenizer(api); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);

  const tokenIds = useMemo(() => tokenizer?.encode(inputText, { disallowedSpecial: new Set() }) ?? [], [inputText, tokenizer]);
  const candidates = useMemo(() => {
    const words = ['aprende', 'conecta', 'imagina', 'reinventa'];
    const logits = [2.7, 2.05, 1.6, 1.2];
    const weights = logits.map(logit => Math.exp((logit - logits[0]) / temperature));
    const total = weights.reduce((a, b) => a + b, 0);
    const probabilities = weights.map(weight => Math.floor(weight / total * 100));
    probabilities[0] += 100 - probabilities.reduce((a, b) => a + b, 0);
    return words.map((word, i) => ({ word, prob: probabilities[i], color: COLORS[i] }));
  }, [temperature]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      if (demoStep.current < PRESETS.length) {
        setInputText(PRESETS[demoStep.current].text);
        demoStep.current += 1;
        arcadeAudio.playLegoSnap();
      } else {
        setIsAutoPlaying(false);
        demoStep.current = 0;
      }
    }, 1400);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const chooseCandidate = (word: string) => {
    setIsAutoPlaying(false);
    setInputText(previous => (previous.trimEnd() + ' ' + word).slice(0, 1000));
    setLastChoice(word);
    arcadeAudio.playLegoSnap();
    addScore(150);
    if (!reduceMotion) fireStarBurst(.68, .6);
  };
  const reset = () => {
    setInputText(PRESETS[0].text);
    setTemperature(.7);
    setIsAutoPlaying(false);
    setLastChoice('');
    demoStep.current = 0;
  };

  return <div className="token-workbench">
    <div className="token-main">
      <div className="workbench-label"><label htmlFor="token-input" className="flex items-center gap-2"><Cpu size={14} />O que vamos transformar?</label><small>CL100K_BASE · BPE</small></div>
      <div className="token-input-wrap">
        <textarea id="token-input" value={inputText} maxLength={1000} spellCheck={false} onChange={event => { setInputText(event.target.value); setIsAutoPlaying(false); }} placeholder="Uma ideia começa com algumas palavras..." />
        <div className="token-input-footer"><span>Texto de entrada</span><span>{inputText.length} / 1.000 caracteres</span><button className="token-reset" onClick={reset} aria-label="Reiniciar forja" title="Reiniciar experimento"><RotateCcw size={13} /></button></div>
      </div>
      <div className="token-presets"><span>EXEMPLOS</span>{PRESETS.map(preset => <button key={preset.label} onClick={() => { setInputText(preset.text); setIsAutoPlaying(false); arcadeAudio.playClick(); }}>{preset.label}</button>)}</div>
      <div className="workbench-label"><span><Layers size={14} />Peças de linguagem</span><div className="token-display-tabs" role="group" aria-label="Exibição dos tokens"><button onClick={() => setShowIds(false)} aria-pressed={!showIds}>Tokens</button><button onClick={() => setShowIds(true)} aria-pressed={showIds}><Braces size={11} className="inline mr-1" />IDs</button></div></div>
      <div className="token-conveyor" aria-label="Tokens gerados" tabIndex={0}>
        {tokenIds.map((id, index) => {
          const fragment = tokenizer!.decode([id]);
          // Some Unicode characters span several byte tokens; retain each real ID.
          const label = fragment.includes('\uFFFD') ? 'bytes' : fragment.replace(/ /g, '·').replace(/\n/g, '↵').replace(/\t/g, '⇥');
          return <motion.div key={index + '-' + id} className="token-block" initial={reduceMotion ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 18, stiffness: 240 }} style={{ '--token-color': COLORS[index % COLORS.length] } as React.CSSProperties} title={'Token ' + (index + 1) + ' · ID ' + id + (label === 'bytes' ? ' · Fragmento de bytes Unicode' : '')}><strong>{showIds ? id : label || '∅'}</strong><small>{showIds ? 'TOKEN ' + String(index + 1).padStart(2, '0') : '#' + id}</small></motion.div>;
        })}
        {tokenIds.length === 0 && <p className="empty-tokens" role="status">{error ? 'Não foi possível carregar o tokenizador. Recarregue a página.' : tokenizer ? 'O próximo experimento começa com seu texto.' : 'Preparando o vocabulário...'}</p>}
      </div>
      <div className="token-stats" aria-live="polite"><span><strong>{tokenIds.length}</strong>tokens</span><span><strong>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</strong>palavras</span><span><strong>{tokenIds.length ? (inputText.length / tokenIds.length).toFixed(1) : '0'}</strong>caracteres / token</span></div>
    </div>
    <aside className="token-side" aria-label="Simulação de probabilidade">
      <div className="token-side-title"><h3>A próxima possibilidade</h3><span className="simulation-badge">SIMULAÇÃO</span></div>
      <p>Uma distribuição ilustrativa. Os candidatos não são previsões de um modelo conectado.</p>
      <label htmlFor="token-temperature" className="temperature-label"><span><Flame size={13} />Temperatura</span><output>{temperature.toFixed(1)}</output></label>
      <input id="token-temperature" type="range" min=".1" max="1.5" step=".1" value={temperature} onChange={event => setTemperature(Number(event.target.value))} />
      <div className="temperature-extremes"><span>Mais previsível</span><span>Mais variedade</span></div>
      <div className="candidate-list">{candidates.map(candidate => <button key={candidate.word} onClick={() => chooseCandidate(candidate.word)} title={'Acrescentar ' + candidate.word} style={{ '--candidate-color': candidate.color } as React.CSSProperties}><i style={{ width: candidate.prob + '%' }} /><span>{candidate.word}</span><span>{candidate.prob}%<ArrowRight size={12} /></span></button>)}</div>
      <button className="token-autoplay tactile-btn" onClick={() => { if (!isAutoPlaying) demoStep.current = 0; setIsAutoPlaying(!isAutoPlaying); }}>{isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}{isAutoPlaying ? 'Pausar demonstração' : 'Iniciar demonstração'}</button>
      <p className="token-state" role="status">{lastChoice ? 'Adicionado: ' + lastChoice + ' · +150 XP' : 'Vocabulário real. Possibilidades para explorar.'}</p>
    </aside>
  </div>;
};
