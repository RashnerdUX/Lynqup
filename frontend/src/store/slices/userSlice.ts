import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { apiClient } from "@/lib/api-client";

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const updateUserProfile = createAsyncThunk<
  { user: User },
  Partial<User>,
  { rejectValue: string }
>(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<{ user: User }>(
        "/user/profile",
        userData
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to update profile");
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

export const uploadProfilePicture = createAsyncThunk<
  { user: User },
  File,
  { rejectValue: string }
>(
  "user/uploadProfilePicture",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await apiClient.post<{ user: User }>(
        "/user/avatar",
        formData
      );
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to upload profile picture");
      }
      return rejectWithValue("Failed to upload profile picture");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state: UserState, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    clearProfile: (state: UserState) => {
      state.profile = null;
    },
    clearError: (state: UserState) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateUserProfile.pending, (state: UserState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state: UserState, action: PayloadAction<{ user: User }>) => {
        state.isLoading = false;
        state.profile = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state: UserState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state: UserState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state: UserState, action: PayloadAction<{ user: User }>) => {
        state.isLoading = false;
        state.profile = action.payload.user;
      })
      .addCase(uploadProfilePicture.rejected, (state: UserState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, clearProfile, clearError } = userSlice.actions;
export default userSlice.reducer;
