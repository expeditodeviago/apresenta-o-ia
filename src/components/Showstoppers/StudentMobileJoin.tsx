import React, { useState } from 'react';
import { Radio, CheckCircle, ArrowRight, User, GraduationCap, Cpu } from 'lucide-react';
import { CyberColor } from '../../types/presentation';

const CONCEPTS = [
  'Agentes Autônomos',
  'Modelos de Raciocínio (DeepSeek / o1)',
  'Cursor & v0 (Programação com IA)',
  'Modelos Locais (Ollama)',
  'Segundo Cérebro (Obsidian)',
  'Engenharia de Prompt',
  'Embeddings & Busca Semântica',
  'Arquitetura de LLMs',
];

const COLORS: CyberColor[] = ['cyan', 'purple', 'matrix', 'amber', 'rose', 'blue'];

export const StudentMobileJoin: React.FC = () => {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Engenharia de Software');
  const [concept, setConcept] = useState(CONCEPTS[0]);
  const [hasJoined, setHasJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const studentData = {
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      course,
      concept,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      timestamp: Date.now(),
    };

    // Broadcast via BroadcastChannel
    try {
      const bc = new BroadcastChannel('neural_room_channel');
      bc.postMessage({ type: 'STUDENT_JOIN', data: studentData });
      bc.close();
    } catch {
      // Fallback
    }

    // Broadcast via localStorage event
    try {
      const existing = JSON.parse(localStorage.getItem('neural_room_students') || '[]');
      existing.push(studentData);
      localStorage.setItem('neural_room_students', JSON.stringify(existing));
      localStorage.setItem('neural_room_latest', JSON.stringify(studentData));
    } catch {
      // Storage fallback
    }

    setHasJoined(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      <div className="w-full max-w-md bg-card rounded-2xl p-8 border border-border shadow-lg relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-foreground text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-foreground" />
            <span>THE NEURAL ROOM • AO VIVO</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Conecte sua Participação ao Telão
          </h1>
          <p className="text-xs text-muted-foreground">
            Envie seus dados para se conectar à rede da turma no telão em tempo real!
          </p>
        </div>

        {hasJoined ? (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-xl bg-secondary border border-border flex items-center justify-center text-foreground shadow-sm">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Conectado com Sucesso!</h3>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              Olhe para o telão agora! Seu perfil <strong className="text-foreground">"{name}"</strong> acabou de surgir e se conectar com seus colegas!
            </p>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs font-mono text-left space-y-1">
              <div>Participante: <strong className="text-foreground">{name}</strong></div>
              <div>Curso: <strong className="text-muted-foreground">{course}</strong></div>
              <div>Tópico: <strong className="text-foreground">{concept}</strong></div>
            </div>
            <button
              onClick={() => setHasJoined(false)}
              className="px-4 py-2 rounded-lg text-xs font-mono bg-secondary hover:bg-muted text-foreground border border-border transition-colors"
            >
              Enviar Outro Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-foreground" />
                <span>SEU NOME / APELIDO:</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos, Ana, Prof. Marcos..."
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm font-sans focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Course */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-foreground" />
                <span>CURSO / TURMA:</span>
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm font-sans focus:outline-none focus:border-primary transition-all"
              >
                <option value="Engenharia de Software">Engenharia de Software</option>
                <option value="Ciência da Computação">Ciência da Computação</option>
                <option value="Sistemas de Informação">Sistemas de Informação</option>
                <option value="Engenharia da Computação">Engenharia da Computação</option>
                <option value="Professor / Convidado">Professor / Convidado</option>
              </select>
            </div>

            {/* Concept */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-foreground" />
                <span>SEU TÓPICO FAVORITO DE IA:</span>
              </label>
              <select
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm font-sans focus:outline-none focus:border-primary transition-all"
              >
                {CONCEPTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all border border-primary/20"
            >
              <span>CONECTAR AO TELÃO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
