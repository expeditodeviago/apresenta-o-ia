import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Pause, RotateCcw, CheckCircle, Code, Eye, Rocket, Flame } from 'lucide-react';
import { fireChalkCelebration } from '../../utils/confetti';

const CHALLENGE_IDEAS = [
  {
    title: 'Calculadora de Nota Mínima na P3 de Matemática Discreta',
    description: 'Um mini-app que calcula exatamente quanto você precisa tirar na prova final para não reprovar, com memes e mensagens de incentivo.',
    tags: ['Matemática', 'Faculdade', 'Calculadora'],
    mockCode: `// Componente Calculadora P3
export default function CalculadoraP3() {
  const [p1, setP1] = useState(6.0);
  const [p2, setP2] = useState(5.5);
  const p3Necessaria = Math.max(0, (15 - (p1 + p2)));
  return (
    <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-400">
      <h4 className="font-bold text-emerald-300">Meta para a P3: {p3Necessaria.toFixed(1)}</h4>
      <p className="text-xs text-slate-300">{p3Necessaria <= 5 ? "Dá pra passar com folga!" : "Hora de abrir o Obsidian e estudar!"}</p>
    </div>
  );
}`,
  },
  {
    title: 'Gerador de Desculpas Técnicas para Git Push na Sexta-feira',
    description: 'Um gerador de frases de commit cômicas que usam jargões de engenharia e teorias probabilísticas complexas.',
    tags: ['Git', 'Engenharia', 'Humor'],
    mockCode: `// Gerador de Commit Seguro
export default function CommitHelper() {
  const desculpas = [
    "Refatorando nó raiz da AST para reduzir entropia de Shannon",
    "Poda de ramos instáveis no grafo de dependências cíclicas",
    "Ajuste de temperatura estocástica no pipeline de build"
  ];
  return (
    <div className="p-4 bg-rose-950/60 rounded-xl border border-rose-400">
      <p className="font-mono text-xs text-rose-200">"git commit -m '\${desculpas[0]}'"</p>
    </div>
  );
}`,
  },
  {
    title: 'Simulador de Fila do Restaurante Universitário (RU)',
    description: 'Simula a chegada de estudantes em tempo real usando teoria de filas discretas (M/M/1) e visualiza o tempo de espera.',
    tags: ['Filas', 'Simulação', 'Tempo Real'],
    mockCode: `// Simulação M/M/1 de Filas
export default function SimuladorRU() {
  return (
    <div className="p-4 bg-sky-950/60 rounded-xl border border-sky-400">
      <span className="text-xs font-mono text-sky-300">λ = 12 alunos/min | μ = 15 atend/min | W_q = 2.4 min</span>
    </div>
  );
}`,
  },
];

export const LiveChallengeWidget: React.FC = () => {
  const [selectedIdea, setSelectedIdea] = useState(0);
  const [customIdea, setCustomIdea] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(180); // 3 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'preview'>('preview');
  const [isGenerated, setIsGenerated] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      fireChalkCelebration();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleGenerateLive = () => {
    setIsGenerated(false);
    setGenerationStep(1);
    setTimeout(() => setGenerationStep(2), 700);
    setTimeout(() => setGenerationStep(3), 1400);
    setTimeout(() => {
      setGenerationStep(4);
      setIsGenerated(true);
      setActiveTab('preview');
      fireChalkCelebration();
    }, 2100);
  };

  const currentIdea = CHALLENGE_IDEAS[selectedIdea];
  const activeTitle = customIdea.trim() || currentIdea.title;

  return (
    <div className="bg-[#0e1611] border-2 border-rose-500/40 rounded-xl p-5 text-slate-100 font-sans shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold font-chalk text-rose-300">
              Desafio da Turma: Criando um App ao Vivo em 3 Minutos!
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-friendly">
            Escolha uma ideia com a sala, inicie o cronômetro e demonstre o poder da criação declarativa!
          </p>
        </div>

        {/* Stopwatch Header */}
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-xl border border-rose-500/40">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Tempo Restante</div>
            <div
              className={`text-2xl font-mono font-bold ${
                timerSeconds < 30 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
              }`}
            >
              {formatTime(timerSeconds)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTimerActive(!timerActive)}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                timerActive
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
              title={timerActive ? 'Pausar Cronômetro' : 'Iniciar 3 Minutos'}
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setTimerSeconds(180);
              }}
              className="p-2 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-slate-300 transition-all border border-white/10"
              title="Reiniciar Cronômetro"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Idea selection */}
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          1. Sugestões de Apps Rápidos para Criar com a Turma:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          {CHALLENGE_IDEAS.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdea(idx);
                setCustomIdea('');
                setIsGenerated(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedIdea === idx && !customIdea
                  ? 'bg-rose-500/20 border-rose-400 text-rose-100 font-medium shadow-md shadow-rose-500/10'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/30'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">{idea.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{idea.description}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Ou digite uma ideia maluca sugerida por alguém da sala agora..."
            value={customIdea}
            onChange={(e) => {
              setCustomIdea(e.target.value);
              setIsGenerated(false);
            }}
            className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
          />
          <button
            onClick={handleGenerateLive}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all"
          >
            <Rocket className="w-3.5 h-3.5" />
            Gerar App ao Vivo
          </button>
        </div>
      </div>

      {/* Generation Progress Stepper (when generating) */}
      {generationStep > 0 && generationStep < 4 && (
        <div className="my-4 p-4 bg-black/60 rounded-xl border border-rose-500/30 text-center animate-fade-in">
          <div className="flex justify-center items-center gap-6 mb-2">
            <div
              className={`text-xs font-mono flex items-center gap-1.5 ${
                generationStep >= 1 ? 'text-rose-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              1. Decomposição Semântica
            </div>
            <div
              className={`text-xs font-mono flex items-center gap-1.5 ${
                generationStep >= 2 ? 'text-amber-400 font-bold' : 'text-slate-500'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              2. Construção da AST React
            </div>
            <div
              className={`text-xs font-mono flex items-center gap-1.5 ${
                generationStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              3. Renderização & Teste
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${(generationStep / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Result Tabs */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 bg-black/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'preview'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Funcional
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Código React & AST
            </button>
          </div>
          <button
            onClick={() => fireChalkCelebration()}
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-friendly"
          >
            🎉 Soltar Confetes da Turma
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className="border border-white/10 rounded-xl p-4 bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <h4 className="text-sm font-bold text-white ml-2">{activeTitle}</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🟢 Live Demo
                  </span>
                </div>

                <div className="py-4 text-center">
                  <div className="max-w-md mx-auto p-4 bg-black/40 rounded-xl border border-rose-500/30">
                    <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
                    <h5 className="text-base font-bold font-chalk text-rose-200 mb-1">
                      {activeTitle}
                    </h5>
                    <p className="text-xs text-slate-300 mb-3 font-friendly">
                      Gerado dinamicamente a partir de instruções declarativas e pronto para produção!
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => fireChalkCelebration()}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg shadow-lg shadow-rose-500/30 transition-all"
                      >
                        Interagir com o App
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <pre className="p-3 bg-black/80 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-white/10 max-h-60">
              <code>{currentIdea.mockCode}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
