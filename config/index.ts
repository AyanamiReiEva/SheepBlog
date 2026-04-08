// 项目全局配置文件

export const config = {
  // 大模型配置
  llm: {
    provider: 'doubao',
    apiKey: 'sk-87a346a89da646f88ba8f1bfb861adf6', // 请替换为豆包API密钥
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3', // 豆包API地址
    model: 'Doubao-Seed-2.0-Code',
    temperature: 0.7,
    maxTokens: 4096,
  },

  // 博客配置
  blog: {
    title: '个人博客',
    description: '一个极简的技术博客',
    author: 'Admin',
    url: 'https://example.com',
    language: 'zh-CN',
    contentDir: 'content',
  },

  // AI开发流水线配置
  pipeline: {
    memoryDir: '.ai-dev/memory',
    promptsDir: '.ai-dev/prompts',
    agentsDir: '.ai-dev/agents',
    maxRetries: 3,
    timeout: 300000, // 5分钟超时
  }
} as const;

export default config;
