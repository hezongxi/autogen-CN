#!/usr/bin/env python3
"""
DeepSeek API集成测试脚本
"""
import os
import asyncio
import sys

# 添加包路径
sys.path.insert(0, '/home/hezongxi/下载/autogen-main/python/packages/autogen-ext/src')
sys.path.insert(0, '/home/hezongxi/下载/autogen-main/python/packages/autogen-core/src')
sys.path.insert(0, '/home/hezongxi/下载/autogen-main/python/packages/autogen-agentchat/src')

# 设置DeepSeek API密钥
os.environ["DEEPSEEK_API_KEY"] = "sk-28d64e25188d420eb08459313355c135"

async def test_deepseek_api():
    """测试DeepSeek API集成"""
    try:
        from autogen_ext.models.openai import OpenAIChatCompletionClient
        from autogen_agentchat.agents import AssistantAgent
        
        print("🔧 正在测试DeepSeek API集成...")
        
        # 测试DeepSeek-R1模型（推理模型）
        print("\n📋 测试1: DeepSeek-R1模型")
        deepseek_r1_client = OpenAIChatCompletionClient(
            model="deepseek-r1"
        )
        
        r1_agent = AssistantAgent(
            "deepseek_r1_assistant",
            model_client=deepseek_r1_client,
            system_message="你是一个使用DeepSeek R1模型的AI助手，擅长逻辑推理。"
        )
        
        result1 = await r1_agent.run(task="解释一下什么是人工智能，请用中文回答。")
        print("✅ DeepSeek-R1响应:")
        print(result1)
        
        # 测试DeepSeek-V3模型（通用模型）
        print("\n📋 测试2: DeepSeek-V3模型")
        deepseek_v3_client = OpenAIChatCompletionClient(
            model="deepseek-v3"
        )
        
        v3_agent = AssistantAgent(
            "deepseek_v3_assistant", 
            model_client=deepseek_v3_client,
            system_message="你是一个使用DeepSeek V3模型的AI助手。"
        )
        
        result2 = await v3_agent.run(task="请简单介绍一下AutoGen框架的特点。")
        print("✅ DeepSeek-V3响应:")
        print(result2)
        
        print("\n🎉 DeepSeek API集成测试成功！")
        
    except ImportError as e:
        print(f"❌ 导入错误: {e}")
        print("请检查AutoGen包是否正确安装")
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        print("请检查API密钥和网络连接")

if __name__ == "__main__":
    print("🚀 开始DeepSeek API集成测试")
    asyncio.run(test_deepseek_api())