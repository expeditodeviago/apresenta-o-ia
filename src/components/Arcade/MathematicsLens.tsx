import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Lightbulb, RotateCcw, Sigma, Sparkles } from 'lucide-react';
import { ARCADE_CURRICULUM } from '../../data/arcadeCurriculum';
import { usePresentationStore } from '../../store/usePresentationStore';
import { BitMascot } from './BitMascot';

export function MathematicsLens({ act }: { act: number }) {
  const lesson = ARCADE_CURRICULUM[act - 1];
  const addScore = usePresentationStore(s => s.addScore);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  return <section className="math-lens" aria-label="Conexão com matemática discreta">
    <div className="math-lens-summary"><div className="math-icon"><Sigma size={22} /></div><div><span className="arcade-eyebrow">O MOTOR INVISÍVEL</span><h3>{lesson.math}</h3><p>{lesson.connection}</p></div><BitMascot /></div>
    <button className="math-challenge-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={`math-challenge-${act}`}><span><Sparkles size={15} />Desafio da turma<span className="challenge-score">+100 XP</span></span><ChevronDown size={17} style={{ transform: open ? 'rotate(180deg)' : undefined }} /></button>
    {open && <div className="math-challenge" id={`math-challenge-${act}`}><h4>{lesson.challenge}</h4><div className="math-choices">{lesson.choices.map((choice, index) => <button key={choice} disabled={revealed} aria-pressed={answer === index} className={`${answer === index ? 'selected' : ''} ${revealed && index === lesson.answer ? 'correct' : ''} ${revealed && answer === index && index !== lesson.answer ? 'incorrect' : ''}`} onClick={() => setAnswer(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}{revealed && index === lesson.answer && <CheckCircle2 size={17} />}</button>)}</div>{revealed ? <div className="math-feedback" role="status"><Lightbulb size={19} /><p><strong>{answer === lesson.answer ? 'Conexão feita! ' : 'Vamos conectar as peças. '}</strong>{lesson.explanation}</p><button className="arcade-icon" title="Tentar novamente" aria-label="Tentar novamente" onClick={() => { setRevealed(false); setAnswer(null); }}><RotateCcw size={16} /></button></div> : <button className="math-verify" disabled={answer === null} onClick={() => { setRevealed(true); if (answer === lesson.answer) addScore(100); }}>Revelar resposta<ArrowRight size={15} /></button>}</div>}
  </section>;
}
