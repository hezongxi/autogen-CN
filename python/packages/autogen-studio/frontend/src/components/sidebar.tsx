import React from "react";
import { Link } from "gatsby";
import { useConfigStore } from "../hooks/store";
import { Tooltip } from "antd";
import {
  Settings,
  MessagesSquare,
  Blocks,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  GalleryHorizontalEnd,
  Rocket,
  Beaker,
  LucideBeaker,
  FlaskConical,
} from "lucide-react";
import Icon from "./icons";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../hooks/useLanguage";

interface INavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  breadcrumbs?: Array<{
    name: string;
    href: string;
    current?: boolean;
  }>;
}

// Navigation configuration moved to component to use translation hook

const classNames = (...classes: (string | undefined | boolean)[]) => {
  return classes.filter(Boolean).join(" ");
};

type SidebarProps = {
  link: string;
  meta?: {
    title: string;
    description: string;
  };
  isMobile: boolean;
};

const Sidebar = ({ link, meta, isMobile }: SidebarProps) => {
  const { sidebar, setHeader, setSidebarState } = useConfigStore();
  const { isExpanded } = sidebar;
  const { t } = useLanguage();

  // Navigation configuration using translation
  const navigation: INavItem[] = [
    {
      name: t("navigation.build"),
      href: "/build",
      icon: Bot,
      breadcrumbs: [{ name: t("navigation.build"), href: "/build", current: true }],
    },
    {
      name: t("navigation.playground"),
      href: "/",
      icon: MessagesSquare,
      breadcrumbs: [{ name: t("navigation.playground"), href: "/", current: true }],
    },
    {
      name: t("navigation.gallery"),
      href: "/gallery",
      icon: GalleryHorizontalEnd,
      breadcrumbs: [{ name: t("navigation.gallery"), href: "/gallery", current: true }],
    },
    {
      name: t("navigation.deploy"),
      href: "/deploy",
      icon: Rocket,
      breadcrumbs: [{ name: t("navigation.deploy"), href: "/deploy", current: true }],
    },
  ];

  // Set initial header state based on current route
  React.useEffect(() => {
    setNavigationHeader(link);
  }, [link]);

  // Always show full sidebar in mobile view
  const showFull = isMobile || isExpanded;

  const handleNavClick = (item: INavItem) => {
    // if (!isExpanded) {
    //   setSidebarState({ isExpanded: true });
    // }
    setHeader({
      title: item.name,
      breadcrumbs: item.breadcrumbs,
    });
  };

  const setNavigationHeader = (path: string) => {
    const navItem = navigation.find((item) => item.href === path);
    if (navItem) {
      setHeader({
        title: navItem.name,
        breadcrumbs: navItem.breadcrumbs,
      });
    } else if (path === "/settings") {
      setHeader({
        title: t("common.settings"),
        breadcrumbs: [{ name: t("common.settings"), href: "/settings", current: true }],
      });
    }
  };

  return (
    <div
      className={classNames(
        "flex grow   z-50  flex-col gap-y-5 overflow-y-auto border-r border-secondary bg-primary",
        "transition-all duration-300 ease-in-out",
        showFull ? "w-72 px-6" : "w-16 px-2"
      )}
    >
      {/* App Logo/Title */}
      <div
        className={`flex h-16 items-center ${showFull ? "gap-x-3" : "ml-2"}`}
      >
        <Link
          to="/"
          onClick={() => setNavigationHeader("/")}
          className="w-8 text-right text-accent hover:opacity-80 transition-opacity"
        >
          <Icon icon="app" size={8} />
        </Link>
        {showFull && (
          <div className="flex flex-col" style={{ minWidth: "200px" }}>
            <span className="text-base font-semibold text-primary">
              {meta?.title}
            </span>
            <span className="text-xs text-secondary">{meta?.description}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main Navigation */}
          <li>
            <ul
              role="list"
              className={classNames(
                "-mx-2 space-y-1",
                !showFull && "items-center"
              )}
            >
              {navigation.map((item) => {
                const isActive = item.href === link;
                const IconComponent = item.icon;

                const navLink = (
                  <div className="relative">
                    {isActive && (
                      <div className="bg-accent absolute top-1 left-0.5 z-50 h-8 w-1 bg-opacity-80  rounded">
                        {" "}
                      </div>
                    )}
                    <Link
                      to={item.href}
                      onClick={() => handleNavClick(item)}
                      className={classNames(
                        // Base styles
                        "group  ml-1 flex gap-x-3 rounded-md mr-2  p-2 text-sm font-medium",
                        !showFull && "justify-center",
                        // Color states
                        isActive
                          ? "bg-secondary text-primary "
                          : "text-secondary hover:bg-tertiary hover:text-accent"
                      )}
                    >
                      {" "}
                      <IconComponent
                        className={classNames(
                          "h-6 w-6 shrink-0",
                          isActive
                            ? "text-accent"
                            : "text-secondary group-hover:text-accent"
                        )}
                      />
                      {showFull && item.name}
                    </Link>
                  </div>
                );

                return (
                  <li key={item.name}>
                    {!showFull && !isMobile ? (
                      <Tooltip title={item.name} placement="right">
                        {navLink}
                      </Tooltip>
                    ) : (
                      navLink
                    )}
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Settings at bottom */}
          <li
            className={classNames(
              "mt-auto -mx-2 mb-4",
              !showFull && "flex flex-col items-center gap-1"
            )}
          >
            {!showFull && !isMobile ? (
              <>
                <Tooltip title={t("common.settings")} placement="right">
                  <Link
                    to="/settings"
                    onClick={() =>
                      setHeader({
                        title: t("common.settings"),
                        breadcrumbs: [
                          {
                            name: t("common.settings"),
                            href: "/settings",
                            current: true,
                          },
                        ],
                      })
                    }
                    className="group   flex gap-x-3 rounded-md p-2 text-sm font-medium text-primary hover:text-accent hover:bg-secondary justify-center"
                  >
                    <Settings className="h-6 w-6 shrink-0 text-secondary group-hover:text-accent" />
                  </Link>
                </Tooltip>
                <div className="hidden md:block">
                  <Tooltip
                    title={isExpanded ? t("ui.closeSidebar") : t("ui.openSidebar")}
                    placement="right"
                  >
                    <button
                      onClick={() =>
                        setSidebarState({ isExpanded: !isExpanded })
                      }
                      className="p-2 rounded-md hover:bg-secondary hover:text-accent text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                    >
                      {isExpanded ? (
                        <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
                      ) : (
                        <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-full  ">
                  <div className="">
                    {" "}
                    <Link
                      to="/settings"
                      onClick={() =>
                        setHeader({
                          title: t("common.settings"),
                          breadcrumbs: [
                            {
                              name: t("common.settings"),
                              href: "/settings",
                              current: true,
                            },
                          ],
                        })
                      }
                      className="group flex flex-1 gap-x-3 rounded-md p-2 text-sm font-medium text-primary hover:text-accent hover:bg-secondary"
                    >
                      <Settings className="h-6 w-6 shrink-0 text-secondary group-hover:text-accent" />
                      {showFull && t("common.settings")}
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Tooltip
                    title={isExpanded ? t("ui.closeSidebar") : t("ui.openSidebar")}
                    placement="right"
                  >
                    <button
                      onClick={() =>
                        setSidebarState({ isExpanded: !isExpanded })
                      }
                      className="p-2 rounded-md hover:bg-secondary hover:text-accent text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
                    >
                      {isExpanded ? (
                        <PanelLeftClose strokeWidth={1.5} className="h-6 w-6" />
                      ) : (
                        <PanelLeftOpen strokeWidth={1.5} className="h-6 w-6" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
