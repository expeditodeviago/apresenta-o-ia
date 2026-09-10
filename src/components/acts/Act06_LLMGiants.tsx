import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Zap, DollarSign, Brain, HardDrive, Sparkles, Check, ChevronRight } from 'lucide-react';

interface GiantModel {
  id: string;
  creator: string;
  name: string;
  tagline: string;
  color: string;
  borderHover: string;
  contextWindow: string;
  codingRank: string;
  reasoningRank: string;
  costPerMillion: string;
  isOpenSource: boolean;
  strengths: string[];
}

const GIANTS: GiantModel[] = [
  {
    id: 'openai',
    creator: 'OpenAI',
    name: 'GPT-4o & o1',
    tagline: 'O pioneiro comercial e referência em ecossistema global',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderHover: 'hover:border-emerald-500/60',
    contextWindow: '128k tokens',
    codingRank: '9.4 / 10',
    reasoningRank: '9.8 / 10 (o1)',
    costPerMillion: 'R$ 15 ~ R$ 75',
    isOpenSource: false,
    strengths: ['Raciocínio complexo com o1', 'API mais madura do planeta', 'Advanced Voice Mode nativo'],
  },
  {
    id: 'anthropic',
    creator: 'Anthropic',
    name: 'Claude 3.5 Sonnet',
    tagline: 'O padrão de ouro dos desenvolvedores e arquitetos de software',
    color: 'from-amber-500/20 to-orange-500/10',
    borderHover: 'hover:border-amber-500/60',
    contextWindow: '200k tokens',
    codingRank: '9.9 / 10 (Líder)',
    reasoningRank: '9.6 / 10',
    costPerMillion: 'R$ 18 ~ R$ 90',
    isOpenSource: false,
    strengths: ['Melhor geração de código do mundo', 'Nuance de escrita sem clichês de IA', 'Artefatos visuais interativos'],
  },
  {
    id: 'google',
    creator: 'Google DeepMind',
    name: 'Gemini 2.0 Flash / Pro',
    tagline: 'Multimodalidade nativa com a maior memória de contexto da história',
    color: 'from-blue-500/20 to-indigo-500/10',
    borderHover: 'hover:border-blue-500/60',
    contextWindow: '2.000.000 tokens',
    codingRank: '9.2 / 10',
    reasoningRank: '9.3 / 10',
    costPerMillion: 'R$ 0,50 ~ R$ 12',
    isOpenSource: false,
    strengths: ['Capacidade de ler livros e vídeos de 1 hora inteiros', 'Velocidade de inferência ultrarrápida', 'Custo extremamente acessível'],
  },
  {
    id: 'opensource',
    creator: 'DeepSeek & Meta',
    name: 'DeepSeek-V3/R1 & Llama 3.3',
    tagline: 'A revolução do código aberto: IA de elite rodando localmente sem censura',
    color: 'from-rose-500/20 to-purple-500/10',
    borderHover: 'hover:border-rose-500/60',
    contextWindow: '128k tokens',
    codingRank: '9.6 / 10',
    reasoningRank: '9.7 / 10 (R1)',
    costPerMillion: 'R$ 0 (Local com Ollama) ou R$ 3 via API',
    isOpenSource: true,
    strengths: ['Pesos abertos para rodar na sua máquina', 'Custo de treino 90% menor com MoE', 'Privacidade total de dados corporativos'],
  },
];

export const Act06_LLMGiants: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('anthropic');
  const selectedModel = GIANTS.find((g) => g.id === selectedModelId) || GIANTS[0];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Ato 06 • Ecossistema Global
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-rose-400" /> Quem é Quem no Mercado em 2025
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Mapa dos Gigantes da Inteligência
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Modelos Proprietários vs A Revolução Open-Source
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            O monopólio acabou: o mercado hoje se divide entre os grandes laboratórios proprietários (OpenAI, Anthropic, Google) e a revolução dos pesos abertos liderada por DeepSeek e Meta.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          4 Pilares Estratégicos
        </div>
      </div>

      {/* Grid of 4 Giants Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
        {GIANTS.map((giant) => {
          const isSelected = selectedModelId === giant.id;
          return (
            <div
              key={giant.id}
              onClick={() => setSelectedModelId(giant.id)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.25)] scale-[1.02]'
                  : 'obsidian-glass border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {giant.creator}
                  </span>
                  {giant.isOpenSource ? (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Open-Weights
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Proprietário
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{giant.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{giant.tagline}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Código:</span>
                  <span className="text-slate-200 font-semibold">{giant.codingRank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contexto:</span>
                  <span className="text-indigo-300">{giant.contextWindow}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Model Detailed Inspector */}
      <div className="flex-1 min-h-[160px] obsidian-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold text-white">{selectedModel.name}</h4>
              <span className="text-xs font-mono text-slate-400">por {selectedModel.creator}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{selectedModel.tagline}</p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              Memória: {selectedModel.contextWindow}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Custo Estimado: {selectedModel.costPerMillion}
            </div>
          </div>
        </div>

        {/* Strengths List */}
        <div className="my-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Pontos Fortes no Mundo Real:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedModel.strengths.map((st, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-xs text-slate-200"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>
            Dica do mercado: Não se case com um único modelo. <strong>Use Claude para programar, Gemini para analisar documentos gigantes e DeepSeek/Ollama para dados confidenciais</strong>.
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Estratégia Multi-Model
        </span>
      </div>
    </div>
  );
};
