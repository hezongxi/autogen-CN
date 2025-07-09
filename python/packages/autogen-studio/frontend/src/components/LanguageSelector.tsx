import React from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../i18n';

const { Option } = Select;

interface LanguageSelectorProps {
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

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  size = 'middle',
  showIcon = true,
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <Select
      value={language}
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

export default LanguageSelector;