import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, PRESENTATION_ACTS } from '../../store/usePresentationStore';
import {
  X,
  BookOpen,
  Clock,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface ActNotes {
  timeEstimate: string;
  hook: string;
  keyConcepts: string[];
  audienceQuestions: string[];
  commonMisconceptions: string[];
  liveDemoTips: string[];
}

const NOTES_BY_ACT: Record<number, ActNotes> = {
  1: {
    timeEstimate: '12 minutos',
    hook: '"Desde Alan Turing em 1950 até ontem, programar significava escrever regras explícitas. Na IA, nós invertemos a equação: alimentamos dados e a máquina descobre as regras."',
    keyConcepts: [
      'Computação Clássica: Regras + Dados = Respostas.',
      'Machine Learning: Dados + Respostas = Regras (pesos sinápticos).',
      'Por que isso importa: regras complexas como visão computacional ou tradução natural são humanamente impossíveis de programar com "if/else".',
    ],
    audienceQuestions: [
      'Quem aqui já tentou escrever uma expressão regular (Regex) complexa e quase enlouqueceu? Imagine escrever uma regra para reconhecer ironia!',
      'Vocês acham que a IA pensa como nós, ou ela apenas encontra padrões estatísticos em alta dimensão?',
    ],
    commonMisconceptions: [
      'Mito: "A IA é um banco de dados que busca respostas prontas no Google". Fato: Ela gera respostas do zero combinando pesos neurais.',
    ],
    liveDemoTips: [
      'Mova o slider de Ajuste de Pesos Sinápticos na tela e aponte para a curva de perda convergindo.',
      'Enfatize que os pesos são apenas números multiplicados em matrizes de GPU.',
    ],
  },
  2: {
    timeEstimate: '12 minutos',
    hook: '"Para uma IA, a palavra \'paralelepípedo\' não existe como um bloco sólido. Ela passa por uma esteira com uma lâmina de alta velocidade chamada Tokenizer."',
    keyConcepts: [
      'Tokens são fragmentos de subpalavras (BPE - Byte Pair Encoding).',
      'Janela de contexto: o número máximo de peças de Lego que o modelo consegue segurar na mesa de trabalho.',
      'Previsão de próximo token: a IA é essencialmente um gerador estatístico de probabilidade condicionada.',
    ],
    audienceQuestions: [
      'Por que você paga mais caro em tokens quando conversa em português ou manda emojis comparado ao inglês? (Resposta: porque o vocabulário base foi treinado em inglês e quebra palavras nossas em mais pedaços).',
      'Se o próximo token é uma probabilidade, por que o ChatGPT não dá uma resposta diferente toda vez? (Conceito de Temperatura).',
    ],
    commonMisconceptions: [
      'Mito: "1 token = 1 palavra". Fato: Em média, 100 palavras geram cerca de 130 tokens em inglês e até 180 em português.',
    ],
    liveDemoTips: [
      'Digite uma palavra comprida ou uma frase com gíria no input e mostre a guilhotina fatiando em blocos coloridos.',
      'Aponte para o medidor preditivo inferior e pergunte para a turma qual bloco eles acham que vai vir a seguir.',
    ],
  },
  3: {
    timeEstimate: '12 minutos',
    hook: '"Como o computador sabe que Cachorro e Lobo são primos, mas Carro é outra história? Ele coloca cada palavra em uma coordenada GPS em um mapa invisível de 1536 dimensões."',
    keyConcepts: [
      'Embeddings convertem significados em listas de números (vetores).',
      'Similaridade de Cosseno: proximidade angular no hiperespaço semântico.',
      'A mágica da álgebra vetorial: Vetor("Rei") - Vetor("Homem") + Vetor("Mulher") ≈ Vetor("Rainha").',
    ],
    audienceQuestions: [
      'Se eu puxar o nó "Carro" para perto de "Rei", o que acontece com a linha elástica? Observem a tensão na tela!',
      'Como a Netflix e o Spotify usam essa mesma física magnética para sugerir o seu próximo filme ou música?',
    ],
    commonMisconceptions: [
      'Mito: "Vetores só guardam palavras". Fato: Fotos, áudios e códigos-fonte viram vetores no mesmo espaço compartilhado (Multimodalidade).',
    ],
    liveDemoTips: [
      'Arraste o nó "Rei" ou "Cachorro" ao vivo e mostre a mola recalculando a similaridade de cosseno.',
      'Insira uma nova palavra com a turma no formulário inferior.',
    ],
  },
  4: {
    timeEstimate: '15 minutos',
    hook: '"Em 2017, um artigo do Google de apenas 8 páginas mudou a civilização: \'Attention Is All You Need\'. Foi aqui que nasceu o Transformer."',
    keyConcepts: [
      'Mecanismo de Auto-Atenção (Self-Attention): cada palavra avalia todas as outras ao mesmo tempo.',
      'Resolução de ambiguidades: em "O animal não atravessou a rua porque estava cansado", quem estava cansado? A atenção conecta "cansado" a "animal" com 89% de peso.',
      'Paralelismo massivo: permitiu treinar redes com trilhões de parâmetros em milhares de GPUs H100.',
    ],
    audienceQuestions: [
      'Antes dos Transformers, as redes liam palavra por palavra (RNNs e LSTMs). Por que elas esqueciam o começo de parágrafos longos?',
      'Vocês sabiam que o nome "GPT" significa Generative Pre-trained Transformer?',
    ],
    commonMisconceptions: [
      'Mito: "O Transformer entende os sentimentos humanos". Fato: Ele calcula o produto escalar entre matrizes Query, Key e Value.',
    ],
    liveDemoTips: [
      'Passe o mouse na palavra "cansado" e mostre a iluminação em roxo apontando diretamente para "animal" e ignorando "rua".',
      'Destaque como essa mesma matemática se aplica a pixels de imagem e notas musicais.',
    ],
  },
  5: {
    timeEstimate: '15 minutos',
    hook: '"Em 2024 e 2025, uma nova muralha caiu: os modelos agora param para pensar antes de responder. É a era do DeepSeek-R1 e OpenAI o1."',
    keyConcepts: [
      'Test-Time Compute: em vez de gerar tokens instantaneamente, o modelo gasta poder computacional explorando hipóteses.',
      'Tree-of-Thought e MCTS: o modelo cria ramificações, detecta becos sem saída e volta atrás sozinho.',
      'A tag `<think>`: a cadeia interna de monólogo reflexivo que não é exibida na resposta final.',
    ],
    audienceQuestions: [
      'Quem aqui já fez uma prova de matemática difícil e começou a rascunhar no canto da página antes de colocar a resposta definitiva? Modelos de raciocínio fazem isso!',
      'Qual o perigo de uma IA responder rápido demais sem reflexão?',
    ],
    commonMisconceptions: [
      'Mito: "DeepSeek e o1 são apenas modelos maiores em tamanho". Fato: Eles têm o mesmo tamanho ou até menor, mas foram treinados com Aprendizado por Reforço (RL) puro para pensar.',
    ],
    liveDemoTips: [
      'Clique no botão [Simular Raciocínio (Tree-of-Thought)] e narre os caminhos sendo descartados em vermelho até a consagração em verde.',
      'Leia em voz alta as etapas do monólogo oculto `<think>`.',
    ],
  },
  6: {
    timeEstimate: '12 minutos',
    hook: '"Quem manda no mundo da IA hoje? O monopólio da OpenAI acabou e o jogo se transformou em uma batalha épica entre proprietários e código aberto."',
    keyConcepts: [
      'OpenAI: pioneira comercial, ecossistema e ferramentas integradas.',
      'Anthropic (Claude 3.5 Sonnet): o favorito absoluto de programadores de elite por não gerar alucinações de código.',
      'Google (Gemini): multimodalidade nativa e memória colossal de 2 milhões de tokens.',
      'DeepSeek & Llama: a revolução open-source que permite rodar modelos de fronteira na sua máquina local com Ollama.',
    ],
    audienceQuestions: [
      'Se você tivesse que escolher apenas uma IA para levar para uma ilha deserta para programar um sistema, qual seria?',
      'Qual o risco para empresas brasileiras de enviar dados confidenciais de clientes para APIs em servidores estrangeiros?',
    ],
    commonMisconceptions: [
      'Mito: "Modelos Open-Source são fracos e amadores". Fato: DeepSeek-R1 e Llama 3 superam modelos fechados custando uma fração do valor.',
    ],
    liveDemoTips: [
      'Alterne entre os 4 cards dos Gigantes e aponte para a comparação de custo por milhão de tokens.',
      'Mencione que rodar local com Ollama tem custo zero de API.',
    ],
  },
  7: {
    timeEstimate: '12 minutos',
    hook: '"O maior medo de qualquer empresa ao adotar IA é a alucinação. Como garantir que o modelo nunca invente dados fiscais ou jurídicos? A resposta se chama RAG."',
    keyConcepts: [
      'RAG (Retrieval-Augmented Generation): consultar manuais e PDFs confiáveis antes de redigir a resposta.',
      'Chunking: quebrar documentos em pedaços de 500 tokens para indexar em bancos de dados vetoriais.',
      'Obsidian e Segundo Cérebro: como organizar seu próprio grafo de notas interligadas para nutrir a IA.',
    ],
    audienceQuestions: [
      'Alguém aqui já usou o NotebookLM do Google? O que mais impressionou vocês nele?',
      'Como vocês organizam as anotações da faculdade ou do trabalho hoje: em pastas soltas ou em rede conectada?',
    ],
    commonMisconceptions: [
      'Mito: "Para ensinar novos dados à IA, eu preciso fazer fine-tuning caro". Fato: RAG resolve 95% dos problemas de conhecimento corporativo com custo quase nulo.',
    ],
    liveDemoTips: [
      'Alterne para a aba "Simulador RAG" e mostre a pergunta encontrando a página 27 exata do PDF com citação ancorada.',
      'Depois alterne para o "Grafo Obsidian" e mostre os nós de notas conectados.',
    ],
  },
  8: {
    timeEstimate: '12 minutos',
    hook: '"Não estamos mais na época de copiar e colar código do ChatGPT. O desenvolvimento moderno acontece dentro de IDEs que entendem o seu projeto inteiro."',
    keyConcepts: [
      'Cursor e Windsurf: editores que leem todo o grafo de arquivos do repositório e prevêem edições em múltiplos arquivos.',
      'Next Edit Prediction: o modelo sabe qual função você vai editar antes mesmo de você abrir o arquivo.',
      'v0.dev e Lovable: da conversa em linguagem natural para telas React completas em Tailwind em menos de 30 segundos.',
    ],
    audienceQuestions: [
      'Quantas horas da semana de vocês são gastas fazendo telas repetitivas de formulário ou CRUD?',
      'Vocês preferem autocompletar linha por linha ou instruir a IA a gerar uma feature inteira com testes?',
    ],
    commonMisconceptions: [
      'Mito: "Ferramentas como o Cursor vão acabar com os engenheiros". Fato: Elas transformam desenvolvedores juniores em plenos e seniores em equipes inteiras.',
    ],
    liveDemoTips: [
      'Clique no botão [Pressione Tab para Aceitar] na demonstração do Cursor e mostre a linha fantasma sendo aceita.',
      'Alterne para o v0.dev e gere a UI em 1 clique.',
    ],
  },
  9: {
    timeEstimate: '12 minutos',
    hook: '"O ápice da tecnologia hoje são os Agentes Autônomos: sistemas que recebem um objetivo, planejam, abrem o terminal, erram, corrigem o bug e só te chamam quando tudo está funcionando."',
    keyConcepts: [
      'O Paradigma ReAct: Reason (Pensar) ➔ Act (Agir com Ferramentas) ➔ Observe (Analisar Saída).',
      'Acesso a Ferramentas Reais: Bash, Python, Navegador Web, Leitura de Telas.',
      'Loop de Auto-Correção: se um teste unitário falha, o agente lê a mensagem de erro do terminal e reescreve o código sozinho.',
    ],
    audienceQuestions: [
      'Qual tarefa chata do trabalho de vocês vocês pagariam para um agente fazer sozinho toda madrugada?',
      'Onde fica o limite ético de dar permissão para um agente executar comandos no seu computador?',
    ],
    commonMisconceptions: [
      'Mito: "Agentes são IAs mágicas que nunca erram". Fato: Eles erram bastante, mas a virtude deles é ter um loop de feedback para consertar o próprio erro.',
    ],
    liveDemoTips: [
      'Clique em [Executar Tarefa do Agente] e narre o pulso de luz percorrendo o circuito.',
      'Destaque no terminal a linha amarela onde o teste falhou e o agente se auto-corrigiu antes de disparar os confetes.',
    ],
  },
  10: {
    timeEstimate: '6 minutos',
    hook: '"Chegamos ao fim da nossa jornada de 2 horas. O futuro pertence aos profissionais que souberem ser maestros dessa sinfonia de inteligência."',
    keyConcepts: [
      'Competência 1: Arquitetura & Clareza de Especificação (o código é barato, a clareza é cara).',
      'Competência 2: Validação Crítica & Testes (auditar o que a IA gera para evitar desastres).',
      'Competência 3: Orquestração de Agentes (comandar um enxame de copilotos especializados).',
    ],
    audienceQuestions: [
      'Qual foi o conceito que mais explodiu a cabeça de vocês hoje ao longo desses 10 atos?',
      'O que vocês vão começar a fazer de diferente já a partir de amanhã?',
    ],
    commonMisconceptions: [
      'Mito: "Tenho medo de ficar obsoleto". Fato: Quem estuda os fundamentos e experimenta as ferramentas na prática se torna indispensável.',
    ],
    liveDemoTips: [
      'Clique no botão [Celebrar Conclusão da Aula!] para disparar a chuva de confetes.',
      'Abra o microfone para perguntas da turma e do professor.',
    ],
  },
};

export const PresenterNotes: React.FC = () => {
  const { currentAct, isPresenterNotesOpen, setPresenterNotesOpen } = usePresentationStore();
  const notes = NOTES_BY_ACT[currentAct] || NOTES_BY_ACT[1];
  const actMeta = PRESENTATION_ACTS[currentAct - 1];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresenterNotesOpen) {
        setPresenterNotesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenterNotesOpen, setPresenterNotesOpen]);

  return (
    <AnimatePresence>
      {isPresenterNotesOpen && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#0b0f19] border-l border-slate-800 z-50 shadow-2xl flex flex-col select-text"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0e1424]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Colinha do Apresentador (2 Horas)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {actMeta.actNumberStr}: {actMeta.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-amber-400" /> {notes.timeEstimate}
              </span>
              <button
                onClick={() => setPresenterNotesOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Fechar (Esc ou P)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin text-xs leading-relaxed text-slate-300">
            {/* Hook de Abertura */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Frase de Impacto para Abrir o Ato (Hook)
              </div>
              <p className="italic text-slate-200">
                {notes.hook}
              </p>
            </div>

            {/* Conceitos-Chave */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase tracking-wider text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400" /> Conceitos Didáticos para Transmitir
              </div>
              <ul className="space-y-2 pl-2">
                {notes.keyConcepts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perguntas para Engajar a Plateia */}
            <div className="space-y-2 bg-[#080c14] p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase tracking-wider text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Perguntas para a Turma
              </div>
              <ul className="space-y-2 pl-2 text-slate-300">
                {notes.audienceQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mitos e Armadilhas */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-white font-semibold uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Mitos Comuns para Desmistificar
              </div>
              <ul className="space-y-2 pl-2">
                {notes.commonMisconceptions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dicas Práticas de Palco */}
            <div className="space-y-2 bg-[#090d16] p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5" /> Dicas de Demonstração Interativa no Palco
              </div>
              <ul className="space-y-2 pl-2 text-slate-300">
                {notes.liveDemoTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 bg-[#080c14] border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>[ P ] fecha colinha</span>
            <span>Espaço avança ato</span>
            <span>[ D ] ativa giz</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
