#!/usr/bin/env python3
"""
DeepSeek API配置示例
演示如何在AutoGen中使用DeepSeek模型
"""
import os
import asyncio
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination
from autogen_agentchat.ui import Console

# 设置DeepSeek API密钥
os.environ["DEEPSEEK_API_KEY"] = "your-deepseek-api-key-here"

async def deepseek_hello_world():
    """DeepSeek Hello World示例"""
    print("🌟 DeepSeek Hello World示例")
    
    # 创建DeepSeek R1客户端
    model_client = OpenAIChatCompletionClient(model="deepseek-r1")
    
    # 创建智能体
    agent = AssistantAgent(
        "deepseek_assistant",
        model_client=model_client,
        system_message="你是一个友好的AI助手，使用DeepSeek R1模型。"
    )
    
    # 运行对话
    result = await agent.run(task="你好！请介绍一下你自己。")
    print(result)

async def deepseek_reasoning_example():
    """DeepSeek推理能力示例"""
    print("\n🧠 DeepSeek推理能力示例")
    
    # DeepSeek-R1特别擅长推理
    model_client = OpenAIChatCompletionClient(model="deepseek-r1")
    
    reasoning_agent = AssistantAgent(
        "reasoning_expert",
        model_client=model_client,
        system_message="你是一个逻辑推理专家，善于分析复杂问题。"
    )
    
    task = """
    有三个朋友：小明、小红、小李。
    - 小明比小红大2岁
    - 小李比小明小3岁
    - 三人年龄之和是60岁
    请推理出每个人的年龄。
    """
    
    result = await reasoning_agent.run(task=task)
    print(result)

async def deepseek_multi_agent_example():
    """DeepSeek多智能体协作示例"""
    print("\n👥 DeepSeek多智能体协作示例")
    
    # 创建多个使用不同DeepSeek模型的智能体
    r1_client = OpenAIChatCompletionClient(model="deepseek-r1")
    v3_client = OpenAIChatCompletionClient(model="deepseek-v3")
    
    # 推理专家（R1模型）
    reasoning_agent = AssistantAgent(
        "推理专家",
        model_client=r1_client,
        system_message="你是一个逻辑推理专家，擅长分析和推理复杂问题。"
    )
    
    # 创意专家（V3模型）
    creative_agent = AssistantAgent(
        "创意专家", 
        model_client=v3_client,
        system_message="你是一个创意专家，善于提供创新的想法和解决方案。"
    )
    
    # 总结专家（V3模型）
    summary_agent = AssistantAgent(
        "总结专家",
        model_client=v3_client,
        system_message="你是一个总结专家，善于整合信息并提供清晰的总结。"
    )
    
    # 创建团队
    team = RoundRobinGroupChat(
        [reasoning_agent, creative_agent, summary_agent],
        termination_condition=MaxMessageTermination(6)
    )
    
    # 运行团队协作
    task = "请团队协作设计一个智能家居系统的核心功能，包括逻辑分析、创意想法和最终总结。"
    await Console(team.run_stream(task=task))

async def deepseek_function_calling_example():
    """DeepSeek函数调用示例"""
    print("\n⚙️ DeepSeek函数调用示例")
    
    from autogen_core.models import FunctionExecutionResult, FunctionExecutionResultMessage
    
    def get_weather(city: str) -> str:
        """获取指定城市的天气信息"""
        # 模拟天气API
        weather_data = {
            "北京": "晴天，温度15-25°C，微风",
            "上海": "多云，温度18-28°C，南风",
            "广州": "雨天，温度20-26°C，东南风",
            "深圳": "晴天，温度22-30°C，无风"
        }
        return weather_data.get(city, f"{city}的天气信息暂时无法获取")
    
    # 创建支持函数调用的智能体
    model_client = OpenAIChatCompletionClient(model="deepseek-v3")
    
    weather_agent = AssistantAgent(
        "weather_assistant",
        model_client=model_client,
        system_message="你是一个天气助手，可以查询城市天气信息。",
        tools=[get_weather]
    )
    
    result = await weather_agent.run(task="请帮我查询北京和上海的天气情况")
    print(result)

async def main():
    """主函数"""
    print("🚀 AutoGen + DeepSeek API配置示例")
    print("=" * 50)
    
    try:
        await deepseek_hello_world()
        await deepseek_reasoning_example()
        await deepseek_multi_agent_example()
        await deepseek_function_calling_example()
        
        print("\n✅ 所有示例运行完成！")
        
    except Exception as e:
        print(f"❌ 运行出错: {e}")
        print("请检查：")
        print("1. DEEPSEEK_API_KEY环境变量是否正确设置")
        print("2. 网络连接是否正常")
        print("3. AutoGen包是否正确安装")

if __name__ == "__main__":
    # 使用说明
    print("🔧 使用前请先设置DeepSeek API密钥：")
    print("export DEEPSEEK_API_KEY='your-api-key-here'")
    print("或者修改本文件中的API密钥配置")
    print()
    
    asyncio.run(main())