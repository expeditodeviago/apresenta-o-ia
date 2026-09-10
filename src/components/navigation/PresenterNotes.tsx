// src/components/navigation/PresenterNotes.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore, PRESENTATION_ACTS } from '../../store/usePresentationStore';
import {
  BookOpen,
  Clock,
  Sparkles,
  HelpCircle,
  Lightbulb,
  X,
  Play,
} from 'lucide-react';

interface ActGuideContent {
  hook: string;
  duration: string;
  concept: string;
  audienceQuestions: string[];
  demoTip: string;
}

const ACT_NOTES: Record<number, ActGuideContent> = {
  1: {
    hook: '"Uma IA não enxerga palavras ou letras. Ela enxerga peças de Lego numéricas chamadas tokens."',
    duration: '10 a 12 minutos',
    concept: 'Tokenização Subword (BPE) & Modelagem Autoregressiva de Próximo Token via Probabilidade Condicional.',
    audienceQuestions: [
      'Por que modelos de linguagem tropeçam ao contar letras na palavra "morango"? (Porque "morango" é um único token!)',
      'O que acontece quando aumentamos a temperatura: a IA fica mais criativa ou mais incoerente?',
    ],
    demoTip: 'Digite palavras raras ou pontuações para ver os blocos coloridos caindo na esteira e o velocímetro oscilar!',
  },
  2: {
    hook: '"A temperatura é a alavanca do caos: no zero, um robô mecânico; no dois, um poeta psicodélico que alucina."',
    duration: '10 a 12 minutos',
    concept: 'Amostragem de Probabilidade via Softmax com Temperatura (Argmax Determinístico vs Golden Ratio 0.7 vs Entropia Máxima).',
    audienceQuestions: [
      'Em tarefas de programação ou cálculos fiscais, qual temperatura devemos usar? (0.0 a 0.2 para evitar alucinação!)',
      'Por que a temperatura não treina o modelo, mas apenas muda a forma como ele sorteia a próxima palavra?',
    ],
    demoTip: 'Arraste o slider para 0.0 e mostre o Bit congelado, depois coloque em 0.7 para o brilho dourado e em 2.0 para a tela queimar!',
  },
  3: {
    hook: '"Palavras não são apenas texto. No hiperespaço de 4096 dimensões, elas têm latitude, longitude e gravidade."',
    duration: '12 a 15 minutos',
    concept: 'Espaço Vetorial Semântico, Embeddings e Distância de Cosseno: a matemática que transforma palavras em vetores.',
    audienceQuestions: [
      'Se subtrairmos "Homem" de "Rei" e somarmos "Mulher", por que o vetor resultante aponta com tanta precisão para "Rainha"?',
      'Como a IA sabe que "banco" financeiro e "banco" de praça estão em vizinhanças geométricas diferentes?',
    ],
    demoTip: 'Selecione os 3 presets na bússola radar para mostrar os ângulos vetoriais e a correspondência geométrica exata.',
  },
  4: {
    hook: '"Como a IA sabe quem veio antes ou depois se processa todas as palavras ao mesmo tempo? Bem-vindos ao relógio modular de RoPE."',
    duration: '12 a 15 minutos',
    concept: 'Aritmética Modular (Z_n), Congruência e Rotações Angulares no Plano Complexo (RoPE - Rotary Position Embedding).',
    audienceQuestions: [
      'Se um relógio de 12 horas marca 2 horas, onde ele estará após 14 horas? (Em 2 horas: 14 ≡ 2 mod 12!)',
      'Por que girar o vetor em vez de somar um número permite ao Transformer ler textos de 128k+ tokens sem perder a ordem?',
    ],
    demoTip: 'Mova os dois ponteiros no relógio e mostre que o produto escalar cos(Δθ) depende apenas da distância relativa (m - n)!',
  },
  5: {
    hook: '"Em 2017, o paper Attention Is All You Need destruiu as redes recorrentes e inaugurou a era moderna da IA."',
    duration: '15 a 18 minutos',
    concept: 'Mecanismo de Auto-Atenção (Self-Attention) e os tensores de Query (Q), Key (K) e Value (V).',
    audienceQuestions: [
      'Na frase: "O animal não atravessou a rua porque estava cansado", quem estava cansado? A rua ou o animal?',
      'Como a atenção permite processar todas as palavras simultaneamente ao invés de ler uma a uma em fila?',
    ],
    demoTip: 'Passe o cursor sobre "cansado" e mostre o feixe de laser mais espesso conectando com 89% de peso a "animal".',
  },
  6: {
    hook: '"A memória de um LLM é finita e caríssima. Se você colocar um PDF gigante sem estratégia, o modelo esquece o início da conversa."',
    duration: '12 a 15 minutos',
    concept: 'Janela de Contexto (Context Window), o Paradoxo "Lost in the Middle" e Compressão Semântica via RAG.',
    audienceQuestions: [
      'Por que passar um livro inteiro para a IA custa caro e faz o modelo se perder?',
      'Como o fatiamento em chunks vetoriais permite responder com precisão cirúrgica sem estourar o limite de tokens?',
    ],
    demoTip: 'Adicione blocos até estourar a capacidade em vermelho (32k), depois clique em "Comprimir com RAG" para salvar o contexto!',
  },
  7: {
    hook: '"LLMs tradicionais chutam a primeira resposta que vem à cabeça. Modelos de Raciocínio pensam antes de falar."',
    duration: '15 a 20 minutos',
    concept: 'Test-Time Compute, Árvores de Pensamento (Tree of Thoughts) e Backtracking com a tag <think>.',
    audienceQuestions: [
      'Por que gastar mais tempo calculando no momento da resposta (inferência) é mais barato do que treinar um modelo 10x maior?',
      'O que o robô faz quando percebe que entrou num beco sem saída lógico?',
    ],
    demoTip: 'Clique em Modo Demonstração e veja o robô Bit bater no beco coral, descartar a hipótese e vencer pelo caminho menta!',
  },
  8: {
    hook: '"A guerra dos modelos não é sobre quem tem o maior número de parâmetros, mas quem entrega inteligência com menor custo e maior precisão."',
    duration: '15 a 18 minutos',
    concept: 'Comparativo de Arquiteturas: Open-source (DeepSeek-R1), Código & Raciocínio (Claude 3.5 Sonnet) e Multimodalidade (GPT-4o).',
    audienceQuestions: [
      'Se o DeepSeek custa 30x menos para rodar inferência, os monopólios de nuvem proprietária estão ameaçados?',
      'Qual modelo você escolheria para construir um agente de software completo?',
    ],
    demoTip: 'Incline as cartas 3D holográficas com o mouse e dispare o confronto de Código e Lógica para comparar as barras de energia!',
  },
  9: {
    hook: '"Conhecimento isolado é inútil. O verdadeiro salto de produtividade vem da integração dos LLMs às nossas ferramentas."',
    duration: '15 a 20 minutos',
    concept: 'O Ecossistema de Ferramentas: Segundo Cérebro (Obsidian), IDEs Agênticas (Cursor), Wireframing (v0) e Grounded RAG (NotebookLM).',
    audienceQuestions: [
      'Como uma base de notas conectadas reduz a sobrecarga cognitiva diária?',
      'Por que o RAG do NotebookLM blindado por PDFs oficiais não alucina como um chatbot genérico?',
    ],
    demoTip: 'Puxe as notas da constelação do Obsidian e demonstre o autocompletar multi-arquivo com Tab no simulador do Cursor.',
  },
  10: {
    hook: '"A IA não mente por maldade: ela inventa com a mesma elegância com que diz a verdade. Como podemos pegá-la no pulo?"',
    duration: '12 a 15 minutos',
    concept: 'Alucinações em LLMs, Ground Truth e Auditoria com Citações Oficiais de Documentos Fonte (RAG Scanner).',
    audienceQuestions: [
      'Por que um LLM inventa citações de livros que nunca existiram com nomes de autores reais?',
      'Como a exigência de número de página auditável (ex: [Pág. 12]) protege sistemas jurídicos e médicos?',
    ],
    demoTip: 'Peça para a sala tentar descobrir qual afirmação é falsa antes de disparar o raio do scanner RAG revelando o erro em vermelho!',
  },
  11: {
    hook: '"Se um agente esperar pelo outro em círculo, a IA trava para sempre. Como a teoria dos Grafos Acíclicos (DAGs) salva os agentes de software?"',
    duration: '15 a 18 minutos',
    concept: 'Conjuntos Parcialmente Ordenados (Posets), Relações de Precedência Estritas, Detecção de Ciclos e Deadlocks.',
    audienceQuestions: [
      'O que acontece se o Deploy depender do Código e o Código depender do Deploy? (Deadlock / Ciclo!)',
      'Como a ordenação topológica garante que cada agente receba o insumo antes de começar a trabalhar?',
    ],
    demoTip: 'Clique em "Injetar Dependência Circular" para disparar o alarme vermelho, e depois desembarace com a Ordenação Topológica!',
  },
  12: {
    hook: '"Um modelo sozinho é um oráculo. Múltiplos modelos coordenados formam uma equipe de desenvolvimento inteira."',
    duration: '15 a 18 minutos',
    concept: 'Enxames de Agentes Autônomos, o Loop ReAct (Thought -> Action -> Observation) e Auto-correção de bugs.',
    audienceQuestions: [
      'Se um agente cometer um erro de sintaxe, como o agente testador detecta e manda o coder refatorar automaticamente?',
      'Estamos caminhando para equipes de 1 humano e 10 agentes especializados?',
    ],
    demoTip: 'Clique em [ Criar App do Zero ] e acompanhe a troca supersônica de arquivos até o mini-app interativo ficar pronto!',
  },
  13: {
    hook: '"Chegamos à fronteira: será que você consegue distinguir a faísca humana da máquina mais avançada do planeta?"',
    duration: '15 a 20 minutos',
    concept: 'O Teste de Turing Contemporâneo: assinaturas de RLHF vs idiossincrasias do pensamento criativo humano.',
    audienceQuestions: [
      'Quais são as impressões digitais de um texto gerado por IA? (Listas numeradas, palavras rebuscadas, tom excessivamente polido).',
      'Quem na sala já foi enganado por uma arte ou áudio sintetizado?',
    ],
    demoTip: 'Peça para a plateia levantar a mão votando "Humano" ou "IA" antes de clicar na resposta e estourar a chuva de confetes!',
  },
};

export const PresenterNotes: React.FC = () => {
  const { isPresenterNotesOpen, togglePresenterNotes, currentAct } = usePresentationStore();
  const currentMeta = PRESENTATION_ACTS.find((a) => a.id === currentAct) || PRESENTATION_ACTS[0];
  const notes = ACT_NOTES[currentAct] || ACT_NOTES[1];

  return (
    <AnimatePresence>
      {isPresenterNotesOpen && (
        <motion.aside
          initial={{ opacity: 0, y: -400 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -400 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed top-0 left-0 right-0 z-50 pointer-events-auto liquid-glass border-b border-white/15 bg-slate-950/95 shadow-2xl backdrop-blur-3xl px-6 py-5 max-h-[85vh] overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Header da Gaveta */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                      NOTAS DO APRESENTADOR • {currentMeta.actNumberStr}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {notes.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {currentMeta.title}: {currentMeta.subtitle}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePresenterNotes}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                  title="Fechar notas (Tecla P)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid com os 4 Pilares da Fala */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Coluna 1: Gancho & Conceito */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>GANCHO DE ABERTURA (15s)</span>
                </div>
                <p className="text-sm font-medium text-amber-100 italic leading-relaxed">
                  {notes.hook}
                </p>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">
                    Conceito Chave
                  </span>
                  <p className="text-xs text-zinc-300 leading-normal">
                    {notes.concept}
                  </p>
                </div>
              </div>

              {/* Coluna 2: Perguntas para a Sala */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>PERGUNTAS PARA A SALA</span>
                </div>
                <div className="space-y-2">
                  {notes.audienceQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-200 leading-relaxed">
                      <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coluna 3: Dica de Demonstração Interativa */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>O QUE DEMONSTRAR AO VIVO</span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {notes.demoTip}
                </p>
                <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-300">
                    Auto-Play mãos livres disponível
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    ▶️ AUTO-PLAY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
