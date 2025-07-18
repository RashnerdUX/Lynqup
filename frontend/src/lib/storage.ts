import { STORAGE_KEYS } from "@/constants";

// Storage utility class
class StorageManager {
  // Get item from localStorage
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key${key}:`, error);
      return null;
    }
  }

  // Set item in localStorage
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  // Remove item from localStorage
  remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key ${key}:`, error);
    }
  }

  // Clear all localStorage
  clear(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  // Check if key exists in localStorage
  has(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Error checking localStorage key${key}:`, error);
      return false;
    }
  }
}

// Create and export the storage manager instance
export const storage = new StorageManager();

// Convenience functions for common storage operations
export const getAuthToken = (): string | null => {
  return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
};

export const setAuthToken = (token: string): void => {
  storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const removeAuthToken = (): void => {
  storage.remove(STORAGE_KEYS.AUTH_TOKEN);
};

export const getUserData = <T>(): T | null => {
  return storage.get<T>(STORAGE_KEYS.USER_DATA);
};

export const setUserData = <T>(userData: T): void => {
  storage.set(STORAGE_KEYS.USER_DATA, userData);
};

export const removeUserData = (): void => {
  storage.remove(STORAGE_KEYS.USER_DATA);
};

export const getTheme = (): string | null => {
  return storage.get<string>(STORAGE_KEYS.THEME);
};

export const setTheme = (theme: string): void => {
  storage.set(STORAGE_KEYS.THEME, theme);
};

// Clear all auth-related data
export const clearAuthData = (): void => {
  removeAuthToken();
  removeUserData();
};

// Export the class for testing purposes
export { StorageManager };
