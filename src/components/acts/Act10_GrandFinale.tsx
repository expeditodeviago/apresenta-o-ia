import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, MessageSquare, Compass, ShieldCheck, Cpu, ArrowUpRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const SKILLS = [
  {
    num: '01',
    title: 'Arquitetura & Especificação Clara',
    desc: 'Quando a digitação de código custa zero, o valor supremo migra para quem sabe modelar sistemas e definir regras de negócio sem ambiguidade.',
    icon: Compass,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20',
  },
  {
    num: '02',
    title: 'Validação Crítica & Confiabilidade',
    desc: 'A IA gera soluções plausíveis em segundos. O engenheiro sênior é aquele com faro afiado para auditar corner cases e arquitetar testes invioláveis.',
    icon: ShieldCheck,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
  },
  {
    num: '03',
    title: 'Orquestração de Agentes Multi-Especialistas',
    desc: 'Você deixa de ser um pedreiro de código isolado para se tornar o maestro de uma equipe autônoma: um agente projeta, outro implementa e um terceiro audita.',
    icon: Cpu,
    color: 'text-sky-400 border-sky-500/30 bg-sky-950/20',
  },
];

const AUDIENCE_TOPICS = [
  'A IA vai substituir os programadores juniores?',
  'Qual a melhor forma de começar a estudar hoje?',
  'Como garantir a segurança de dados sigilosos nas APIs?',
  'Até onde a IA autônoma consegue ir sem supervisão humana?',
];

export const Act10_GrandFinale: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'],
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Ato 10 • Grande Final & Debate
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> O Futuro da Carreira & da Computação
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Horizonte & Espaço Aberto para Perguntas
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — As 3 Competências Supremas para os Próximos 10 Anos
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            A tecnologia não para de acelerar. Concluímos nossa odisseia de 2 horas sintetizando o que realmente importa para prosperar nesta nova era.
          </p>
        </div>

        {/* Celebrate Confetti Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={fireConfetti}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 text-white font-bold text-xs md:text-sm hover:opacity-95 transition-all shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Celebrar Conclusão da Aula!
          </button>
        </div>
      </div>

      {/* The 3 Core Future Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-5">
        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.num}
              className={`p-6 rounded-2xl border ${skill.color} flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-extrabold font-mono opacity-60">{skill.num}</span>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{skill.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{skill.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Debate Questions Arena */}
      <div className="flex-1 min-h-[160px] obsidian-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Tópicos de Debate & Perguntas da Turma:
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">Microfone Aberto</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-3">
          {AUDIENCE_TOPICS.map((topic, i) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={i}
                onClick={() => setSelectedTopic(topic)}
                className={`p-3 rounded-xl text-left text-xs transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 font-semibold shadow-md'
                    : 'bg-[#090d16] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 mb-1.5 opacity-70" />
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Final Quote */}
      <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Frase de encerramento: <strong>"A inteligência artificial não vai substituir humanos. Mas humanos que dominam a inteligência artificial substituirão aqueles que a ignoram."</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Obrigado a todos! • 2025
        </span>
      </div>
    </div>
  );
};
