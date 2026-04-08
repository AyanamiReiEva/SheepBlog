export interface MemorySpec {
  id: string;
  type: 'spec' | 'history' | 'context';
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface RequirementDocument {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  technicalRequirements?: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  tags: string[];
  createdAt: string;
  status: 'draft' | 'approved' | 'in-progress' | 'completed';
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface PipelineContext {
  taskId: string;
  requirement?: RequirementDocument;
  generatedFiles: Array<{ path: string; content: string }>;
  testResults?: any;
  complianceReport?: any;
  currentStage: string;
  createdAt: string;
}
