import { FORMAL_LESSONS } from './curriculum.ts';
import { createSim, growth, minimax, missionChecks, shortestPath, topologicalLayers, TRANSITIONS } from './engine.ts';
import type { Sim } from './engine.ts';

export type Prediction = { question: string; options: string[]; answer: number; why: string; scenario: string };
const format = (n: number | bigint) => n.toLocaleString('pt-BR');

// Question, choices and explanation always describe the same simulation snapshot.
export function mathPrediction(module: number, sim = createSim(module)): Prediction {
  const v = sim.values;
  switch (module) {
    case 1: {
      const choices = Number(v.options), length = Number(v.length), total = choices ** length;
      return { question: `Com ${choices} opções em cada uma de ${length} posições, quantas sequências existem?`, options: [format(total / choices) + ' sequências', format(total) + ' sequências', format(total * choices) + ' sequências'], answer: 1, why: `${Array(length).fill(choices).join(' × ')} = ${format(total)}. Cada posição multiplica o total por ${choices}; a ordem importa e pode repetir.`, scenario: `${choices} tipos de peças, ${length} posições, com repetição e ordem relevante.` };
    }
    case 2: return { question: 'Qual estratégia garante a saída com menos passos neste labirinto?', options: ['Olhar por perto, em camadas (BFS)', 'Seguir um corredor até o fim (DFS)', 'As duas sempre garantem o menor caminho'], answer: 0, why: 'BFS encontra uma rota de 6 arestas. DFS pode encontrar primeiro uma rota mais longa. Isso vale aqui porque cada passagem tem o mesmo custo.', scenario: 'Compare as estratégias no mesmo labirinto, da entrada I até a saída S.' };
    case 3: return { question: 'Sem bloqueio de segurança, quem passa a entrar ao trocar E por OU?', options: ['Ninguém novo entra', 'Quem tem apenas uma das duas credenciais', 'Apenas quem está bloqueado'], answer: 1, why: 'E exige crachá e autorização. OU permite só uma das credenciais. O bloqueio continua impedindo a entrada nos dois casos.', scenario: 'Compare a mesma pessoa, com crachá e sem autorização, primeiro com E e depois com OU.' };
    case 4: {
      const a = String(v.source), b = String(v.target), directed = Boolean(v.directed);
      const forward = shortestPath(sim.edges, a, b, directed).length > 0, back = shortestPath(sim.edges, b, a, directed).length > 0;
      return { question: `Na rede atual, há caminho de ${a} até ${b} e de ${b} até ${a}?`, options: ['Nos dois sentidos', 'Em apenas um sentido', 'Em nenhum sentido'], answer: forward && back ? 0 : forward || back ? 1 : 2, why: `${a} → ${b}: ${forward ? 'há caminho' : 'não há caminho'}. ${b} → ${a}: ${back ? 'há caminho' : 'não há caminho'}. Um caminho pode passar por várias ligações; não precisa ser uma aresta direta.`, scenario: `Origem ${a}, destino ${b}; ligações ${directed ? 'direcionadas' : 'nos dois sentidos'}. A pergunta usa as conexões atuais.` };
    }
    case 5: {
      const n = Number(v.stones), result = minimax(n), options = Array.from({ length: Math.min(n, 3) }, (_, i) => 'Retirar ' + (i + 1));
      options.push(n ? 'Nenhuma retirada garante vitória' : 'A partida já terminou');
      return { question: n ? `Restam ${n} peças. Qual escolha garante vitória contra um adversário que joga perfeitamente?` : 'Sem peças restantes, ainda existe uma próxima jogada?', options, answer: result.winning ? result.move - 1 : options.length - 1, why: n === 0 ? 'A última peça já foi retirada; a partida acabou.' : result.winning ? `Retirar ${result.move} deixa ${n - result.move}. ${n - result.move === 0 ? 'Você tira a última peça e vence.' : 'Depois, responda para que as duas retiradas somem 4. Assim você preserva a vantagem.'}` : 'Um múltiplo de 4 é uma posição perdedora contra jogo perfeito. Qualquer retirada entrega ao adversário uma resposta que mantém o padrão.', scenario: `Restam ${n} peças. É permitido retirar de 1 a 3, sem ultrapassar o que resta. Quem retira a última vence.` };
    }
    case 6: {
      const start = Number(v.position), shift = Number(v.offset), mod = Number(v.modulus), end = (start + shift) % mod;
      return { question: `Partindo de ${start}, avance ${shift} em um relógio de ${mod} posições. Onde termina?`, options: [String((end + mod - 1) % mod), String(end), String((end + 1) % mod)], answer: 1, why: `(${start} + ${shift}) mod ${mod} = ${end}. As voltas completas não alteram a posição final.`, scenario: `Posição inicial ${start}; deslocamento ${shift}; ${mod} posições numeradas de 0 a ${mod - 1}.` };
    }
    case 7: {
      const order = topologicalLayers(sim.edges);
      return { question: 'Com as dependências atuais, é possível concluir todas as tarefas?', options: ['Sim, todas podem começar juntas', 'Sim, respeitando os grupos de dependências', 'Não, existe um ciclo de dependências'], answer: order.cycle ? 2 : sim.edges.length ? 1 : 0, why: order.cycle ? 'O ciclo impede concluir todas as tarefas: há tarefas que esperam umas pelas outras. Remova a dependência que fecha o círculo.' : 'Grupos liberados em ordem: ' + order.layers.map(layer => layer.join(' e ')).join(' → ') + '. No mesmo grupo, as tarefas podem começar juntas.', scenario: 'P = pesquisar; V = verificar; E = escrever; R = revisar. Cada seta indica uma tarefa que precisa terminar antes da outra.' };
    }
    case 8: {
      const drawers = Number(v.drawers);
      return { question: `Com ${drawers} gavetas, qual é o primeiro número de objetos que garante alguma gaveta compartilhada?`, options: [drawers, drawers + 1, drawers + 2].map(n => n + ' objetos'), answer: 1, why: `Com ${drawers + 1} objetos em ${drawers} gavetas, pelo menos dois ficam juntos. Com ${drawers} ou menos, compartilhar é possível, mas não obrigatório.`, scenario: `${v.objects} objetos para distribuir em ${drawers} gavetas. Cada objeto vai para exatamente uma gaveta.` };
    }
    case 9: return { question: 'Em 100 escolhas, as frequências têm de ser exatamente iguais às probabilidades?', options: ['Sim, exatamente', 'Não, a amostragem pode produzir diferenças', 'Sim, se a temperatura for maior'], answer: 1, why: 'Probabilidade descreve a chance de cada escolha. Frequência conta o que saiu; ela pode diferir em 100 amostras. A temperatura redistribui chances, sem obrigar igualdade.', scenario: `Quatro continuações ilustrativas, temperatura ${v.temperature}. Compare as chances com as frequências observadas.` };
    case 10: {
      const next = TRANSITIONS[sim.status]?.enviar;
      return { question: `No estado “${sim.status}”, o que deve acontecer ao receber o evento “enviar”?`, options: ['Enviar a resposta e ir para respondido', 'Recusar o evento e manter o estado atual', 'Concluir todo o fluxo imediatamente'], answer: next ? 0 : 1, why: next ? 'A solicitação já está validada. O evento enviar é permitido e leva ao estado respondido; concluir é uma etapa posterior.' : `Enviar não é permitido no estado ${sim.status}. O fluxo registra a transição inválida e permanece onde estava.`, scenario: `Estado atual: ${sim.status}. Compare um evento permitido com outro que não está liberado.` };
    }
    case 11: return { question: 'Aumentando n de 1 em diante, qual destas famílias ultrapassa primeiro um milhão?', options: ['n²', '2ⁿ', 'n!'], answer: 2, why: '10! = 3.628.800; 2²⁰ = 1.048.576; 1001² = 1.002.001. O fatorial passa primeiro. Isso compara contagens, não o tempo medido.', scenario: `Para n = ${v.n}: n = ${format(growth(Number(v.n), 'linear'))}; n² = ${format(growth(Number(v.n), 'quadratic'))}; 2ⁿ = ${format(growth(Number(v.n), 'exponential'))}; n! = ${format(growth(Number(v.n), 'factorial'))}.` };
    case 12: {
      const checks = missionChecks(sim), first = checks.findIndex(c => !c.passed);
      return { question: 'Com os ajustes atuais, onde a próxima execução da missão vai parar?', options: [...checks.map(c => c.label), 'Nenhum bloqueio: conclui a missão'], answer: first < 0 ? 4 : first, why: first < 0 ? 'As quatro condições estão satisfeitas; a execução pode concluir.' : `A primeira condição não satisfeita é ${checks[first].label}. A execução para nela, mesmo que também existam problemas posteriores.`, scenario: checks.map(c => c.label + ': ' + (c.passed ? 'satisfeita' : 'não satisfeita')).join(' · ') };
    }
    default: throw Error('Experimento matemático inválido');
  }
}

export function mathLesson(module: number, sim?: Sim) {
  const prediction = mathPrediction(module, sim);
  return { ...FORMAL_LESSONS[module], question: prediction.question, prediction: prediction.question, example: prediction.scenario, reveal: prediction.why };
}
