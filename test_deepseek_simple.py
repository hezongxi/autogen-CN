#!/usr/bin/env python3
"""
简单的DeepSeek配置测试
"""
import os
import sys

# 清除代理设置
for key in ['http_proxy', 'https_proxy', 'HTTP_PROXY', 'HTTPS_PROXY']:
    if key in os.environ:
        del os.environ[key]

# 添加包路径
sys.path.insert(0, '/home/hezongxi/下载/autogen-main/python/packages/autogen-ext/src')
sys.path.insert(0, '/home/hezongxi/下载/autogen-main/python/packages/autogen-core/src')

# 设置DeepSeek API密钥
os.environ["DEEPSEEK_API_KEY"] = "sk-28d64e25188d420eb08459313355c135"

def test_model_info():
    """测试模型信息配置"""
    try:
        from autogen_ext.models.openai._model_info import get_info, DEEPSEEK_API_BASE_URL
        
        print("🔧 测试模型信息配置...")
        print(f"✅ DEEPSEEK_API_BASE_URL: {DEEPSEEK_API_BASE_URL}")
        
        # 测试DeepSeek-R1
        r1_info = get_info("deepseek-r1")
        print(f"✅ DeepSeek-R1信息: {r1_info}")
        
        # 测试DeepSeek-V3
        v3_info = get_info("deepseek-v3")
        print(f"✅ DeepSeek-V3信息: {v3_info}")
        
        return True
        
    except Exception as e:
        print(f"❌ 模型信息测试失败: {e}")
        return False

def test_client_creation():
    """测试客户端创建"""
    try:
        from autogen_ext.models.openai import OpenAIChatCompletionClient
        
        print("\n🔧 测试客户端创建...")
        
        # 创建DeepSeek-R1客户端
        r1_client = OpenAIChatCompletionClient(model="deepseek-r1")
        print("✅ DeepSeek-R1客户端创建成功")
        
        # 创建DeepSeek-V3客户端
        v3_client = OpenAIChatCompletionClient(model="deepseek-v3")
        print("✅ DeepSeek-V3客户端创建成功")
        
        return True
        
    except Exception as e:
        print(f"❌ 客户端创建失败: {e}")
        return False

def test_basic_config():
    """测试基础配置"""
    try:
        from autogen_ext.models.openai import OpenAIChatCompletionClient
        
        print("\n🔧 测试基础配置...")
        
        # 手动指定配置
        client = OpenAIChatCompletionClient(
            model="deepseek-r1",
            api_key="sk-28d64e25188d420eb08459313355c135",
            base_url="https://api.deepseek.com/v1/"
        )
        
        print("✅ 手动配置客户端创建成功")
        print(f"✅ 模型: {client._model_name}")
        
        return True
        
    except Exception as e:
        print(f"❌ 基础配置测试失败: {e}")
        return False

if __name__ == "__main__":
    print("🚀 DeepSeek配置测试")
    print("=" * 40)
    
    # 运行测试
    tests = [
        test_model_info,
        test_client_creation,
        test_basic_config
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print(f"\n📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！DeepSeek配置正常！")
    else:
        print("⚠️ 部分测试失败，请检查配置")