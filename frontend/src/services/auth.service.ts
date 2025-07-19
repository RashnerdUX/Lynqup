/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { LoginFormData, SignupFormData, User } from "@/types";
import { API_BASE_URL } from "@/constants";

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/users/login",
        credentials
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Login failed. Please try again.");
    }
  }

  static async signup(userData: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/users/register",
        userData
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Signup failed. Please try again.");
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error: any) {
      throw new Error(error?.message || "Logout failed. Please try again.");
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>("/auth/me");
      return response.user;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to fetch user info.");
    }
  }

  static async refreshToken(): Promise<{ token: string }> {
    try {
      const response = await apiClient.post<{ token: string }>("/auth/refresh");
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to refresh token.");
    }
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/auth/forgot-password",
        { email }
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to send password reset email.");
    }
  }

  static async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/auth/reset-password",
        { token, password }
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to reset password.");
    }
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/auth/verify-email",
        { token }
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to verify email.");
    }
  }

  static getGoogleOAuthUrl(): string {
    return `${API_BASE_URL}/auth/google`;
  }

  static async handleGoogleCallback(
    query: Record<string, string>
  ): Promise<AuthResponse> {
    if (query.token) {
      return { user: {} as User, token: query.token };
    } else if (query.code) {
      try {
        const response = await apiClient.post<AuthResponse>(
          "/auth/google/callback",
          { code: query.code }
        );
        return response;
      } catch (error: any) {
        throw new Error(error?.message || "Google authentication failed.");
      }
    } else {
      throw new Error("No token or code found in Google OAuth callback");
    }
  }
}
