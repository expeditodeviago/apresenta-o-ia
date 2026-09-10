export type CyberColor = 'cyan' | 'purple' | 'matrix' | 'amber' | 'rose' | 'blue';

export type ChalkColor = 'white' | 'cream' | 'green' | 'amber' | 'blue' | 'rose' | 'purple' | 'orange' | 'cyan' | 'matrix';

export type BoardTheme = 'green' | 'slate' | 'blueprint' | 'cyber';

export interface ConnectionData {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  color: any;
  label?: string;
  curved?: 'up' | 'down' | 'straight' | 's-curve';
  dashed?: boolean;
}

export type PresentationMode = 'deck' | 'mindmap';

export interface ToolReference {
  name: string;
  category: string;
  url: string;
  badge: string;
  description: string;
  practicalInsight: string;
  discreteMathConnection?: string; // Mantido para compatibilidade retroativa segura
}

export interface MindMapNodeData {
  id: string;
  stepNumber: number; // 1 to 15
  actId: string; // 'act-1' to 'act-5'
  zoneId?: string;
  title: string;
  subtitle: string;
  color: CyberColor;
  x: number; // Canvas X position for Mindmap Mode
  y: number; // Canvas Y position for Mindmap Mode
  width: number;
  height: number;
  iconName: string;
  tags: string[];
  
  // Rich slide details
  analogy: {
    title: string;
    description: string;
  };
  keyTakeaways: string[];
  techUnderTheHood: {
    concept: string;
    howItWorks: string;
    stageTip: string;
  };
  discreteMathSecret?: {
    concept: string;
    formulaOrConcept: string;
    explanation: string;
  };
  classroomDynamic: {
    prompt: string;
    suggestedAnswer: string;
  };
  tools: ToolReference[];
  simulatorType?: 'token-explorer' | 'knowledge-galaxy' | 'holo-deck' | 'reasoning-tree' | 'neural-room' | 'matrix-protocol' | 'llm-pipeline' | 'agent-loop';
}

export interface ActData {
  id: string;
  actNumber: number;
  title: string;
  subtitle: string;
  color: CyberColor;
  icon: string;
  description: string;
  stageFocus: string;
  discreteMathFocus?: string;
  nodeIds: string[];
}

export interface StudentParticipant {
  id: string;
  name: string;
  course: string;
  concept: string;
  color: CyberColor;
  timestamp: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface AgentActivity {
  agentName: 'Nexus' | 'Cypher' | 'Sentinel';
  role: 'Arquiteto de Sistemas' | 'Engenheiro de Código' | 'Auditor de QA';
  avatarColor: string;
  currentAction: string;
  codeSnippet?: string;
  status: 'idle' | 'working' | 'done';
}
