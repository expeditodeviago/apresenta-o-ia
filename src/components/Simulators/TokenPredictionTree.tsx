import React, { useState } from 'react';
import { Sparkles, Sliders, RotateCcw, Send, Check } from 'lucide-react';

interface CandidateToken {
  text: string;
  prob: number;
  color: string;
  tokenId: number;
}

const PRESETS = [
  'O programador usou IA para',
  'No grafo de conhecimento, cada nó',
  'Para resolver o problema de busca, a árvore',
  'O modelo de raciocínio testou 5 hipóteses e',
];

export const TokenPredictionTree: React.FC = () => {
  const [customInput, setCustomInput] = useState('O programador usou IA para');
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number>(0.7);

  // Dynamic candidate generator based on the accumulated text
  const generateCandidates = (text: string): CandidateToken[] => {
    const lastWord = text.trim().split(' ').pop()?.toLowerCase() || '';

    // Specialized realistic candidate sets
    if (lastWord.includes('ia') || lastWord.includes('para') || lastWord.includes('usou')) {
      return [
        { text: ' acelerar', prob: 0.48, color: '#4ade80', tokenId: 4821 },
        { text: ' refatorar', prob: 0.26, color: '#38bdf8', tokenId: 9142 },
        { text: ' otimizar', prob: 0.16, color: '#fbbf24', tokenId: 3319 },
        { text: ' automatizar', prob: 0.10, color: '#fb7185', tokenId: 7604 },
      ];
    } else if (lastWord.includes('nó') || lastWord.includes('grafo') || lastWord.includes('cada')) {
      return [
        { text: ' representa', prob: 0.54, color: '#4ade80', tokenId: 5510 },
        { text: ' conecta', prob: 0.28, color: '#38bdf8', tokenId: 6182 },
        { text: ' armazena', prob: 0.12, color: '#fbbf24', tokenId: 8091 },
        { text: ' calcula', prob: 0.06, color: '#fb7185', tokenId: 2419 },
      ];
    } else if (lastWord.includes('árvore') || lastWord.includes('busca') || lastWord.includes('hipóteses')) {
      return [
        { text: ' explorou', prob: 0.50, color: '#4ade80', tokenId: 7219 },
        { text: ' podou', prob: 0.30, color: '#38bdf8', tokenId: 4410 },
        { text: ' calculou', prob: 0.12, color: '#fbbf24', tokenId: 3892 },
        { text: ' encontrou', prob: 0.08, color: '#fb7185', tokenId: 1983 },
      ];
    } else if (lastWord.includes('acelerar') || lastWord.includes('refatorar')) {
      return [
        { text: ' o desenvolvimento', prob: 0.52, color: '#4ade80', tokenId: 3012 },
        { text: ' a arquitetura', prob: 0.32, color: '#38bdf8', tokenId: 7714 },
        { text: ' os testes', prob: 0.16, color: '#fbbf24', tokenId: 5518 },
      ];
    } else {
      return [
        { text: ' com alta precisão', prob: 0.45, color: '#4ade80', tokenId: 4018 },
        { text: ' em tempo recorde', prob: 0.35, color: '#38bdf8', tokenId: 6291 },
        { text: ' sem falhas', prob: 0.20, color: '#fbbf24', tokenId: 8127 },
      ];
    }
  };

  const fullPrompt = `${customInput}${generatedTokens.join('')}`;
  const candidates = generateCandidates(fullPrompt);

  const getTempProb = (prob: number) => {
    if (temperature < 0.2) return prob >= 0.4 ? 100 : 0;
    const scaled = Math.pow(prob, 1 / Math.max(0.1, temperature));
    return Math.min(99, Math.max(1, Math.round(scaled * 100)));
  };

  const handlePickToken = (tokenText: string) => {
    setGeneratedTokens((prev) => [...prev, tokenText]);
  };

  const handleReset = () => {
    setGeneratedTokens([]);
  };

  return (
    <div className="bg-[#0b130e] border-2 border-emerald-500/40 rounded-2xl p-6 text-slate-100 font-sans shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl md:text-2xl font-bold font-chalk text-emerald-300">
              Simulador de Previsão de Palavras da IA (Softmax & Beam Search)
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-friendly mt-0.5">
            Digite uma frase ou escolha um exemplo e veja a IA calculando a probabilidade de cada próximo bloco de texto!
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpar Geração
        </button>
      </div>

      {/* Input or Presets */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Sugestões Rápidas:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomInput(p);
                setGeneratedTokens([]);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-black/40 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/10 hover:border-emerald-500/40 transition-all font-friendly"
            >
              "{p}..."
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setGeneratedTokens([]);
            }}
            placeholder="Digite qualquer frase em português para testar a previsão..."
            className="flex-1 bg-black/60 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono"
          />
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="bg-black/40 p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            Temperatura (T = {temperature.toFixed(2)})
          </label>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {temperature < 0.3 ? 'Determinístico / Frio' : temperature > 0.8 ? 'Criativo / Quente' : 'Equilibrado'}
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.5"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
          <span>T=0.1 (Greedy / Sempre o mais provável)</span>
          <span>T=0.7 (Padrão LLM)</span>
          <span>T=1.5 (Alta Estocasticidade)</span>
        </div>
      </div>

      {/* Live Generated Text Box */}
      <div className="bg-black/60 border-2 border-emerald-500/40 rounded-xl p-4 mb-6 shadow-inner">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
          Texto Acumulado:
        </span>
        <div className="text-lg md:text-xl font-mono text-white flex flex-wrap items-center gap-1.5">
          <span className="text-slate-300">{customInput}</span>
          {generatedTokens.map((tok, i) => (
            <span
              key={i}
              className="bg-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-400/50 animate-pulse font-bold"
            >
              {tok}
            </span>
          ))}
          <span className="w-2.5 h-6 bg-emerald-400 animate-bounce inline-block ml-1"></span>
        </div>
      </div>

      {/* Candidate Next Tokens with Probability Distribution */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-xs font-mono font-bold border border-emerald-500/40">
            P
          </span>
          Candidatos de Próximo Token — Distribuição Softmax P(w | Contexto):
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {candidates.map((cand, idx) => {
            const adjustedProb = getTempProb(cand.prob);
            return (
              <button
                key={idx}
                onClick={() => handlePickToken(cand.text)}
                className="relative p-3.5 rounded-xl border border-white/10 hover:border-emerald-400 bg-black/50 hover:bg-emerald-950/40 text-left transition-all group hover:scale-[1.03] shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-sm text-white group-hover:text-emerald-200">
                    "{cand.text.trim()}"
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {adjustedProb}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${adjustedProb}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Token #{cand.tokenId}</span>
                  <span className="text-emerald-400 group-hover:underline">Clique para adicionar +</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
