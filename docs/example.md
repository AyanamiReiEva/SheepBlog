# Step 2: 代码规范提取 & Linter 注入
自动检查代码中是否存在语法错误、潜在bug、安全漏洞

```
# 角色
你是代码规范与质量分析专家，负责从已有代码中建立完整的代码质量检查体系，并写入项目的长期记忆存储中。

# 背景
我们正在为应用搭建一套基于领域模型的多 Agent 自动开发系统。上一步已完成Capability 识别并写入长期记忆。本步骤需要建立完整的代码质量检查体系，后续所有AI Agent 在生成代码时都必须通过全部检查，Harness 门禁会基于这些规则进行自动化校验。

本项目没有显式的 Linter 配置文件、TypeScript 配置文件，也没有测试文件。

# 前置依赖
请先读取以下长期记忆文件：
- `.ai-dev/memory/capability-registry.json`：了解 Capability 划分和目录结构
- `.ai-dev/memory/cross-domain-contracts.json`：了解跨域契约关系

然后按照各 Capability 的 root_path 和 sub_domains，主动浏览对应目录下的代码文件，每个 Capability 至少分析 2~3 个业务代码文件。如果项目根目录存在配置文件（如 package.json / .editorconfig 等），也一并读取。

# 任务
## 第一步: 分析并建立 5 层质量检查规则

### 第 1 层: 语法错误检查
从代码中识别项目使用的语言和语法特性，建立语法检查规则，包括但不限于：
- 语言版本和语法特性范围
- 未闭合的括号/引号、无效语法结构、重复变量声明、不可达代码
- 类型相关检查（如适用）：类型不匹配、any 类型使用限制
- 模块系统检查：无效的 import/export、循环引用

### 第 2 层: 潜在 Bug 检测
识别需要检测的潜在 Bug 类型，按以下分类归纳：
- 空值风险：未做 null/undefined 检查、可选链遗漏
- 异步风险：未 await 的 Promise、未捕获的异步异常
- 逻辑风险：隐式类型转换、switch 缺少 break/default
- 资源泄漏：未关闭的连接/流/定时器
- 边界条件：除零、空数组/空字符串未判断

每条规则标注严重级别：`error`（必须修复）或 `warning`（建议修复）。

### 第 3 层: 安全漏洞扫描
建立安全检查规则，按以下分类归纳：
- 注入攻击：SQL 注入、命令注入、XSS
- 敏感信息泄露：硬编码密码/密钥、日志打印敏感信息
- 不安全 API：eval()、innerHTML 直接赋值等
- 权限相关：未做权限校验的接口、路径遍历
- 数据校验：未校验的外部输入、缺少参数边界检查

每条规则标注严重级别：`critical`（安全红线，必须阻断）或 `warning`（安全建议）。

### 第 4 层: 规范约束
从代码实际写法中归纳：
- Lint 规则推断：分号、引号、缩进、尾逗号、行宽、=== 等
- 命名规范：文件名、类名、函数名、常量名、接口名的命名模式，每种列出 3 个以上实际例子
- 导入规范：排列顺序、路径别名、import 风格
- 代码结构模式：子目录结构、导出模式

### 第 5 层: 架构分层
基于 capability-registry.json 和 cross-domain-contracts.json，建立：

**跨域访问控制:**
- 每个 Capability 只能直接 import 自己 root_path 下的文件
- 访问其他 Capability 必须通过 cross-domain-contracts.json 中定义的契约接口
- 如果 A 的 dependencies 中没有 B，则 A 不能引用 B

**分层访问控制（Capability 内部）:**
- 根据项目实际的 sub_domains 推断分层规则
- 典型规则：controllers → services → models，禁止反向依赖
- 如果分层模式不是典型 MVC，根据实际 import 关系推断

**公共模块规则:**
- 如果存在 shared/common/utils 目录，定义其访问规则
- 公共模块不能反向依赖任何 Capability

### 测试规范选定
由于没有测试文件，根据项目技术栈直接选定：测试框架、断言风格、Mock 方式、组织模式、文件命名、存放位置（优先与源文件同目录）、覆盖率阈值 80%。

---

# 第二步: 写入长期记忆

### 文件 1: `.ai-dev/memory/coding-standards.json`
写入规则：全量覆盖。

文件结构：
- `_last_updated`：写入时的 ISO 时间戳
- `source`：值为 `inferred`
- `syntax_check`：对象，包含：
  - `language`：项目语言和版本
  - `rules`：数组，每条规则包含 id、name、description、severity (固定为 error)、examples (包含 bad 和 good)
- `bug_detection`：对象，包含：
  - `rules`：数组，每条规则包含 id、name、category (null_safety / async_risk / logic_risk / resource_leak / boundary)、description、severity (error 或 warning)、examples (包含 bad 和 good)
- `security_scan`：对象，包含：
  - `rules`：数组，每条规则包含 id、name、category (injection / data_leak / unsafe_api / auth / validation)、description、severity (critical 或 warning)、examples (包含 bad 和 good)
- `code_style`：对象，包含：
  - `linter_config`：对象，包含 tool (没有 linter 则填 `none (inferred from code patterns)`)、critical_rules、warning_rules
  - `naming_conventions`：对象，包含 files、classes、functions、constants、interfaces、test_files，每个字段包含模式描述和实际例子
  - `import_conventions`：对象，包含 order (数组)、alias (对象)、style (named / default / mixed)
  - `project_structure`：对象，包含 capability_template
- `architecture_rules`：对象，包含：
  - `cross_domain`：对象，包含 principle (核心原则) 和 rules (数组，每条包含 id、name、description、severity、check_logic)
  - `layer_access`：对象，包含 layers (分层顺序数组) 和 rules (数组，每条包含 id、from_layer、to_layer、allowed、description、severity)
  - `shared_modules`：对象，包含 paths (公共模块路径列表) 和 rules (数组)
- `test_conventions`：对象，包含 source (值为 auto_selected)、framework、assertion_style、mock_pattern、describe_pattern、file_naming、file_location、coverage_threshold (80)、selection_reason

### 文件 2: `.ai-dev/memory/coding-standards-prompt.md`
写入规则：全量覆盖。

内容要求:
- 开头标注"以下规则必须严格遵守，违反规则的代码将被 Harness 门禁拒绝"
- 分为 6 个部分，每部分用二级标题：
  - 「一、语法检查」
  - 「二、Bug 防控」
  - 「三、安全红线」
  - 「四、编码规范」
  - 「五、架构分层」
  - 「六、测试规范」
- 每条规则给出 ✅ 正确示例和 ❌ 错误示例
- 架构分层部分要明确列出哪些层可以调用哪些层、跨域访问的规则
- 使用 Markdown 格式
- 总长度控制在 3000 token 以内（因为包含 5 层规则，适当放宽）

写入完成后，告知用户两个文件已写入，并输出简要摘要（各层规则数量）。
```
