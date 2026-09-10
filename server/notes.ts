import { LESSONS, STAGES } from '../shared/curriculum.ts';

export function getNotes(module: number, stage: number) {
  const l = LESSONS[module];
  const steps = [l.question, l.example, l.prediction, 'Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.', l.variant, l.reveal, l.application + ' Limite: ' + l.limit, l.conclusion];
  const answers: Record<number, string> = {
    0: 'Não é preciso enumerar tudo: estratégias e restrições ajudam. Na abertura, compare 20⁴ = 160.000 com 10⁸ = 100 milhões. Neste exemplo, a segunda contagem é 625 vezes a primeira. Peça a previsão antes de revelar; não generalize a razão para outras bases e comprimentos.',
    1: '3³ = 27. Uma posição extra multiplica o total por 3, com as demais hipóteses mantidas.',
    2: 'BFS encontra o menor número de arestas: neste labirinto são 6. DFS prioriza o corredor inferior e pode encontrar um caminho mais longo.',
    3: 'Com apenas crachá, E nega e OU permite. Sem bloqueio: (1 ∧ 0) = 0, mas (1 ∨ 0) = 1.',
    4: 'A alcança F na rede inicial, mas F não alcança A em modo direcionado. Tornar as conexões simétricas muda essa resposta.',
    5: 'Com 7 peças, retirar 3 deixa 4 para o adversário. Depois, complemente a retirada dele até 4. Com 4 iniciais não há vitória garantida contra jogo ótimo.',
    6: '(2 + 14) mod 12 = 4. Não confundir o resto do deslocamento com a posição final.',
    7: 'Pesquisar primeiro; verificar e redigir podem acontecer juntos; revisar por último. A aresta Revisar → Pesquisar cria um ciclo.',
    8: '5 objetos em 4 gavetas garantem colisão. Com até 4 ainda pode haver colisão, mas ela não é inevitável.',
    9: 'Não. Frequências flutuam; mais amostras tendem a aproximar proporções teóricas, sem igualdade obrigatória em uma execução.',
    10: 'Enviar no estado inicial é inválido e não deve alterar o estado. A validação precisa ocorrer primeiro.',
    11: 'Entre as famílias mostradas, n! ultrapassa um milhão em n = 10. 2ⁿ ultrapassa em n = 20. A medição é limitada a até 2¹⁶ estados.',
    12: 'Autorize o pedido, mantenha a fonte alcançável, remova o ciclo e use capacidade de pelo menos 3 evidências.',
    13: 'Gabarito: C, A, B, C, B, A. Peça justificativas antes de revelar. Divida cerca de 90 segundos por rodada, reservando um minuto à introdução.',
    14: 'Aceite conexões bem justificadas. Reforce que cada modelo matemático tem hipóteses e não descreve sozinho toda a IA.',
  };
  return {
    heading: l.title, stage: STAGES[stage], speech: steps[stage], math: l.reveal,
    question: l.prediction, expected: answers[module], commonMistake: l.limit,
    transition: l.conclusion, nextAction: steps[Math.min(7, stage + 1)],
    shortcut: 'Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.',
    deepening: module === 1 ? 'Extra: retire a repetição e compare Vⁿ com V!/(V−n)!. Depois retire a importância da ordem.' : module === 7 ? 'Extra: discuta fechamento transitivo, redução transitiva e mais de uma ordenação topológica.' : 'Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.',
    pacing: module > 0 && module < 13 ? '45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.' : module === 0 ? '2min abertura + 2min hipótese + 2min comparação + 2min acordo com a turma = 8min.' : module === 13 ? '1min introdução + 6 rodadas de 90s = 10min.' : '2min síntese + 4min perguntas = 6min.',
  };
}
