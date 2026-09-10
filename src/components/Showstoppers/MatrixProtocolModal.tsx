import React, { useState } from 'react';
import { X, Terminal, Cpu, Play, CheckCircle2, Sparkles, Code } from 'lucide-react';
import { CyberGraphDefender } from '../Games/CyberGraphDefender';

interface MatrixProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlarmSound?: () => void;
  onDoneSound?: () => void;
}

export const MatrixProtocolModal: React.FC<MatrixProtocolModalProps> = ({
  isOpen,
  onClose,
  onAlarmSound,
  onDoneSound,
}) => {
  const [protocolStage, setProtocolStage] = useState<'standby' | 'swarming' | 'ready'>('standby');
  const [progressPercent, setProgressPercent] = useState(0);

  // Agent Chat Stream State
  const [agentLogs, setAgentLogs] = useState<{ agent: string; role: string; message: string; time: string }[]>([]);
  const [codeStream, setCodeStream] = useState('');

  const handleActivateSwarm = () => {
    if (onAlarmSound) onAlarmSound();
    setProtocolStage('swarming');
    setProgressPercent(10);
    setAgentLogs([]);
    setCodeStream('// INICIANDO COMPILADOR DO ENXAME...\nimport React, { useState } from "react";');

    const timeline = [
      {
        delay: 600,
        progress: 25,
        agent: 'Nexus',
        role: 'Arquiteto de Sistemas',
        message: 'Requisitos analisados. Topologia do sistema: Fluxo de dados com 6 etapas de validação e prevenção de loops.',
        code: '\nconst NetworkTopology = { nodes: 6, routes: 8, safeCyclePrevention: true };',
      },
      {
        delay: 1400,
        progress: 55,
        agent: 'Cypher',
        role: 'Engenheiro React',
        message: 'Escrevendo componente React. Implementando hook de física de pacotes e listeners de clique com roteamento dinâmico...',
        code: '\nexport function SmartRouter() {\n  const [packet, setPacket] = useState("start");\n  const routePacket = () => { /* Roteamento Inteligente */ };\n}',
      },
      {
        delay: 2400,
        progress: 85,
        agent: 'Sentinel',
        role: 'Auditor de Qualidade',
        message: 'Auditoria concluída com sucesso! Tempo de resposta otimizado, zero vazamento de memória e código aprovado para produção.',
        code: '\n// BUILD CERTIFIED BY SENTINEL ENGINE: 100% PASS',
      },
      {
        delay: 3200,
        progress: 100,
        agent: 'Nexus',
        role: 'Arquiteto de Sistemas',
        message: '🚀 APLICAÇÃO COMPILADA COM SUCESSO! Montando mini-app interativo na tela agora!',
        code: '\n// MOUNTING COMPONENT TO DOM...',
      },
    ];

    timeline.forEach((item) => {
      setTimeout(() => {
        setProgressPercent(item.progress);
        setAgentLogs((prev) => [
          ...prev,
          {
            agent: item.agent,
            role: item.role,
            message: item.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setCodeStream((prev) => prev + item.code);

        if (item.progress === 100) {
          if (onDoneSound) onDoneSound();
          setTimeout(() => {
            setProtocolStage('ready');
          }, 600);
        }
      }, item.delay);
    });
  };

  const handleResetProtocol = () => {
    setProtocolStage('standby');
    setProgressPercent(0);
    setAgentLogs([]);
    setCodeStream('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary border border-border text-foreground">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  THE MATRIX PROTOCOL — ENXAME DE AGENTES DE IA AO VIVO
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-foreground border border-border">
                  ESTADO DE AUTONOMIA
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                3 Agentes de IA colaborando em tempo real para planejar, programar e testar um mini-app funcional
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {protocolStage === 'ready' && (
              <button
                onClick={handleResetProtocol}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted border border-border text-foreground text-xs font-mono transition-colors"
              >
                REATIVAR ENXAME
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {protocolStage === 'standby' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center text-foreground shadow-sm">
                <Cpu className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                  CENTRO DE COMANDO DO ENXAME
                </h3>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                  Clique no botão abaixo para disparar o protocolo. Três agentes especializados (Arquiteto, Desenvolvedor e Auditor) assumirão a tela, trocarão mensagens em alta velocidade e construirão um jogo interativo completo em menos de 5 segundos.
                </p>
              </div>

              {/* 3 Agents Preview Cards */}
              <div className="grid grid-cols-3 gap-3 w-full text-left font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-foreground">
                  <div className="font-semibold text-foreground">1. NEXUS</div>
                  <div className="text-[10px] text-muted-foreground">Arquiteto de Sistemas</div>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-foreground">
                  <div className="font-semibold text-foreground">2. CYPHER</div>
                  <div className="text-[10px] text-muted-foreground">Engenheiro React</div>
                </div>
                <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-foreground">
                  <div className="font-semibold text-foreground">3. SENTINEL</div>
                  <div className="text-[10px] text-muted-foreground">Auditor de Qualidade</div>
                </div>
              </div>

              {/* Security clearance trigger button */}
              <button
                onClick={handleActivateSwarm}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wide text-xs font-mono shadow-sm flex items-center justify-center gap-2 transition-all border border-primary/20"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>[ ATIVAR PROTOCOLO MATRIX: ENXAME DE AGENTES ]</span>
              </button>
            </div>
          )}

          {protocolStage === 'swarming' && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-foreground">
                  <span>COMPILANDO SISTEMA MULTI-AGENTE...</span>
                  <span className="font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden border border-border">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Swarm Live Conversation + Code Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chat Stream */}
                <div className="rounded-xl p-5 bg-background border border-border space-y-3 font-mono text-xs max-h-[380px] overflow-y-auto shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground border-b border-border pb-2">
                    <Terminal className="w-4 h-4 text-foreground" />
                    <span>COMUNICAÇÃO ENTRE AGENTES:</span>
                  </div>
                  {agentLogs.map((log, i) => (
                    <div key={i} className="p-3 rounded-lg bg-card border border-border space-y-1 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {log.agent} <span className="text-[10px] text-muted-foreground font-normal">({log.role})</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">{log.time}</span>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">{log.message}</p>
                    </div>
                  ))}
                </div>

                {/* Code Generation Stream */}
                <div className="rounded-xl p-5 bg-background border border-border font-mono text-xs max-h-[380px] overflow-y-auto space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-foreground border-b border-border pb-2">
                    <Code className="w-4 h-4" />
                    <span>CÓDIGO GERADO EM TEMPO REAL:</span>
                  </div>
                  <pre className="text-foreground/90 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                    {codeStream}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {protocolStage === 'ready' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3 rounded-xl bg-secondary border border-border flex items-center justify-between text-xs font-mono text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground" />
                  <span>ENXAME CONCLUÍDO: APLICAÇÃO GERADA E PRONTA PARA TESTE AO VIVO!</span>
                </div>
                <span className="text-muted-foreground">Tempo de compilação: 3.4s</span>
              </div>

              {/* Render the actual, playable game! */}
              <CyberGraphDefender />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
