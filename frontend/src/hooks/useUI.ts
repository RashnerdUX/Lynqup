import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setModalOpen,
  setModalType,
  showToast,
  hideToast,
} from "@/store/slices/uiSlice";
import { getTheme, setTheme as setThemeStorage } from "@/lib/storage";
import type { RootState } from "@/store";

export const useUI = () => {
  const dispatch = useAppDispatch();
  const { theme, sidebarOpen, modalOpen, modalType, toast } = useAppSelector(
    (state: RootState) => state.ui
  );

  // Initialize theme from storage
  useEffect(() => {
    const storedTheme = getTheme();
    if (storedTheme && storedTheme !== theme) {
      dispatch(setTheme(storedTheme as "light" | "dark"));
    }
  }, [dispatch, theme]);

  // Save theme to storage when it changes
  useEffect(() => {
    setThemeStorage(theme);
  }, [theme]);

  const handleSetTheme = (newTheme: "light" | "dark") => {
    dispatch(setTheme(newTheme));
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetSidebarOpen = (open: boolean) => {
    dispatch(setSidebarOpen(open));
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSetModalOpen = (open: boolean) => {
    dispatch(setModalOpen(open));
  };

  const handleSetModalType = (type: string) => {
    dispatch(setModalType(type));
  };

  const handleShowToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info"
  ) => {
    dispatch(showToast({ message, type }));
  };

  const handleHideToast = () => {
    dispatch(hideToast());
  };

  return {
    theme,
    sidebarOpen,
    modalOpen,
    modalType,
    toast,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
    setSidebarOpen: handleSetSidebarOpen,
    toggleSidebar: handleToggleSidebar,
    setModalOpen: handleSetModalOpen,
    setModalType: handleSetModalType,
    showToast: handleShowToast,
    hideToast: handleHideToast,
  };
};
