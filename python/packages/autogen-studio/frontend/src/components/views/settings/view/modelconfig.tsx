import React, { useState } from "react";
import { Button, Tooltip, Drawer } from "antd";
import { Edit2, Settings } from "lucide-react";
import { truncateText } from "../../../utils/utils";
import {
  Component,
  ComponentConfig,
  ModelConfig,
} from "../../../types/datamodel";
import { ComponentEditor } from "../../teambuilder/builder/component-editor/component-editor";
import { useLanguage } from "../../../../hooks/useLanguage";

interface ModelConfigPanelProps {
  modelComponent: Component<ModelConfig>;
  onModelUpdate: (updatedModel: Component<ComponentConfig>) => Promise<void>;
}

export const ModelConfigPanel: React.FC<ModelConfigPanelProps> = ({
  modelComponent,
  onModelUpdate,
}) => {
  const { t } = useLanguage();
  const [isModelEditorOpen, setIsModelEditorOpen] = useState(false);

  const handleOpenModelEditor = () => {
    setIsModelEditorOpen(true);
  };

  const handleCloseModelEditor = () => {
    setIsModelEditorOpen(false);
  };

  const handleModelUpdate = async (
    updatedModel: Component<ComponentConfig>
  ) => {
    await onModelUpdate(updatedModel);
    setIsModelEditorOpen(false);
  };

  return (
    <>
      <div className=" ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t("modelConfig.title")}</h3>
          <Tooltip title={t("modelConfig.editTooltip")}>
            <Button
              type="primary"
              icon={<Edit2 className="w-4 h-4 mr-1" />}
              onClick={handleOpenModelEditor}
              className="flex items-center"
            >
              {t("modelConfig.editModel")}
            </Button>
          </Tooltip>
        </div>

        <div className="mb-6">
          {t("modelConfig.description")}
        </div>
        <div className="bg-secondary p-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-primary">{t("modelConfig.model")}</p>
              <p className="text-sm">
                {modelComponent.label || "" || t("modelConfig.notSet")}
              </p>
              <p className="text-base">
                {modelComponent.config?.model || t("modelConfig.notSet")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-primary">{t("modelConfig.modelProvider")}</p>
              <p className="  break-all text-sm">
                {modelComponent.provider || t("modelConfig.notSet")}
              </p>
            </div>
            {modelComponent.config?.temperature && (
              <div>
                <p className="text-sm font-medium text-primary">{t("modelConfig.temperature")}</p>
                <p className="text-base">
                  {modelComponent.config?.temperature}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Editor Drawer */}
      <Drawer
        title={t("modelConfig.editDefaultModel")}
        placement="right"
        size="large"
        onClose={handleCloseModelEditor}
        open={isModelEditorOpen}
        className="component-editor-drawer"
      >
        <ComponentEditor
          component={modelComponent}
          onChange={handleModelUpdate}
          onClose={handleCloseModelEditor}
          navigationDepth={true}
        />
      </Drawer>
    </>
  );
};

export default ModelConfigPanel;
