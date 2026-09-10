# SYNAPSE — roteiro privado de 120 minutos

Uso do apresentador. Não projetar este documento.

O cronômetro começa ao tocar em Iniciar cronômetro no controle privado. Auto-Play anima o experimento; o avanço pedagógico é conduzido pelo apresentador.

## 0–8 min · A matemática invisível da IA

**Conceito:** Prever, testar, explicar

**Ritmo:** 2min abertura + 2min hipótese + 2min comparação + 2min acordo com a turma = 8min.

**Resposta esperada:** Não é preciso enumerar tudo: estratégias e restrições ajudam. Na abertura, compare 20⁴ = 160.000 com 10⁸ = 100 milhões. Neste exemplo, a segunda contagem é 625 vezes a primeira. Peça a previsão antes de revelar; não generalize a razão para outras bases e comprimentos.

Use “Antes de entrar, um desafio de 8 minutos”. Peça a votação antes de mostrar os números. Parta de 10⁴ = 10.000; compare 20⁴ = 160.000 com 10⁸ = 100 milhões. Faça uma pausa antes de revelar a razão de 625. Avance usando as setas ou o celular.

### 1. A pergunta

Uma máquina precisa tentar tudo para encontrar uma boa resposta?

### 2. Um exemplo

Uma senha com quatro posições e dez símbolos já admite 10.000 sequências.

### 3. Sua previsão

Neste exemplo, o que gera mais sequências: dobrar as opções ou dobrar o comprimento?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare 20⁴ com 10⁸: dobre só as opções ou só as posições da senha inicial.

### 6. A matemática

20⁴ = 160.000; 10⁸ = 100 milhões. Neste exemplo, dobrar as posições gera 625 vezes mais sequências que dobrar as opções.

### 7. Na inteligência artificial

Decisão, busca, representação e coordenação aparecem em sistemas de IA. Limite: As experiências são algoritmos didáticos locais. Nenhum modelo externo está respondendo ao vivo.

### 8. A conexão seguinte

Começamos com escolhas simples. O número de possibilidades pode surpreender.

**Limite / erro comum:** As experiências são algoritmos didáticos locais. Nenhum modelo externo está respondendo ao vivo.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 8–16 min · A fábrica de combinações

**Conceito:** Princípio multiplicativo

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** 3³ = 27. Uma posição extra multiplica o total por 3, com as demais hipóteses mantidas.

### 1. A pergunta

Quantas possibilidades cabem em três escolhas?

### 2. Um exemplo

Escolher uma peça para cada posição: roupas, símbolos de senha ou tokens.

### 3. Sua previsão

Com 3 opções e 3 posições, quantas sequências existem?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Mantenha as opções e acrescente uma posição. O total soma ou multiplica?

### 6. A matemática

V opções em cada uma de n posições: Vⁿ sequências, com repetição e ordem relevante.

### 7. Na inteligência artificial

Um vocabulário finito permite construir muitas sequências de tokens. Limite: Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem.

### 8. A conexão seguinte

Muitas possibilidades exigem uma estratégia de busca.

**Limite / erro comum:** Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: retire a repetição e compare Vⁿ com V!/(V−n)!. Depois retire a importância da ordem.

## 16–24 min · O robô e a saída

**Conceito:** Grafos, BFS, DFS e backtracking

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** BFS encontra o menor número de arestas: neste labirinto são 6. DFS prioriza o corredor inferior e pode encontrar um caminho mais longo.

### 1. A pergunta

Encontrar uma saída é o mesmo que encontrar a menor rota?

### 2. Um exemplo

O mesmo labirinto aparece como corredores e como grafo de posições.

### 3. Sua previsão

Qual estratégia chega à saída pelo menor número de arestas?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Troque largura por profundidade, mantendo o labirinto.

### 6. A matemática

BFS explora por camadas. DFS aprofunda um ramo. Backtracking desfaz escolhas quando necessário.

### 7. Na inteligência artificial

Busca em espaços de estados aparece em planejamento e resolução de problemas. Limite: BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM.

### 8. A conexão seguinte

O caminho depende tanto da estrutura quanto das regras.

**Limite / erro comum:** BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 24–32 min · O detetive das regras

**Conceito:** Lógica proposicional

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Com apenas crachá, E nega e OU permite. Sem bloqueio: (1 ∧ 0) = 0, mas (1 ∨ 0) = 1.

### 1. A pergunta

Uma regra aparentemente segura pode abrir a porta errada?

### 2. Um exemplo

A porta exige crachá E autorização, sem bloqueio de segurança.

### 3. Sua previsão

Se usarmos OU no lugar de E, quem passa a entrar?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Ative só o crachá. Compare E com OU e revele a tabela-verdade.

### 6. A matemática

(C ∧ A) ∧ ¬B exige as duas credenciais e ausência de bloqueio.

### 7. Na inteligência artificial

Condições lógicas controlam permissões e ações de ferramentas em sistemas de IA. Limite: Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos.

### 8. A conexão seguinte

Regras também descrevem relações entre elementos.

**Limite / erro comum:** Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 32–40 min · A rede de conexões

**Conceito:** Relações e grafos direcionados

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** A alcança F na rede inicial, mas F não alcança A em modo direcionado. Tornar as conexões simétricas muda essa resposta.

### 1. A pergunta

Se um documento aponta para outro, a relação vale nos dois sentidos?

### 2. Um exemplo

Uma biblioteca de seis documentos conectados por referências.

### 3. Sua previsão

Existe um caminho de A até F? E de F até A?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Transforme a rede em simétrica ou remova uma conexão.

### 6. A matemática

Arestas diretas e caminhos são coisas diferentes. Simetria exige o par inverso.

### 7. Na inteligência artificial

Grafos de conhecimento e recomendações usam relações para localizar informações. Limite: Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro.

### 8. A conexão seguinte

Na próxima etapa, conexões viram decisões de um jogo.

**Limite / erro comum:** Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 40–48 min · O duelo de estratégias

**Conceito:** Árvores de decisão e minimax

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Com 7 peças, retirar 3 deixa 4 para o adversário. Depois, complemente a retirada dele até 4. Com 4 iniciais não há vitória garantida contra jogo ótimo.

### 1. A pergunta

Pegar o máximo agora sempre é a melhor jogada?

### 2. Um exemplo

Há 7 peças. Cada jogador retira 1, 2 ou 3. Quem tira a última vence.

### 3. Sua previsão

Qual retirada deixa o adversário sem uma vitória garantida?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare aleatório reproduzível, guloso e minimax com a mesma quantidade inicial.

### 6. A matemática

Estados múltiplos de 4 são perdedores para quem joga, se o adversário responder de forma ótima.

### 7. Na inteligência artificial

Busca adversarial avalia consequências e respostas possíveis. Limite: São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo.

### 8. A conexão seguinte

O resto de uma divisão pode esconder a estratégia.

**Limite / erro comum:** São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 48–56 min · O relógio das posições

**Conceito:** Aritmética modular e rotações

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** (2 + 14) mod 12 = 4. Não confundir o resto do deslocamento com a posição final.

### 1. A pergunta

Um relógio marca 2. Que posição terá após 14 horas?

### 2. Um exemplo

Cada volta completa retorna à mesma classe de restos.

### 3. Sua previsão

O resultado é 2, 4 ou 14?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Mude o tamanho do relógio e observe a mesma soma.

### 6. A matemática

(2 + 14) mod 12 = 4. Posições equivalentes têm o mesmo resto.

### 7. Na inteligência artificial

RoPE usa rotações para incorporar posições em pares de componentes de queries e keys. Limite: RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática.

### 8. A conexão seguinte

Posições organizam sequências; dependências organizam trabalho.

**Limite / erro comum:** RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 56–64 min · A cidade das tarefas

**Conceito:** Dependências e ordens parciais

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Pesquisar primeiro; verificar e redigir podem acontecer juntos; revisar por último. A aresta Revisar → Pesquisar cria um ciclo.

### 1. A pergunta

Quais tarefas podem acontecer juntas sem atropelar uma dependência?

### 2. Um exemplo

Pesquisar → verificar e redigir → revisar.

### 3. Sua previsão

O que acontece se pesquisar também depender de revisar?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Insira o ciclo e depois remova a dependência problemática.

### 6. A matemática

Uma ordenação topológica existe em DAGs. A alcançabilidade define uma ordem estrita, e sua versão reflexiva é uma ordem parcial.

### 7. Na inteligência artificial

Fluxos de agentes e pipelines organizam tarefas por dependências. Limite: As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados.

### 8. A conexão seguinte

Mesmo um fluxo bem ordenado encontra limites de recursos.

**Limite / erro comum:** As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: discuta fechamento transitivo, redução transitiva e mais de uma ordenação topológica.

## 64–72 min · As gavetas impossíveis

**Conceito:** Princípio das Casas dos Pombos

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** 5 objetos em 4 gavetas garantem colisão. Com até 4 ainda pode haver colisão, mas ela não é inevitável.

### 1. A pergunta

É possível distribuir 5 objetos em 4 gavetas sem repetir uma gaveta?

### 2. Um exemplo

Cada objeto é colocado em exatamente uma gaveta.

### 3. Sua previsão

Qual é o primeiro número de objetos que garante alguma colisão?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare uma distribuição manual com h(x) = x mod g.

### 6. A matemática

Se n > g, pelo menos uma gaveta recebe dois objetos. Em geral, alguma recebe ao menos ⌈n/g⌉.

### 7. Na inteligência artificial

Mais entradas possíveis do que hashes disponíveis tornam colisões inevitáveis. Limite: n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas.

### 8. A conexão seguinte

Limites determinísticos são diferentes de incerteza probabilística.

**Limite / erro comum:** n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 72–80 min · O painel das probabilidades

**Conceito:** Distribuição e amostragem

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Não. Frequências flutuam; mais amostras tendem a aproximar proporções teóricas, sem igualdade obrigatória em uma execução.

### 1. A pergunta

O resultado mais provável precisa aparecer em toda tentativa?

### 2. Um exemplo

Quatro tokens possuem pesos que somam 100% após normalização.

### 3. Sua previsão

Em 100 amostras, as frequências serão exatamente iguais às probabilidades?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Aumente a temperatura e repita a amostragem com a mesma semente.

### 6. A matemática

Softmax com temperatura redistribui o peso. Frequências observadas variam por amostragem.

### 7. Na inteligência artificial

A geração pode amostrar o próximo token de uma distribuição discreta. Limite: Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos.

### 8. A conexão seguinte

Uma escolha também pode ser um evento que muda um estado.

**Limite / erro comum:** Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 80–88 min · A máquina de estados

**Conceito:** Estados e transições

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Enviar no estado inicial é inválido e não deve alterar o estado. A validação precisa ocorrer primeiro.

### 1. A pergunta

Um assistente pode entregar uma resposta antes de validar a solicitação?

### 2. Um exemplo

Receber → validar → responder → concluir; erros podem exigir revisão.

### 3. Sua previsão

O que deve acontecer se “enviar” chegar no estado inicial?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Provoque uma transição inválida e compare com o fluxo correto.

### 6. A matemática

Uma função de transição associa estado e evento a um próximo estado permitido.

### 7. Na inteligência artificial

Máquinas de estados controlam fluxos de atendimento e ferramentas. Limite: Isso descreve o controle do software, não toda a computação de um modelo de linguagem.

### 8. A conexão seguinte

Mais estados possíveis podem tornar a exploração cara.

**Limite / erro comum:** Isso descreve o controle do software, não toda a computação de um modelo de linguagem.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 88–96 min · A explosão combinatória

**Conceito:** Crescimento e custo de busca

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Entre as famílias mostradas, n! ultrapassa um milhão em n = 10. 2ⁿ ultrapassa em n = 20. A medição é limitada a até 2¹⁶ estados.

### 1. A pergunta

Se funciona com 8 elementos, também funciona com 40?

### 2. Um exemplo

Compare n, n², 2ⁿ e n! para o mesmo tamanho de entrada.

### 3. Sua previsão

Qual família ultrapassa primeiro um milhão de possibilidades?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Dobre n e compare a mudança em cada família.

### 6. A matemática

As curvas têm taxas de crescimento diferentes. Contar estados não é medir tempo de execução.

### 7. Na inteligência artificial

Busca, planejamento e otimização precisam limitar ou explorar melhor seus espaços. Limite: Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA.

### 8. A conexão seguinte

Agora combinamos busca, regras e recursos em uma missão.

**Limite / erro comum:** Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 96–104 min · A missão SYNAPSE

**Conceito:** Decidir, buscar, ordenar e limitar

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Autorize o pedido, mantenha a fonte alcançável, remova o ciclo e use capacidade de pelo menos 3 evidências.

### 1. A pergunta

Sua equipe consegue entregar uma resposta verificada com recursos limitados?

### 2. Um exemplo

Um pedido precisa de autorização, fonte alcançável, tarefas sem ciclo e espaço para evidências.

### 3. Sua previsão

Qual condição vai bloquear a primeira tentativa?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Corrija um bloqueio por vez e execute novamente.

### 6. A matemática

A missão só conclui quando lógica, caminho, dependências e capacidade são satisfeitos.

### 7. Na inteligência artificial

Sistemas de IA confiáveis combinam vários mecanismos verificáveis ao redor do modelo. Limite: A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais.

### 8. A conexão seguinte

A inteligência do sistema também está na organização ao redor dele.

**Limite / erro comum:** A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

Comece com os bloqueios padrão. Execute: a primeira verificação para na autorização. Autorize e execute de novo: agora aparece o ciclo. Remova o ciclo e execute: falta capacidade. Aumente a capacidade para 3 e rode a última vez. Deixe a turma narrar cada verificação até a conclusão.

## 104–114 min · O desafio da turma

**Conceito:** Prever antes de revelar

**Ritmo:** 1min introdução + 6 rodadas de 90s = 10min.

**Resposta esperada:** Gabarito: C, A, B, C, B, A. Peça justificativas antes de revelar. Divida cerca de 90 segundos por rodada, reservando um minuto à introdução.

### 1. A pergunta

Qual decisão você defenderia agora?

### 2. Um exemplo

Seis situações curtas. A turma vota levantando a mão.

### 3. Sua previsão

Escolha A, B ou C antes de revelar cada explicação.

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Peça a alguém que votou diferente para defender a alternativa.

### 6. A matemática

A resposta importa; o motivo que a sustenta importa mais.

### 7. Na inteligência artificial

Reconhecer limites e contraexemplos ajuda a avaliar sistemas de IA. Limite: Não usamos aparência de texto para alegar autoria humana ou artificial.

### 8. A conexão seguinte

A matemática torna decisões discutíveis, testáveis e corrigíveis.

**Limite / erro comum:** Não usamos aparência de texto para alegar autoria humana ou artificial.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 114–120 min · As peças agora se conectam

**Conceito:** Da abstração ao sistema

**Ritmo:** 2min síntese + 4min perguntas = 6min.

**Resposta esperada:** Aceite conexões bem justificadas. Reforce que cada modelo matemático tem hipóteses e não descreve sozinho toda a IA.

### 1. A pergunta

Qual conceito mudou sua forma de olhar para a IA?

### 2. Um exemplo

Escolhas → busca → regras → relações → estratégias → posições → dependências → limites → amostragem → estados.

### 3. Sua previsão

Qual desses conceitos você usaria primeiro em seu próximo projeto?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Escolha um problema da turma e identifique duas conexões matemáticas.

### 6. A matemática

Não há uma única matemática da IA. Há mecanismos distintos com hipóteses e limites.

### 7. Na inteligência artificial

Engenharia de software combina modelos, algoritmos, dados e verificação. Limite: O mapeamento com a ementa do professor ainda precisa ser validado.

### 8. A conexão seguinte

Pergunte. Modele. Preveja. Teste. Explique.

**Limite / erro comum:** O mapeamento com a ementa do professor ainda precisa ser validado.

**Se faltar tempo:** Se a turma já previu corretamente, faça uma execução e avance para a revelação. Não pule as hipóteses nem o limite da analogia.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.
