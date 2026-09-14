import { ArrowRight, Boxes, BrainCircuit, Route } from 'lucide-react';
import { LESSONS } from '../../shared/curriculum';
import type { Command, Sim } from '../../shared/engine';
import { LegoChoices } from './LegoBrick';

export const PREDICTIONS = [
  [], ['9 sequências', '27 sequências', '81 sequências'], ['Largura', 'Profundidade', 'Tanto faz'], ['Ninguém novo entra', 'Quem tem só uma credencial', 'Apenas quem está bloqueado'], ['Somente A → F', 'Somente F → A', 'Nos dois sentidos'], ['Retirar 1', 'Retirar 2', 'Retirar 3'], ['2', '4', '14'], ['Paralelismo maior', 'Nada muda', 'O fluxo fica bloqueado'], ['4 objetos', '5 objetos', '8 objetos'], ['Sempre exatamente iguais', 'Podem variar entre execuções', 'Temperatura garante igualdade'], ['Enviar a resposta', 'Rejeitar a transição', 'Pular a validação'], ['n²', '2ⁿ', 'n!'], ['A autorização', 'Só a capacidade', 'Nenhuma condição'],
];
export function PredictionPanel({ module, sim, send }: { module: number; sim: Sim; send: (command: Command) => void }) {
  return <section className="prediction-panel">{module === 1 ? <div className="prediction-bricks"><LegoChoices /><span>3 tipos de peças · pode repetir · a ordem importa</span></div> : <div className="prediction-symbols"><Boxes size={43} /><span /><Route size={43} /><span /><BrainCircuit size={43} /></div>}<span className="live-eyebrow">ANTES DO RESULTADO, UMA HIPÓTESE</span><h3>{LESSONS[module].prediction}</h3><div className="prediction-options">{PREDICTIONS[module].map((answer, index) => <button aria-pressed={sim.selected === index} key={answer} onClick={() => send({ type: 'answer', value: index })}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div><button className="prediction-run" onClick={() => send({ type: 'stage', value: 3 })}>Testar a hipótese<ArrowRight size={17} /></button></section>;
}
