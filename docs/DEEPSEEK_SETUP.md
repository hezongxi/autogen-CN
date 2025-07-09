# DeepSeek API集成指南

## 🎯 概述

AutoGen中文版现已支持DeepSeek API，让你能够使用DeepSeek的强大模型来构建智能代理应用。

## 🔧 支持的模型

### DeepSeek-R1 (推理模型)
- **模型名称**: `deepseek-r1`
- **特点**: 专为复杂推理任务设计，支持思维链推理
- **上下文长度**: 65,536 tokens
- **功能**: 
  - ✅ 函数调用
  - ✅ JSON输出
  - ✅ 结构化输出
  - ✅ 推理过程可视化

### DeepSeek-V3 (通用模型)
- **模型名称**: `deepseek-v3`
- **特点**: 通用对话模型，支持多模态
- **上下文长度**: 32,768 tokens
- **功能**:
  - ✅ 视觉理解
  - ✅ 函数调用
  - ✅ JSON输出
  - ✅ 结构化输出

## 📦 安装配置

### 1. 获取API密钥

1. 访问 [DeepSeek开放平台](https://platform.deepseek.com/)
2. 注册并登录账户
3. 创建API密钥
4. 复制你的API密钥（格式：`sk-xxxxxxxx`）

### 2. 设置环境变量

```bash
# 方法1：临时设置
export DEEPSEEK_API_KEY="你的API密钥"

# 方法2：添加到~/.bashrc或~/.zshrc
echo 'export DEEPSEEK_API_KEY="你的API密钥"' >> ~/.bashrc
source ~/.bashrc
```

### 3. 验证安装

```bash
# 运行测试脚本
./start.sh
# 选择 "6. 测试DeepSeek集成"
```

## 🚀 使用示例

### 基础使用

```python
import os
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent

# 设置API密钥
os.environ["DEEPSEEK_API_KEY"] = "你的API密钥"

async def main():
    # 创建DeepSeek客户端
    client = OpenAIChatCompletionClient(model="deepseek-r1")
    
    # 创建智能体
    agent = AssistantAgent(
        "deepseek_assistant",
        model_client=client,
        system_message="你是一个AI助手"
    )
    
    # 运行对话
    result = await agent.run(task="解释什么是机器学习")
    print(result)

asyncio.run(main())
```

### 推理能力示例

```python
# DeepSeek-R1特别适合复杂推理
reasoning_client = OpenAIChatCompletionClient(model="deepseek-r1")

reasoning_agent = AssistantAgent(
    "reasoning_expert",
    model_client=reasoning_client,
    system_message="你是一个逻辑推理专家"
)

# 复杂推理任务
task = """
有一个数列：2, 6, 12, 20, 30, ...
请找出规律并预测下一个数字。
"""

result = await reasoning_agent.run(task=task)
print(result)
```

### 多模态使用

```python
# DeepSeek-V3支持视觉理解
vision_client = OpenAIChatCompletionClient(model="deepseek-v3")

vision_agent = AssistantAgent(
    "vision_assistant",
    model_client=vision_client,
    system_message="你是一个视觉理解专家"
)

# 注意：需要传入图像数据
```

### 多智能体协作

```python
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination

# 创建多个智能体
r1_client = OpenAIChatCompletionClient(model="deepseek-r1")
v3_client = OpenAIChatCompletionClient(model="deepseek-v3")

analyst = AssistantAgent("分析师", model_client=r1_client)
creative = AssistantAgent("创意师", model_client=v3_client)
reviewer = AssistantAgent("审核员", model_client=v3_client)

# 创建团队
team = RoundRobinGroupChat(
    [analyst, creative, reviewer],
    termination_condition=MaxMessageTermination(10)
)

# 运行团队协作
await team.run(task="设计一个智能家居系统")
```

## 🔍 高级配置

### 自定义配置

```python
# 完全自定义配置
client = OpenAIChatCompletionClient(
    model="deepseek-r1",
    api_key="你的API密钥",
    base_url="https://api.deepseek.com/v1/",
    temperature=0.7,
    max_tokens=4000,
    timeout=30.0
)
```

### 流式输出

```python
# 支持流式输出
async def stream_example():
    client = OpenAIChatCompletionClient(model="deepseek-r1")
    
    # 流式生成（具体实现取决于AutoGen版本）
    async for chunk in client.create_stream(...):
        print(chunk, end="", flush=True)
```

## 🛠️ 故障排除

### 常见错误

1. **API密钥错误**
   ```
   错误: 认证失败
   解决: 检查DEEPSEEK_API_KEY环境变量是否正确设置
   ```

2. **网络连接问题**
   ```
   错误: 连接超时
   解决: 检查网络连接，确保能访问api.deepseek.com
   ```

3. **模型不存在**
   ```
   错误: 模型名称无效
   解决: 确保使用正确的模型名称：deepseek-r1 或 deepseek-v3
   ```

### 调试技巧

```python
# 启用调试日志
import logging
logging.basicConfig(level=logging.DEBUG)

# 检查模型信息
from autogen_ext.models.openai._model_info import get_info
print(get_info("deepseek-r1"))
```

## 💡 最佳实践

### 1. 模型选择
- **复杂推理任务**: 使用 `deepseek-r1`
- **通用对话**: 使用 `deepseek-v3`
- **多模态任务**: 使用 `deepseek-v3`

### 2. 提示词优化
```python
# 对于R1模型，可以要求显示推理过程
system_message = """
你是一个AI助手。在回答复杂问题时，请展示你的推理过程。
使用以下格式：
<思考>
[详细的推理过程]
</思考>

[最终答案]
"""
```

### 3. 成本控制
- 合理设置 `max_tokens` 限制
- 对于简单任务，优先使用 `deepseek-v3`
- 使用流式输出可以提前终止不必要的生成

### 4. 性能优化
- 复用客户端实例
- 合理设置超时时间
- 使用异步调用

## 📚 相关资源

- [DeepSeek官方文档](https://platform.deepseek.com/docs)
- [AutoGen官方文档](https://microsoft.github.io/autogen/)
- [示例代码](./examples/deepseek_config_example.py)
- [测试脚本](./test_deepseek.py)

## 🤝 贡献

欢迎提交问题和改进建议！

- GitHub Issues: [提交问题](https://github.com/hezongxi/autogen-CN/issues)
- 贡献代码: [Pull Request](https://github.com/hezongxi/autogen-CN/pulls)

## 📄 许可证

本集成遵循AutoGen的MIT许可证。