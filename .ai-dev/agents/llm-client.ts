import fs from 'fs';
import path from 'path';
import { AgentResponse } from '../utils/types';

export interface LLMConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  maxRetries?: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  model: 'claude-3-5-sonnet-20241022',
  temperature: 0.7,
  maxTokens: 4096,
  timeout: 60000,
  maxRetries: 3,
};

export class LLMClient {
  private config: LLMConfig;
  private totalTokens: number = 0;
  private requestCount: number = 0;

  constructor(config?: LLMConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async call(
    systemPrompt: string,
    userPrompt: string,
    config?: LLMConfig
  ): Promise<AgentResponse> {
    const finalConfig = { ...this.config, ...config };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= (finalConfig.maxRetries || 3); attempt++) {
      try {
        const response = await this._callLLM(systemPrompt, userPrompt, finalConfig);
        this.requestCount++;
        this.totalTokens += response.tokenUsage.total;
        return response;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed: ${(error as Error).message}`);
        if (attempt < (finalConfig.maxRetries || 3)) {
          await this._delay(1000 * attempt);
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Max retries exceeded',
      tokenUsage: { prompt: 0, completion: 0, total: 0 },
    };
  }

  private async _callLLM(
    systemPrompt: string,
    userPrompt: string,
    config: LLMConfig
  ): Promise<AgentResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY not set, using mock response');
      return this._getMockResponse(systemPrompt, userPrompt);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
        signal: AbortSignal.timeout(config.timeout || 60000),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      const promptTokens = data.usage?.input_tokens || 0;
      const completionTokens = data.usage?.output_tokens || 0;

      return {
        success: true,
        data: this._parseJSON(content),
        tokenUsage: {
          prompt: promptTokens,
          completion: completionTokens,
          total: promptTokens + completionTokens,
        },
      };
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  private _parseJSON(content: string): any {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      return { rawContent: content };
    } catch {
      return { rawContent: content };
    }
  }

  private _getMockResponse(systemPrompt: string, userPrompt: string): AgentResponse {
    if (systemPrompt.includes('需求分析师')) {
      return {
        success: true,
        data: {
          title: '测试需求',
          description: userPrompt,
          acceptanceCriteria: ['功能正常工作'],
          priority: 'medium',
          tags: ['test'],
          estimatedHours: 4,
        },
        tokenUsage: { prompt: 10, completion: 20, total: 30 },
      };
    }
    return {
      success: true,
      data: { message: 'Mock response' },
      tokenUsage: { prompt: 10, completion: 10, total: 20 },
    };
  }

  private _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      totalTokens: this.totalTokens,
      requestCount: this.requestCount,
      averageTokensPerRequest: this.requestCount > 0 ? this.totalTokens / this.requestCount : 0,
    };
  }
}

export function loadPrompt(promptName: string): string {
  const promptPath = path.join(process.cwd(), '.ai-dev', 'prompts', `${promptName}.md`);
  if (fs.existsSync(promptPath)) {
    return fs.readFileSync(promptPath, 'utf-8');
  }
  throw new Error(`Prompt not found: ${promptName}`);
}

export const llmClient = new LLMClient();
