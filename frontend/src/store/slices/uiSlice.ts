import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: string | null;
  toast: {
    message: string;
    type: "success" | "error" | "warning" | "info";
    visible: boolean;
  };
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  toast: {
    message: "",
    type: "info",
    visible: false,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state: UIState, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    toggleTheme: (state: UIState) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setSidebarOpen: (state: UIState, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state: UIState) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setModalOpen: (state: UIState, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload;
      if (!action.payload) {
        state.modalType = null;
      }
    },
    setModalType: (state: UIState, action: PayloadAction<string>) => {
      state.modalType = action.payload;
      state.modalOpen = true;
    },
    showToast: (
      state: UIState,
      action: PayloadAction<{
        message: string;
        type?: "success" | "error" | "warning" | "info";
      }>
    ) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || "info",
        visible: true,
      };
    },
    hideToast: (state: UIState) => {
      state.toast.visible = false;
    },
    clearToast: (state: UIState) => {
      state.toast = {
        message: "",
        type: "info",
        visible: false,
      };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setModalOpen,
  setModalType,
  showToast,
  hideToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;
