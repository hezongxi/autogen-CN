// Simple i18n solution without React Context
export type Language = 'en-US' | 'zh-CN';

export interface Translations {
  common: {
    save: string;
    reset: string;
    cancel: string;
    ok: string;
    yes: string;
    no: string;
    loading: string;
    settings: string;
    language: string;
    darkMode: string;
    signOut: string;
    toggleDarkMode: string;
    openMainMenu: string;
    viewNotifications: string;
    openUserMenu: string;
  };
  settings: {
    title: string;
    description: string;
    uiSettings: string;
    defaultModel: string;
    environmentVariables: string;
    languageSettings: string;
    showLLMEvents: string;
    showLLMEventsDesc: string;
    expandMessagesByDefault: string;
    expandMessagesByDefaultDesc: string;
    showAgentFlowByDefault: string;
    showAgentFlowByDefaultDesc: string;
    resetToDefaults: string;
    saveChanges: string;
    noUnsavedChanges: string;
    settingsResetSuccess: string;
    settingsResetFailed: string;
    settingsSaveSuccess: string;
    settingsSaveFailed: string;
    settingsNotLoaded: string;
    selectLanguage: string;
    languageDescription: string;
  };
  navigation: {
    build: string;
    playground: string;
    gallery: string;
    dataExplorer: string;
  };
}

const enUS: Translations = {
  common: {
    save: 'Save',
    reset: 'Reset',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    signOut: 'Sign out',
    toggleDarkMode: 'Toggle dark mode',
    openMainMenu: 'Open main menu',
    viewNotifications: 'View notifications',
    openUserMenu: 'Open user menu',
  },
  settings: {
    title: 'Settings',
    description: 'Manage your settings and preferences',
    uiSettings: 'UI Settings',
    defaultModel: 'Default Model',
    environmentVariables: 'Environment Variables',
    languageSettings: 'Language Settings',
    showLLMEvents: 'Show LLM Events',
    showLLMEventsDesc: 'Display detailed LLM call logs in the message thread',
    expandMessagesByDefault: 'Expand Messages by Default',
    expandMessagesByDefaultDesc: 'Automatically expand message threads when they load',
    showAgentFlowByDefault: 'Show Agent Flow by Default',
    showAgentFlowByDefaultDesc: 'Display the agent flow diagram automatically',
    resetToDefaults: 'Reset to defaults',
    saveChanges: 'Save your changes',
    noUnsavedChanges: 'No unsaved changes',
    settingsResetSuccess: 'UI settings reset successfully',
    settingsResetFailed: 'Failed to reset UI settings',
    settingsSaveSuccess: 'UI settings saved successfully',
    settingsSaveFailed: 'Failed to save UI settings',
    settingsNotLoaded: 'Settings not loaded',
    selectLanguage: 'Select Language',
    languageDescription: 'Choose your preferred language for the interface',
  },
  navigation: {
    build: 'Build',
    playground: 'Playground',
    gallery: 'Gallery',
    dataExplorer: 'Data Explorer',
  },
};

const zhCN: Translations = {
  common: {
    save: '保存',
    reset: '重置',
    cancel: '取消',
    ok: '确定',
    yes: '是',
    no: '否',
    loading: '加载中...',
    settings: '设置',
    language: '语言',
    darkMode: '深色模式',
    signOut: '退出登录',
    toggleDarkMode: '切换深色模式',
    openMainMenu: '打开主菜单',
    viewNotifications: '查看通知',
    openUserMenu: '打开用户菜单',
  },
  settings: {
    title: '设置',
    description: '管理您的设置和偏好',
    uiSettings: '界面设置',
    defaultModel: '默认模型',
    environmentVariables: '环境变量',
    languageSettings: '语言设置',
    showLLMEvents: '显示 LLM 事件',
    showLLMEventsDesc: '在消息线程中显示详细的 LLM 调用日志',
    expandMessagesByDefault: '默认展开消息',
    expandMessagesByDefaultDesc: '加载时自动展开消息线程',
    showAgentFlowByDefault: '默认显示智能体流程',
    showAgentFlowByDefaultDesc: '自动显示智能体流程图',
    resetToDefaults: '重置为默认值',
    saveChanges: '保存更改',
    noUnsavedChanges: '没有未保存的更改',
    settingsResetSuccess: '界面设置重置成功',
    settingsResetFailed: '重置界面设置失败',
    settingsSaveSuccess: '界面设置保存成功',
    settingsSaveFailed: '保存界面设置失败',
    settingsNotLoaded: '设置未加载',
    selectLanguage: '选择语言',
    languageDescription: '选择您首选的界面语言',
  },
  navigation: {
    build: '构建',
    playground: '游戏场',
    gallery: '模板库',
    dataExplorer: '数据浏览器',
  },
};

const translations: Record<Language, Translations> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

let currentLanguage: Language = 'en-US';

// Simple getter function that works on both client and server
export const getCurrentLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app-language') as Language;
    if (saved && translations[saved]) {
      currentLanguage = saved;
      return saved;
    }
    // Detect browser language
    if (navigator.language.startsWith('zh')) {
      currentLanguage = 'zh-CN';
      return 'zh-CN';
    }
  }
  return currentLanguage;
};

export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-language', language);
    // Trigger page reload to apply changes
    window.location.reload();
  }
};

export const t = (path: string): string => {
  const currentLang = getCurrentLanguage();
  const keys = path.split('.');
  let value: any = translations[currentLang];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English
      value = translations['en-US'];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return path;
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : path;
};