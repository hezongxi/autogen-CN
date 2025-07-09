import React, { useState, useEffect, useContext } from "react";
import { Tabs, TabsProps } from "antd";
import {
  ChevronRight,
  RotateCcw,
  Variable,
  Settings,
  Palette,
  Brain,
  Globe,
} from "lucide-react";
import { useSettingsStore } from "./store";
import { SettingsSidebar } from "./sidebar";
import { appContext } from "../../../hooks/provider";
import UISettingsPanel from "./view/ui";
import { ModelConfigPanel } from "./view/modelconfig";
import { EnvironmentVariablesPanel } from "./view/environment";
import { SimpleLanguageSettings } from "./view/SimpleLanguageSettings";
import { settingsAPI } from "./api";
import { Component, ComponentConfig } from "../../types/datamodel";
import { message } from "antd";

export const SimpleSettingsManager: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("settingsSidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  const [currentLang, setCurrentLang] = useState('zh-CN');

  const { user } = useContext(appContext);
  const userId = user?.id || "";

  const { serverSettings, resetUISettings, initializeSettings, isLoading } =
    useSettingsStore();

  // Check current language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-language');
      if (saved) {
        setCurrentLang(saved);
      } else if (navigator.language.startsWith('zh')) {
        setCurrentLang('zh-CN');
      }
    }
  }, []);

  // Initialize settings when component mounts
  useEffect(() => {
    if (userId) {
      initializeSettings(userId);
    }
  }, [userId, initializeSettings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("settingsSidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  if (isLoading) {
    return <div className="p-8 text-center">{currentLang === 'zh-CN' ? '加载设置中...' : 'Loading settings...'}</div>;
  }

  // Get model component for the model config panel
  const modelComponent = serverSettings?.config.default_model_client || {
    provider: "openai",
    component_type: "model",
    label: "Default Model Client",
    description: "Default model client for this environment",
    config: {
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
    },
  };

  const isZhCN = currentLang === 'zh-CN';

  const tabItems: TabsProps["items"] = [
    {
      key: "ui",
      label: (
        <span className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          {isZhCN ? '界面设置' : 'UI Settings'}
        </span>
      ),
      children: <UISettingsPanel userId={userId} />,
    },
    {
      key: "language",
      label: (
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {isZhCN ? '语言设置' : 'Language Settings'}
        </span>
      ),
      children: <SimpleLanguageSettings />,
    },
    {
      key: "model",
      label: (
        <span className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          {isZhCN ? '默认模型' : 'Default Model'}
        </span>
      ),
      children: (
        <div className="mt-4">
          <ModelConfigPanel
            modelComponent={modelComponent}
            onModelUpdate={async (updatedModel: Component<ComponentConfig>) => {
              try {
                // Update the server settings with the new model configuration
                const updatedServerSettings = {
                  ...serverSettings,
                  config: {
                    ...serverSettings?.config,
                    default_model_client: updatedModel,
                  },
                };

                // Save to server
                await settingsAPI.updateSettings(updatedServerSettings, userId);
                
                // Refresh settings to get the latest state
                await initializeSettings(userId);
                
                message.success(isZhCN ? '模型配置已保存' : 'Model configuration saved successfully');
              } catch (error) {
                console.error('Failed to save model configuration:', error);
                message.error(isZhCN ? '保存模型配置失败' : 'Failed to save model configuration');
              }
            }}
          />
        </div>
      ),
    },
    {
      key: "environment",
      label: (
        <span className="flex items-center gap-2">
          <Variable className="w-4 h-4" />
          {isZhCN ? '环境变量' : 'Environment Variables'}
        </span>
      ),
      children: (
        <div className="mt-4">
          <EnvironmentVariablesPanel
            serverSettings={serverSettings}
            loading={false}
            userId={userId}
            initializeSettings={initializeSettings}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex h-full w-full">
      <div
        className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-12"
        }`}
      >
        <SettingsSidebar
          isOpen={isSidebarOpen}
          sections={[
            {
              id: "settings",
              title: isZhCN ? "设置" : "Settings",
              icon: Variable,
              content: () => <></>,
            },
          ]}
          currentSection={{
            id: "settings",
            title: isZhCN ? "设置" : "Settings",
            icon: Variable,
            content: () => <></>,
          }}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectSection={() => {}}
        />
      </div>

      <div
        className={`flex-1 transition-all max-w-5xl -mr-6 duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-12"
        }`}
      >
        <div className="p-4 pt-2">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-primary font-medium">{isZhCN ? '设置' : 'Settings'}</span>
          </div>

          <div className="flex items-center gap-2 mb-8 text-sm">
            <span className="text-secondary">
              {isZhCN ? '管理您的设置和偏好' : 'Manage your settings and preferences'}
            </span>
          </div>

          <div className="  rounded-lg shadow-sm">
            <Tabs
              defaultActiveKey={localStorage.getItem('settings-active-tab') || "language"}
              onChange={(key) => localStorage.setItem('settings-active-tab', key)}
              items={tabItems}
              // type="card"
              size="large"
              className="settings-tabs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSettingsManager;
