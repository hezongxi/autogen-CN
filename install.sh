#!/bin/bash
# AutoGen 中文版一键安装脚本
# AutoGen Chinese Version One-click Installation Script

set -e

echo "🚀 AutoGen 中文版一键安装脚本"
echo "🚀 AutoGen Chinese Version One-click Installation Script"
echo "==============================================="

# 检查Python版本
check_python() {
    echo "📋 检查Python版本..."
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
        echo "✅ 发现Python版本: $PYTHON_VERSION"
        
        # 检查Python版本是否>=3.10
        if python3 -c "import sys; exit(0 if sys.version_info >= (3, 10) else 1)"; then
            echo "✅ Python版本符合要求 (>=3.10)"
        else
            echo "❌ Python版本过低，需要Python 3.10或更高版本"
            echo "请升级Python版本或使用以下命令安装:"
            echo "  Ubuntu/Debian: sudo apt-get update && sudo apt-get install python3.10"
            echo "  CentOS/RHEL: sudo yum install python3.10"
            echo "  macOS: brew install python@3.10"
            exit 1
        fi
    else
        echo "❌ 未找到Python3，请先安装Python 3.10或更高版本"
        exit 1
    fi
}

# 检查并安装pip
check_pip() {
    echo "📋 检查pip..."
    if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
        echo "⚠️ 未找到pip，正在安装..."
        python3 -m ensurepip --upgrade
        echo "✅ pip安装完成"
    else
        echo "✅ pip已存在"
    fi
}

# 升级pip
upgrade_pip() {
    echo "📋 升级pip到最新版本..."
    python3 -m pip install --upgrade pip
    echo "✅ pip升级完成"
}

# 安装AutoGen核心包
install_autogen() {
    echo "📋 安装AutoGen核心包..."
    echo "正在安装 autogen-agentchat 和 autogen-ext[openai]..."
    
    python3 -m pip install -U "autogen-agentchat" "autogen-ext[openai]"
    
    echo "✅ AutoGen核心包安装完成"
}

# 安装AutoGen Studio
install_autogen_studio() {
    echo "📋 安装AutoGen Studio..."
    python3 -m pip install -U "autogenstudio"
    echo "✅ AutoGen Studio安装完成"
}

# 安装可选依赖
install_optional_deps() {
    echo "📋 安装可选依赖..."
    
    # 询问是否安装Web浏览功能
    read -p "是否安装Web浏览功能 (需要playwright)? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在安装Web浏览功能..."
        python3 -m pip install -U "autogen-ext[web-surfer]"
        python3 -m pip install playwright
        echo "正在安装playwright浏览器..."
        python3 -m playwright install
        echo "✅ Web浏览功能安装完成"
    fi
    
    # 询问是否安装其他扩展
    read -p "是否安装其他扩展 (anthropic, azure, etc.)? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "正在安装其他扩展..."
        python3 -m pip install -U "autogen-ext[anthropic,azure]"
        echo "✅ 其他扩展安装完成"
    fi
}

# 创建示例配置文件
create_examples() {
    echo "📋 创建示例文件..."
    
    mkdir -p examples
    
    # 创建基础示例
    cat > examples/hello_world.py << 'EOF'
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    # 请在这里设置您的OpenAI API密钥
    # model_client = OpenAIChatCompletionClient(model="gpt-4o", api_key="your-api-key")
    
    # 或者设置环境变量 OPENAI_API_KEY
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    
    agent = AssistantAgent("助手", model_client=model_client)
    
    result = await agent.run(task="你好！请介绍一下AutoGen框架。")
    print(result)
    
    await model_client.close()

if __name__ == "__main__":
    asyncio.run(main())
EOF
    
    # 创建配置文件模板
    cat > examples/config_template.py << 'EOF'
# AutoGen 配置模板
# 复制此文件并重命名为 config.py，然后填入您的API密钥

# OpenAI配置
OPENAI_API_KEY = "your-openai-api-key-here"
OPENAI_BASE_URL = "https://api.openai.com/v1"  # 可选，默认为OpenAI官方API

# Azure OpenAI配置 (如果使用Azure)
AZURE_OPENAI_API_KEY = "your-azure-openai-key"
AZURE_OPENAI_ENDPOINT = "https://your-resource.openai.azure.com"
AZURE_OPENAI_API_VERSION = "2023-05-15"

# Anthropic配置 (如果使用Claude)
ANTHROPIC_API_KEY = "your-anthropic-api-key"

# 其他配置
DEFAULT_MODEL = "gpt-4o"
MAX_TOKENS = 4000
TEMPERATURE = 0.7
EOF
    
    echo "✅ 示例文件创建完成"
}

# 验证安装
verify_installation() {
    echo "📋 验证安装..."
    
    # 检查AutoGen是否正确安装
    if python3 -c "import autogen_agentchat; print('✅ autogen_agentchat导入成功')" 2>/dev/null; then
        echo "✅ AutoGen核心包安装验证成功"
    else
        echo "❌ AutoGen核心包安装验证失败"
        return 1
    fi
    
    # 检查AutoGen Studio
    if python3 -c "import autogenstudio; print('✅ autogenstudio导入成功')" 2>/dev/null; then
        echo "✅ AutoGen Studio安装验证成功"
    else
        echo "⚠️ AutoGen Studio可能未正确安装"
    fi
    
    echo "✅ 安装验证完成"
}

# 显示使用说明
show_usage() {
    echo ""
    echo "🎉 AutoGen 中文版安装完成！"
    echo "==============================================="
    echo ""
    echo "📖 快速开始:"
    echo "1. 设置API密钥 (必需):"
    echo "   export OPENAI_API_KEY='your-api-key'"
    echo "   或者编辑 examples/config_template.py"
    echo ""
    echo "2. 运行示例:"
    echo "   python3 examples/hello_world.py"
    echo ""
    echo "3. 启动AutoGen Studio:"
    echo "   autogenstudio ui"
    echo "   然后访问 http://localhost:8080"
    echo ""
    echo "4. 或者使用启动脚本:"
    echo "   ./start.sh"
    echo ""
    echo "📚 更多资源:"
    echo "- 官方文档: https://microsoft.github.io/autogen/"
    echo "- 示例代码: ./examples/"
    echo "- GitHub仓库: https://github.com/hezongxi/autogen-CN"
    echo ""
    echo "❓ 需要帮助？"
    echo "- 查看README.md"
    echo "- 提交Issue到GitHub"
    echo "- 加入Discord社区"
    echo ""
}

# 主函数
main() {
    echo "开始安装AutoGen中文版..."
    
    check_python
    check_pip
    upgrade_pip
    install_autogen
    install_autogen_studio
    install_optional_deps
    create_examples
    verify_installation
    show_usage
    
    echo "🎉 安装完成！享受AutoGen的强大功能吧！"
}

# 运行主函数
main "$@"