import React from "react";
import { Button, Tooltip, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  Code2,
  Grid,
  Maximize2,
  Minimize2,
  Redo2,
  Save,
  Undo2,
  LayoutGrid,
  Cable,
  Map,
  MoreHorizontal,
} from "lucide-react";
import { useLanguage } from "../../../../hooks/useLanguage";

interface TeamBuilderToolbarProps {
  isJsonMode: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  onToggleView: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onToggleGrid: () => void;
  onToggleFullscreen: () => void;
  onAutoLayout: () => void;
  onToggleMiniMap: () => void;
}

export const TeamBuilderToolbar: React.FC<TeamBuilderToolbarProps> = ({
  isJsonMode,
  isFullscreen,
  showGrid,
  canUndo,
  canRedo,
  isDirty,
  onToggleView,
  onUndo,
  onRedo,
  onSave,
  onToggleGrid,
  onToggleFullscreen,
  onAutoLayout,
  onToggleMiniMap,
}) => {
  const { t } = useLanguage();
  
  const menuItems: MenuProps["items"] = [
    {
      key: "autoLayout",
      label: t("teamBuilder.autoLayout"),
      icon: <LayoutGrid size={16} />,
      onClick: onAutoLayout,
    },
    {
      key: "grid",
      label: t("teamBuilder.showGrid"),
      icon: <Grid size={16} />,
      onClick: onToggleGrid,
    },
    {
      key: "minimap",
      label: t("teamBuilder.showMiniMap"),
      icon: <Map size={16} />,
      onClick: onToggleMiniMap,
    },
  ];

  return (
    <div
      className={`${
        isFullscreen ? "fixed top-6 right-6" : "absolute top-2 right-2"
      } bg-secondary hover:bg-secondary rounded shadow-sm min-w-[200px] z-[60]`}
    >
      <div className="p-1 flex items-center gap-1">
        {!isJsonMode && (
          <>
            <Tooltip title={t("teamBuilder.undo")}>
              <Button
                type="text"
                icon={<Undo2 size={18} />}
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onUndo}
                disabled={!canUndo}
              />
            </Tooltip>

            <Tooltip title={t("teamBuilder.redo")}>
              <Button
                type="text"
                icon={<Redo2 size={18} />}
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onRedo}
                disabled={!canRedo}
              />
            </Tooltip>
            <Tooltip
              title={isFullscreen ? t("teamBuilder.exitFullscreen") : t("teamBuilder.enterFullscreen")}
            >
              <Button
                type="text"
                icon={
                  isFullscreen ? (
                    <Minimize2 size={18} />
                  ) : (
                    <Maximize2 size={18} />
                  )
                }
                className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
                onClick={onToggleFullscreen}
              />
            </Tooltip>
          </>
        )}

        <Tooltip title={t("teamBuilder.saveChanges")}>
          <Button
            type="text"
            icon={
              <div className="relative">
                <Save size={18} />
                {isDirty && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            }
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSave}
            // disabled={!isDirty}
          />
        </Tooltip>

        <Tooltip title={isJsonMode ? t("teamBuilder.switchToVisual") : t("teamBuilder.switchToJSON")}>
          <Button
            type="text"
            icon={isJsonMode ? <Cable size={18} /> : <Code2 size={18} />}
            className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
            onClick={onToggleView}
          />
        </Tooltip>

        {!isJsonMode && (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            overlayStyle={{ zIndex: 1001 }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreHorizontal size={18} />}
              className="p-1.5 hover:bg-primary/10 rounded-md text-primary/75 hover:text-primary"
              title={t("teamBuilder.moreOptions")}
            />
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default TeamBuilderToolbar;
