import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Sparkles, ArrowRight, RefreshCw, Zap, Binary } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

export const Act01_Intro: React.FC = () => {
  const [learningRate, setLearningRate] = useState([65]);
  const [dataComplexity, setDataComplexity] = useState([40]);
  const [epoch, setEpoch] = useState(128);

  const lr = learningRate[0];
  const complexity = dataComplexity[0];

  // Simulated loss and weight convergence curve
  const lossValue = Math.max(0.01, (100 - lr) * 0.04 + (complexity / 100) * 0.2).toFixed(3);
  const accuracy = Math.min(99.8, 50 + (lr / 2) + (100 - complexity) / 4).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Ato 01 • Fundamentos & Paradigmas
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Binary className="w-3.5 h-3.5 text-indigo-400" /> A Grande Inversão da Computação
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            O Despertar
            <span className="text-sm font-normal text-slate-400 hidden sm:inline">
              — Programação Tradicional vs Aprendizado de Máquina
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Na computação clássica, humanos escrevem as regras na mão. Na Inteligência Artificial, fornecemos exemplos e a máquina <strong className="text-slate-200">descobre e calibra as regras por conta própria</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Taxa de Convergência: {accuracy}%
        </div>
      </div>

      {/* Main Dual Comparison: Traditional vs AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 flex-1 min-h-[360px]">
        {/* Card 1: Programação Tradicional (Regras Rígidas) */}
        <div className="obsidian-glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Settings className="w-28 h-28 text-slate-400 animate-spin" style={{ animationDuration: '30s' }} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                PARADIGMA 01 (1950 - HOJE)
              </span>
              <span className="text-xs text-slate-500 font-mono">Engrenagem Estática</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Programação Tradicional</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              O programador precisa antecipar <strong>cada caso possível no código</strong> com milhares de <code>if / else</code>. Se surgir um caso novo não mapeado, o sistema quebra.
            </p>

            {/* Formula Block */}
            <div className="bg-[#0b0f19] border border-slate-800/90 rounded-xl p-4 flex items-center justify-center gap-3 font-mono text-xs md:text-sm">
              <div className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-center font-bold">
                Regras
                <span className="block text-[9px] font-normal text-slate-400">Algoritmo</span>
              </div>
              <span className="text-slate-500 font-bold">+</span>
              <div className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 text-center font-bold">
                Dados
                <span className="block text-[9px] font-normal text-slate-400">Inputs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="px-3 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-center font-bold">
                Respostas
                <span className="block text-[9px] font-normal text-indigo-400">Outputs</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Limitação: Impossível programar manualmente a regra para reconhecer o rosto de uma pessoa ou traduzir poesia.
          </div>
        </div>

        {/* Card 2: Inteligência Artificial (Rede Auto-Ajustável) */}
        <div className="obsidian-glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Cpu className="w-28 h-28 text-indigo-400" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                PARADIGMA 02 (ERA MODERNA)
              </span>
              <span className="text-xs text-indigo-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Auto-Calibração
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Inteligência Artificial & Redes</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Você não escreve as regras: você alimenta o modelo com milhões de exemplos e ele <strong className="text-indigo-300">ajusta seus próprios pesos matemáticos</strong> até aprender a generalizar.
            </p>

            {/* Formula Block */}
            <div className="bg-[#0b0f19] border border-indigo-500/30 rounded-xl p-4 flex items-center justify-center gap-3 font-mono text-xs md:text-sm">
              <div className="px-3 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-center font-bold">
                Dados
                <span className="block text-[9px] font-normal text-slate-400">Exemplos</span>
              </div>
              <span className="text-indigo-400 font-bold">+</span>
              <div className="px-3 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 text-center font-bold">
                Respostas
                <span className="block text-[9px] font-normal text-slate-400">Rótulos</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-center font-bold">
                Regras
                <span className="block text-[9px] font-normal text-emerald-400">Pesos / Modelo</span>
              </div>
            </div>
          </div>

          {/* Interactive Weight Adjustment Simulator */}
          <div className="mt-5 p-4 rounded-xl bg-[#0b0f19] border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Ajuste dos Pesos Sinápticos (Gradiente):</span>
              <span className="font-mono text-indigo-400 font-bold">{learningRate[0]}%</span>
            </div>

            {/* Radix Slider for Interactive Weights */}
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
              value={learningRate}
              onValueChange={(val) => {
                setLearningRate(val);
                setEpoch((e) => e + 4);
              }}
              max={100}
              step={1}
            >
              <Slider.Track className="bg-slate-800 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-4 h-4 bg-white shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-transform hover:scale-110" />
            </Slider.Root>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
              <span>Época de Treino: #{epoch}</span>
              <span className="text-emerald-400">Erro de Perda (Loss): {lossValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            Frase central para a turma: <strong>"Se você consegue descrever a regra linha por linha, use código tradicional. Se a regra é sutil demais para palavras, use IA."</strong>
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
          Arthur Samuel (1959) ➔ LLMs (2025)
        </span>
      </div>
    </div>
  );
};
