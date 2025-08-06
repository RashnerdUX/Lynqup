/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "@/constants";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, timeout: number) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth token to every request if available
    this.axiosInstance.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
          if (typeof (config.headers as any).set === "function") {
            (config.headers as any).set("Authorization", `Bearer ${token}`);
          } else {
            (config.headers as any)["Authorization"] = `Bearer ${token}`;
          }
        }
      }
      return config;
    });
  }

  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    console.log("API REQUEST", endpoint, config);
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      // Axios error handling
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      data,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      data,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      data,
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Export the class for testing purposes
export { ApiClient };
