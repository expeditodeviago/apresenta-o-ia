import { LESSONS } from './curriculum.ts';
import { AI_CHAPTERS } from './aiJourney.ts';

type Seed = [string, string, string];
const SEEDS: Seed[][] = Object.values(AI_CHAPTERS).map(c => [
  [c.short + ' — a ideia central', c.intro, c.variants.join(' ou ')],
  [c.short + ' — primeiro passo', c.steps[0], c.intro],
  [c.short + ' — o mecanismo', c.steps[1], c.variants.join(' em comparação com ')],
  [c.short + ' — o resultado', c.steps[2], c.takeaway],
  [c.short + ' — uma pergunta', c.question, c.takeaway],
  [c.short + ' — o que lembrar', c.takeaway, c.steps[0]],
  [c.short + ' — matemática de apoio', c.mathBridge, c.limit],
  [c.short + ' — limites do exemplo', c.limit, c.steps[2]],
]);
export const NETWORK_GROUPS = ['Tokens', 'Significados', 'Treinamento', 'Rede neural', 'Atenção', 'Contexto', 'Geração', 'Memória', 'Probabilidade', 'Erros e fontes', 'Ferramentas', 'Tudo conectado'];
export type KnowledgeNode = { id: string; title: string; group: number; kind: 'root' | 'hub' | 'idea' | 'card'; text: string; example: string; parent?: string };
export const KNOWLEDGE_NODES: KnowledgeNode[] = [{ id: 'inicio', title: 'SYNAPSE — uma ideia acende outras', group: 0, kind: 'root', text: 'Este “cérebro” é um mapa de conhecimento. Cada ponto é uma nota e cada linha é um link entre ideias. Os pesos de uma rede neural real são parâmetros numéricos aprendidos; este mapa serve para explorar conceitos.', example: 'Comece por uma dúvida e siga as conexões.' }];
export const KNOWLEDGE_EDGES: [string, string][] = [];
const connect = (a: string, b: string) => { if (a !== b && !KNOWLEDGE_EDGES.some(([x, y]) => x === a && y === b || x === b && y === a)) KNOWLEDGE_EDGES.push([a, b]); };
SEEDS.forEach((seeds, groupIndex) => {
  const group = groupIndex + 1, lesson = LESSONS[group], hub = 'grupo-' + group;
  const theme = lesson;
  KNOWLEDGE_NODES.push({ id: hub, title: NETWORK_GROUPS[groupIndex], group, kind: 'hub', text: theme.reveal, example: theme.example, parent: 'inicio' });
  connect('inicio', hub);
  seeds.forEach(([title, text, example], index) => {
    const id = 'ideia-' + group + '-' + index;
    KNOWLEDGE_NODES.push({ id, title, text, example, group, kind: 'idea', parent: hub }); connect(hub, id);
    const cards = [
      { title: 'Exemplo', text: example, example: 'Observe a situação e explique, com suas palavras, como ela se conecta a “' + title + '”.' },
      { title: 'Pergunta', text: 'Como você explicaria “' + title + '” para alguém que nunca estudou IA?', example: 'Comece por esta situação: ' + example + ' Depois confira a explicação na nota principal.' },
      { title: 'Conexão com IA', text: theme.application, example: 'Ponte para o tema: ' + text },
      { title: 'Até onde vale', text: theme.limit, example: 'A ideia que estamos examinando é: ' + text + ' Pense em quais condições esse exemplo depende.' },
    ];
    cards.forEach((card, cardIndex) => { const cardId = id + '-' + cardIndex; KNOWLEDGE_NODES.push({ ...card, id: cardId, title: title + ' — ' + card.title, group, kind: 'card', parent: id }); connect(id, cardId); connect(hub, cardId); });
    connect(id, 'ideia-' + group + '-' + (index + 1) % seeds.length);
  });
});
// Explicit bridges with a teachable relationship, rather than random decorative links.
export const BRIDGES: [number, number, string][] = [
  [1, 2, 'Tokens recebem representações numéricas.'], [2, 4, 'A rede transforma as representações.'],
  [3, 4, 'Treinar ajusta os pesos da rede.'], [4, 5, 'Atenção combina informações dentro de modelos como Transformers.'],
  [5, 6, 'O contexto orienta relações entre palavras.'], [6, 7, 'A geração usa o contexto disponível.'],
  [7, 9, 'Cada escolha pode usar uma distribuição de probabilidades.'], [8, 6, 'O contexto tem capacidade limitada.'],
  [9, 10, 'Ser provável não garante ser verdadeiro.'], [10, 11, 'Ferramentas podem trazer fontes para conferir.'],
  [11, 12, 'O sistema conecta o modelo a ferramentas e permissões.'], [3, 12, 'O uso aplica padrões aprendidos no treinamento.'],
];
for (const [a, b] of BRIDGES) connect('grupo-' + a, 'grupo-' + b);

export const NETWORK_QUESTIONS = [
  { title: 'Por que a IA pode errar?', groups: [1, 6, 9, 12, 4], answer: 'Ela calcula possibilidades a partir do que aprendeu. Uma continuação pode soar ótima e ainda estar errada. Por isso, precisamos conferir as fontes.' },
  { title: 'Como a IA ajuda no dia a dia?', groups: [2, 5, 7, 10, 12], answer: 'Um pedido pode virar pesquisa, comparação e rascunho. As ferramentas executam etapas; você define o objetivo e avalia o resultado.' },
  { title: 'Por que mais informação não basta?', groups: [1, 4, 8, 11, 12], answer: 'Além de reunir dados, é preciso encontrar o que importa, respeitar limites e verificar a qualidade. Conectar bem faz diferença.' },
];
