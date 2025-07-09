import React from "react";
import { Card } from "antd";
import { Globe } from "lucide-react";
import { t } from "../../../../utils/i18n";
import SimpleLanguageSelector from "../../../SimpleLanguageSelector";

export const LanguageSettingsPanel: React.FC = () => {

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t('settings.languageSettings')}</h3>
      </div>

      <div className="space-y-4">
        <Card className="border border-secondary">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <label className="font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('settings.selectLanguage')}
              </label>
              <span className="text-sm text-secondary">
                {t('settings.languageDescription')}
              </span>
            </div>
            <div className="ml-4">
              <SimpleLanguageSelector size="middle" showIcon={false} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSettingsPanel;