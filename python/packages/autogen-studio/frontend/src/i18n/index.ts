import React from 'react';
import { enUS } from './locales/en-US';
import { zhCN } from './locales/zh-CN';

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
    deploy: string;
  };
  messages: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  environmentVariables: {
    title: string;
    addVariable: string;
    deleteVariable: string;
    saveChanges: string;
    noUnsavedChanges: string;
    settingsNotLoaded: string;
    add: string;
    name: string;
    value: string;
    actions: string;
    note: string;
  };
  modelConfig: {
    title: string;
    editModel: string;
    editTooltip: string;
    description: string;
    model: string;
    modelProvider: string;
    temperature: string;
    notSet: string;
    editDefaultModel: string;
  };
  playground: {
    selectTeam: string;
    searchTeams: string;
    newSession: string;
    createTeam: string;
    searchSessions: string;
    selectSession: string;
  };
  teamBuilder: {
    agents: string;
    models: string;
    tools: string;
    terminations: string;
    undo: string;
    redo: string;
    autoLayout: string;
    showGrid: string;
    showMiniMap: string;
    saveChanges: string;
    switchToVisual: string;
    switchToJSON: string;
    enterFullscreen: string;
    exitFullscreen: string;
    moreOptions: string;
    testComponent: string;
    test: string;
    formEditor: string;
    jsonEditor: string;
    cancel: string;
    root: string;
    componentTestPassed: string;
    componentTestFailed: string;
    failedToTestComponent: string;
    testFailed: string;
    componentDetails: string;
    configuration: string;
    name: string;
    description: string;
    teamName: string;
    teamDescription: string;
    selectorPrompt: string;
    promptForSelector: string;
    model: string;
    noModelConfigured: string;
    terminationCondition: string;
    noTerminationCondition: string;
  };
  gallery: {
    createNew: string;
    deleteGallery: string;
    editGallery: string;
    editComponent: string;
    delete: string;
    edit: string;
    createNewGallery: string;
    fileUpload: string;
  };
  ui: {
    search: string;
    searchPlaceholder: string;
    signOut: string;
    closeSidebar: string;
    openSidebar: string;
  };
}

const translations: Record<Language, Translations> = {
  'en-US': enUS,
  'zh-CN': zhCN,
};

let currentLanguage: Language = 'en-US';

// Initialize language - will be set properly on client side
const initializeLanguage = (): void => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      currentLanguage = savedLanguage;
    } else {
      // Try to detect browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('zh')) {
        currentLanguage = 'zh-CN';
      }
    }
  }
};

export const getCurrentLanguage = (): Language => currentLanguage;

export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-language', language);
    // Trigger a custom event to notify components of language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  }
};

export const t = (path: string): string => {
  const keys = path.split('.');
  let value: any = translations[currentLanguage];
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English if key not found
      value = translations['en-US'];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return path; // Return the path if not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : path;
};

export const useTranslation = () => {
  const [language, setCurrentLanguage] = React.useState(currentLanguage);
  
  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChange', handleLanguageChange as EventListener);
      
      return () => {
        window.removeEventListener('languageChange', handleLanguageChange as EventListener);
      };
    }
  }, []);
  
  return {
    t,
    language,
    setLanguage,
    getCurrentLanguage,
  };
};

export { translations };