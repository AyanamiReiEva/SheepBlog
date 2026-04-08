import { LLMClient, loadPrompt } from './llm-client';
import { RequirementDocument } from '../utils/types';
import { saveRequirement, getSpecs } from '../utils/memory';

export class RequirementsAgent {
  private llm: LLMClient;

  constructor(llm?: LLMClient) {
    this.llm = llm || new LLMClient();
  }

  async analyzeRequirement(
    userRequirement: string,
    taskId?: string
  ): Promise<RequirementDocument> {
    const systemPrompt = loadPrompt('requirements-analyst');
    const specs = await getSpecs();

    const context = `
# 项目上下文

## 现有规范文档
${specs.map((s) => `### ${s.title}\n${s.content}`).join('\n\n')}

## 用户需求
${userRequirement}

请分析以上需求，生成结构化需求文档。
`;

    const response = await this.llm.call(systemPrompt, context, { temperature: 0.3 });

    if (!response.success || !response.data) {
      throw new Error(`Failed to analyze requirement: ${response.error}`);
    }

    const doc: RequirementDocument = {
      id: taskId || `req-${Date.now()}`,
      ...response.data,
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    await saveRequirement(doc);

    return doc;
  }

  async validateRequirement(doc: RequirementDocument): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    if (!doc.title || doc.title.length < 5) {
      issues.push('标题太短，需要更具体');
    }

    if (!doc.description || doc.description.length < 20) {
      issues.push('描述不够详细');
    }

    if (!doc.acceptanceCriteria || doc.acceptanceCriteria.length === 0) {
      issues.push('需要至少一个验收标准');
    }

    if (!doc.priority) {
      issues.push('需要指定优先级');
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}

export const requirementsAgent = new RequirementsAgent();
