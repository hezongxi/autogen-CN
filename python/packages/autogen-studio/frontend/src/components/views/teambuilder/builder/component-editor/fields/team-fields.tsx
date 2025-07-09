import React, { useCallback } from "react";
import { Input, Button } from "antd";
import { Edit, Timer } from "lucide-react";
import {
  Component,
  TeamConfig,
  ComponentConfig,
  RoundRobinGroupChatConfig,
  SelectorGroupChatConfig,
} from "../../../../../types/datamodel";
import { isSelectorTeam, isRoundRobinTeam } from "../../../../../types/guards";
import DetailGroup from "../detailgroup";
import { useLanguage } from "../../../../../../hooks/useLanguage";

const { TextArea } = Input;

interface TeamFieldsProps {
  component: Component<TeamConfig>;
  onChange: (updates: Partial<Component<ComponentConfig>>) => void;
  onNavigate?: (componentType: string, id: string, parentField: string) => void;
}

export const TeamFields: React.FC<TeamFieldsProps> = ({
  component,
  onChange,
  onNavigate,
}) => {
  const { t } = useLanguage();
  if (!isSelectorTeam(component) && !isRoundRobinTeam(component)) return null;

  const handleComponentUpdate = useCallback(
    (updates: Partial<Component<ComponentConfig>>) => {
      onChange({
        ...component,
        ...updates,
        config: {
          ...component.config,
          ...(updates.config || {}),
        },
      });
    },
    [component, onChange]
  );

  const handleConfigUpdate = useCallback(
    (field: string, value: unknown) => {
      if (isSelectorTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as SelectorGroupChatConfig,
        });
      } else if (isRoundRobinTeam(component)) {
        handleComponentUpdate({
          config: {
            ...component.config,
            [field]: value,
          } as RoundRobinGroupChatConfig,
        });
      }
    },
    [component, handleComponentUpdate]
  );

  return (
    <div className=" ">
      <DetailGroup title={t("teamBuilder.componentDetails")}>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-primary">{t("teamBuilder.name")}</span>
            <Input
              value={component.label || ""}
              onChange={(e) => handleComponentUpdate({ label: e.target.value })}
              placeholder={t("teamBuilder.teamName")}
              className="mt-1"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-primary">
              {t("teamBuilder.description")}
            </span>
            <TextArea
              value={component.description || ""}
              onChange={(e) =>
                handleComponentUpdate({ description: e.target.value })
              }
              placeholder={t("teamBuilder.teamDescription")}
              rows={4}
              className="mt-1"
            />
          </label>
        </div>
      </DetailGroup>

      <DetailGroup title={t("teamBuilder.configuration")}>
        {isSelectorTeam(component) && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-primary">
                {t("teamBuilder.selectorPrompt")}
              </span>
              <TextArea
                value={component.config.selector_prompt || ""}
                onChange={(e) =>
                  handleConfigUpdate("selector_prompt", e.target.value)
                }
                placeholder={t("teamBuilder.promptForSelector")}
                rows={4}
                className="mt-1"
              />
            </label>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-primary">{t("teamBuilder.model")}</h3>
              <div className="bg-secondary p-4 rounded-md">
                {component.config.model_client ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {component.config.model_client.config.model}
                    </span>
                    {onNavigate && (
                      <Button
                        type="text"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() =>
                          onNavigate(
                            "model",
                            component.config.model_client?.label || "",
                            "model_client"
                          )
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-secondary text-center">
                    {t("teamBuilder.noModelConfigured")}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-primary">
            {t("teamBuilder.terminationCondition")}
          </h3>
          <div className="bg-secondary p-4 rounded-md">
            {component.config.termination_condition ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-secondary" />
                  <span className="text-sm">
                    {component.config.termination_condition.label ||
                      component.config.termination_condition.component_type}
                  </span>
                </div>
                {onNavigate && (
                  <Button
                    type="text"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() =>
                      onNavigate(
                        "termination",
                        component.config.termination_condition?.label || "",
                        "termination_condition"
                      )
                    }
                  />
                )}
              </div>
            ) : (
              <div className="text-sm text-secondary text-center">
                {t("teamBuilder.noTerminationCondition")}
              </div>
            )}
          </div>
        </div>
      </DetailGroup>
    </div>
  );
};

export default React.memo(TeamFields);
