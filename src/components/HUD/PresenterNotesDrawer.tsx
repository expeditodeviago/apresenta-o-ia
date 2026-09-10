import React from 'react';
import { Mic, Lightbulb, Sparkles, X, HelpCircle } from 'lucide-react';
import { NODES } from '../../data/presentationData';

interface PresenterNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  isQuizActive?: boolean;
}

interface NoteData {
  whatToSay: string;
  analogy: string;
  stageTip: string;
  engagementQuestion?: string;
  suggestedAnswer?: string;
}

const NOTES_DATABASE: Record<number, NoteData> = {
  1: {
    whatToSay: 'Explique que a IA não pensa nem tem consciência: ela prevê a próxima palavra baseada em padrões de texto gigantescos, como o corretor automático do celular em escala cósmica.',
    analogy: 'O Corretor Automático Cósmico treinado em quase toda a internet.',
    stageTip: 'Digite uma frase incompleta na tela e pergunte o que vem a seguir para mostrar que prever continuações é natural até para humanos.',
  },
  2: {
    whatToSay: 'Aponte para a esteira e mostre a guilhotina fatiando as palavras em bloquinhos coloridos de LEGO. Destaque que cada pedaço ganha um número de identificação.',
    analogy: 'Peças de LEGO linguísticas com pinos e números de série.',
    stageTip: 'Abra a esteira interativa de LEGO e mostre como frases fatiam em blocos com números de IDs.',
  },
  3: {
    whatToSay: 'Mostre que palavras viram pontos num mapa mental de ideias. Palavras com sentidos parecidos ficam vizinhas de bairro: Rei - Homem + Mulher = Rainha.',
    analogy: 'O GPS das Ideias Semânticas com constelações de sentido.',
    stageTip: 'Mostre que a IA não busca letras exatas, e sim a vizinhança semântica de proximidade.',
  },
  4: {
    whatToSay: 'Destaque o trio de ferro da nuvem: ChatGPT, Claude 3.7 e Gemini 2.0. Mostre que oferecem a maior inteligência bruta sob demanda.',
    analogy: 'Alugar uma Ferrari na nuvem: aceleração máxima pagando por quilômetro rodado (tokens).',
    stageTip: 'Compare modelos focados em velocidade instantânea (Flash/Mini) com modelos de raciocínio profundo.',
  },
  5: {
    whatToSay: 'Explique por que modelos abertos como DeepSeek e Llama mudaram o mundo: os pesos são públicos e qualquer empresa pode rodar sem pagar mensalidade de API.',
    analogy: 'A receita secreta do melhor chef do mundo liberada publicamente para todos cozinharem.',
    stageTip: 'Ressalte o corte de 90% nos custos da indústria após a chegada dos modelos abertos eficientes.',
  },
  6: {
    whatToSay: 'Mostre o Ollama rodando no terminal sem internet. Explique que a compactação reduz o tamanho do modelo para caber tranquilamente no notebook.',
    analogy: 'A mala a vácuo: comprime as roupas para caber no porta-malas sem estragar o tecido.',
    stageTip: 'Se possível, mostre o modelo respondendo no terminal com Wi-Fi desligado: impacto visual imediato na turma!',
  },
  7: {
    whatToSay: 'Apresente o Cursor e o Windsurf. Explique que eles têm visão de raio-X do projeto inteiro: leem múltiplos arquivos e editam código com contexto completo.',
    analogy: 'O mecânico com visão de raio-X de todo o chassi e motor do carro.',
    stageTip: 'Mostre a diferença entre copiar e colar código no chat versus a edição inline com visualizador de diffs.',
  },
  8: {
    whatToSay: 'Apresente assistentes de terminal (Claude Code, Aider). Eles rodam comandos de verdade, leem saídas de erro e corrigem scripts sozinhos.',
    analogy: 'Um estagiário incansável testando e corrigindo comandos no terminal em loop autônomo.',
    stageTip: 'Enfatize que o papel do programador moderno é arquitetura e clareza de requisitos, não digitação braçal.',
  },
  9: {
    whatToSay: 'Mostre o v0 e o Lovable. Como transformar uma ideia em português ou um rabisco em tela funcional com Tailwind CSS em 20 segundos.',
    analogy: 'Do rabisco em guardanapo ao app interativo funcional em segundos.',
    stageTip: 'Mostre uma tela sendo gerada ao vivo e como pedir pequenas alterações de design conversando.',
  },
  10: {
    whatToSay: 'Abra a teia de notas do Obsidian. Mostre que pastas tradicionais prendem o conhecimento, enquanto links conectam ideias como sinapses do cérebro.',
    analogy: 'Pastas são gavetas fechadas; a rede do Obsidian é uma constelação viva de conhecimento.',
    stageTip: 'Mova os nós da constelação visual e mostre como aglomerados de matérias se formam naturalmente.',
  },
  11: {
    whatToSay: 'Apresente o NotebookLM. Suba apostilas e gere um debate em podcast de 2 apresentadores de IA. Destaque: zero alucinação, responde só com as fontes!',
    analogy: 'Dois apresentadores de rádio simpáticos lendo sua apostila de 400 páginas e tirando dúvidas.',
    stageTip: 'Reproduza alguns segundos do áudio do podcast do NotebookLM se houver caixa de som: a turma adora!',
  },
  12: {
    whatToSay: 'Mostre o Perplexity. Adeus aos 10 links azuis cheios de anúncios do Google: a IA lê as melhores fontes e resume com notas de rodapé clicáveis.',
    analogy: 'Um assistente de pesquisa que lê 20 artigos em 3 segundos e entrega o relatório com fontes.',
    stageTip: 'Faça uma pergunta sobre uma notícia de hoje para provar a busca com citação e tempo real.',
  },
  13: {
    whatToSay: 'A virada de chave: chatbot só conversa; agente de IA tem mãos virtuais. Ele abre navegadores, executa código, lê respostas e toma decisões.',
    analogy: 'A diferença entre um consultor que só dá conselhos e um funcionário com ferramentas que entrega o trabalho pronto.',
    stageTip: 'Aponte as 4 etapas no infográfico: Pensar ➔ Agir ➔ Avaliar Resultado ➔ Responder.',
  },
  14: {
    whatToSay: 'Apresente modelos com raciocínio passo a passo (DeepSeek-R1 e OpenAI o1/o3). Eles pensam antes de falar, testam hipóteses e corrigem os próprios erros.',
    analogy: 'O explorador no labirinto que rascunha o mapa antes de entrar e dá meia-volta em becos sem saída.',
    stageTip: 'Abra a aba de pensamento (<think>) de um modelo para a sala ver a IA conversando consigo mesma.',
  },
  15: {
    whatToSay: 'Conclusão triunfal da apresentação de 2 horas: as ferramentas e modelos mudam rápido, mas quem entende a mecânica e usa o ferramental comanda o futuro.',
    analogy: 'A chave mestra que transforma qualquer profissional em um criador de alto impacto na era da IA.',
    stageTip: 'Convide a plateia inteira para sacar o celular e escanear o QR Code no telão para a ativação coletiva!',
  },
};

export const PresenterNotesDrawer: React.FC<PresenterNotesDrawerProps> = ({
  isOpen,
  onClose,
  currentStep,
  isQuizActive = false,
}) => {
  if (!isOpen) return null;

  const currentNode = NODES.find((n) => n.stepNumber === currentStep);
  const baseNote = NOTES_DATABASE[currentStep] || NOTES_DATABASE[1];

  const currentNote: NoteData = {
    ...baseNote,
    engagementQuestion: currentNode?.classroomDynamic?.prompt || 'Como essa ferramenta muda a forma como vocês estudam ou trabalham no dia a dia?',
    suggestedAnswer: currentNode?.classroomDynamic?.suggestedAnswer || 'Autonomia, velocidade de prototipagem e foco na resolução de problemas reais.',
  };

  return (
    <aside
      aria-label="Notas do Apresentador"
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-2xl p-4 md:p-5 text-foreground animate-fade-in select-text"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-secondary text-foreground border border-border">
            <Mic className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
            NOTAS DO APRESENTADOR (TECLA 'P' PARA FECHAR) • PASSO {currentStep} DE 15
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border"
          title="Fechar notas (Tecla 'P')"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Teleprompter Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3.5">
        {/* Pillar 1: What to say */}
        <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground">
            <Mic className="w-3.5 h-3.5 text-muted-foreground" />
            <span>1. O QUE FALAR NO PALCO</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-normal">
            "{currentNote.whatToSay}"
          </p>
        </div>

        {/* Pillar 2: Analogy */}
        <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground">
            <Lightbulb className="w-3.5 h-3.5 text-muted-foreground" />
            <span>2. ANALOGIA VISUAL</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-normal">
            {currentNote.analogy}
          </p>
        </div>

        {/* Pillar 3: Provocative Engagement Question */}
        <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground">
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <span>3. PERGUNTA PROVOCATIVA</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-normal">
            "{currentNote.engagementQuestion}"
          </p>
          <p className="text-[10px] text-muted-foreground font-mono italic">
            Insight: {currentNote.suggestedAnswer}
          </p>
        </div>

        {/* Pillar 4: Stage Demo Tip */}
        <div className="p-3 rounded-lg bg-secondary/40 border border-border space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            <span>4. DICA DE PALCO</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-normal">
            {currentNote.stageTip}
          </p>
        </div>
      </div>
    </aside>
  );
};
