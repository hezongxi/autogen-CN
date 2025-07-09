import React, { useCallback, useEffect, useState, useContext } from "react";
import { message, Modal } from "antd";
import { ChevronRight } from "lucide-react";
import { appContext } from "../../../hooks/provider";
import { useLanguage } from "../../../hooks/useLanguage";
import { galleryAPI } from "./api";
import { GallerySidebar } from "./sidebar";
import { GalleryDetail } from "./detail";
import { GalleryCreateModal } from "./create-modal";
import type { Gallery } from "../../types/datamodel";

export const GalleryManager: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [currentGallery, setCurrentGallery] = useState<Gallery | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gallerySidebar");
      return stored !== null ? JSON.parse(stored) : true;
    }
    return true;
  });

  const { user } = useContext(appContext);
  const [messageApi, contextHolder] = message.useMessage();

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gallerySidebar", JSON.stringify(isSidebarOpen));
    }
  }, [isSidebarOpen]);

  const fetchGalleries = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await galleryAPI.listGalleries(user.id);
      setGalleries(data);
      if (!currentGallery && data.length > 0) {
        setCurrentGallery(data[0]);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
      messageApi.error(t('gallery.failedToFetchGalleries'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentGallery, messageApi]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  // Handle URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const galleryId = params.get("galleryId");

    if (galleryId && !currentGallery) {
      const numericId = parseInt(galleryId, 10);
      if (!isNaN(numericId)) {
        handleSelectGallery(numericId);
      }
    }
  }, []);

  // Update URL when gallery changes
  useEffect(() => {
    if (currentGallery?.id) {
      window.history.pushState(
        {},
        "",
        `?galleryId=${currentGallery.id.toString()}`
      );
    }
  }, [currentGallery?.id]);

  const handleSelectGallery = async (galleryId: number) => {
    if (!user?.id) return;

    if (hasUnsavedChanges) {
      Modal.confirm({
        title: t('gallery.unsavedChanges'),
        content: t('gallery.unsavedChangesMessage'),
        okText: t('gallery.discard'),
        cancelText: t('gallery.goBack'),
        onOk: () => {
          switchToGallery(galleryId);
          setHasUnsavedChanges(false);
        },
      });
    } else {
      await switchToGallery(galleryId);
    }
  };

  const switchToGallery = async (galleryId: number) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const data = await galleryAPI.getGallery(galleryId, user.id);
      setCurrentGallery(data);
    } catch (error) {
      console.error("Error loading gallery:", error);
      messageApi.error(t('gallery.failedToLoadGallery'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGallery = async (galleryData: Gallery) => {
    if (!user?.id) return;

    galleryData.user_id = user.id;
    try {
      const savedGallery = await galleryAPI.createGallery(galleryData, user.id);
      setGalleries([savedGallery, ...galleries]);
      setCurrentGallery(savedGallery);
      setIsCreateModalOpen(false);
      messageApi.success(t('gallery.galleryCreatedSuccessfully'));
    } catch (error) {
      console.error("Error creating gallery:", error);
      messageApi.error(t('gallery.failedToCreateGallery'));
    }
  };

  const handleUpdateGallery = async (updates: Partial<Gallery>) => {
    if (!user?.id || !currentGallery?.id) return;

    try {
      const sanitizedUpdates = {
        ...updates,
        created_at: undefined,
        updated_at: undefined,
      };
      const updatedGallery = await galleryAPI.updateGallery(
        currentGallery.id,
        sanitizedUpdates,
        user.id
      );
      setGalleries(
        galleries.map((g) => (g.id === updatedGallery.id ? updatedGallery : g))
      );
      setCurrentGallery(updatedGallery);
      setHasUnsavedChanges(false);
      messageApi.success(t('gallery.galleryUpdatedSuccessfully'));
    } catch (error) {
      console.error("Error updating gallery:", error);
      messageApi.error(t('gallery.failedToUpdateGallery'));
    }
  };

  const handleDeleteGallery = async (galleryId: number) => {
    if (!user?.id) return;

    try {
      await galleryAPI.deleteGallery(galleryId, user.id);
      setGalleries(galleries.filter((g) => g.id !== galleryId));
      if (currentGallery?.id === galleryId) {
        setCurrentGallery(null);
      }
      messageApi.success(t('gallery.galleryDeletedSuccessfully'));
    } catch (error) {
      console.error("Error deleting gallery:", error);
      messageApi.error(t('gallery.failedToDeleteGallery'));
    }
  };

  const handleSyncGallery = async (galleryId: number) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const gallery = galleries.find((g) => g.id === galleryId);
      if (!gallery?.config.url) return;

      const remoteGallery = await galleryAPI.syncGallery(gallery.config.url);
      await handleUpdateGallery({
        ...remoteGallery,
        id: galleryId,
        config: {
          ...remoteGallery.config,
          metadata: {
            ...remoteGallery.config.metadata,
            lastSynced: new Date().toISOString(),
          },
        },
      });

      messageApi.success(t('gallery.gallerySyncedSuccessfully'));
    } catch (error) {
      console.error("Error syncing gallery:", error);
      messageApi.error(t('gallery.failedToSyncGallery'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)] text-secondary">
        {t('gallery.pleaseLoginToViewGalleries')}
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full">
      {contextHolder}

      {/* Create Modal */}
      <GalleryCreateModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onCreateGallery={handleCreateGallery}
      />

      {/* Sidebar */}
      <div
        className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-12"
        }`}
      >
        <GallerySidebar
          isOpen={isSidebarOpen}
          galleries={galleries}
          currentGallery={currentGallery}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectGallery={(gallery) => handleSelectGallery(gallery.id!)}
          onCreateGallery={() => setIsCreateModalOpen(true)}
          onDeleteGallery={handleDeleteGallery}
          onSyncGallery={handleSyncGallery}
          isLoading={isLoading}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all -mr-6 duration-200 ${
          isSidebarOpen ? "ml-64" : "ml-12"
        }`}
      >
        <div className="p-4 pt-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-primary font-medium">{t('gallery.galleries')}</span>
            {currentGallery && (
              <>
                <ChevronRight className="w-4 h-4 text-secondary" />
                <span className="text-secondary">
                  {currentGallery.config.name}
                </span>
              </>
            )}
          </div>

          {/* Content Area */}
          {isLoading && !currentGallery ? (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] text-secondary">
              {t('gallery.loadingGalleries')}
            </div>
          ) : currentGallery ? (
            <GalleryDetail
              gallery={currentGallery}
              onSave={handleUpdateGallery}
              onDirtyStateChange={setHasUnsavedChanges}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-120px)] text-secondary">
              {t('gallery.selectGalleryOrCreateNew')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
