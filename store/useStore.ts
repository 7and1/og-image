import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import { getTemplate } from "@/templates";
import type {
  TemplateId,
  BackgroundMode,
  FontFamily,
  FontSize,
  Layout,
  ExportTab,
} from "@/types";

/**
 * Main application state interface
 */
interface OGState {
  // === Content ===
  title: string;
  description: string;
  icon: string;

  // === Styling ===
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundMode: BackgroundMode;
  backgroundId: string | null;
  backgroundImageSrc: string | null;
  overlayOpacity: number;

  // === Advanced Options ===
  fontFamily: FontFamily;
  fontSize: FontSize;
  layout: Layout;

  // === Library ===
  favoriteBackgroundIds: string[];
  favoritesUserKey: string | null;

  // === UI State ===
  isGenerating: boolean;
  previewUrl: string | null;
  error: string | null;
  activeExportTab: ExportTab;
  isAdvancedOpen: boolean;

  // === Actions ===
  setContent: (
    content: Partial<Pick<OGState, "title" | "description" | "icon">>
  ) => void;
  setStyling: (
    styling: Partial<
      Pick<OGState, "template" | "backgroundColor" | "textColor" | "accentColor">
    >
  ) => void;
  setBackground: (
    background: Partial<
      Pick<
        OGState,
        "backgroundMode" | "backgroundId" | "backgroundImageSrc" | "overlayOpacity"
      >
    >
  ) => void;
  setAdvanced: (
    advanced: Partial<Pick<OGState, "fontFamily" | "fontSize" | "layout">>
  ) => void;
  toggleFavoriteBackground: (backgroundId: string) => void;
  clearFavoriteBackgrounds: () => void;
  setFavoritesUserKey: (userKey: string | null) => void;
  setFavoriteBackgroundIds: (ids: string[]) => void;
  setUI: (
    ui: Partial<
      Pick<
        OGState,
        "isGenerating" | "previewUrl" | "error" | "activeExportTab" | "isAdvancedOpen"
      >
    >
  ) => void;
  reset: () => void;
  loadTemplate: (templateId: TemplateId) => void;
}

/**
 * Default state values
 */
const defaultState = {
  // Content
  title: "Build faster with Next.js",
  description: "The React Framework for Production",
  icon: "⚡",

  // Styling
  template: "gradient" as TemplateId,
  backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  textColor: "#ffffff",
  accentColor: "#3b82f6",
  backgroundMode: "color" as BackgroundMode,
  backgroundId: null,
  backgroundImageSrc: null,
  overlayOpacity: 0.55,

  // Advanced
  fontFamily: "inter" as FontFamily,
  fontSize: "medium" as FontSize,
  layout: "center" as Layout,

  // Library
  favoriteBackgroundIds: [] as string[],
  favoritesUserKey: null as string | null,

  // UI State
  isGenerating: false,
  previewUrl: null,
  error: null,
  activeExportTab: "nextjs" as ExportTab,
  isAdvancedOpen: false,
};

/**
 * Main Zustand store with persistence
 */
export const useStore = create<OGState>()(
  devtools(
    persist(
      (set) => ({
        ...defaultState,

        setContent: (content) =>
          set((state) => ({ ...state, ...content }), false, "setContent"),

        setStyling: (styling) =>
          set((state) => ({ ...state, ...styling }), false, "setStyling"),

        setBackground: (background) =>
          set((state) => ({ ...state, ...background }), false, "setBackground"),

        setAdvanced: (advanced) =>
          set((state) => ({ ...state, ...advanced }), false, "setAdvanced"),

        toggleFavoriteBackground: (backgroundId) =>
          set(
            (state) => {
              const target = backgroundId.trim();
              if (!target) {
                return state;
              }

              const exists = state.favoriteBackgroundIds.includes(target);
              const favoriteBackgroundIds = exists
                ? state.favoriteBackgroundIds.filter((id) => id !== target)
                : [...state.favoriteBackgroundIds, target];

              return {
                ...state,
                favoriteBackgroundIds,
              };
            },
            false,
            "toggleFavoriteBackground"
          ),

        clearFavoriteBackgrounds: () =>
          set(
            (state) => ({
              ...state,
              favoriteBackgroundIds: [],
            }),
            false,
            "clearFavoriteBackgrounds"
          ),

        setFavoritesUserKey: (userKey) =>
          set(
            (state) => ({
              ...state,
              favoritesUserKey: userKey,
            }),
            false,
            "setFavoritesUserKey"
          ),

        setFavoriteBackgroundIds: (ids) =>
          set(
            (state) => ({
              ...state,
              favoriteBackgroundIds: ids,
            }),
            false,
            "setFavoriteBackgroundIds"
          ),

        setUI: (ui) => set((state) => ({ ...state, ...ui }), false, "setUI"),

        reset: () =>
          set(
            (state) => ({
              ...defaultState,
              favoriteBackgroundIds: state.favoriteBackgroundIds,
            }),
            false,
            "reset"
          ),

        loadTemplate: (templateId) =>
          set(
            (state) => {
              const template = getTemplate(templateId);
              const defaults = template.defaultProps;

              return {
                ...state,
                template: templateId,
                backgroundColor:
                  defaults.backgroundColor ?? defaultState.backgroundColor,
                textColor: defaults.textColor ?? defaultState.textColor,
                accentColor: defaults.accentColor ?? defaultState.accentColor,
                backgroundMode:
                  defaults.backgroundMode ?? defaultState.backgroundMode,
                backgroundId: defaults.backgroundId ?? null,
                backgroundImageSrc: defaults.backgroundImageSrc ?? null,
                overlayOpacity:
                  typeof defaults.overlayOpacity === "number"
                    ? defaults.overlayOpacity
                    : defaultState.overlayOpacity,
                layout:
                  (defaults.layout as Layout | undefined) ?? defaultState.layout,
              };
            },
            false,
            "loadTemplate"
          ),
      }),
      {
        name: "og-generator-storage",
        // Only persist user content and styling, not UI state
        partialize: (state) => ({
          title: state.title,
          description: state.description,
          icon: state.icon,
          template: state.template,
          backgroundColor: state.backgroundColor,
          textColor: state.textColor,
          accentColor: state.accentColor,
          backgroundMode: state.backgroundMode,
          backgroundId: state.backgroundId,
          backgroundImageSrc: null,
          overlayOpacity: state.overlayOpacity,
          fontFamily: state.fontFamily,
          fontSize: state.fontSize,
          layout: state.layout,
          favoriteBackgroundIds: state.favoriteBackgroundIds,
          favoritesUserKey: state.favoritesUserKey,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) {
            return;
          }

          // Upload backgrounds are local-only, so they cannot be restored after refresh.
          if (state.backgroundMode === "upload" && !state.backgroundImageSrc) {
            state.setBackground({
              backgroundMode: "color",
              backgroundId: null,
              backgroundImageSrc: null,
            });
          }
        },
      }
    ),
    { name: "og-store" }
  )
);

/**
 * Selector hooks for optimized re-renders
 * Using useShallow to prevent infinite loops in SSR/hydration
 */

// Content selector
export const useContent = () =>
  useStore(
    useShallow((state) => ({
      title: state.title,
      description: state.description,
      icon: state.icon,
    }))
  );

// Styling selector
export const useStyling = () =>
  useStore(
    useShallow((state) => ({
      template: state.template,
      backgroundColor: state.backgroundColor,
      textColor: state.textColor,
      accentColor: state.accentColor,
      backgroundMode: state.backgroundMode,
      backgroundId: state.backgroundId,
      backgroundImageSrc: state.backgroundImageSrc,
      overlayOpacity: state.overlayOpacity,
    }))
  );

// Advanced options selector
export const useAdvanced = () =>
  useStore(
    useShallow((state) => ({
      fontFamily: state.fontFamily,
      fontSize: state.fontSize,
      layout: state.layout,
    }))
  );

// Library selector
export const useLibrary = () =>
  useStore(
    useShallow((state) => ({
      favoriteBackgroundIds: state.favoriteBackgroundIds,
      favoritesUserKey: state.favoritesUserKey,
    }))
  );

// UI state selector
export const useUIState = () =>
  useStore(
    useShallow((state) => ({
      isGenerating: state.isGenerating,
      previewUrl: state.previewUrl,
      error: state.error,
      activeExportTab: state.activeExportTab,
      isAdvancedOpen: state.isAdvancedOpen,
    }))
  );

// Actions selector
export const useActions = () =>
  useStore(
    useShallow((state) => ({
      setContent: state.setContent,
      setStyling: state.setStyling,
      setBackground: state.setBackground,
      setAdvanced: state.setAdvanced,
      toggleFavoriteBackground: state.toggleFavoriteBackground,
      clearFavoriteBackgrounds: state.clearFavoriteBackgrounds,
      setFavoritesUserKey: state.setFavoritesUserKey,
      setFavoriteBackgroundIds: state.setFavoriteBackgroundIds,
      setUI: state.setUI,
      reset: state.reset,
      loadTemplate: state.loadTemplate,
    }))
  );
