import { LESSONS } from './curriculum.ts';

type Seed = [string, string, string];
// Each idea has a concrete example. The vault and the projected graph share this source.
const SEEDS: Seed[][] = [
  [
    ['Uma escolha', 'Escolher é separar uma possibilidade das outras.', 'Escolher a primeira peça de uma montagem.'],
    ['A ordem importa', 'Usar as mesmas peças em outra ordem pode mudar o resultado.', 'AB e BA são duas sequências diferentes.'],
    ['Pode repetir', 'Permitir repetição mantém as opções disponíveis em cada posição.', 'Uma senha pode ter o mesmo número mais de uma vez.'],
    ['Mais uma posição', 'Uma posição extra abre uma escolha para cada sequência que já existia.', 'De três peças com três cores para quatro peças: o total passa de 27 para 81.'],
    ['Multiplicar opções', 'Quando cada etapa tem a mesma quantidade de opções, multiplicamos essas quantidades.', 'Três camisetas e duas calças permitem seis pares.'],
    ['Vocabulário', 'Um conjunto de peças pode servir de base para muitas sequências.', 'Poucas letras formam muitas palavras.'],
    ['Pedaços de texto', 'Um token é uma unidade de texto processada pelo modelo. Pode ser uma palavra ou parte dela.', 'Uma palavra comprida pode ser dividida em vários tokens.'],
    ['Restrições ajudam', 'Uma regra pode reduzir o conjunto de escolhas permitidas.', 'Exigir uma peça azul elimina as sequências sem azul.'],
  ],
  [
    ['Ponto de partida', 'Uma busca começa com uma situação inicial e um objetivo.', 'Entrar no labirinto e procurar a saída.'],
    ['Explorar por perto', 'A busca em largura visita primeiro os lugares a menos passos do início.', 'Verificar todas as portas próximas antes de ir para o andar seguinte.'],
    ['Ir até o fim', 'A busca em profundidade segue um ramo antes de voltar a outras opções.', 'Seguir um corredor até encontrar uma saída ou um bloqueio.'],
    ['Voltar e tentar', 'Voltar permite abandonar uma escolha e explorar outra.', 'Uma rua está fechada; você retorna ao cruzamento anterior.'],
    ['Guardar o caminho', 'Lembrar a sequência de passos ajuda a explicar como se chegou ao resultado.', 'Anotar as ruas percorridas para voltar ao hotel.'],
    ['Evitar repetição', 'Marcar os lugares visitados evita explorar a mesma situação sem necessidade.', 'Não abrir de novo uma gaveta que você já procurou.'],
    ['Caminho mais curto', 'Menos passos é um critério possível para comparar rotas.', 'Entre duas rotas com o mesmo custo por trecho, escolher a que tem menos trechos.'],
    ['Planejar antes', 'Comparar caminhos pode economizar ações no mundo real.', 'Um robô pode procurar uma rota antes de começar a se mover.'],
  ],
  [
    ['As duas condições', 'A regra E exige que as duas condições sejam verdadeiras.', 'Ter ingresso e documento para entrar.'],
    ['Pelo menos uma', 'A regra OU aceita uma condição, a outra ou ambas.', 'Pagar com cartão ou dinheiro.'],
    ['Uma exceção', 'Uma condição de bloqueio pode impedir uma ação que seria permitida.', 'O ingresso existe, mas foi cancelado.'],
    ['Permissão', 'Ter capacidade para fazer algo é diferente de ter autorização.', 'Um assistente consegue redigir um email, mas precisa de permissão para enviá-lo.'],
    ['Testar a regra', 'Casos concretos mostram como uma regra se comporta.', 'Testar a porta com só o documento e depois com só o ingresso.'],
    ['Contraexemplo', 'Um caso que quebra uma afirmação geral mostra que ela precisa mudar.', 'Um único animal que não seja gato derruba a frase “todo animal é gato”.'],
    ['Dados corretos', 'Uma regra depende das informações usadas para decidir.', 'Um cadastro desatualizado pode negar uma entrada válida.'],
    ['Revisar condições', 'Pequenas mudanças no texto de uma regra podem mudar suas consequências.', 'Trocar E por OU numa regra de acesso.'],
  ],
  [
    ['Uma nota', 'Uma nota guarda uma ideia que pode ser conectada a outras.', 'Uma página sobre receitas de pão.'],
    ['Um link', 'Um link cria uma ligação explícita entre duas notas.', 'A nota sobre pão aponta para a nota sobre fermento.'],
    ['Vários caminhos', 'Podemos chegar à mesma ideia por sequências diferentes de links.', 'Chegar a “energia” a partir de alimentação ou de eletricidade.'],
    ['Mão única', 'Uma ligação pode existir só em um sentido.', 'Você segue uma pessoa que não segue você de volta.'],
    ['Ideias vizinhas', 'Ideias relacionadas podem ser exploradas juntas.', 'Uma nota sobre chuva liga clima, guarda-chuva e previsão.'],
    ['Fonte da informação', 'Guardar a origem ajuda a conferir uma afirmação.', 'Ligar uma anotação ao documento em que ela foi encontrada.'],
    ['Grafo do Obsidian', 'No grafo do Obsidian, pontos representam notas e linhas representam links.', 'Abrir uma ideia e ver as outras notas que se ligam a ela.'],
    ['Conhecimento conectado', 'Links tornam uma coleção de notas navegável.', 'Partir de uma dúvida e descobrir assuntos que você não tinha pensado em procurar.'],
  ],
  [
    ['Pensar adiante', 'Uma boa decisão considera o que pode acontecer depois.', 'Guardar uma peça para conseguir completar a montagem.'],
    ['Ganho imediato', 'A maior recompensa agora pode atrapalhar a próxima etapa.', 'Pegar três peças e deixar uma posição favorável para o adversário.'],
    ['Resposta do outro', 'Em um jogo, a consequência depende também da próxima jogada do adversário.', 'Imaginar o que o outro jogador faria se você retirasse duas peças.'],
    ['Árvore de decisões', 'Cada escolha abre novos caminhos possíveis.', 'Desenhar as opções de retirar uma, duas ou três peças.'],
    ['Posição favorável', 'Uma situação pode oferecer uma vitória garantida se as próximas jogadas forem corretas.', 'Deixar quatro peças ao adversário no jogo apresentado.'],
    ['Jogar ao acaso', 'Uma escolha aleatória não compara necessariamente as consequências.', 'Sortear quantas peças retirar.'],
    ['Escolha informada', 'Usar um modelo do jogo permite comparar as opções.', 'Testar as respostas possíveis antes de escolher uma retirada.'],
    ['Mudar as regras', 'Uma estratégia depende das regras do problema.', 'Se perder quem tirar a última peça, é preciso rever a estratégia.'],
  ],
  [
    ['Dar uma volta', 'Um ciclo retorna a uma posição conhecida.', 'Depois do domingo vem outra segunda-feira.'],
    ['O que sobra', 'O resto mostra quanto fica depois das voltas completas.', 'Quatorze horas têm uma volta de doze horas e mais duas.'],
    ['Lugar inicial', 'A posição final depende de onde começamos.', 'Avançar duas casas a partir da casa cinco leva à casa sete.'],
    ['Quanto avançar', 'O deslocamento descreve o movimento a partir do início.', 'Andar quatorze horas num relógio que marca duas.'],
    ['Padrões repetidos', 'Uma estrutura periódica reaparece em intervalos.', 'Os dias da semana se repetem a cada sete dias.'],
    ['Ordem das palavras', 'Trocar a posição das palavras pode mudar o sentido.', '“O cachorro mordeu o homem” e “o homem mordeu o cachorro”.'],
    ['Informação de posição', 'Um modelo de linguagem precisa representar a posição dos elementos da sequência.', 'Distinguir qual palavra veio antes e qual veio depois.'],
    ['Rotações na IA', 'Alguns modelos usam rotações numéricas para representar relações de posição.', 'RoPE é uma técnica de posição; o relógio ajuda apenas a visualizar a ideia de rotação.'],
  ],
  [
    ['Primeiro passo', 'Uma tarefa sem pendências pode começar.', 'Pesquisar as fontes antes de escrever a conclusão.'],
    ['Esperar uma tarefa', 'Uma dependência indica o que precisa terminar antes.', 'Esperar o bolo assar antes de decorar.'],
    ['Trabalhar junto', 'Tarefas independentes podem acontecer ao mesmo tempo.', 'Uma pessoa confere as fontes enquanto outra redige um rascunho.'],
    ['Revisar por último', 'Uma etapa final pode reunir os resultados das anteriores.', 'Conferir o texto e as fontes antes de entregar o trabalho.'],
    ['Espera em círculo', 'Um ciclo de dependências pode impedir o início do fluxo.', 'Ana espera Bruno, que espera Carla, que espera Ana.'],
    ['Dividir um pedido', 'Separar um trabalho em etapas ajuda a organizar sua execução.', 'Pesquisar, escrever, conferir e entregar uma resposta.'],
    ['Agente de software', 'Um agente pode escolher e executar ações para cumprir um objetivo dentro de limites.', 'Um assistente consulta uma ferramenta e usa o resultado no próximo passo.'],
    ['Coordenar a equipe', 'A organização das tarefas importa tanto quanto cada tarefa isolada.', 'Evitar que dois integrantes esperem indefinidamente um pelo outro.'],
  ],
  [
    ['Espaço disponível', 'Uma capacidade limitada restringe como podemos distribuir objetos.', 'Quatro gavetas disponíveis para guardar celulares.'],
    ['Mais objetos', 'Se há mais objetos do que gavetas, alguma gaveta é compartilhada.', 'Cinco celulares precisam ocupar quatro gavetas.'],
    ['Compartilhar lugar', 'Uma colisão significa que dois elementos recebem o mesmo destino.', 'Dois nomes recebem o mesmo código curto.'],
    ['Código curto', 'Um hash transforma uma entrada em um código de tamanho limitado.', 'Usar um código para ajudar a organizar registros num sistema.'],
    ['Comparar de verdade', 'Um código igual não prova que os dados originais sejam iguais.', 'Conferir o conteúdo quando dois registros têm o mesmo hash.'],
    ['Distribuir melhor', 'Uma boa distribuição pode diminuir concentrações, dentro da capacidade disponível.', 'Espalhar objetos pelas gavetas em vez de encher só a primeira.'],
    ['Limite inevitável', 'Alguns limites não desaparecem com uma estratégia melhor.', 'Nenhuma organização coloca cinco objetos em quatro gavetas mantendo todos separados.'],
    ['Cabem as evidências', 'Uma resposta precisa de espaço para considerar as informações necessárias.', 'Escolher quais trechos de documentos cabem no contexto enviado a um modelo.'],
  ],
  [
    ['A opção favorita', 'Uma probabilidade maior indica mais chance, não certeza.', 'A previsão aponta maior chance de chuva, mas o dia pode ficar seco.'],
    ['Outras possibilidades', 'Vários resultados podem continuar possíveis ao mesmo tempo.', '“Hoje eu quero” pode continuar com “dormir”, “viajar” ou “estudar”.'],
    ['Tentar de novo', 'Uma nova amostra pode produzir outro resultado.', 'Lançar o mesmo dado outra vez.'],
    ['Contar resultados', 'A frequência registra o que aconteceu nas tentativas observadas.', 'Contar quantas vezes cada face apareceu em cem lançamentos.'],
    ['Temperatura', 'A temperatura redistribui a concentração de probabilidade entre opções.', 'Na simulação, aumentar a temperatura dá mais espaço às alternativas menos favoritas.'],
    ['Próximo pedaço', 'Na geração de texto, o modelo calcula possibilidades para o próximo token.', 'Uma continuação é escolhida e passa a fazer parte do contexto da próxima escolha.'],
    ['Plausível e verdadeiro', 'Um texto natural pode conter uma informação falsa.', 'Uma resposta inventa uma data com a mesma fluidez de uma resposta correta.'],
    ['Conferir a resposta', 'Comparar com fontes e testes ajuda a avaliar o resultado.', 'Abrir a fonte citada e conferir se ela sustenta a afirmação.'],
  ],
  [
    ['Situação atual', 'O estado representa em que etapa um processo está.', 'Um pedido de comida está em preparo.'],
    ['Uma ação chega', 'Um evento pode solicitar uma mudança de etapa.', 'A cozinha avisa que o pedido está pronto.'],
    ['Próxima etapa', 'Uma transição muda o estado quando a regra permite.', 'Passar de pronto para saiu para entrega.'],
    ['Hora errada', 'Uma ação pode ser válida em uma etapa e inválida em outra.', 'Marcar um pedido como entregue antes de recebê-lo.'],
    ['Corrigir e voltar', 'Um fluxo pode prever revisão em caso de problema.', 'Corrigir um endereço e validar o pedido novamente.'],
    ['Terminar uma tarefa', 'Um estado final sinaliza que o processo foi concluído.', 'A entrega foi confirmada e o atendimento pode ser encerrado.'],
    ['Histórico de ações', 'Um registro das etapas ajuda a entender o que aconteceu.', 'Consultar quando o pedido foi confirmado, preparado e entregue.'],
    ['Conversa organizada', 'Uma aplicação pode combinar linguagem livre com etapas controladas.', 'A IA conversa com o cliente enquanto o software controla o andamento do pedido.'],
  ],
  [
    ['Um pouco maior', 'Aumentar a entrada pode mudar muito o custo de um problema.', 'Organizar uma fila de três pessoas é bem diferente de explorar todas as ordens de uma turma.'],
    ['Crescer em linha', 'Num crescimento linear, dobrar a entrada dobra a contagem representada.', 'Verificar uma vez cada nome de uma lista.'],
    ['Comparar pares', 'Comparações entre pares podem crescer como o quadrado da quantidade.', 'Comparar cada item de uma lista com cada item de outra lista do mesmo tamanho.'],
    ['Dobrar caminhos', 'Uma escolha entre duas opções repetida muitas vezes gera crescimento exponencial.', 'Para cada novo interruptor, dobram as configurações de ligado e desligado.'],
    ['Todas as ordens', 'O fatorial conta ordens possíveis de elementos distintos.', 'Dez pessoas podem formar 3.628.800 filas diferentes.'],
    ['Evitar tentar tudo', 'Um bom método pode explorar apenas parte do espaço de possibilidades.', 'Descartar cedo uma rota que já viola uma regra.'],
    ['Medir com cuidado', 'Contar possibilidades e medir tempo são coisas diferentes.', 'Uma operação pode custar tempos diferentes em dois computadores.'],
    ['Limite de tempo', 'Uma solução prática precisa respeitar o tempo e os recursos disponíveis.', 'Um aplicativo de rotas precisa responder antes de você passar pelo cruzamento.'],
  ],
  [
    ['Rede neural', 'Uma rede neural combina unidades numéricas conectadas em camadas para transformar entradas em saídas.', 'Uma rede pode aprender padrões de imagens a partir de exemplos.'],
    ['Neurônio artificial', 'Uma unidade combina entradas com pesos e aplica uma função para produzir um valor.', 'Uma unidade recebe vários números, calcula uma combinação e passa o resultado adiante.'],
    ['Pesos das conexões', 'Pesos regulam a contribuição das entradas nos cálculos da rede.', 'Alterar um peso pode mudar quanto uma característica influencia o resultado.'],
    ['Camadas de cálculo', 'Camadas sucessivas transformam representações ao longo da rede.', 'Valores de uma imagem passam por várias transformações antes da classificação.'],
    ['Aprender com exemplos', 'O treinamento ajusta parâmetros para reduzir um objetivo de erro nos dados usados.', 'Comparar previsões com respostas esperadas e ajustar os pesos.'],
    ['Usar o que aprendeu', 'Na inferência, a rede usa os parâmetros disponíveis para calcular uma saída.', 'Depois do treinamento, receber uma nova imagem e produzir uma classificação.'],
    ['IA com ferramentas', 'Uma aplicação pode conectar um modelo a busca, cálculo e outras ferramentas.', 'Consultar uma fonte externa antes de compor uma resposta.'],
    ['Responsabilidade humana', 'Pessoas definem objetivos, limites e como avaliar as consequências do uso.', 'Conferir uma resposta antes de usá-la numa decisão importante.'],
  ],
];

export const NETWORK_GROUPS = ['Escolhas', 'Caminhos', 'Regras', 'Conhecimento', 'Estratégia', 'Posição', 'Equipe', 'Memória', 'Probabilidade', 'Etapas', 'Limites', 'Aprendizado'];
export type KnowledgeNode = { id: string; title: string; group: number; kind: 'root' | 'hub' | 'idea' | 'card'; text: string; example: string; parent?: string };
export const KNOWLEDGE_NODES: KnowledgeNode[] = [{ id: 'inicio', title: 'SYNAPSE — uma ideia acende outras', group: 0, kind: 'root', text: 'Este “cérebro” é um mapa de conhecimento. Cada ponto é uma nota e cada linha é um link entre ideias. Os pesos de uma rede neural real são parâmetros numéricos aprendidos; este mapa serve para explorar conceitos.', example: 'Comece por uma dúvida e siga as conexões.' }];
export const KNOWLEDGE_EDGES: [string, string][] = [];
const connect = (a: string, b: string) => { if (a !== b && !KNOWLEDGE_EDGES.some(([x, y]) => x === a && y === b || x === b && y === a)) KNOWLEDGE_EDGES.push([a, b]); };
SEEDS.forEach((seeds, groupIndex) => {
  const group = groupIndex + 1, lesson = LESSONS[group], hub = 'grupo-' + group;
  const theme = group === 12 ? {
    reveal: 'Uma rede neural aprende ajustando os pesos das conexões a partir de exemplos. Depois, usa esses valores para calcular uma saída.',
    example: 'É como calibrar muitos pequenos controles: juntos, eles mudam o resultado. As notas ao redor explicam unidades, camadas, pesos e treinamento.',
    application: 'Redes neurais são usadas em tarefas como reconhecer imagens e gerar texto. Uma aplicação pode combinar o modelo com ferramentas e regras.',
    limit: 'Este mapa tem notas e links. Numa rede neural real, unidades fazem cálculos e conexões têm pesos numéricos ajustados no treinamento.',
  } : lesson;
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
  [1, 11, 'Mais escolhas fazem crescer o número de caminhos.'], [2, 4, 'Links entre ideias também podem ser percorridos como caminhos.'],
  [3, 12, 'Ferramentas de IA precisam respeitar permissões.'], [4, 9, 'Fontes conectadas ajudam a conferir respostas plausíveis.'],
  [5, 11, 'Comparar jogadas exige tempo para explorar possibilidades.'], [6, 9, 'A ordem dos elementos participa do contexto usado para prever o próximo token.'],
  [7, 10, 'Tarefas organizadas têm etapas e condições para avançar.'], [8, 12, 'Uma aplicação precisa escolher quais informações cabem no contexto.'],
  [9, 12, 'Modelos treinados podem produzir distribuições sobre saídas possíveis.'], [10, 12, 'Etapas de software organizam o uso de um modelo e suas ferramentas.'],
  [2, 11, 'Uma busca precisa equilibrar exploração e custo.'], [3, 10, 'Regras determinam quais mudanças de etapa são permitidas.'],
];
for (const [a, b] of BRIDGES) connect('grupo-' + a, 'grupo-' + b);

export const NETWORK_QUESTIONS = [
  { title: 'Por que a IA pode errar?', groups: [1, 6, 9, 12, 4], answer: 'Ela calcula possibilidades a partir do que aprendeu. Uma continuação pode soar ótima e ainda estar errada. Por isso, precisamos conferir as fontes.' },
  { title: 'Como a IA ajuda no dia a dia?', groups: [2, 5, 7, 10, 12], answer: 'Um pedido pode virar pesquisa, comparação e rascunho. As ferramentas executam etapas; você define o objetivo e avalia o resultado.' },
  { title: 'Por que mais informação não basta?', groups: [1, 4, 8, 11, 12], answer: 'Além de reunir dados, é preciso encontrar o que importa, respeitar limites e verificar a qualidade. Conectar bem faz diferença.' },
];
