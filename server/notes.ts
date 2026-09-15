import { AI_CHAPTERS } from '../shared/aiJourney.ts';
import { LESSONS, STAGES, FORMAL_LESSONS, QUIZ } from '../shared/curriculum.ts';
import { AI_NOTE_STAGES } from '../shared/noteSections.ts';
import { NETWORK_QUESTIONS } from '../shared/knowledge.ts';
import { AI_GUIDES } from './presenterGuides.ts';
import { MATH_GUIDES } from './mathGuides.ts';
import { OPENING_GUIDE, FINALE_GUIDE, QUIZ_EXPLANATIONS } from './specialGuides.ts';

type NotesContext = { quizIndex?: number; variant?: number; networkQuestion?: number };
const pacing = 'Preparação: leia o conceito, os termos e as dúvidas antes da apresentação; não é preciso ler tudo isso em voz alta. Durante a aula, use a fala da etapa atual e a demonstração.\nRitmo sugerido: 45s na etapa 1, 45s na 2, 1min na 3, 2min na 4, 1min na 5, 1min na 6, 1min na 7 e 30s na 8: total de 8min. Reserve as pausas para ouvir respostas, repetir o exemplo e observar o resultado. Não deixe Auto-Play avançar enquanto estiver explicando.';
const sources = 'Google — introdução a modelos de linguagem e Transformers (material técnico, em inglês): https://developers.google.com/machine-learning/crash-course/llm/transformers\nVaswani e colaboradores — Attention Is All You Need (artigo original sobre Transformer): https://arxiv.org/abs/1706.03762\nSu e colaboradores — RoFormer (referência para o aprofundamento sobre rotações): https://arxiv.org/abs/2104.09864\nAs situações, números ilustrativos e procedimentos de clique destas notas foram preparados para os simuladores desta apresentação.';

export function getNotes(module: number, stage: number, mathMode = false, context: NotesContext = {}): Record<string, string> {
  stage = Math.max(0, Math.min(7, Math.floor(stage) || 0));
  if (!LESSONS[module]) throw Error('Módulo de notas inválido.');
  const ai = AI_CHAPTERS[module];
  if (module === 13) {
    const index = Math.max(0, Math.min(QUIZ.length - 1, Math.floor(context.quizIndex || 0)));
    const q = QUIZ[index], answer = String.fromCharCode(65 + q.answer);
    return {
      heading: 'Quiz — pergunta ' + (index + 1) + ' de ' + QUIZ.length, stage: 'Pergunta ' + (index + 1),
      speech: '“Vamos responder e justificar. ' + q.question + '”\nLeia as alternativas: ' + q.options.map((option, i) => String.fromCharCode(65 + i) + ': ' + option).join('; ') + '.\n“Escolham antes de revelar. Quem escolheu A? B? C? Alguém pode explicar o motivo?” Espere a votação. Só depois revele e explique: ' + QUIZ_EXPLANATIONS[index],
      demonstration: '1. Em Comandos, leia a pergunta atual e suas três alternativas.\n2. Peça votação por mãos levantadas. Você pode selecionar a alternativa no controle, mas espere a turma antes de revelar.\n3. Use “Revelar” ou “Um passo” no controle.\n4. Leia a justificativa nas notas e mostre por que as outras alternativas não servem.\n5. Para passar à próxima pergunta, use “Próxima rodada” ou “Um passo” depois da revelação. O botão “Próximo módulo” sai do quiz.\n6. As notas acompanham a pergunta do quiz, independentemente do contador geral de oito etapas.',
      foundations: 'O quiz verifica distinções, não vocabulário decorado: token versus palavra; treinamento versus resposta pronta; contexto versus aparência; variedade versus verdade; histórico versus contexto; citação versus evidência. Peça uma justificativa curta antes de mostrar a explicação. Se a maioria errar, retome o exemplo indicado e faça a pergunta novamente sem constranger quem votou.',
      example: QUIZ_EXPLANATIONS[index],
      glossary: 'Alternativa: uma resposta proposta.\nJustificativa: motivo que apoia a escolha.\nContraexemplo: situação que mostra por que uma regra geral não vale. Uma palavra dividida em vários tokens refuta “toda palavra é um token”.',
      question: q.question, expected: answer + ' — ' + q.options[q.answer] + '.\n' + QUIZ_EXPLANATIONS[index],
      questions: '“Por que a minha alternativa está errada?” Use a comparação específica: ' + QUIZ_EXPLANATIONS[index] + '\n“Isso sempre funciona assim?” Volte ao alcance da afirmação: estamos falando dos mecanismos e exemplos discutidos, sem atribuir o mesmo funcionamento a toda forma de IA.',
      math: 'Não é necessário introduzir uma fórmula nova no quiz. A aprendizagem aparece quando a pessoa explica a distinção. Gabarito para conferência do apresentador: ' + QUIZ.map((item, i) => (i + 1) + ': ' + String.fromCharCode(65 + item.answer)).join(' · ') + '.',
      commonMistake: 'Não revele a resposta antes da votação. Não use “porque a IA disse” como justificativa. Não confunda avançar uma pergunta com sair do módulo. Se o grupo já souber a resposta, peça um exemplo que mostre por que ela é correta.',
      nextAction: index < QUIZ.length - 1 ? 'Depois de explicar a resposta, use “Próxima rodada” no cartão ou “Um passo” no controle para ir à pergunta ' + (index + 2) + '. Leia as novas notas antes de revelar.' : 'Depois de justificar a sexta resposta, use “Próximo módulo” para abrir a rede de conhecimento. Faça uma pausa antes de revelar a rede inteira.',
      transition: '“Essas respostas mostram diferenças que agora conseguimos explicar. Vamos ver como as ideias se conectam num mapa de estudo.”',
      shortcut: 'Leia a pergunta atual, peça uma votação rápida e explique a alternativa correta com o exemplo destas notas. Evite ler todas as dúvidas de apoio. Preserve uma justificativa por pergunta, mesmo se reduzir a discussão.',
      pacing: 'Total: 10min. Use 1min para explicar a dinâmica e cerca de 90s por pergunta: 20s leitura, 20s votação, 40s justificativa e 10s para avançar. Se a discussão crescer, use o roteiro curto sem pular a explicação da resposta.', sources,
    };
  }
  if (ai && mathMode) {
    const g = MATH_GUIDES[module], l = FORMAL_LESSONS[module];
    const speeches = [
      g.example + '\n“É essa situação que nosso experimento vai ajudar a explicar.”',
      '“Vamos traduzir o exemplo para os elementos do painel.”\n' + g.foundations + '\n' + g.glossary,
      '“Antes de executar: ' + l.prediction + '” Espere um palpite e peça o motivo. Se ninguém responder, releia o exemplo completo. Depois explique: ' + g.expected,
      '“Vamos conferir uma alteração por vez. Acompanhem o que muda e o que permanece.”\n' + g.demonstration + '\nAo terminar, diga: ' + g.expected,
      '“Agora vamos comparar com a segunda situação descrita na demonstração. Não mudem vários controles juntos: queremos saber qual mudança produziu o efeito.”\n' + g.reasoning,
      '“Vamos explicar por que o resultado aconteceu.”\n' + g.reasoning + '\nConclua: ' + g.expected,
      '“Como isso se relaciona com a IA?”\n' + ai.mathBridge + '\n' + l.application + '\n“Até onde essa comparação vale?” ' + l.limit,
      '“Como vocês explicariam este resultado usando o exemplo inicial?”\nResposta de apoio: ' + g.expected + '\n' + g.transition,
    ];
    return {
      heading: l.title + ' — matemática opcional', stage: STAGES[stage], speech: speeches[stage],
      foundations: g.foundations, glossary: g.glossary, example: g.example, demonstration: g.demonstration,
      question: l.prediction, expected: g.expected, questions: g.questions,
      math: g.reasoning + '\nPonte com a explicação principal: ' + ai.mathBridge,
      commonMistake: l.limit + '\nOs resultados descritos partem dos valores indicados. Se os controles já foram alterados, use “Reiniciar experimento” e refaça os ajustes do roteiro antes de anunciar o resultado.',
      nextAction: stage === 7 ? 'Abra Comandos e use “Voltar à explicação de IA” para retornar ao capítulo. Se já concluiu também o capítulo principal, use “Próximo módulo”.' : 'Use “Próxima etapa” para ' + STAGES[stage + 1] + '. Para executar o experimento, use os controles específicos da seção Demonstração. Avançar a etapa não substitui clicar nos controles.',
      transition: g.transition, shortcut: g.shortcut, pacing, sources,
    };
  }
  const g = module === 0 ? OPENING_GUIDE : module === 14 ? FINALE_GUIDE : AI_GUIDES[module];
  const titles = module === 0 ? ['O convite', 'Parece humano?', 'Antes da conversa', 'O texto vira números', 'O contexto', 'A resposta em construção', 'Os limites', 'Começar a descoberta'] : module === 14 ? ['As primeiras ideias', 'Conectar as ideias', 'A rede inteira', 'O mapa acende', 'Responder uma pergunta', 'Explorar uma nota', 'Levar o cofre', 'Fechamento e perguntas'] : AI_NOTE_STAGES;
  const variant = context.variant === 1 ? 1 : 0;
  const selectedQuestion = NETWORK_QUESTIONS[Math.max(0, Math.min(2, Math.floor(context.networkQuestion || 0)))];
  return {
    heading: LESSONS[module].title, stage: titles[stage],
    speech: module === 14 && stage === 4 ? 'Pergunta selecionada: “' + selectedQuestion.title + '”\nDiga: “' + selectedQuestion.answer + '”\nUse o exemplo correspondente da seção “Se a turma perguntar”. Aponte as áreas destacadas como relações entre ideias, sem apresentá-las como o percurso real de um modelo neural.' : g.stages[stage],
    foundations: g.foundations, glossary: g.glossary, example: g.example,
    demonstration: (ai ? 'Exemplo selecionado no controle: “' + ai.variants[variant] + '”. Os passos abaixo permitem comparar os dois.\n' : '') + g.demonstration,
    question: ai?.question || (module === 0 ? 'O que acontece entre a pergunta que escrevemos e a resposta que recebemos?' : 'Qual conexão ajuda a explicar uma dúvida que você tinha sobre IA?'),
    expected: g.expected + (ai ? '\nIdeia central: ' + ai.takeaway : ''), questions: g.questions,
    math: ai ? ai.mathBridge + '\nSe quiser abrir esse aprofundamento, use “Explorar a matemática” em Comandos. As notas mudam para outro roteiro, com a conta resolvida e os cliques do experimento. Não é necessário introduzir esse conteúdo para explicar o capítulo principal.' : module === 0 ? 'Nesta abertura, basta distinguir treinamento, representação e geração. Não apresente fórmulas sem necessidade: cada aprofundamento posterior tem um roteiro próprio com exemplo e conta resolvida.' : 'Neste mapa, vértices são notas e arestas são ligações. Uma ligação organiza o estudo, mas não comprova uma afirmação. Diferentemente de uma rede neural treinada, este mapa não ajusta pesos para gerar respostas.',
    commonMistake: (ai?.limit || (module === 0 ? 'Não use a aparência humana do texto como prova de consciência. Não apresente estas animações como respostas geradas ao vivo.' : 'Não chame as notas de neurônios reais nem as linhas de pesos aprendidos. O pacote é material de estudo, não um modelo de IA.')) + '\nSe você não souber responder uma dúvida, diga: “Não tenho base para afirmar isso agora; vou registrar e conferir uma fonte.” Isso é melhor do que improvisar uma explicação factual.',
    nextAction: stage < 7 ? 'Use “Próxima etapa” para “' + titles[stage + 1] + '”. Leia a fala da nova etapa antes de avançar outra vez. Os botões para trocar exemplos ficam em Comandos; a seção Demonstração explica o que observar.' : module === 14 ? 'Abra espaço para perguntas. Use os exemplos de dúvidas destas notas e registre o que exigir pesquisa posterior.' : 'Use “Próximo módulo” depois da síntese. Antes de avançar, leia a fala de transição abaixo para conectar os assuntos.',
    transition: g.transition, shortcut: g.shortcut,
    pacing: module === 14 ? 'Total: 6min. Reserve 2min para revelar o mapa e explicar a diferença entre notas e rede neural; use os outros 4min para uma pergunta preparada, o convite ao download e as perguntas da turma. Faça uma pausa de alguns segundos ao revelar a rede inteira. A leitura de todo o material de apoio é preparação, não fala obrigatória.' : pacing,
    sources,
  };
}
