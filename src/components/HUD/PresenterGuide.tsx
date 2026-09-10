// src/components/HUD/PresenterGuide.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, GAME_LEVELS } from '../../store/useGameStore';
import {
  X,
  BookOpen,
  Sparkles,
  Lightbulb,
  HelpCircle,
  AlertTriangle,
  Gamepad2,
} from 'lucide-react';

interface LevelNotes {
  timeEstimate: string;
  hook: string;
  keyConcepts: string[];
  audienceQuestions: string[];
  commonMisconceptions: string[];
  gameplayTips: string[];
}

const NOTES_BY_LEVEL: Record<number, LevelNotes> = {
  1: {
    timeEstimate: '15 min',
    hook: '"Para a IA, a palavra não existe como um bloco sólido. Ela é fatiada em peças de LEGO chamadas tokens e o modelo calcula probabilidades para prever o próximo bloco."',
    keyConcepts: [
      'Tokenização (BPE): Divisão em sub-palavras que equilibra eficiência de vocabulário e flexibilidade.',
      'Softmax & Probabilidade: Distribuição estatística sobre 100.000 tokens candidatos.',
      'Temperatura: Parâmetro que achata (criativo) ou afunila (determinístico) a curva de escolha.',
    ],
    audienceQuestions: [
      'Por que conversar em português ou mandar emojis gasta mais tokens do que em inglês?',
      'Se a IA é probabilística, por que ela não responde coisas aleatórias o tempo todo?',
    ],
    commonMisconceptions: [
      'Mito: "1 token = 1 palavra". Fato: 100 palavras em português geram cerca de 140 a 180 tokens.',
    ],
    gameplayTips: [
      'Use o Modo Demonstração ou clique em "dominar" para ver o cálculo do próximo token na esteira.',
      'Varie o slider de temperatura para mostrar como o modelo se torna caótico em valores altos.',
    ],
  },
  2: {
    timeEstimate: '15 min',
    hook: '"Como a máquina sabe que Rei e Rainha são parentes semânticos? Ela transforma conceitos em coordenadas GPS em um mapa invisível de milhares de dimensões."',
    keyConcepts: [
      'Embeddings: Vetores densos de números reais onde a proximidade angular reflete afinidade de sentido.',
      'Álgebra Vetorial: Vetor(Rei) - Vetor(Homem) + Vetor(Mulher) ≈ Vetor(Rainha).',
      'Similaridade de Cosseno: Métrica geométrica padronizada entre -1 e +1.',
    ],
    audienceQuestions: [
      'Como o algoritmo de recomendação do Spotify ou Netflix usa esses mesmos vetores para indicar sua próxima música favorita?',
      'Vocês sabiam que fotos, áudios e códigos-fonte viram vetores no mesmo espaço compartilhado?',
    ],
    commonMisconceptions: [
      'Mito: "Embeddings servem apenas para procurar palavras parecidas". Fato: São o alicerce da busca vetorial corporativa (RAG).',
    ],
    gameplayTips: [
      'Clique nos presets para mostrar os vetores conectando "Homem ➔ Mulher" e "Rei ➔ Rainha".',
      'Aponte para o paralelismo geométrico das retas na tela.',
    ],
  },
  3: {
    timeEstimate: '15 min',
    hook: '"Em 2017, um artigo de apenas 8 páginas do Google mudou o mundo: \'Attention Is All You Need\'. Nascia o Transformer e a capacidade de conectar qualquer palavra a todas as outras."',
    keyConcepts: [
      'Auto-Atenção (Self-Attention): Cada palavra avalia o contexto de todas as outras simultaneamente.',
      'Resolução de Ambiguidades: Em "O animal não atravessou a rua porque estava cansado", "cansado" conecta a "animal" com 89% de atenção.',
      'Treinamento Paralelo: Destravou a capacidade de rodar em milhares de GPUs sem gargalo sequencial.',
    ],
    audienceQuestions: [
      'Antes dos Transformers, os modelos liam palavra por palavra (RNNs). Por que eles esqueciam o começo de textos longos?',
      'Alguém sabe o que significa a sigla GPT? (Generative Pre-trained Transformer).',
    ],
    commonMisconceptions: [
      'Mito: "O Transformer compreende sentimentos humanos". Fato: Ele calcula produtos escalares entre matrizes Query (Q), Key (K) e Value (V).',
    ],
    gameplayTips: [
      'Passe o mouse na palavra "cansado" e mostre a barra de energia disparando para "animal".',
      'Acione o botão Modo Demonstração para ver o ciclo automático de atenção.',
    ],
  },
  4: {
    timeEstimate: '18 min',
    hook: '"A maior barreira que caiu em 2024 e 2025: a IA agora para para pensar antes de falar. É a era do DeepSeek-R1 e OpenAI o1."',
    keyConcepts: [
      'Test-Time Compute: Gastar poder computacional no momento da inferência testando hipóteses.',
      'Backtracking & MCTS: Ao encontrar um beco sem saída, o modelo volta atrás e busca outro ramo.',
      'A Tag <think>: O monólogo reflexivo interno que é descartado na resposta final.',
    ],
    audienceQuestions: [
      'Quem aqui já fez um rascunho no canto da folha de prova antes de passar a resposta a limpo? É exatamente isso que esses modelos fazem!',
      'Por que essa capacidade de reflexão é crítica para programação e medicina?',
    ],
    commonMisconceptions: [
      'Mito: "Modelos de raciocínio são apenas maiores em parâmetros". Fato: Eles têm o mesmo tamanho, mas foram treinados com Aprendizado por Reforço puro para refletir.',
    ],
    gameplayTips: [
      'Clique em "Modo Demonstração" e narre o robô batendo na parede em (3,3), a fumaça de erro e o retorno pelo ramo certo.',
      'Leia as linhas geradas no terminal lateral em tempo real.',
    ],
  },
  5: {
    timeEstimate: '18 min',
    hook: '"O ringue da tecnologia pegou fogo: o monopólio fechado da OpenAI foi abalado pelo meteoro open-source chinês DeepSeek-R1, custando 20x menos."',
    keyConcepts: [
      'Open-Source vs Proprietário: A soberania de rodar modelos na sua máquina local com Ollama.',
      'Custo por Milhão de Tokens: O abismo econômico ($0.14 vs $5.00) que muda o modelo de negócios de software.',
      'Especialização: Modelos de raciocínio lógico vs modelos de síntese multimodal ultra-rápida.',
    ],
    audienceQuestions: [
      'Qual o risco de uma empresa nacional enviar dados confidenciais para servidores em nuvens estrangeiras?',
      'Se vocês precisassem processar 100 milhões de notas fiscais, qual modelo escolheriam?',
    ],
    commonMisconceptions: [
      'Mito: "Modelos abertos são fracos e amadores". Fato: DeepSeek-R1 superou modelos fechados nos benchmarks de matemática e código.',
    ],
    gameplayTips: [
      'Acione o golpe "Shock de Custo" e mostre o dano crítico infligido pelo custo 95% mais barato.',
      'Ou use o Modo Demonstração para ver o combate completo acontecer sozinho.',
    ],
  },
  6: {
    timeEstimate: '20 min',
    hook: '"Não estamos mais na época de copiar e colar código do ChatGPT. O ecossistema moderno conecta seu Segundo Cérebro (Obsidian), editores de próxima geração (Cursor) e RAG confiável."',
    keyConcepts: [
      'Obsidian: Grafo de notas interconectadas que serve de combustível para a IA.',
      'Cursor / Windsurf: Indexação de todo o repositório e Next Edit Prediction em múltiplos arquivos.',
      'v0.dev / Lovable: Da conversa em linguagem natural para telas React completas em Tailwind em segundos.',
      'NotebookLM / RAG: Consulta de fontes confiáveis eliminando alucinações.',
    ],
    audienceQuestions: [
      'Quantas horas da semana de vocês são gastas fazendo telas repetitivas de formulário ou CRUD?',
      'Alguém já usou o NotebookLM do Google para estudar apostilas ou livros inteiros?',
    ],
    commonMisconceptions: [
      'Mito: "Para ensinar novos dados à IA, eu preciso treinar um modelo novo". Fato: RAG resolve 95% dos problemas empresariais com custo quase zero.',
    ],
    gameplayTips: [
      'Alterne entre as 4 abas para demonstrar cada uma das ferramentas.',
      'Pressione Tab na aba Cursor para aceitar a linha de código simulada.',
    ],
  },
  7: {
    timeEstimate: '18 min',
    hook: '"O ápice da tecnologia hoje são os Agentes Autônomos: equipes digitais que recebem uma meta, decompõem tarefas, erram, corrigem o bug no terminal e só te chamam quando tudo está pronto."',
    keyConcepts: [
      'Loop ReAct: Reason (Pensar) ➔ Act (Usar Ferramentas) ➔ Observe (Analisar Resultado).',
      'Divisão de Papéis: Arquiteto planeja, Coder escreve, Tester audita.',
      'Auto-Correção: O agente lê o stack trace do teste e reescreve a função com defeito sozinho.',
    ],
    audienceQuestions: [
      'Qual tarefa chata da rotina de vocês vocês pagariam para um agente fazer sozinho de madrugada?',
      'Onde fica o limite ético de dar permissão para um agente rodar comandos de terminal?',
    ],
    commonMisconceptions: [
      'Mito: "Agentes nunca erram". Fato: Eles erram frequentemente, mas têm sensores para consertar o próprio erro.',
    ],
    gameplayTips: [
      'Clique nos bugs na tela ou aperte "Modo Demonstração" para acelerar o progresso até 100% e exibir o mini-app gerado.',
    ],
  },
  8: {
    timeEstimate: '15 min',
    hook: '"Chegamos ao teste definitivo de Turing: será que conseguimos distinguir com nossos próprios olhos o que foi criado por humanos daquilo gerado por matrizes de silício?"',
    keyConcepts: [
      'O Teste de Turing Moderno: A linha tênue entre síntese algorítmica e autenticidade humana.',
      'Pistas Ocultas: Padrões de alucinação, comentários hiper-didáticos de código e rimas quadradas.',
      'O Futuro da Co-Criação: O profissional do futuro é o maestro de orquestra da inteligência.',
    ],
    audienceQuestions: [
      'Quem aqui vota que a Opção A é IA? Levantem as mãos!',
      'Qual pista fez vocês desconfiarem do texto?',
    ],
    commonMisconceptions: [
      'Mito: "A IA é sempre fria e o humano é sempre poético". Fato: Modelos de linguagem modernos simulam imperfeições e sentimentos com maestria.',
    ],
    gameplayTips: [
      'Peça os votos da plateia antes de clicar no card para revelar.',
      'Celebre com a chuva de confetes no final!',
    ],
  },
};

export const PresenterGuide: React.FC = () => {
  const { currentLevel, isPresenterGuideOpen, setPresenterGuideOpen } = useGameStore();
  const notes = NOTES_BY_LEVEL[currentLevel] || NOTES_BY_LEVEL[1];
  const currentMeta = GAME_LEVELS[currentLevel - 1] || GAME_LEVELS[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPresenterGuideOpen) {
        setPresenterGuideOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenterGuideOpen, setPresenterGuideOpen]);

  return (
    <AnimatePresence>
      {isPresenterGuideOpen && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#090d16] border-l border-zinc-800 z-50 shadow-2xl flex flex-col select-text"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>Guia do Apresentador</span>
                  <span className="text-blue-400 font-mono text-xs">({notes.timeEstimate})</span>
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {currentMeta.levelNumberStr}: {currentMeta.title}
                </span>
              </div>
            </div>

            <button
              onClick={() => setPresenterGuideOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Fechar Guia (P ou Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Notes Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-zinc-300 scrollbar-thin">
            {/* Hook */}
            <div className="bg-blue-500/10 border border-blue-500/25 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Frase de Impacto para Abrir o Módulo (Hook)
              </div>
              <p className="italic text-zinc-200">
                {notes.hook}
              </p>
            </div>

            {/* Conceitos Didáticos */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold uppercase tracking-wider text-[11px]">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400" /> Conceitos-Chave
              </div>
              <ul className="space-y-1.5 pl-2">
                {notes.keyConcepts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perguntas para a Plateia */}
            <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                <HelpCircle className="w-3.5 h-3.5" /> Perguntas Interativas para a Turma
              </div>
              <ul className="space-y-1.5 pl-2">
                {notes.audienceQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-200">
                    <span className="text-purple-400 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mitos Comuns */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" /> Mitos Comuns para Desmistificar
              </div>
              <ul className="space-y-1.5 pl-2">
                {notes.commonMisconceptions.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-rose-400 font-bold">⚠</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dicas de Gameplay */}
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <Gamepad2 className="w-3.5 h-3.5" /> Dicas de Palco & Auto-Play
              </div>
              <ul className="space-y-1.5 pl-2">
                {notes.gameplayTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-200">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex items-center justify-between">
            <span>[ P ] Fechar Guia</span>
            <span>[ D ] Lápis</span>
            <span>Espaço avança módulo</span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
