# Mapeamento dos experimentos

Mapeamento descritivo do conteúdo implementado. A ementa do professor não foi fornecida; aderência curricular ainda precisa ser validada.

| Módulo | Conteúdo matemático | Conexão com IA | Limite da analogia |
| --- | --- | --- | --- |
| 1. Fábrica | Princípio multiplicativo | Um vocabulário finito permite construir muitas sequências de tokens. | Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem. |
| 2. Labirinto | Grafos, BFS, DFS e backtracking | Busca em espaços de estados aparece em planejamento e resolução de problemas. | BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM. |
| 3. Lógica | Lógica proposicional | Condições lógicas controlam permissões e ações de ferramentas em sistemas de IA. | Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos. |
| 4. Relações | Relações e grafos direcionados | Grafos de conhecimento e recomendações usam relações para localizar informações. | Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro. |
| 5. Estratégias | Árvores de decisão e minimax | Busca adversarial avalia consequências e respostas possíveis. | São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo. |
| 6. Módulo & RoPE | Aritmética modular e rotações | RoPE usa rotações para incorporar posições em pares de componentes de queries e keys. | RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática. |
| 7. DAGs & agentes | Dependências e ordens parciais | Fluxos de agentes e pipelines organizam tarefas por dependências. | As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados. |
| 8. Gavetas & hash | Princípio das Casas dos Pombos | Mais entradas possíveis do que hashes disponíveis tornam colisões inevitáveis. | n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas. |
| 9. Probabilidade | Distribuição e amostragem | A geração pode amostrar o próximo token de uma distribuição discreta. | Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos. |
| 10. Autômatos | Estados e transições | Máquinas de estados controlam fluxos de atendimento e ferramentas. | Isso descreve o controle do software, não toda a computação de um modelo de linguagem. |
| 11. Complexidade | Crescimento e custo de busca | Busca, planejamento e otimização precisam limitar ou explorar melhor seus espaços. | Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA. |
| 12. Missão integrada | Decidir, buscar, ordenar e limitar | Sistemas de IA confiáveis combinam vários mecanismos verificáveis ao redor do modelo. | A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais. |
