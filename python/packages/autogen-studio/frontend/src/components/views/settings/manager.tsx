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
import { t } from "../../../utils/i18n";

export const SettingsManager: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("settingsSidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  const { user } = useContext(appContext);
  const userId = user?.id || "";

  const { serverSettings, resetUISettings, initializeSettings, isLoading } =
    useSettingsStore();

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
    return <div className="p-8 text-center">Loading settings...</div>;
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

  const tabItems: TabsProps["items"] = [
    {
      key: "ui",
      label: (
        <span className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          {t('settings.uiSettings')}
        </span>
      ),
      children: <UISettingsPanel userId={userId} />,
    },
    {
      key: "language",
      label: (
        <span className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t('settings.languageSettings')}
        </span>
      ),
      children: <SimpleLanguageSettings />,
    },
    {
      key: "model",
      label: (
        <span className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          {t('settings.defaultModel')}
        </span>
      ),
      children: (
        <div className="mt-4">
          <ModelConfigPanel
            modelComponent={modelComponent}
            onModelUpdate={async () => {}}
          />
        </div>
      ),
    },
    {
      key: "environment",
      label: (
        <span className="flex items-center gap-2">
          <Variable className="w-4 h-4" />
          {t('settings.environmentVariables')}
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
              title: "Settings",
              icon: Variable,
              content: () => <></>,
            },
          ]}
          currentSection={{
            id: "settings",
            title: "Settings",
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
            <span className="text-primary font-medium">{t('settings.title')}</span>
          </div>

          <div className="flex items-center gap-2 mb-8 text-sm">
            <span className="text-secondary">
              {t('settings.description')}
            </span>
          </div>

          <div className="  rounded-lg shadow-sm">
            <Tabs
              defaultActiveKey="ui"
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

export default SettingsManager;
