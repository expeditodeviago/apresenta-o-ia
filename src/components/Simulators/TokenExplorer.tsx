import React, { useState } from 'react';
import { Sliders, RotateCcw, Binary, Network, Blocks } from 'lucide-react';
import { BlockFactoryDiagram } from '../VisualDiagrams/BlockFactoryDiagram';

interface CandidateToken {
  text: string;
  prob: number;
  color: string;
  tokenId: number;
}

const PRESETS = [
  'A inteligência artificial na engenharia de software',
  'No mapa de ideias, cada conceito conecta',
  'Para evitar tentar tudo ao acaso, a IA',
  'O modelo de raciocínio testou 5 hipóteses e',
  'A engenharia de software moderna é a base da',
];

export const TokenExplorer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'lego' | 'softmax'>('lego');
  const [inputText, setInputText] = useState('A inteligência artificial na engenharia de software');
  const [tokensAdded, setTokensAdded] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number>(0.7);

  // Pseudo-token hash generator to simulate real BPE Token IDs
  const pseudoHashToken = (word: string): number => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 98000) + 1000;
  };

  // Split sentence into visual tokens
  const words = `${inputText} ${tokensAdded.join('')}`.trim().split(/\s+/).filter(Boolean);
  const tokenList = words.map((w, i) => {
    return {
      id: pseudoHashToken(w + i),
      text: w,
      colorClass: 'bg-secondary border-border text-foreground',
    };
  });

  // Generate intelligent candidate tokens based on the last words
  const generateCandidates = (): CandidateToken[] => {
    const full = `${inputText} ${tokensAdded.join(' ')}`.toLowerCase();

    if (full.includes('software') || full.includes('engenharia')) {
      return [
        { text: ' acelera', prob: 0.44, color: '#38bdf8', tokenId: 4812 },
        { text: ' transforma', prob: 0.28, color: '#a855f7', tokenId: 9341 },
        { text: ' otimiza', prob: 0.18, color: '#10b981', tokenId: 3108 },
        { text: ' refatora', prob: 0.10, color: '#f59e0b', tokenId: 7205 },
      ];
    } else if (full.includes('mapa') || full.includes('ideia') || full.includes('conceito')) {
      return [
        { text: ' novos caminhos', prob: 0.52, color: '#38bdf8', tokenId: 6103 },
        { text: ' links práticos', prob: 0.26, color: '#a855f7', tokenId: 8421 },
        { text: ' soluções reais', prob: 0.14, color: '#10b981', tokenId: 2980 },
        { text: ' insights rápidos', prob: 0.08, color: '#f59e0b', tokenId: 5542 },
      ];
    } else if (full.includes('árvore') || full.includes('decisão') || full.includes('raciocínio')) {
      return [
        { text: ' de decisão poda', prob: 0.48, color: '#38bdf8', tokenId: 7719 },
        { text: ' explora rotas', prob: 0.32, color: '#a855f7', tokenId: 4410 },
        { text: ' calcula custo', prob: 0.12, color: '#10b981', tokenId: 1983 },
        { text: ' ajusta a direção', prob: 0.08, color: '#f59e0b', tokenId: 8122 },
      ];
    } else {
      return [
        { text: ' em tempo real', prob: 0.45, color: '#38bdf8', tokenId: 4018 },
        { text: ' com precisão total', prob: 0.35, color: '#a855f7', tokenId: 6291 },
        { text: ' sem falhas', prob: 0.20, color: '#10b981', tokenId: 8127 },
      ];
    }
  };

  const candidates = generateCandidates();

  // Apply temperature scaling
  const getScaledProb = (baseProb: number) => {
    if (temperature <= 0.1) {
      const max = Math.max(...candidates.map((c) => c.prob));
      return baseProb === max ? 100 : 0;
    }
    const scaled = Math.pow(baseProb, 1 / Math.max(0.1, temperature));
    return Math.min(99, Math.max(1, Math.round(scaled * 100)));
  };

  const handlePickCandidate = (text: string) => {
    setTokensAdded((prev) => [...prev, text]);
  };

  const handleReset = () => {
    setTokensAdded([]);
  };

  return (
    <div className="rounded-2xl p-6 bg-card border border-border text-foreground shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              THE TOKEN EXPLORER & METÁFORA DO LEGO
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Fábrica de Lego: fatiador BPE na esteira • Distribuição de probabilidades
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary/50 rounded-xl border border-border">
          <button
            onClick={() => setViewMode('lego')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'lego'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Blocks className="w-3.5 h-3.5" />
            <span>Fábrica de Lego</span>
          </button>
          <button
            onClick={() => setViewMode('softmax')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'softmax'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>Probabilidades & Temperatura</span>
          </button>
        </div>

        {viewMode === 'softmax' && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-secondary hover:bg-muted border border-border text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>LIMPAR</span>
          </button>
        )}
      </div>

      {viewMode === 'lego' ? (
        <BlockFactoryDiagram />
      ) : (
        <>
          {/* Preset Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-1">EXEMPLOS:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p);
                  setTokensAdded([]);
                }}
                className="px-3 py-1 rounded-lg text-xs font-mono bg-secondary hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all truncate max-w-[280px]"
              >
                "{p.slice(0, 30)}..."
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>PROMPT DE ENTRADA (DIGITE QUALQUER TEXTO):</span>
              <span>{tokenList.length} tokens mapeados</span>
            </div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setTokensAdded([]);
              }}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground font-mono text-sm focus:outline-none focus:border-primary transition-all"
              placeholder="Digite qualquer frase..."
            />
          </div>

          {/* Real-time Token Decomposition View */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-muted-foreground">
              COMO A IA ENXERGA ESTE TEXTO (CONVERSÃO EM IDs DISCRETOS):
            </span>
            <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-background border border-border min-h-[70px] items-center">
              {tokenList.map((tok, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono shadow-sm ${tok.colorClass}`}
                >
                  <span className="font-semibold">{tok.text}</span>
                  <span className="text-[10px] text-muted-foreground font-mono px-1 rounded bg-secondary">
                    #{tok.id}
                  </span>
                </div>
              ))}

              {tokensAdded.length > 0 && (
                <span className="text-xs font-mono text-muted-foreground pl-2">
                  ← gerado pela IA
                </span>
              )}
            </div>
          </div>

          {/* Softmax Probability Branching Tree */}
          <div className="p-5 rounded-xl bg-secondary/30 border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Network className="w-4 h-4 text-foreground" />
                <span className="font-semibold text-foreground">
                  PRÓXIMO TOKEN CANDIDATO (DISTRIBUIÇÃO DE PROBABILIDADES):
                </span>
              </div>

              {/* Temperature Slider */}
              <div className="flex items-center gap-3 text-xs font-mono bg-secondary px-3 py-1.5 rounded-lg border border-border">
                <Sliders className="w-3.5 h-3.5 text-foreground" />
                <span>Temperatura T: <strong className="text-foreground">{temperature.toFixed(2)}</strong></span>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-24 accent-primary cursor-pointer"
                />
              </div>
            </div>

            {/* Candidate Rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {candidates.map((cand, idx) => {
                const prob = getScaledProb(cand.prob);
                return (
                  <button
                    key={idx}
                    onClick={() => handlePickCandidate(cand.text)}
                    className="group p-3 rounded-lg bg-card hover:bg-secondary/70 border border-border hover:border-foreground/30 text-left transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          "{cand.text}"
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">#{cand.tokenId}</span>
                      </div>
                      <span className="font-semibold text-foreground">{prob}%</span>
                    </div>

                    {/* Probability Bar */}
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden border border-border">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-foreground/80"
                        style={{
                          width: `${prob}%`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
