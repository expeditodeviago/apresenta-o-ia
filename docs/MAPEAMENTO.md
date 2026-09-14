# Mapeamento dos experimentos

Mapeamento descritivo do conteúdo implementado. A ementa do professor não foi fornecida; aderência curricular ainda precisa ser validada.

| Módulo | Conteúdo matemático | Conexão com IA | Limite da analogia |
| --- | --- | --- | --- |
| 1. Fábrica | Princípio multiplicativo | A IA também monta sequências, escolhendo pequenos pedaços de texto, chamados tokens. | Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem. |
| 2. Labirinto | Grafos, BFS, DFS e backtracking | Um robô que procura uma saída e um sistema que planeja tarefas precisam explorar caminhos possíveis. | BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM. |
| 3. Lógica | Lógica proposicional | Antes de uma IA acessar um arquivo ou executar uma tarefa, o sistema deve conferir se ela tem permissão. | Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos. |
| 4. Relações | Relações e grafos direcionados | Mapas de conhecimento ligam assuntos, documentos e fontes. É a ideia que vamos reencontrar no Obsidian, no final. | Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro. |
| 5. Estratégias | Árvores de decisão e minimax | Em jogos e planejamento, um sistema pode comparar o que acontece depois de cada decisão. | São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo. |
| 6. O relógio | Aritmética modular e rotações | Na frase “o cachorro mordeu o homem”, a ordem importa. Modelos de linguagem usam informações de posição para distinguir essa ordem. | RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática. |
| 7. Tarefas em equipe | Dependências e ordens parciais | Um assistente de IA pode dividir um pedido em pesquisar, escrever e revisar. O fluxo organiza quem espera por quem. | As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados. |
| 8. As gavetas | Princípio das Casas dos Pombos | Computadores usam códigos curtos para organizar dados. Dois dados diferentes podem acabar com o mesmo código. | n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas. |
| 9. Probabilidade | Distribuição e amostragem | Ao gerar texto, uma IA pode escolher entre continuações possíveis. Soar provável não garante estar certo. | Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos. |
| 10. Passo a passo | Estados e transições | Um atendimento pode usar IA para conversar e regras para organizar as etapas de cada pedido. | Isso descreve o controle do software, não toda a computação de um modelo de linguagem. |
| 11. Complexidade | Crescimento e custo de busca | Sistemas de IA precisam escolher onde gastar tempo: quais caminhos explorar e quando parar. | Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA. |
| 12. Missão integrada | Decidir, buscar, ordenar e limitar | Uma boa ferramenta de IA depende também de boas fontes, regras claras e conferência dos resultados. | A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais. |
