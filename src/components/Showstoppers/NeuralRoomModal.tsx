import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Radio, Users, Sparkles, Plus, Copy, Check } from 'lucide-react';
import { StudentParticipant, CyberColor } from '../../types/presentation';

interface NeuralRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewParticipantSound?: () => void;
}

const SAMPLE_NAMES = [
  'Lucas Dev', 'Mariana IA', 'Pedro Fullstack', 'Beatriz Product', 'Gabriel Cloud',
  'Larissa Design', 'Thiago Backend', 'Camila Mobile', 'Prof. Marcos', 'Rafael Frontend',
];

const SAMPLE_CONCEPTS = [
  'Agentes Autônomos', 'Modelos Locais (Ollama)', 'Cursor & v0',
  'Raciocínio & R1', 'Segundo Cérebro (Obsidian)', 'Engenharia de Prompt',
];

export const NeuralRoomModal: React.FC<NeuralRoomModalProps> = ({
  isOpen,
  onClose,
  onNewParticipantSound,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [participants, setParticipants] = useState<StudentParticipant[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');

  const participantsRef = useRef<StudentParticipant[]>([]);
  participantsRef.current = participants;

  // Generate QR code and Join URL
  useEffect(() => {
    if (!isOpen) return;

    const currentHref = window.location.origin + window.location.pathname + '?join=true';
    setJoinUrl(currentHref);

    if (qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        currentHref,
        {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#09090b',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR Code:', error);
        }
      );
    }
  }, [isOpen]);

  // Listen for real incoming students via BroadcastChannel & LocalStorage
  useEffect(() => {
    if (!isOpen) return;

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('neural_room_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'STUDENT_JOIN' && event.data?.data) {
          addParticipant(event.data.data);
        }
      };
    } catch {
      // Broadcast fallback
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'neural_room_latest' && e.newValue) {
        try {
          const student = JSON.parse(e.newValue);
          addParticipant(student);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [isOpen]);

  const addParticipant = (newStud: StudentParticipant) => {
    setParticipants((prev) => {
      if (prev.some((p) => p.id === newStud.id || (p.name === newStud.name && Date.now() - p.timestamp < 3000))) {
        return prev;
      }

      const angle = Math.random() * Math.PI * 2;
      const dist = 320;
      const x = 360 + Math.cos(angle) * dist;
      const y = 230 + Math.sin(angle) * dist;

      const fullStud: StudentParticipant = {
        ...newStud,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
      };

      if (onNewParticipantSound) onNewParticipantSound();
      return [...prev, fullStud];
    });
  };

  const handleSimulateStudents = (count = 5) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
        const randomConcept = SAMPLE_CONCEPTS[Math.floor(Math.random() * SAMPLE_CONCEPTS.length)];
        const colors: CyberColor[] = ['cyan', 'purple', 'matrix', 'amber', 'rose'];

        addParticipant({
          id: `sim-${Date.now()}-${i}-${Math.random()}`,
          name: `${randomName} #${Math.floor(Math.random() * 90 + 10)}`,
          course: 'Engenharia de Software',
          concept: randomConcept,
          color: colors[Math.floor(Math.random() * colors.length)],
          timestamp: Date.now(),
        });
      }, i * 300);
    }
  };

  // Canvas Physics and Rendering Loop (100% Matte, Zero Neon)
  useEffect(() => {
    if (!isOpen) return;

    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const studs = participantsRef.current;

      // Dark matte background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Subtle matte grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics update
      for (let i = 0; i < studs.length; i++) {
        const s1 = studs[i];
        if (s1.x === undefined || s1.y === undefined) continue;

        // Attract toward center
        const cdx = width / 2 - s1.x;
        const cdy = height / 2 - s1.y;
        s1.vx = (s1.vx || 0) + cdx * 0.0003;
        s1.vy = (s1.vy || 0) + cdy * 0.0003;

        // Repulsion among nodes
        for (let j = i + 1; j < studs.length; j++) {
          const s2 = studs[j];
          if (s2.x === undefined || s2.y === undefined) continue;

          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dist = Math.hypot(dx, dy) || 1;

          if (dist < 150) {
            const force = 350 / (dist * dist);
            s1.vx -= (dx / dist) * force;
            s1.vy -= (dy / dist) * force;
            s2.vx = (s2.vx || 0) + (dx / dist) * force;
            s2.vy = (s2.vy || 0) + (dy / dist) * force;
          }
        }

        // Damping
        s1.vx *= 0.92;
        s1.vy *= 0.92;
        s1.x += s1.vx;
        s1.y += s1.vy;

        // Bounds
        s1.x = Math.max(30, Math.min(width - 30, s1.x));
        s1.y = Math.max(30, Math.min(height - 30, s1.y));
      }

      // Draw clean matte connections between students
      ctx.lineWidth = 1;
      for (let i = 0; i < studs.length; i++) {
        const s1 = studs[i];
        for (let j = i + 1; j < studs.length; j++) {
          const s2 = studs[j];
          if (s1.x === undefined || s1.y === undefined || s2.x === undefined || s2.y === undefined) continue;

          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          const hasSharedConcept = s1.concept === s2.concept;

          if (hasSharedConcept || dist < 130) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = hasSharedConcept
              ? 'rgba(255, 255, 255, 0.35)'
              : 'rgba(255, 255, 255, 0.12)';
            ctx.stroke();
          }
        }
      }

      // Draw Student Nodes (Zero glow, clean matte circle with border)
      for (const s of studs) {
        if (s.x === undefined || s.y === undefined) continue;

        // Outer ring
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#18181b';
        ctx.fill();
        ctx.strokeStyle = '#fafafa';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#a1a1aa';
        ctx.fill();

        // Name label
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = '#f4f4f5';
        ctx.textAlign = 'center';
        ctx.fillText(s.name, s.x, s.y - 14);

        // Concept pill text
        ctx.font = '500 9px monospace';
        ctx.fillStyle = '#a1a1aa';
        ctx.fillText(`[${s.concept}]`, s.x, s.y + 20);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary border border-border text-foreground">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  THE NEURAL ROOM — A REDE DE PARTICIPAÇÃO DA SALA
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-secondary text-foreground border border-border">
                  AO VIVO VIA QR CODE
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Aponte a câmera do celular para o QR Code abaixo para ingressar no telão em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateStudents(5)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted text-foreground border border-border text-xs font-mono font-medium transition-all"
              title="Simula 5 alunos entrando no telão"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ SIMULAR 5 ALUNOS</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: QR Code & Link (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-secondary/30 border border-border">
            <div className="p-3 rounded-xl bg-white border border-border shadow-sm">
              <canvas ref={qrCanvasRef} className="rounded-lg block" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-foreground font-semibold block">
                ESCANEIE AGORA COM O CELULAR
              </span>
              <p className="text-[11px] text-muted-foreground">
                Não precisa instalar nada! Abre direto no navegador do smartphone.
              </p>
            </div>

            {/* Copyable link */}
            <button
              onClick={copyToClipboard}
              className="w-full py-2 px-3 rounded-lg bg-secondary hover:bg-muted border border-border text-foreground text-xs font-mono flex items-center justify-center gap-2 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-foreground" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'LINK COPIADO!' : 'COPIAR LINK DA SALA'}</span>
            </button>

            {/* Participants Counter Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-xs font-mono text-muted-foreground">
              <Users className="w-4 h-4 text-foreground" />
              <span>
                Participantes Conectados: <strong className="text-foreground text-sm">{participants.length}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Live Collective Graph (8 cols) */}
          <div className="lg:col-span-8 rounded-xl overflow-hidden border border-border bg-background relative shadow-sm">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/90 border border-border text-xs font-mono text-muted-foreground shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Sincronização Ativa • Rede da Turma</span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={720}
              height={460}
              className="w-full h-[460px] block"
            />

            {participants.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6 space-y-3">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm font-mono text-muted-foreground max-w-sm">
                  Aguardando os primeiros alunos escanearem o QR Code ou clique em{' '}
                  <strong className="text-foreground">"+ SIMULAR 5 ALUNOS"</strong> acima para ver a rede no telão!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
