# O encerramento surpresa

A estrutura da apresentação continua a mesma: 12 capítulos de IA com matemática opcional, desafio da turma e encerramento, com 120 minutos no total. As explicações projetadas começam com exemplos cotidianos; as definições formais continuam nas notas privadas.

## Revele uma parte de cada vez

No último módulo, use o controle do celular ou os botões da projeção:

1. **Mostrar as primeiras ideias**: “Até aqui, vocês viram peças separadas.” Faça uma pausa.
2. **Conectar as ideias**: “Uma ideia ajuda a entender outra.” Aparecem 109 pontos.
3. **Revelar a rede inteira**: “Agora olha o tamanho do que elas formam juntas.” A rede chega a **493 notas e 984 ligações**. Deixe a turma olhar antes de falar.
4. **Fazer a rede acender**: luzes percorrem as conexões. Peça à turma para escolher uma das perguntas.
5. **Por que a IA pode errar?**: o mapa destaca treinamento, contexto, probabilidade, erros e ferramentas. Explique que uma continuação plausível ainda precisa ser conferida.
6. Explore **Treinamento** para explicar, em poucas palavras, que redes neurais aprendem ajustando pesos. O botão de download entrega o mapa à turma.

Use cerca de dois minutos para a revelação e reserve os quatro restantes para perguntas. Para reiniciar a cena, volte a **Mostrar as primeiras ideias**. Zoom e arrasto ajustam a visualização só no dispositivo em uso; tema e pergunta selecionados são sincronizados com a projeção.

O “cérebro” é uma metáfora visual. Este é um mapa de conhecimento: os pontos são notas e as linhas são links. Uma rede neural real combina unidades numéricas, camadas e pesos ajustados no treinamento. As perguntas do encerramento destacam percursos preparados; não são respostas de um modelo executando ao vivo.

## Abrir no Obsidian de verdade

O cofre está na pasta `artifacts/SYNAPSE-Obsidian`. A apresentação também oferece **Levar esta rede para o Obsidian**, que baixa `SYNAPSE-Obsidian.zip`.

1. Extraia o ZIP, se usou o download.
2. No Obsidian, escolha **Abrir pasta como cofre** e selecione a pasta `SYNAPSE-Obsidian`.
3. Abra a nota **COMECE-AQUI** e depois a **visão de grafo** na barra lateral.
4. No painel do grafo, use **Animar** para revelar a rede. Aproxime com a roda do mouse e clique em uma nota para ler.

As notas estão divididas em 12 pastas. É possível atribuir cores usando grupos, com buscas como `path:01-Tokens`. Todas as ligações apontam para notas existentes; o cofre não exige plugins da comunidade.

O grafo nativo do Obsidian organiza os pontos de acordo com suas forças e configurações. A composição e as luzes da apresentação são uma visualização própria do mesmo conjunto de notas e links.

Referências: [grafo do Obsidian](https://help.obsidian.md/Plugins/Graph+view), [links entre notas](https://help.obsidian.md/Linking+notes+and+files/Internal+links), [unidades e camadas de redes neurais](https://developers.google.com/machine-learning/crash-course/neural-networks/nodes-hidden-layers).

## Atualizar o cofre

`npm.cmd run export:obsidian` gera a pasta e o ZIP a partir de `shared/knowledge.ts`. O build também faz essa geração, para disponibilizar o download quando o site for publicado. As notas privadas do apresentador não entram no cofre.
