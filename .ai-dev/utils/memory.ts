import fs from 'fs';
import path from 'path';
import { MemorySpec, RequirementDocument, PipelineContext } from './types';

const MEMORY_BASE = path.join(process.cwd(), '.ai-dev', 'memory');
const SPECS_DIR = path.join(MEMORY_BASE, 'specs');
const HISTORY_DIR = path.join(MEMORY_BASE, 'history');
const CONTEXT_DIR = path.join(MEMORY_BASE, 'context');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function saveSpec(
  type: 'code-style' | 'ui-design' | 'architecture' | 'commit' | 'pr' | 'requirement',
  title: string,
  content: string
): Promise<MemorySpec> {
  ensureDir(SPECS_DIR);
  const id = `${type}-${generateId()}`;
  const now = new Date().toISOString();
  const spec: MemorySpec = {
    id,
    type: 'spec',
    title,
    content,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
  const filePath = path.join(SPECS_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(spec, null, 2));
  return spec;
}

export async function getSpecs(type?: string): Promise<MemorySpec[]> {
  if (!fs.existsSync(SPECS_DIR)) return [];
  const files = fs.readdirSync(SPECS_DIR).filter((f) => f.endsWith('.json'));
  const specs = files.map((f) => {
    const content = fs.readFileSync(path.join(SPECS_DIR, f), 'utf-8');
    return JSON.parse(content) as MemorySpec;
  });
  if (type) {
    return specs.filter((s) => s.id.startsWith(type));
  }
  return specs;
}

export async function saveHistory(
  requirementId: string,
  title: string,
  data: any
): Promise<void> {
  ensureDir(HISTORY_DIR);
  const filePath = path.join(HISTORY_DIR, `${requirementId}.json`);
  const record = {
    id: requirementId,
    title,
    data,
    completedAt: new Date().toISOString(),
  };
  fs.writeFileSync(filePath, JSON.stringify(record, null, 2));
}

export async function saveContext(context: PipelineContext): Promise<void> {
  ensureDir(CONTEXT_DIR);
  const filePath = path.join(CONTEXT_DIR, `${context.taskId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(context, null, 2));
}

export async function getContext(taskId: string): Promise<PipelineContext | null> {
  const filePath = path.join(CONTEXT_DIR, `${taskId}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as PipelineContext;
}

export async function deleteContext(taskId: string): Promise<void> {
  const filePath = path.join(CONTEXT_DIR, `${taskId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export async function saveRequirement(doc: RequirementDocument): Promise<void> {
  ensureDir(SPECS_DIR);
  const filePath = path.join(SPECS_DIR, `requirement-${doc.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2));
}

export async function getRequirement(id: string): Promise<RequirementDocument | null> {
  const filePath = path.join(SPECS_DIR, `requirement-${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as RequirementDocument;
}
