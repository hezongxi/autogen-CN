import React from "react";
import { Card, Select } from "antd";
import { Globe } from "lucide-react";

const { Option } = Select;

const languageOptions = [
  { value: 'en-US', label: 'English', flag: '🇺🇸' },
  { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
];

export const SimpleLanguageSettings: React.FC = () => {
  const [currentLang, setCurrentLang] = React.useState('en-US');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-language');
      if (saved) {
        setCurrentLang(saved);
      } else if (navigator.language.startsWith('zh')) {
        setCurrentLang('zh-CN');
      }
    }
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLang(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', newLanguage);
      window.location.reload();
    }
  };

  const isZhCN = currentLang === 'zh-CN';

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {isZhCN ? '语言设置' : 'Language Settings'}
        </h3>
      </div>

      <div className="space-y-4">
        <Card className="border border-secondary">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <label className="font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {isZhCN ? '选择语言' : 'Select Language'}
              </label>
              <span className="text-sm text-secondary">
                {isZhCN ? '选择您首选的界面语言' : 'Choose your preferred language for the interface'}
              </span>
            </div>
            <div className="ml-4">
              <Select
                value={currentLang}
                onChange={handleLanguageChange}
                style={{ minWidth: 150 }}
              >
                {languageOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                    </span>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimpleLanguageSettings;