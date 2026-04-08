#!/usr/bin/env node

import { requirementsAgent } from './agents';
import { saveHistory, saveContext } from './utils';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'analyze':
      await analyzeRequirement(args.slice(1).join(' '));
      break;
    case 'help':
    default:
      printHelp();
  }
}

async function analyzeRequirement(requirementText: string) {
  if (!requirementText) {
    console.error('请提供需求描述');
    process.exit(1);
  }

  console.log('=== AI需求分析 ===');
  console.log(`需求: ${requirementText}`);
  console.log('');

  try {
    const taskId = `task-${Date.now()}`;
    console.log('正在分析需求...');

    const doc = await requirementsAgent.analyzeRequirement(requirementText, taskId);

    console.log('');
    console.log('✅ 需求分析完成!');
    console.log('');
    console.log('需求文档:');
    console.log(`  ID: ${doc.id}`);
    console.log(`  标题: ${doc.title}`);
    console.log(`  优先级: ${doc.priority}`);
    console.log(`  预估工时: ${doc.estimatedHours || 'N/A'}小时`);
    console.log(`  标签: ${doc.tags.join(', ')}`);
    console.log('');
    console.log('验收标准:');
    doc.acceptanceCriteria.forEach((criteria, i) => {
      console.log(`  ${i + 1}. ${criteria}`);
    });

    const validation = await requirementsAgent.validateRequirement(doc);
    if (!validation.valid) {
      console.log('');
      console.warn('⚠️  需求文档存在问题:');
      validation.issues.forEach((issue) => {
        console.warn(`  - ${issue}`);
      });
    }

    await saveContext({
      taskId,
      requirement: doc,
      generatedFiles: [],
      currentStage: 'requirements',
      createdAt: new Date().toISOString(),
    });

    await saveHistory(doc.id, doc.title, { requirement: doc });

    console.log('');
    console.log('📝 需求文档已保存');

  } catch (error) {
    console.error('');
    console.error('❌ 分析失败:', (error as Error).message);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
AI开发流水线 CLI

使用方法:
  node .ai-dev/cli.ts <command> [options]

命令:
  analyze "<需求描述>"    分析自然语言需求，生成结构化需求文档
  help                    显示帮助信息

示例:
  node .ai-dev/cli.ts analyze "添加一个博客文章搜索功能"
`);
}

main().catch(console.error);
