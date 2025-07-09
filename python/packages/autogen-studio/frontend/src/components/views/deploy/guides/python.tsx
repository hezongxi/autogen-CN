import React from "react";
import { Alert } from "antd";
import { CodeSection, copyToClipboard } from "./guides";
import { Download } from "lucide-react";

const PythonGuide: React.FC = () => {
  return (
    <div className="">
      <h1 className="tdext-2xl font-bold mb-6">
        在Python代码和REST API中使用AutoGen Studio团队
      </h1>

      <Alert
        className="mb-6"
        message="Prerequisites"
        description={
          <ul className="list-disc pl-4 mt-2 space-y-1">
            <li>已安装AutoGen Studio</li>
          </ul>
        }
        type="info"
      />

      <div className="my-3 text-sm">
        {" "}
        您可以重用在中创建的代理团队的声明性规范
      使用TeamManager在python应用程序中创建AutoGen studio
        类。 .在TeamBuilder中，选择一个团队配置并单击下载。{" "}
        <Download className="h-4 w-4 inline-block" />{" "}
      </div>

      {/* Basic Usage */}
      <CodeSection
        title="1. Build Your Team in Python, Export as JSON"
        description="下面是一个用python构建代理团队并将其导出为JSON文件的示例。"
        code={`
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient
from autogen_agentchat.conditions import  TextMentionTermination
 
agent = AssistantAgent(
        name="weather_agent",
        model_client=OpenAIChatCompletionClient(
            model="gpt-4o-mini", 
        ), 
    ) 
agent_team = RoundRobinGroupChat([agent], termination_condition=TextMentionTermination("TERMINATE"))
config = agent_team.dump_component()
print(config.model_dump_json())`}
        onCopy={copyToClipboard}
      />

      {/* Installation Steps */}
      <div className="space-y-6">
        {/* Basic Usage */}
        <CodeSection
          title="2. Run a Team in Python"
          description="下面是一个在python代码中使用AutoGen Studio中的TeamManager类的简单示例。"
          code={`
from autogenstudio.teammanager import TeamManager

# Initialize the TeamManager
manager = TeamManager()

# Run a task with a specific team configuration
result = await manager.run(
task="What is the weather in New York?",
team_config="team.json"
)
print(result)`}
          onCopy={copyToClipboard}
        />

        <CodeSection
          title="3. Serve a Team as a REST API"
          description=<div>
            AutoGen Studio offers a convenience CLI command to serve a team as a
            REST API endpoint.{" "}
          </div>
          code={`
autogenstudio serve --team path/to/team.json --port 8084  
          `}
          onCopy={copyToClipboard}
        />
      </div>
    </div>
  );
};

export default PythonGuide;
