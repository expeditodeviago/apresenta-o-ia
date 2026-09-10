// src/components/acts/Act08_TuringShowdown.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireChalkCelebration, fireStarBurst } from '../../utils/confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  ArrowRight,
  User,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface QuizRound {
  id: number;
  category: string;
  question: string;
  optionA: {
    title: string;
    content: string;
    isAI: boolean;
    clue: string;
  };
  optionB: {
    title: string;
    content: string;
    isAI: boolean;
    clue: string;
  };
}

const QUIZ_ROUNDS: QuizRound[] = [
  {
    id: 1,
    category: 'CÓDIGO-FONTE TYPESCRIPT',
    question: 'Qual dos dois blocos de código foi gerado por uma INTELIGÊNCIA ARTIFICIAL?',
    optionA: {
      title: 'Opção A',
      content: `// Função responsável por calcular a soma de dois inteiros
function somarNumeros(a: number, b: number): number {
  // Retorna o resultado da operação de adição
  return a + b;
}`,
      isAI: true,
      clue: 'Pista de IA: Comentários hiper-redundantes e óbvios ("Retorna o resultado da operação...") são a assinatura típica do alinhamento RLHF.',
    },
    optionB: {
      title: 'Opção B',
      content: `const add = (a: number, b: number) => a + b;
// fixme: revisar tipagem quando o backend subir`,
      isAI: false,
      clue: 'Pista Humana: Comentário pragmático "fixme", sintaxe concisa em arrow function e foco no fluxo de deploy real.',
    },
  },
  {
    id: 2,
    category: 'ARQUITETURA DE MICROSSERVIÇOS',
    question: 'Qual destes textos técnicos foi redigido por um HUMANO?',
    optionA: {
      title: 'Opção A',
      content: `"Adotamos Kafka para desacoplamento de mensageria com partições balanceadas, garantindo alta escalabilidade, tolerância a falhas e arquitetura robusta orientada a eventos para o futuro da organização."`,
      isAI: true,
      clue: 'Pista de IA: Palavras-chave corporativas empilhadas ("garantindo alta escalabilidade, tolerância a falhas...") sem citar dores específicas.',
    },
    optionB: {
      title: 'Opção B',
      content: `"Colocamos Redis como cache na frente do PostgreSQL porque o banco estava caindo todo meio-dia com o pico de pedidos do app. Se o Redis cair, Deus nos ajude."`,
      isAI: false,
      clue: 'Pista Humana: Narrativa baseada em um incidente real ("caindo todo meio-dia") e humor técnico autêntico.',
    },
  },
  {
    id: 3,
    category: 'POESIA & LITERATURA',
    question: 'Qual destes textos foi redigido por uma IA?',
    optionA: {
      title: 'Opção A',
      content: `"Silício que pensa em noites escuras,
Buscando a verdade em luzes e cura.
O código vibra na imensidão,
Unindo futuro e computação."`,
      isAI: true,
      clue: 'Pista de IA: Rima AABB excessivamente métrica e metáforas previsíveis de ficção científica ("Silício", "Futuro").',
    },
    optionB: {
      title: 'Opção B',
      content: `"O café esfriou na caneca lascada.
A tela pisca.
Três horas da manhã e o bug ainda respira."`,
      isAI: false,
      clue: 'Pista Humana: Ritmo livre, detalhes sensoriais imperfeitos ("caneca lascada") e autenticidade.',
    },
  },
];

export const Act08_TuringShowdown: React.FC = () => {
  const { addScore, score } = usePresentationStore();

  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const round = QUIZ_ROUNDS[currentRoundIndex];

  const handleVote = (choice: 'A' | 'B') => {
    if (isRevealed) return;
    setSelectedOption(choice);
    setIsRevealed(true);

    const chosenIsAI = choice === 'A' ? round.optionA.isAI : round.optionB.isAI;

    // Se acertou
    if (chosenIsAI) {
      arcadeAudio.playCorrect();
      arcadeAudio.playVictoryFanfare();
      fireChalkCelebration();
      fireStarBurst(0.5, 0.4);
      addScore(300);
    } else {
      arcadeAudio.playErrorBuzzer();
    }
  };

  const handleNextRound = () => {
    if (currentRoundIndex < QUIZ_ROUNDS.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
      arcadeAudio.playClick();
    } else {
      setIsFinished(true);
      arcadeAudio.playVictoryFanfare();
      fireChalkCelebration();
    }
  };

  const handleReset = () => {
    setCurrentRoundIndex(0);
    setSelectedOption(null);
    setIsRevealed(false);
    setIsFinished(false);
    arcadeAudio.playClick();
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying) return;
    setIsAutoPlaying(true);
    handleReset();

    let step = 0;
    const interval = setInterval(() => {
      if (step === 0) {
        handleVote('A'); // Vota na opção correta
      } else if (step === 1) {
        handleNextRound();
      } else if (step === 2) {
        handleVote('A');
      } else if (step === 3) {
        handleNextRound();
      } else if (step === 4) {
        handleVote('A');
      } else {
        clearInterval(interval);
        setIsAutoPlaying(false);
      }
      step++;
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ CARD PRINCIPAL EM VIDRO LÍQUIDO */}
      <div className="w-full liquid-glass border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl backdrop-blur-2xl rounded-3xl">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-wider">
              ATO 08 • O TESTE DE TURING DEFINITIVO
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>The Turing Showdown: Humano ou IA?</span>
              <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Vote com a plateia: identifique as assinaturas sutis de código, tom e estilo gerados por LLMs modernos!
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoPlay}
              disabled={isAutoPlaying}
              className="tactile-btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-600/30 hover:bg-rose-600/40 border border-rose-400/40 text-xs font-semibold text-rose-200 hover:text-white transition-all active:scale-95 disabled:opacity-50"
              title="Demonstração automática do Quiz"
            >
              <Play className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>{isAutoPlaying ? 'Apresentando...' : 'Modo Demonstração'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95"
              title="Reiniciar Quiz"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isFinished ? (
          <>
            {/* 🎯 PERGUNTA DA RODADA */}
            <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 bg-slate-950/60 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Rodada {round.id} de {QUIZ_ROUNDS.length} • {round.category}
                </span>
                <div className="text-sm sm:text-base font-bold text-white">{round.question}</div>
              </div>
              <div className="text-xs font-mono text-zinc-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/5">
                Pontos: <span className="text-amber-400 font-bold">{score}</span>
              </div>
            </div>

            {/* 🥊 OS DOIS CARDS DE CONFRONTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* OPÇÃO A */}
              <motion.div
                whileHover={!isRevealed ? { scale: 1.01 } : {}}
                onClick={() => !isRevealed && handleVote('A')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  !isRevealed
                    ? 'liquid-glass-subtle border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    : selectedOption === 'A'
                    ? round.optionA.isAI
                      ? 'liquid-glass border-emerald-400 bg-emerald-950/30 shadow-2xl shadow-emerald-500/20'
                      : 'liquid-glass border-rose-400 bg-rose-950/30 shadow-2xl shadow-rose-500/20'
                    : 'liquid-glass-subtle border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-zinc-300 border border-white/10">
                      {round.optionA.title}
                    </span>
                    {isRevealed && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                          round.optionA.isAI
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {round.optionA.isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {round.optionA.isAI ? '🤖 GERADO POR IA' : '👤 ESCRITO POR HUMANO'}
                      </span>
                    )}
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {round.optionA.content}
                  </pre>
                </div>

                {/* Revelação Forense */}
                {isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-zinc-300 space-y-1"
                  >
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Análise Forense:
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{round.optionA.clue}</p>
                  </motion.div>
                ) : (
                  <button className="tactile-btn w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-bold text-zinc-200 border border-white/10">
                    Votar nesta Opção
                  </button>
                )}
              </motion.div>

              {/* OPÇÃO B */}
              <motion.div
                whileHover={!isRevealed ? { scale: 1.01 } : {}}
                onClick={() => !isRevealed && handleVote('B')}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  !isRevealed
                    ? 'liquid-glass-subtle border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    : selectedOption === 'B'
                    ? round.optionB.isAI
                      ? 'liquid-glass border-emerald-400 bg-emerald-950/30 shadow-2xl shadow-emerald-500/20'
                      : 'liquid-glass border-rose-400 bg-rose-950/30 shadow-2xl shadow-rose-500/20'
                    : 'liquid-glass-subtle border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-zinc-300 border border-white/10">
                      {round.optionB.title}
                    </span>
                    {isRevealed && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                          round.optionB.isAI
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {round.optionB.isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        {round.optionB.isAI ? '🤖 GERADO POR IA' : '👤 ESCRITO POR HUMANO'}
                      </span>
                    )}
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {round.optionB.content}
                  </pre>
                </div>

                {/* Revelação Forense */}
                {isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-zinc-300 space-y-1"
                  >
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Análise Forense:
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">{round.optionB.clue}</p>
                  </motion.div>
                ) : (
                  <button className="tactile-btn w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-bold text-zinc-200 border border-white/10">
                    Votar nesta Opção
                  </button>
                )}
              </motion.div>
            </div>

            {/* BOTÃO PRÓXIMA RODADA */}
            {isRevealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                <button
                  onClick={handleNextRound}
                  className="tactile-btn flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-xl hover:brightness-110 active:scale-95"
                >
                  <span>{currentRoundIndex < QUIZ_ROUNDS.length - 1 ? 'Próxima Rodada' : 'Ver Resultado Final'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          /* 🏆 TELA DE GRAND FINALE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl liquid-glass border border-amber-400/40 bg-slate-950/80 text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/20">
              🏆
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Keynote Synapse Concluído com Sucesso!
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
                Você e a turma dominaram os 8 fundamentos: da tokenização por peças de Lego ao raciocínio em labirinto, duelo de modelos e enxames de agentes autônomos.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-sm font-bold">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Pontuação Final da Apresentação: {score} XP</span>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="tactile-btn flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-zinc-200 hover:text-white text-xs font-bold border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar Quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
