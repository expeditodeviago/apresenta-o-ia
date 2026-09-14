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

Você escolhe quatro números para uma senha. Parece pouco… até contar todas as possibilidades.

### 3. Seu palpite

Neste exemplo, o que gera mais sequências: dobrar as opções ou dobrar o comprimento?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare 20⁴ com 10⁸: dobre só as opções ou só as posições da senha inicial.

### 6. Por que acontece?

20⁴ = 160.000; 10⁸ = 100 milhões. Neste exemplo, dobrar as posições gera 625 vezes mais sequências que dobrar as opções.

### 7. Onde a IA entra

Escolher uma rota, organizar tarefas e completar uma frase: a IA precisa lidar com muitas possibilidades. Limite: As experiências são algoritmos didáticos locais. Nenhum modelo externo está respondendo ao vivo.

### 8. A próxima ideia

Você não precisa saber programar para participar. Basta dar um palpite e observar.

**Limite / erro comum:** As experiências são algoritmos didáticos locais. Nenhum modelo externo está respondendo ao vivo.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 8–16 min · A fábrica de combinações

**Conceito:** Princípio multiplicativo

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** 3³ = 27. Uma posição extra multiplica o total por 3, com as demais hipóteses mantidas.

### 1. A pergunta

Quantas possibilidades cabem em três escolhas?

### 2. Um exemplo

Monte uma fileira de três peças: em cada lugar, escolha amarela, azul ou vermelha.

### 3. Seu palpite

Com 3 opções e 3 posições, quantas sequências existem?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Mantenha as opções e acrescente uma posição. O total soma ou multiplica?

### 6. Por que acontece?

Cada novo lugar multiplica as possibilidades. Com 3 cores e 3 lugares: 3 × 3 × 3 = 27.

### 7. Onde a IA entra

A IA também monta sequências, escolhendo pequenos pedaços de texto, chamados tokens. Limite: Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem.

### 8. A próxima ideia

Se existem tantas opções, como encontrar uma boa escolha sem tentar tudo?

**Limite / erro comum:** Um LLM não enumera todas as frases. Sequências ordenadas com repetição não são combinações sem ordem.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: retire a repetição e compare Vⁿ com V!/(V−n)!. Depois retire a importância da ordem.

## 16–24 min · O robô e a saída

**Conceito:** Grafos, BFS, DFS e backtracking

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** BFS encontra o menor número de arestas: neste labirinto são 6. DFS prioriza o corredor inferior e pode encontrar um caminho mais longo.

### 1. A pergunta

Encontrar uma saída é o mesmo que encontrar a menor rota?

### 2. Um exemplo

Você está num lugar desconhecido. Explora um corredor até o fim ou olha primeiro todas as saídas próximas?

### 3. Seu palpite

Qual estratégia encontra a saída com menos passos?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Troque largura por profundidade, mantendo o labirinto.

### 6. Por que acontece?

Olhar por camadas encontra a rota com menos passos neste labirinto. Seguir um corredor até o fim pode dar uma volta maior.

### 7. Onde a IA entra

Um robô que procura uma saída e um sistema que planeja tarefas precisam explorar caminhos possíveis. Limite: BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM.

### 8. A próxima ideia

Um bom caminho ajuda. Agora imagine que há uma porta que só abre com a regra certa.

**Limite / erro comum:** BFS minimiza arestas em grafos não ponderados ou com pesos iguais. Não descreve literalmente o raciocínio de um LLM.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 24–32 min · O detetive das regras

**Conceito:** Lógica proposicional

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Com apenas crachá, E nega e OU permite. Sem bloqueio: (1 ∧ 0) = 0, mas (1 ∨ 0) = 1.

### 1. A pergunta

Uma regra aparentemente segura pode abrir a porta errada?

### 2. Um exemplo

Para entrar no evento, você precisa de ingresso E documento. O que muda se a placa disser OU?

### 3. Seu palpite

Se usarmos OU no lugar de E, quem passa a entrar?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Ative só o crachá. Compare E com OU e revele a tabela-verdade.

### 6. Por que acontece?

Com E, precisa ter os dois. Com OU, basta um. Uma palavra muda quem consegue entrar.

### 7. Onde a IA entra

Antes de uma IA acessar um arquivo ou executar uma tarefa, o sistema deve conferir se ela tem permissão. Limite: Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos.

### 8. A próxima ideia

As palavras conectam regras. E as referências conectam ideias.

**Limite / erro comum:** Uma regra formal correta ainda depende de dados corretos e de requisitos bem definidos.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 32–40 min · A rede de conexões

**Conceito:** Relações e grafos direcionados

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** A alcança F na rede inicial, mas F não alcança A em modo direcionado. Tornar as conexões simétricas muda essa resposta.

### 1. A pergunta

Se um documento aponta para outro, a relação vale nos dois sentidos?

### 2. Um exemplo

Você vê uma receita, descobre um ingrediente e chega a outra receita. Uma ideia abre caminho para outra.

### 3. Seu palpite

Existe um caminho de A até F? E de F até A?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Transforme a rede em simétrica ou remova uma conexão.

### 6. Por que acontece?

Um link é uma ligação direta. Um caminho passa por várias ligações. Seguir alguém não significa que essa pessoa segue você.

### 7. Onde a IA entra

Mapas de conhecimento ligam assuntos, documentos e fontes. É a ideia que vamos reencontrar no Obsidian, no final. Limite: Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro.

### 8. A próxima ideia

Quando você enxerga conexões, começa a perceber as consequências de cada escolha.

**Limite / erro comum:** Existir um caminho não prova que uma recomendação é boa ou que um fato é verdadeiro.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 40–48 min · O duelo de estratégias

**Conceito:** Árvores de decisão e minimax

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Com 7 peças, retirar 3 deixa 4 para o adversário. Depois, complemente a retirada dele até 4. Com 4 iniciais não há vitória garantida contra jogo ótimo.

### 1. A pergunta

Pegar o máximo agora sempre é a melhor jogada?

### 2. Um exemplo

Há 7 peças. Cada jogador retira 1, 2 ou 3. Quem tira a última vence.

### 3. Seu palpite

Qual retirada deixa o adversário sem uma vitória garantida?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare jogar ao acaso, pegar o máximo e pensar na resposta do adversário.

### 6. Por que acontece?

Deixe 4 peças para o adversário. Depois, tire o que falta para as duas retiradas somarem 4. Pense uma jogada à frente.

### 7. Onde a IA entra

Em jogos e planejamento, um sistema pode comparar o que acontece depois de cada decisão. Limite: São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo.

### 8. A próxima ideia

A estratégia esconde um padrão que se repete. Como os números de um relógio.

**Limite / erro comum:** São algoritmos programados, não modelos de IA competindo. A conclusão vale para as regras deste jogo.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 48–56 min · O relógio das posições

**Conceito:** Aritmética modular e rotações

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** (2 + 14) mod 12 = 4. Não confundir o resto do deslocamento com a posição final.

### 1. A pergunta

Um relógio marca 2. Que posição terá após 14 horas?

### 2. Um exemplo

São 2 horas. Você espera 14 horas. O ponteiro dá uma volta e ainda anda mais um pouco.

### 3. Seu palpite

O resultado é 2, 4 ou 14?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Mude o tamanho do relógio e observe a mesma soma.

### 6. Por que acontece?

Uma volta completa não muda a posição do ponteiro. De 2, avançamos 14 e chegamos ao 4.

### 7. Onde a IA entra

Na frase “o cachorro mordeu o homem”, a ordem importa. Modelos de linguagem usam informações de posição para distinguir essa ordem. Limite: RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática.

### 8. A próxima ideia

A ordem das palavras muda uma frase. A ordem das tarefas muda um trabalho.

**Limite / erro comum:** RoPE usa múltiplas frequências e vetores; não é apenas posição módulo n. O relógio é uma ponte didática.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 56–64 min · A cidade das tarefas

**Conceito:** Dependências e ordens parciais

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Pesquisar primeiro; verificar e redigir podem acontecer juntos; revisar por último. A aresta Revisar → Pesquisar cria um ciclo.

### 1. A pergunta

Quais tarefas podem acontecer juntas sem atropelar uma dependência?

### 2. Um exemplo

Num trabalho em grupo, dá para conferir fontes e escrever juntos. Mas a revisão final precisa esperar o texto.

### 3. Seu palpite

E se o primeiro passo tiver de esperar pelo último?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Insira o ciclo e depois remova a dependência problemática.

### 6. Por que acontece?

Algumas tarefas podem acontecer juntas. Se uma espera pela outra em círculo, ninguém começa.

### 7. Onde a IA entra

Um assistente de IA pode dividir um pedido em pesquisar, escrever e revisar. O fluxo organiza quem espera por quem. Limite: As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados.

### 8. A próxima ideia

Mesmo com tudo organizado, ainda precisamos de espaço para guardar o que encontramos.

**Limite / erro comum:** As arestas são dependências diretas; a relação de ordem inclui caminhos transitivos. Agentes aqui são simulados.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: discuta fechamento transitivo, redução transitiva e mais de uma ordenação topológica.

## 64–72 min · As gavetas impossíveis

**Conceito:** Princípio das Casas dos Pombos

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** 5 objetos em 4 gavetas garantem colisão. Com até 4 ainda pode haver colisão, mas ela não é inevitável.

### 1. A pergunta

É possível distribuir 5 objetos em 4 gavetas sem repetir uma gaveta?

### 2. Um exemplo

Cinco amigos deixam seus celulares em quatro gavetas. Alguma gaveta terá que receber dois.

### 3. Seu palpite

Com quatro gavetas, quantos objetos tornam a repetição inevitável?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Compare uma distribuição manual com h(x) = x mod g.

### 6. Por que acontece?

Cinco objetos, quatro gavetas: pelo menos dois ficam juntos. Não depende de sorte; é falta de espaço.

### 7. Onde a IA entra

Computadores usam códigos curtos para organizar dados. Dois dados diferentes podem acabar com o mesmo código. Limite: n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas.

### 8. A próxima ideia

Aqui o resultado era inevitável. Mas e quando só sabemos o que é mais provável?

**Limite / erro comum:** n ≤ g não impede colisões; apenas deixa de garanti-las. Colisão de hash não significa igualdade das entradas.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 72–80 min · Por que a resposta muda?

**Conceito:** Distribuição e amostragem

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Não. Frequências flutuam; mais amostras tendem a aproximar proporções teóricas, sem igualdade obrigatória em uma execução.

### 1. A pergunta

O resultado mais provável precisa aparecer em toda tentativa?

### 2. Um exemplo

Complete “Hoje eu quero…”: dormir, viajar ou estudar? Há várias continuações.

### 3. Seu palpite

Se uma opção é a favorita, ela precisa aparecer sempre?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Aumente a temperatura e repita a amostragem com a mesma semente.

### 6. Por que acontece?

A favorita pode não sair. A temperatura muda o espaço dado às outras opções.

### 7. Onde a IA entra

Ao gerar texto, uma IA pode escolher entre continuações possíveis. Soar provável não garante estar certo. Limite: Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos.

### 8. A próxima ideia

Escolher uma resposta é uma parte. Saber quando enviá-la é outra.

**Limite / erro comum:** Probabilidade de um token não é probabilidade de uma afirmação ser verdadeira. Os logits são ilustrativos.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 80–88 min · A máquina de estados

**Conceito:** Estados e transições

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Enviar no estado inicial é inválido e não deve alterar o estado. A validação precisa ocorrer primeiro.

### 1. A pergunta

Um assistente pode entregar uma resposta antes de validar a solicitação?

### 2. Um exemplo

Um pedido de comida passa por recebido, confirmado, em preparo e entregue. Não faz sentido entregar antes de preparar.

### 3. Seu palpite

O assistente deve responder antes de conferir o pedido?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Provoque uma transição inválida e compare com o fluxo correto.

### 6. Por que acontece?

Cada etapa libera certas ações. Se a ação chega na hora errada, o fluxo deve recusá-la.

### 7. Onde a IA entra

Um atendimento pode usar IA para conversar e regras para organizar as etapas de cada pedido. Limite: Isso descreve o controle do software, não toda a computação de um modelo de linguagem.

### 8. A próxima ideia

Quanto mais caminhos e etapas existem, mais difícil fica verificar todas as possibilidades.

**Limite / erro comum:** Isso descreve o controle do software, não toda a computação de um modelo de linguagem.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 88–96 min · A explosão combinatória

**Conceito:** Crescimento e custo de busca

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Entre as famílias mostradas, n! ultrapassa um milhão em n = 10. 2ⁿ ultrapassa em n = 20. A medição é limitada a até 2¹⁶ estados.

### 1. A pergunta

Se funciona com 8 elementos, também funciona com 40?

### 2. Um exemplo

Organizar 3 pessoas numa fila é fácil. E testar todas as ordens possíveis de uma turma inteira?

### 3. Seu palpite

Qual família ultrapassa primeiro um milhão de possibilidades?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Dobre n e compare a mudança em cada família.

### 6. Por que acontece?

Acrescentar uma pessoa pode multiplicar muito o trabalho. Por isso, “tentar tudo” logo deixa de ser uma boa ideia.

### 7. Onde a IA entra

Sistemas de IA precisam escolher onde gastar tempo: quais caminhos explorar e quando parar. Limite: Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA.

### 8. A próxima ideia

Vamos juntar tudo: uma equipe, um pedido e alguns obstáculos para resolver.

**Limite / erro comum:** Medições são locais e pequenas. Tempos maiores usam uma taxa hipotética, não um benchmark de IA.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 96–104 min · A missão SYNAPSE

**Conceito:** Decidir, buscar, ordenar e limitar

**Ritmo:** 45s pergunta + 45s exemplo + 1min previsão + 2min simulação + 1min variação + 1min revelação + 1min aplicação + 30s ponte = 8min.

**Resposta esperada:** Autorize o pedido, mantenha a fonte alcançável, remova o ciclo e use capacidade de pelo menos 3 evidências.

### 1. A pergunta

Sua equipe consegue entregar uma resposta verificada com recursos limitados?

### 2. Um exemplo

Sua equipe precisa responder a um pedido. Há permissão? A fonte está acessível? As tarefas podem começar? As evidências cabem?

### 3. Seu palpite

Qual condição vai bloquear a primeira tentativa?

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Corrija um bloqueio por vez e execute novamente.

### 6. Por que acontece?

A missão funciona quando as quatro partes se encaixam: permissão, fonte, ordem das tarefas e espaço.

### 7. Onde a IA entra

Uma boa ferramenta de IA depende também de boas fontes, regras claras e conferência dos resultados. Limite: A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais.

### 8. A próxima ideia

As peças funcionaram juntas. Agora vamos ver o tamanho da rede que elas formam.

**Limite / erro comum:** A missão é um sistema didático determinístico; não garante qualidade semântica de respostas reais.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

Comece com os bloqueios padrão. Execute: a primeira verificação para na autorização. Autorize e execute de novo: agora aparece o ciclo. Remova o ciclo e execute: falta capacidade. Aumente a capacidade para 3 e rode a última vez. Deixe a turma narrar cada verificação até a conclusão.

## 104–114 min · O desafio da turma

**Conceito:** Prever antes de revelar

**Ritmo:** 1min introdução + 6 rodadas de 90s = 10min.

**Resposta esperada:** Gabarito: C, A, B, C, B, A. Peça justificativas antes de revelar. Divida cerca de 90 segundos por rodada, reservando um minuto à introdução.

### 1. A pergunta

Depois de experimentar, qual decisão você tomaria?

### 2. Um exemplo

Seis situações curtas. A turma vota levantando a mão.

### 3. Seu palpite

Escolha A, B ou C antes de revelar cada explicação.

### 4. Experimente

Faça uma alteração por vez. Antes de executar, peça uma previsão. Mostre quais elementos mudaram e quais ficaram iguais.

### 5. E se mudar?

Peça a alguém que votou diferente para defender a alternativa.

### 6. Por que acontece?

A resposta importa; o motivo que a sustenta importa mais.

### 7. Onde a IA entra

Reconhecer limites e contraexemplos ajuda a avaliar sistemas de IA. Limite: Não usamos aparência de texto para alegar autoria humana ou artificial.

### 8. A próxima ideia

Entender uma ideia dá a você poder para questionar, conferir e escolher melhor.

**Limite / erro comum:** Não usamos aparência de texto para alegar autoria humana ou artificial.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.

## 114–120 min · Uma ideia acende muitas outras

**Conceito:** Da abstração ao sistema

**Ritmo:** 2min síntese + 4min perguntas = 6min.

**Resposta esperada:** Aceite conexões bem justificadas. Reforce que cada modelo matemático tem hipóteses e não descreve sozinho toda a IA.

### 1. A pergunta

Diga: “Vocês viram as peças separadas. Agora quero mostrar o que acontece quando elas se conectam.” Mostre apenas os primeiros pontos e faça uma pausa.

### 2. Um exemplo

Toque em Conectar as ideias. Relacione dois temas que a turma acabou de experimentar.

### 3. Seu palpite

Diga: “Cada uma dessas ideias abre outras perguntas.” Toque em Revelar a rede inteira. Deixe a turma observar em silêncio por alguns segundos.

### 4. Experimente

Toque em Fazer a rede acender. Explique: “O cérebro aqui é uma metáfora. Cada ponto é uma nota; cada linha conecta ideias, como no Obsidian.”

### 5. E se mudar?

Escolha uma pergunta da turma entre as três disponíveis. Siga as áreas destacadas e leia a explicação em linguagem simples. O trajeto é uma ilustração didática.

### 6. Por que acontece?

Explore Aprendizado para distinguir este mapa de uma rede neural: na rede real, unidades fazem cálculos e pesos são ajustados durante o treinamento.

### 7. Onde a IA entra

Mostre Levar esta rede para o Obsidian. O arquivo contém notas de verdade, ligadas entre si. No Obsidian, abra a pasta como cofre e depois a visão de grafo.

### 8. A próxima ideia

Encerre: “A próxima conexão pode ser sua. Qual pergunta você acrescentaria aqui?” Abra para perguntas.

**Limite / erro comum:** O mapeamento com a ementa do professor ainda precisa ser validado.

**Se faltar tempo:** Comece pelo exemplo do dia a dia e peça um palpite. Só diga o nome técnico depois que a turma entender a ideia. Se já acertaram, faça uma execução e avance.

**Aprofundamento:** Extra: peça um contraexemplo em que a conclusão deixa de valer quando uma hipótese muda.
