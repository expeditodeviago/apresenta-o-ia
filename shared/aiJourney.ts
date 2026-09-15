export type AIChapter = {
  short: string; title: string; label: string; intro: string; question: string;
  steps: [string, string, string]; takeaway: string; limit: string;
  variants: [string, string]; mathBridge: string;
};

/** Editorial content for the main route. All diagrams are teaching examples. */
export const AI_CHAPTERS: Record<number, AIChapter> = {
  1: { short: 'A entrada', title: 'Tudo começa com a sua pergunta.', label: '01 / A LINGUAGEM VIRA PEÇAS',
    intro: 'Para um modelo de linguagem, uma frase chega em pequenos pedaços: os tokens.',
    question: 'Uma palavra sempre vira um único token?', steps: ['Um token pode ser uma palavra, parte dela ou um sinal. O recorte depende do modelo.', 'Cada pedaço recebe um identificador. Assim, o computador consegue trabalhar com a sequência.', 'A resposta também será montada com tokens. Cada novo pedaço entra no contexto do próximo.'],
    takeaway: 'O primeiro passo é transformar linguagem em algo que o modelo consegue processar.', limit: 'O recorte na tela é ilustrativo: não é a saída de um tokenizador real.', variants: ['Uma pergunta', 'Uma palavra longa'], mathBridge: 'O experimento de sequências mostra como as combinações crescem; o modelo não enumera todas elas.' },
  2: { short: 'Significados', title: 'Palavras ganham uma vizinhança.', label: '02 / REPRESENTAR SIGNIFICADOS',
    intro: 'O modelo representa os tokens com listas de números. Relações aprendidas aparecem nessas representações.',
    question: '“Gato” deveria ficar mais perto de “cachorro” ou de “avião”?', steps: ['Chamamos essas representações de embeddings. Pense em um mapa de relações aprendidas.', 'Durante o processamento, o contexto muda a representação de uma palavra.', 'A tela achata esse espaço em duas dimensões. Modelos reais usam muitas dimensões.'],
    takeaway: 'A IA trabalha com relações entre representações, além da aparência das palavras.', limit: 'As posições deste mapa foram desenhadas para explicar a ideia, não medidas em um modelo.', variants: ['Animais e objetos', 'A palavra banco'], mathBridge: 'O labirinto é um exemplo de busca em grafos. Não representa como um embedding é calculado.' },
  3: { short: 'Aprendizado', title: 'Aprender é ajustar depois do erro.', label: '03 / ANTES DA CONVERSA: TREINAMENTO',
    intro: 'No treinamento de muitos modelos de linguagem, o desafio é prever o próximo token de um exemplo.',
    question: 'O que muda quando o modelo erra uma previsão?', steps: ['O modelo faz uma previsão e compara o resultado com o token que aparece no exemplo.', 'O erro orienta pequenos ajustes nos pesos: números que controlam como os sinais são combinados.', 'Repetir esse processo em muitos exemplos produz padrões úteis. Etapas posteriores podem refinar como o modelo responde.'],
    takeaway: 'Treinar muda os pesos. Usar o modelo normalmente aplica o que já foi aprendido.', limit: 'A sequência de acertos é ilustrativa. O aprendizado real não melhora a cada exemplo sem exceção.', variants: ['Primeiras tentativas', 'Depois de praticar'], mathBridge: 'O exercício de regras mostra decisões programadas. Aprender pesos é outro processo, diferente de escrever regras à mão.' },
  4: { short: 'Rede neural', title: 'Muitas operações. Uma resposta.', label: '04 / POR DENTRO DA REDE',
    intro: 'Uma rede neural combina sinais em várias camadas. Cada camada transforma a representação que recebeu.',
    question: 'Cada bolinha da rede guarda uma palavra ou uma lembrança?', steps: ['As entradas são representações numéricas. As conexões têm pesos que influenciam o resultado.', 'Camadas combinam e transformam os sinais. O conhecimento fica distribuído por muitos parâmetros.', 'Em modelos de linguagem, a saída ajuda a calcular as chances dos próximos tokens.'],
    takeaway: 'As conexões fazem cálculos; as bolinhas não são pequenos pensamentos.', limit: 'É uma rede didática reduzida. Um Transformer inclui mecanismos que este desenho não detalha.', variants: ['Siga uma entrada', 'Veja várias camadas'], mathBridge: 'Grafos ajudam a representar conexões, mas um mapa de notas não é uma rede neural treinada.' },
  5: { short: 'Atenção', title: 'Nem toda palavra pesa igual.', label: '05 / O CONTEXTO MUDA A LEITURA',
    intro: 'A atenção combina informações de diferentes posições para interpretar o trecho atual.',
    question: 'Na frase sobre um banco, o que ajuda a saber de qual banco estamos falando?', steps: ['“Praça” e “sentar” sugerem um assento. “Conta” e “depósito” sugerem uma instituição financeira.', 'O mecanismo de atenção calcula combinações entre representações. Algumas relações recebem mais peso.', 'Várias camadas e cabeças de atenção podem capturar relações diferentes. Não existe uma única seta que explique tudo.'],
    takeaway: 'Uma palavra ganha sentido junto das outras.', limit: 'As linhas são uma ilustração das relações, não pesos de atenção extraídos de um modelo.', variants: ['Banco da praça', 'Banco da conta'], mathBridge: 'Antecipar jogadas é um exemplo de planejamento; atenção não é uma partida de minimax.' },
  6: { short: 'Contexto', title: 'O mesmo pedido. Outra resposta.', label: '06 / COMO FAZER UM BOM PEDIDO',
    intro: 'Seu pedido, as mensagens disponíveis e as instruções ajudam a orientar a resposta.',
    question: '“Explique gravidade” é o mesmo pedido para uma criança e para um engenheiro?', steps: ['Dizer para quem é a explicação muda o vocabulário e o nível de detalhe esperado.', 'Dar objetivo, contexto e formato reduz a ambiguidade do pedido.', 'Isso orienta a geração naquele momento. Não equivale a treinar novamente todos os pesos.'],
    takeaway: 'Um bom pedido dá direção; ele não garante que a resposta esteja certa.', limit: 'As respostas da tela são exemplos preparados, não chamadas a uma IA ao vivo.', variants: ['Para uma criança', 'Para um engenheiro'], mathBridge: 'O relógio explora posições e ciclos. É uma analogia limitada, não a implementação da posição em todo modelo.' },
  7: { short: 'Geração', title: 'A resposta nasce aos poucos.', label: '07 / UM PEDAÇO DE CADA VEZ',
    intro: 'Um modelo de linguagem pode construir texto escolhendo o próximo token e repetindo o processo.',
    question: 'Ele precisa escolher a frase inteira de uma só vez?', steps: ['O modelo calcula possibilidades para a continuação usando o contexto disponível.', 'Um token é escolhido. Esse token passa a fazer parte do contexto.', 'O ciclo continua até um critério de parada. A interface pode mostrar vários tokens de uma vez.'],
    takeaway: 'Uma resposta longa é construída por muitas escolhas encadeadas.', limit: 'O texto animado é uma demonstração preparada. Os blocos visuais não são tokens medidos.', variants: ['Uma explicação', 'Uma ideia criativa'], mathBridge: 'Dependências ajudam a pensar em etapas. O fluxo de tarefas é um complemento à geração de texto.' },
  8: { short: 'Memória', title: 'Conversar não é lembrar de tudo.', label: '08 / O QUE CABE NO CONTEXTO',
    intro: 'Há um limite para a quantidade de conteúdo que o modelo considera em uma chamada.',
    question: 'Uma conversa antiga estará sempre disponível para o modelo?', steps: ['O sistema precisa escolher quais mensagens, documentos e instruções entram no contexto.', 'Históricos longos podem ser resumidos ou ter partes removidas. Detalhes podem se perder.', 'Alguns produtos têm memória salva ou busca em arquivos. São recursos do sistema, com funcionamento próprio.'],
    takeaway: 'Pesos aprendidos, contexto atual e memória salva são coisas diferentes.', limit: 'Os quatro cartões representam um limite ilustrativo, não uma capacidade real em tokens.', variants: ['Cabe na conversa', 'Histórico longo'], mathBridge: 'As gavetas ilustram capacidade limitada. O princípio das gavetas não descreve sozinho a memória de uma IA.' },
  9: { short: 'Variação', title: 'Por que ela responde diferente?', label: '09 / ESCOLHER ENTRE POSSIBILIDADES',
    intro: 'Pode existir mais de uma continuação plausível. A forma de escolher afeta a variação do texto.',
    question: 'A opção mais provável precisa aparecer sempre?', steps: ['Nesta demonstração, diferentes continuações recebem chances diferentes.', 'Uma temperatura maior distribui melhor as chances entre opções; uma menor favorece as mais prováveis.', 'Variar mais pode ajudar em ideias criativas. Isso não é um controle de verdade ou de inteligência.'],
    takeaway: 'Provável, criativo e correto são critérios diferentes.', limit: 'As probabilidades são de um exemplo didático com quatro opções, não de um modelo comercial.', variants: ['Mais previsível', 'Mais variedade'], mathBridge: 'Aqui a probabilidade é uma conexão direta: o experimento permite observar frequências em várias escolhas.' },
  10: { short: 'Erros', title: 'Parece certeza. Pode ser invenção.', label: '10 / POR QUE A IA PODE ERRAR',
    intro: 'Um texto fluente pode conter uma informação falsa, uma referência inventada ou uma conclusão sem apoio.',
    question: 'Uma resposta muito convincente é prova de que aconteceu?', steps: ['O treinamento não garante uma base perfeita nem conhecimento atualizado de todos os fatos.', 'A geração pode produzir uma continuação plausível mesmo quando falta evidência.', 'Peça fontes, abra os links e compare com o documento original. Uma citação também pode estar errada.'],
    takeaway: 'Confiança no tom não substitui evidência.', limit: 'O evento e a resposta mostrados são fictícios, criados para demonstrar o erro.', variants: ['Sem conferir', 'Conferindo a fonte'], mathBridge: 'Estados e regras podem exigir revisão antes de enviar, mas não garantem sozinhos que o conteúdo seja verdadeiro.' },
  11: { short: 'Ferramentas', title: 'Ela pode consultar e agir.', label: '11 / ALÉM DO MODELO',
    intro: 'Um assistente pode usar ferramentas para buscar documentos, fazer cálculos ou executar tarefas.',
    question: 'Se a IA precisa de um dado atual, de onde ele pode vir?', steps: ['O modelo propõe uma chamada. O sistema decide se pode executá-la e com quais permissões.', 'A ferramenta devolve dados. O modelo usa esse resultado para preparar a resposta.', 'Isso amplia o alcance, mas também exige conferir entradas, resultados e ações.'],
    takeaway: 'Modelo, ferramentas e permissões trabalham juntos.', limit: 'A busca e a calculadora na tela são encenações locais. Nenhuma ação externa é executada.', variants: ['Consultar um arquivo', 'Usar uma calculadora'], mathBridge: 'O crescimento de possibilidades ajuda a explicar por que planejamento e limites de execução importam.' },
  12: { short: 'Tudo junto', title: 'Agora você enxerga o caminho.', label: '12 / DA PERGUNTA À RESPOSTA',
    intro: 'Vamos acompanhar um pedido passando por entrada, contexto, modelo, ferramentas e resposta.',
    question: 'Em que parte desse caminho você conferiria as informações?', steps: ['O pedido ganha tokens e representações. Instruções e informações disponíveis entram no contexto.', 'A rede processa os sinais. Se necessário e permitido, o sistema consulta uma ferramenta.', 'A resposta é gerada e precisa ser avaliada. Você decide se ela atende ao objetivo e se a evidência sustenta o que diz.'],
    takeaway: 'Entender o caminho ajuda você a usar, questionar e conferir melhor.', limit: 'Este fluxo resume um assistente de linguagem. Outros tipos de IA podem funcionar de formas diferentes.', variants: ['Explicar uma ideia', 'Responder com uma fonte'], mathBridge: 'A missão original reúne regras, conexões, dependências e capacidade como aprofundamento opcional.' },
};

export function storyLines(id: number) {
  const c = AI_CHAPTERS[id];
  return [c.intro, c.steps[0], c.question, c.steps[1], 'Troque o exemplo e observe o que muda.', c.steps[2], c.takeaway, 'Antes de avançar: como você explicaria essa ideia para outra pessoa?'];
}

export const AI_AUDIENCE_COPY = Object.fromEntries(Object.entries(AI_CHAPTERS).map(([id, c]) => [id, {
  short: c.short, title: c.title, math: c.label.split(' / ')[1], question: c.question, example: c.intro,
  prediction: c.question, variant: 'Compare os dois exemplos da animação.', reveal: c.steps[2], application: c.takeaway,
  conclusion: 'Como você explicaria essa ideia com suas palavras?', limit: c.limit,
}]));
