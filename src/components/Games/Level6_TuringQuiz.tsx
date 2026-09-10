// src/components/Games/Level6_TuringQuiz.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { arcadeAudio } from '../../utils/arcadeAudio';
import { fireChalkCelebration } from '../../utils/confetti';
import {
  Trophy,
  Play,
  RotateCcw,
  ArrowRight,
  User,
  Bot,
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
    category: 'CÓDIGO-FONTE',
    question: 'Qual dos dois blocos de código foi gerado por uma INTELIGÊNCIA ARTIFICIAL?',
    optionA: {
      title: 'Opção A',
      content: `// Função responsável por calcular a soma de dois inteiros
function somarNumeros(a: number, b: number): number {
  // Retorna o resultado da operação de adição
  return a + b;
}`,
      isAI: true,
      clue: 'Pista de IA: Comentários redundantes e óbvios ("Retorna o resultado...") são a assinatura típica do alinhamento RLHF.',
    },
    optionB: {
      title: 'Opção B',
      content: `const add = (a: number, b: number) => a + b;
// fixme: revisar tipagem quando o backend subir`,
      isAI: false,
      clue: 'Pista Humana: O comentário pragmático "fixme" e sintaxe concisa refletem a rotina de um desenvolvedor real.',
    },
  },
  {
    id: 2,
    category: 'POESIA & LITERATURA',
    question: 'Qual destes textos foi redigido por um HUMANO?',
    optionA: {
      title: 'Opção A',
      content: `"Silício que pensa em noites escuras,
Buscando a verdade em luzes e cura.
O código vibra na imensidão,
Unindo futuro e computação."`,
      isAI: true,
      clue: 'Pista de IA: Rima AABB excessivamente métrica e metáforas previsíveis com silício e futuro.',
    },
    optionB: {
      title: 'Opção B',
      content: `"O café esfriou na caneca lascada.
A tela pisca.
Três horas da manhã e o bug ainda respira."`,
      isAI: false,
      clue: 'Pista Humana: Ritmo livre, foco em detalhes imperfeitos e experiência cotidiana palpável.',
    },
  },
];

export const Level6_TuringQuiz: React.FC = () => {
  const { addScore, score } = useGameStore();

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

    if (chosenIsAI) {
      arcadeAudio.playCorrect();
      fireChalkCelebration();
      addScore(500);
    } else {
      arcadeAudio.playWrong();
    }
  };

  // ⚡ MODO DEMONSTRAÇÃO / AUTO-PLAY
  const handleAutoPlay = () => {
    if (isAutoPlaying || isRevealed) return;
    setIsAutoPlaying(true);
    arcadeAudio.playClick();

    setTimeout(() => {
      // Vota na opção correta (Opção A é IA na Rodada 1)
      handleVote('A');
      setIsAutoPlaying(false);
    }, 500);
  };

  const handleNextRound = () => {
    if (currentRoundIndex < QUIZ_ROUNDS.length - 1) {
      setCurrentRoundIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsRevealed(false);
      arcadeAudio.playClick();
    } else {
      setIsFinished(true);
      arcadeAudio.playVictoryFanfare();
      fireChalkCelebration();
    }
  };

  const handleResetQuiz = () => {
    setCurrentRoundIndex(0);
    setSelectedOption(null);
    setIsRevealed(false);
    setIsFinished(false);
    arcadeAudio.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 flex flex-col items-center justify-center select-none">
      {/* 🏛️ VITRINE INTERATIVA (CARD PREMIUM) */}
      <div className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800/80 shadow-2xl backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Cabeçalho Limpo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold tracking-wider">
              MÓDULO 08 • O TESTE DE TURING COLETIVO
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Turing Arena: Humano ou IA?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              A sala vota: Qual conteúdo foi gerado por redes neurais e qual foi redigido por um ser humano?
            </p>
          </div>

          {/* Botão Auto-Play */}
          {!isFinished && (
            <button
              onClick={handleAutoPlay}
              disabled={isAutoPlaying || isRevealed}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
              title="Demonstração automática da votação"
            >
              <Play className="w-3.5 h-3.5 text-blue-400 fill-current" />
              <span>{isAutoPlaying ? 'Votando...' : 'Modo Demonstração'}</span>
            </button>
          )}
        </div>

        {/* 🎯 ÁREA DO QUIZ (CARDS CONVIDATIVOS) */}
        {!isFinished ? (
          <div className="space-y-4">
            {/* Pergunta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
              <span className="text-xs font-mono text-zinc-400 font-medium">
                RODADA {currentRoundIndex + 1} DE {QUIZ_ROUNDS.length} • {round.category}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white">
                {round.question}
              </span>
            </div>

            {/* Os 2 Cards Grandes de Comparação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card Opção A */}
              <div
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedOption === 'A'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                    : 'border-zinc-800 bg-zinc-950/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-200">
                      {round.optionA.title}
                    </span>

                    {isRevealed && (
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                          round.optionA.isAI
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {round.optionA.isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {round.optionA.isAI ? 'Inteligência Artificial' : 'Humano'}
                      </span>
                    )}
                  </div>

                  <pre className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800/80 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {round.optionA.content}
                  </pre>
                </div>

                {isRevealed && (
                  <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
                    {round.optionA.clue}
                  </div>
                )}

                {!isRevealed && (
                  <button
                    onClick={() => handleVote('A')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md active:scale-98"
                  >
                    Votar: Opção A é IA
                  </button>
                )}
              </div>

              {/* Card Opção B */}
              <div
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedOption === 'B'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                    : 'border-zinc-800 bg-zinc-950/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 text-sm">
                      {round.optionB.title}
                    </span>

                    {isRevealed && (
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                          round.optionB.isAI
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {round.optionB.isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {round.optionB.isAI ? 'Inteligência Artificial' : 'Humano'}
                      </span>
                    )}
                  </div>

                  <pre className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800/80 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {round.optionB.content}
                  </pre>
                </div>

                {isRevealed && (
                  <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
                    {round.optionB.clue}
                  </div>
                )}

                {!isRevealed && (
                  <button
                    onClick={() => handleVote('B')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-md active:scale-98"
                  >
                    Votar: Opção B é IA
                  </button>
                )}
              </div>
            </div>

            {/* Botão Próxima Rodada */}
            {isRevealed && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextRound}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Próxima Rodada</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 🎉 ENCERRAMENTO COMEMORATIVO */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 rounded-xl bg-zinc-950/70 border border-zinc-800 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="p-3.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Apresentação Concluída</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Todas as 6 fases interativas foram exploradas. Pontuação acumulada:
              </p>
            </div>

            <div className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400 font-mono text-xl font-bold">
              {String(score).padStart(4, '0')} PONTOS
            </div>

            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Recomeçar Quiz
            </button>
          </motion.div>
        )}

        {/* Footer info */}
        <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/70 text-xs text-zinc-400 flex items-center justify-between">
          <span>
            💡 <strong>Interação:</strong> Peça votos por palmas ou mãos levantadas antes de revelar a resposta.
          </span>
          <span className="text-blue-400 font-mono text-[11px] shrink-0 ml-2">+500 Score</span>
        </div>
      </div>
    </div>
  );
};
