#!/bin/bash
# AutoGen 中文版启动脚本
# AutoGen Chinese Version Start Script

set -e

echo "🚀 AutoGen 中文版启动脚本"
echo "🚀 AutoGen Chinese Version Start Script"
echo "==============================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查AutoGen是否已安装
check_installation() {
    echo -e "${BLUE}📋 检查AutoGen安装状态...${NC}"
    
    if ! python3 -c "import autogen_agentchat" 2>/dev/null; then
        echo -e "${RED}❌ AutoGen未安装或安装不完整${NC}"
        echo -e "${YELLOW}请先运行安装脚本: ./install.sh${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ AutoGen已正确安装${NC}"
}

# 检查API密钥
check_api_keys() {
    echo -e "${BLUE}📋 检查API密钥配置...${NC}"
    
    if [[ -z "$OPENAI_API_KEY" && -z "$AZURE_OPENAI_API_KEY" && -z "$ANTHROPIC_API_KEY" ]]; then
        echo -e "${YELLOW}⚠️ 未检测到API密钥环境变量${NC}"
        echo -e "${YELLOW}请设置以下环境变量之一:${NC}"
        echo -e "${YELLOW}  export OPENAI_API_KEY='your-openai-key'${NC}"
        echo -e "${YELLOW}  export AZURE_OPENAI_API_KEY='your-azure-key'${NC}"
        echo -e "${YELLOW}  export ANTHROPIC_API_KEY='your-anthropic-key'${NC}"
        echo ""
        
        read -p "是否继续启动？(某些功能可能无法使用) [y/N]: " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}启动已取消${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ API密钥配置已找到${NC}"
    fi
}

# 显示菜单
show_menu() {
    echo ""
    echo -e "${BLUE}🎯 请选择启动方式:${NC}"
    echo "1. 启动AutoGen Studio (可视化界面)"
    echo "2. 运行Hello World示例"
    echo "3. 运行Web浏览示例"
    echo "4. 运行多智能体团队示例"
    echo "5. 启动交互式Python环境"
    echo "6. 查看系统信息"
    echo "7. 退出"
    echo ""
}

# 启动AutoGen Studio
start_studio() {
    echo -e "${BLUE}🎨 启动AutoGen Studio...${NC}"
    
    if ! python3 -c "import autogenstudio" 2>/dev/null; then
        echo -e "${RED}❌ AutoGen Studio未安装${NC}"
        echo -e "${YELLOW}请运行: pip install autogenstudio${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ AutoGen Studio启动中...${NC}"
    echo -e "${YELLOW}访问地址: http://localhost:8080${NC}"
    echo -e "${YELLOW}按 Ctrl+C 停止服务${NC}"
    echo ""
    
    autogenstudio ui
}

# 运行Hello World示例
run_hello_world() {
    echo -e "${BLUE}👋 运行Hello World示例...${NC}"
    
    if [[ ! -f "examples/hello_world.py" ]]; then
        echo -e "${YELLOW}⚠️ 示例文件不存在，正在创建...${NC}"
        mkdir -p examples
        cat > examples/hello_world.py << 'EOF'
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    try:
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        agent = AssistantAgent("助手", model_client=model_client)
        
        result = await agent.run(task="你好！请介绍一下AutoGen框架的主要特性。")
        print(result)
        
        await model_client.close()
    except Exception as e:
        print(f"错误: {e}")
        print("请检查API密钥是否正确设置")

if __name__ == "__main__":
    asyncio.run(main())
EOF
    fi
    
    python3 examples/hello_world.py
}

# 运行Web浏览示例
run_web_example() {
    echo -e "${BLUE}🌐 运行Web浏览示例...${NC}"
    
    # 检查playwright是否安装
    if ! python3 -c "import playwright" 2>/dev/null; then
        echo -e "${RED}❌ Playwright未安装${NC}"
        echo -e "${YELLOW}请运行: pip install playwright && playwright install${NC}"
        return 1
    fi
    
    if [[ ! -f "examples/web_browsing.py" ]]; then
        echo -e "${YELLOW}⚠️ Web浏览示例文件不存在，正在创建...${NC}"
        mkdir -p examples
        cat > examples/web_browsing.py << 'EOF'
import asyncio
from autogen_agentchat.agents import UserProxyAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    try:
        # 尝试导入web_surfer
        from autogen_ext.agents.web_surfer import MultimodalWebSurfer
        
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        
        web_surfer = MultimodalWebSurfer(
            "web_surfer", 
            model_client, 
            headless=True,  # 设置为True以避免打开浏览器窗口
            animate_actions=False
        )
        
        user_proxy = UserProxyAgent("user_proxy")
        termination = TextMentionTermination("完成", sources=["web_surfer"])
        
        team = RoundRobinGroupChat([web_surfer, user_proxy], termination_condition=termination)
        
        await Console(team.run_stream(task="搜索最新的AI新闻并总结三条重要信息"))
        
        await web_surfer.close()
        await model_client.close()
        
    except ImportError:
        print("Web浏览功能未安装。请运行:")
        print("pip install autogen-ext[web-surfer]")
        print("playwright install")
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    asyncio.run(main())
EOF
    fi
    
    python3 examples/web_browsing.py
}

# 运行多智能体团队示例
run_team_example() {
    echo -e "${BLUE}👥 运行多智能体团队示例...${NC}"
    
    if [[ ! -f "examples/team_example.py" ]]; then
        echo -e "${YELLOW}⚠️ 团队示例文件不存在，正在创建...${NC}"
        mkdir -p examples
        cat > examples/team_example.py << 'EOF'
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    try:
        model_client = OpenAIChatCompletionClient(model="gpt-4o")
        
        # 创建不同角色的智能体
        programmer = AssistantAgent(
            "程序员", 
            model_client=model_client,
            system_message="你是一个专业的Python程序员，擅长编写清晰、高效的代码。"
        )
        
        reviewer = AssistantAgent(
            "代码审查员",
            model_client=model_client,
            system_message="你是一个代码审查专家，负责检查代码质量、安全性和最佳实践。"
        )
        
        tester = AssistantAgent(
            "测试员",
            model_client=model_client,
            system_message="你是一个软件测试专家，负责设计和执行测试用例。"
        )
        
        # 创建团队
        team = RoundRobinGroupChat(
            [programmer, reviewer, tester],
            termination_condition=MaxMessageTermination(10)
        )
        
        # 运行团队协作
        task = "请团队协作开发一个简单的计算器Python类，包括加减乘除功能，并进行代码审查和测试。"
        await Console(team.run_stream(task=task))
        
        await model_client.close()
        
    except Exception as e:
        print(f"错误: {e}")
        print("请检查API密钥是否正确设置")

if __name__ == "__main__":
    asyncio.run(main())
EOF
    fi
    
    python3 examples/team_example.py
}

# 启动交互式Python环境
start_interactive() {
    echo -e "${BLUE}🐍 启动交互式Python环境...${NC}"
    echo -e "${YELLOW}已导入常用的AutoGen模块${NC}"
    echo -e "${YELLOW}输入 'help_autogen()' 查看帮助信息${NC}"
    echo ""
    
    python3 -c "
import asyncio
from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

def help_autogen():
    print('AutoGen 中文版交互式环境')
    print('========================')
    print('已导入的模块:')
    print('- AssistantAgent, UserProxyAgent (智能体)')
    print('- RoundRobinGroupChat (团队)')
    print('- MaxMessageTermination, TextMentionTermination (终止条件)')
    print('- Console (控制台)')
    print('- OpenAIChatCompletionClient (OpenAI客户端)')
    print('')
    print('快速开始:')
    print('model_client = OpenAIChatCompletionClient(model=\"gpt-4o\")')
    print('agent = AssistantAgent(\"助手\", model_client=model_client)')
    print('result = await agent.run(task=\"你的任务\")')
    print('')
    print('记得在异步环境中运行，或使用 asyncio.run()')

print('AutoGen 中文版交互式环境已启动！')
print('输入 help_autogen() 查看帮助')
print('========================')
" -i
}

# 显示系统信息
show_system_info() {
    echo -e "${BLUE}📊 系统信息${NC}"
    echo "========================"
    
    echo -e "${YELLOW}Python版本:${NC}"
    python3 --version
    
    echo -e "${YELLOW}Python路径:${NC}"
    which python3
    
    echo -e "${YELLOW}已安装的AutoGen包:${NC}"
    pip list | grep -i autogen || echo "未找到AutoGen包"
    
    echo -e "${YELLOW}环境变量:${NC}"
    echo "OPENAI_API_KEY: ${OPENAI_API_KEY:+已设置}"
    echo "AZURE_OPENAI_API_KEY: ${AZURE_OPENAI_API_KEY:+已设置}"
    echo "ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:+已设置}"
    
    echo -e "${YELLOW}当前目录:${NC}"
    pwd
    
    echo -e "${YELLOW}磁盘空间:${NC}"
    df -h . | tail -1
    
    echo ""
}

# 主函数
main() {
    check_installation
    check_api_keys
    
    while true; do
        show_menu
        read -p "请选择 (1-7): " choice
        
        case $choice in
            1)
                start_studio
                ;;
            2)
                run_hello_world
                ;;
            3)
                run_web_example
                ;;
            4)
                run_team_example
                ;;
            5)
                start_interactive
                ;;
            6)
                show_system_info
                ;;
            7)
                echo -e "${GREEN}👋 感谢使用AutoGen中文版！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ 无效选择，请输入1-7${NC}"
                ;;
        esac
        
        echo ""
        read -p "按回车键继续..."
    done
}

# 运行主函数
main "$@"