/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  googleLogin,
} from "@/store/slices/authSlice";
import { LoginFormData, SignupFormData } from "@/types";
import { getAuthToken } from "@/lib/storage";
import type { RootState } from "@/store";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
    (state: RootState) => state.auth
  );

  // Check for existing token on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  const login = async (credentials: LoginFormData) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      toast.success("Login successful!");
      return result;
    } catch (err: any) {
      toast.error(err?.message || "Login failed. Please try again.");
      throw err;
    }
  };

  const signup = async (userData: SignupFormData) => {
    try {
      const result = await dispatch(signupUser(userData)).unwrap();
      toast.success("Signup successful! Please log in.");
      return result;
    } catch (err: any) {
      toast.error(err?.message || "Signup failed. Please try again.");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully.");
    } catch (err: any) {
      toast.error(err?.message || "Logout failed. Please try again.");
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      return await dispatch(getCurrentUser()).unwrap();
    } catch (err: any) {
      toast.error(err?.message || "Failed to refresh user info.");
      throw err;
    }
  };

  const googleAuth = async (params: Record<string, string>) => {
    try {
      const result = await dispatch(googleLogin(params)).unwrap();
      toast.success("Google login successful!");
      return result;
    } catch (err: any) {
      toast.error(err?.message || "Google login failed.");
      throw err;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshUser,
    googleAuth,
  };
};
