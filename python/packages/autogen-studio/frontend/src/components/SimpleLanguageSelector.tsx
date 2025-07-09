import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { Language, getCurrentLanguage, setLanguage } from '../utils/i18n';

const { Option } = Select;

interface SimpleLanguageSelectorProps {
  size?: 'small' | 'middle' | 'large';
  showIcon?: boolean;
  className?: string;
}

const languageOptions = [
  {
    value: 'en-US' as Language,
    label: 'English',
    flag: '🇺🇸',
  },
  {
    value: 'zh-CN' as Language,
    label: '简体中文',
    flag: '🇨🇳',
  },
];

export const SimpleLanguageSelector: React.FC<SimpleLanguageSelectorProps> = ({
  size = 'middle',
  showIcon = true,
  className = '',
}) => {
  const [currentLang, setCurrentLang] = React.useState<Language>('en-US');

  React.useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <Select
      value={currentLang}
      onChange={handleLanguageChange}
      size={size}
      className={className}
      style={{ minWidth: 120 }}
      suffixIcon={showIcon ? <GlobalOutlined /> : undefined}
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
  );
};

export default SimpleLanguageSelector;