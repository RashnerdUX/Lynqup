import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { User, LoginFormData, SignupFormData } from "@/types";
import { apiClient } from "@/lib/api-client";
import { AuthService } from "@/services/auth.service";
import {
  setAuthToken,
  removeAuthToken,
  setUserData,
  removeUserData,
} from "@/lib/storage";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginFormData,
  { rejectValue: string }
>("users/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/users/login",
      credentials
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Login failed");
    }
    return rejectWithValue("Login failed");
  }
});

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  SignupFormData,
  { rejectValue: string }
>("users/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/users/register",
      userData
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Signup failed");
    }
    return rejectWithValue("Signup failed");
  }
});

export const logoutUser = createAsyncThunk<null, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/auth/logout");
      return null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Logout failed");
      }
      return rejectWithValue("Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ user: User }>("/auth/me");
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to get user data");
    }
    return rejectWithValue("Failed to get user data");
  }
});

export const googleLogin = createAsyncThunk<
  { user: User; token: string },
  Record<string, string>,
  { rejectValue: string }
>("auth/googleLogin", async (query, { rejectWithValue }) => {
  try {
    const response = await AuthService.handleGoogleCallback(query);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Google login failed");
    }
    return rejectWithValue("Google login failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state: AuthState) => {
      state.error = null;
    },
    setLoading: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      // Login
      .addCase(loginUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          setAuthToken(action.payload.token);
          setUserData(action.payload.user);
        }
      )
      .addCase(
        loginUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      )
      // Signup
      .addCase(signupUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          setAuthToken(action.payload.token);
          setUserData(action.payload.user);
        }
      )
      .addCase(
        signupUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      )
      // Logout
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        removeAuthToken();
        removeUserData();
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state: AuthState, action: PayloadAction<{ user: User }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      )
      .addCase(
        getCurrentUser.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload as string;
          state.isAuthenticated = false;
        }
      )
      // Google Login
      .addCase(googleLogin.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        googleLogin.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          setAuthToken(action.payload.token);
          setUserData(action.payload.user);
        }
      )
      .addCase(
        googleLogin.rejected,
        (state: AuthState, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
