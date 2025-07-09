<a name="readme-top"></a>

<div align="center">
<img src="https://microsoft.github.io/autogen/0.2/img/ag.svg" alt="AutoGen Logo" width="100">

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40pyautogen)](https://twitter.com/pyautogen)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Company?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/105812540)
[![Discord](https://img.shields.io/badge/discord-chat-green?logo=discord)](https://aka.ms/autogen-discord)
[![Documentation](https://img.shields.io/badge/Documentation-AutoGen-blue?logo=read-the-docs)](https://microsoft.github.io/autogen/)
[![Blog](https://img.shields.io/badge/Blog-AutoGen-blue?logo=blogger)](https://devblogs.microsoft.com/autogen/)

</div>

# AutoGen 中文版

> **基于 Microsoft AutoGen 的中文本地化项目**  
> 本项目基于 [Microsoft AutoGen](https://github.com/microsoft/autogen) 创建，遵循 MIT 许可证。  
> 感谢 Microsoft 和 AutoGen 团队的杰出贡献！

**AutoGen** 是一个用于创建多智能体AI应用程序的框架，这些应用程序可以自主运行或与人类协作。

## 🚀 为什么选择AutoGen？

- **🤖 强大的多智能体系统**：创建能够协作、讨论和解决复杂问题的AI智能体团队
- **🔧 易于使用**：简单的API设计，几行代码即可开始
- **🎯 灵活配置**：支持多种AI模型和自定义智能体行为
- **💡 创新应用**：从代码生成到数据分析，从研究到自动化，无限可能
- **🌐 丰富生态**：包含Web浏览、代码执行、可视化界面等扩展
- **🧠 DeepSeek集成**：完整支持DeepSeek-R1推理模型和DeepSeek-V3通用模型

## 📦 安装

AutoGen 需要 **Python 3.10 或更高版本**。

### 🚀 一键安装（推荐）

```bash
# 下载项目
git clone https://github.com/hezongxi/autogen-CN.git
cd autogen-CN

# 运行一键安装脚本
chmod +x install.sh
./install.sh
```

### 📋 手动安装

```bash
# 安装 AgentChat 和 OpenAI 客户端扩展
pip install -U "autogen-agentchat" "autogen-ext[openai]"

# 安装 AutoGen Studio 获得无代码GUI界面
pip install -U "autogenstudio"

# 可选：安装Web浏览功能
pip install -U "autogen-ext[web-surfer]"
pip install playwright
playwright install
```

当前稳定版本为 v0.4。如果您从 AutoGen v0.2 升级，请参考 [迁移指南](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/migration-guide.html) 了解如何更新代码和配置。

## 🎯 快速开始

### 🚀 一键启动

```bash
# 使用启动脚本（推荐）
./start.sh
```

启动脚本提供以下功能：
- 🎨 启动AutoGen Studio可视化界面
- 👋 运行Hello World示例
- 🌐 运行Web浏览示例
- 👥 运行多智能体团队示例
- 🤖 运行DeepSeek API示例
- 🧪 测试DeepSeek集成
- 🐍 启动交互式Python环境
- 📊 查看系统信息

### 你好，世界！

使用 OpenAI 的 GPT-4o 模型创建一个助手智能体。查看 [其他支持的模型](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/tutorial/models.html)。

```python
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main() -> None:
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    agent = AssistantAgent("assistant", model_client=model_client)
    print(await agent.run(task="说 '你好，世界！'"))
    await model_client.close()

asyncio.run(main())
```

### 🤖 DeepSeek API示例

使用DeepSeek-R1推理模型创建智能体。支持复杂推理和思维链。

```python
import asyncio
import os
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent

# 设置DeepSeek API密钥
os.environ["DEEPSEEK_API_KEY"] = "your-deepseek-api-key"

async def main():
    # DeepSeek-R1推理模型
    model_client = OpenAIChatCompletionClient(model="deepseek-r1")
    
    agent = AssistantAgent(
        "deepseek_assistant", 
        model_client=model_client,
        system_message="你是一个逻辑推理专家，善于分析复杂问题。"
    )
    
    result = await agent.run(task="解释机器学习中的过拟合问题及其解决方案")
    print(result)

asyncio.run(main())
```

### 🌐 Web浏览智能体团队

创建一个包含网络浏览智能体和用户代理智能体的群聊团队来执行网络浏览任务。您需要安装 [playwright](https://playwright.dev/python/docs/library)。

```python
# pip install -U autogen-agentchat autogen-ext[openai,web-surfer]
# playwright install
import asyncio
from autogen_agentchat.agents import UserProxyAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_ext.agents.web_surfer import MultimodalWebSurfer

async def main() -> None:
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    # 网络浏览器将打开一个Chromium浏览器窗口来执行网络浏览任务
    web_surfer = MultimodalWebSurfer("web_surfer", model_client, headless=False, animate_actions=True)
    # 用户代理智能体用于在网络浏览器的每个步骤之后获取用户输入
    # 注意：您可以按Enter键跳过输入
    user_proxy = UserProxyAgent("user_proxy")
    # 当用户输入'exit'时终止对话
    termination = TextMentionTermination("exit", sources=["user_proxy"])
    # 网络浏览器和用户代理以轮询方式交替进行
    team = RoundRobinGroupChat([web_surfer, user_proxy], termination_condition=termination)
    try:
        # 启动团队并等待其终止
        await Console(team.run_stream(task="找到关于AutoGen的信息并写一个简短的摘要。"))
    finally:
        await web_surfer.close()
        await model_client.close()

asyncio.run(main())
```

### 🎨 AutoGen Studio

使用 AutoGen Studio 无需编写代码即可原型化和运行多智能体工作流。

```bash
# 在 http://localhost:8080 运行 AutoGen Studio
autogenstudio ui
```

## 🌟 主要特性

### 🤝 多智能体协作
- **智能体团队**：创建专业化的AI智能体团队
- **角色分工**：每个智能体都有明确的角色和职责
- **协作解决**：复杂问题通过智能体间的协作解决

### 🔧 灵活配置
- **多模型支持**：支持OpenAI、Azure、Anthropic、DeepSeek等主流AI模型
- **自定义智能体**：轻松创建具有特定能力的智能体
- **工作流编排**：灵活的对话和任务流程控制

#### 支持的DeepSeek模型
- **DeepSeek-R1**：专业推理模型，支持复杂逻辑推理和思维链
- **DeepSeek-V3**：通用对话模型，支持多模态和视觉理解

### 💡 丰富应用场景
- **代码生成与审查**：自动化软件开发流程
- **数据分析**：智能数据处理和洞察生成
- **研究助手**：文献调研和知识总结
- **内容创作**：文章写作和创意生成

## 📚 应用示例

### 👥 代码审查团队
```python
# 创建一个代码审查团队
reviewer_team = RoundRobinGroupChat([
    AssistantAgent("程序员", model_client=model_client, system_message="你是一个专业的Python程序员"),
    AssistantAgent("审查员", model_client=model_client, system_message="你是一个代码审查专家"),
    AssistantAgent("测试员", model_client=model_client, system_message="你是一个软件测试专家")
])
```

### 📊 数据分析团队
```python
# 创建一个数据分析团队
analysis_team = RoundRobinGroupChat([
    AssistantAgent("数据科学家", model_client=model_client, system_message="专业的数据分析师"),
    AssistantAgent("可视化专家", model_client=model_client, system_message="数据可视化专家"),
    AssistantAgent("报告撰写员", model_client=model_client, system_message="专业的报告撰写员")
])
```

## 🛠️ 高级功能

### 🔍 工具集成
- **代码执行**：安全的代码执行环境
- **Web浏览**：智能网络信息收集
- **文件操作**：文档处理和生成
- **数据库连接**：数据存储和查询

### 🎯 精确控制
- **终止条件**：灵活的对话结束条件
- **消息过滤**：智能消息路由和过滤
- **状态管理**：对话状态的持久化

## 🌍 社区与支持

- **📖 官方文档**：[https://microsoft.github.io/autogen/](https://microsoft.github.io/autogen/)
- **🤖 DeepSeek配置**：[DeepSeek集成指南](./docs/DEEPSEEK_SETUP.md)
- **💬 Discord社区**：[加入讨论](https://aka.ms/autogen-discord)
- **🐛 问题报告**：[GitHub Issues](https://github.com/microsoft/autogen/issues)
- **🔄 原版项目**：[Microsoft AutoGen](https://github.com/microsoft/autogen)

## 📄 许可证

本项目基于原版 Microsoft AutoGen 项目，遵循相同的许可证结构：

- **代码部分**: [MIT 许可证](LICENSE-CODE) - 允许自由使用、修改和分发
- **文档部分**: [Creative Commons Attribution 4.0](LICENSE) - 要求署名

### 原版项目声明
```
Copyright (c) Microsoft Corporation.

基于 Microsoft AutoGen (https://github.com/microsoft/autogen)
本项目为中文本地化版本，保留所有原始版权声明和许可证条款。
```

## 🤝 贡献

我们欢迎社区贡献！在贡献之前，请：

1. 查看 [贡献指南](CONTRIBUTING.md)
2. 遵循原版 AutoGen 的贡献规范
3. 确保中文翻译的准确性和一致性
4. 保持与上游项目的同步

### 贡献类型
- 🌐 中文翻译和本地化
- 🐛 Bug 修复和问题报告
- 📚 文档改进和示例补充
- 🚀 新功能开发（需与上游保持一致）

## 🔗 相关链接

- **原版项目**: [Microsoft AutoGen](https://github.com/microsoft/autogen)
- **官方文档**: [AutoGen Documentation](https://microsoft.github.io/autogen/)
- **社区支持**: [Discord](https://aka.ms/autogen-discord)
- **问题报告**: [GitHub Issues](https://github.com/microsoft/autogen/issues)

## 🏆 致谢

### 原创团队
感谢 Microsoft 和 AutoGen 团队创造了这个强大的多智能体框架！

### 特别声明
- 本项目是 Microsoft AutoGen 的**非官方**中文本地化版本
- 我们不隶属于 Microsoft Corporation
- 所有原始版权归 Microsoft Corporation 所有
- 本项目旨在为中文用户提供更好的使用体验

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请同时为 [原版项目](https://github.com/microsoft/autogen) 和本项目点赞！ ⭐**

[English](https://github.com/microsoft/autogen) | **中文** | [官方文档](https://microsoft.github.io/autogen/)

</div>