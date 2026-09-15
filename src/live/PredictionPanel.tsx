import { ArrowRight, Boxes, BrainCircuit, Route } from 'lucide-react';
import { mathPrediction } from '../../shared/mathContent';
import type { Command, Sim } from '../../shared/engine';
import { LegoChoices } from './LegoBrick';

export function PredictionPanel({ module, sim, send }: { module: number; sim: Sim; send: (command: Command) => void }) {
  const prediction = mathPrediction(module, sim);
  return <section className="prediction-panel">{module === 1 ? <div className="prediction-bricks"><LegoChoices options={Number(sim.values.options)} /><span>{String(sim.values.options)} tipos de peças · pode repetir · a ordem importa</span></div> : <div className="prediction-symbols"><Boxes size={43} /><span /><Route size={43} /><span /><BrainCircuit size={43} /></div>}<span className="live-eyebrow">ANTES DO RESULTADO, UMA HIPÓTESE</span><h3>{prediction.question}</h3><div className="prediction-options">{prediction.options.map((answer, index) => <button aria-pressed={sim.predictionSelected === index} key={answer} onClick={() => send({ type: 'answer', value: index })}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div><button className="prediction-run" onClick={() => send({ type: 'stage', value: 3 })}>Testar a hipótese<ArrowRight size={17} /></button></section>;
}
