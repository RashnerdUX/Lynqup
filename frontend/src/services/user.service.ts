/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api-client";
import { User } from "@/types";

export class UserService {
  static async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>("/user/profile");
      return response.user;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to fetch user profile.");
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>(
        "/user/profile",
        userData
      );
      return response.user;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to update profile.");
    }
  }

  static async uploadAvatar(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await apiClient.post<{ user: User }>(
        "/user/avatar",
        formData
      );
      return response.user;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to upload avatar.");
    }
  }

  static async deleteAvatar(): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        "/user/avatar"
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to delete avatar.");
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/user/change-password",
        {
          currentPassword,
          newPassword,
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to change password.");
    }
  }

  static async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/user/account/delete",
        { password }
      );
      return response;
    } catch (error: any) {
      throw new Error(error?.message || "Failed to delete account.");
    }
  }
}
