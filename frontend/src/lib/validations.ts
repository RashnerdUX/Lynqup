import { VALIDATION } from "@/constants";

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= VALIDATION.EMAIL_MAX_LENGTH;
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    password.length <= VALIDATION.PASSWORD_MAX_LENGTH
  );
};

// Name validation
export const isValidName = (name: string): boolean => {
  return (
    name.length >= VALIDATION.NAME_MIN_LENGTH &&
    name.length <= VALIDATION.NAME_MAX_LENGTH &&
    /^[a-zA-Z\s]+$/.test(name)
  );
};

// Password strength validation
export const getPasswordStrength = (
  password: string
): "weak" | "medium" | "strong" => {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (score < 3) return "weak";
  if (score === 3) return "medium";
  return "strong";
};

// Form validation helpers
export const validateRequired = (value: string): string | null => {
  return value.trim() ? null : "This field is required";
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  if (!isValidEmail(email)) return "Please enter a valid email address";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (!isValidPassword(password)) {
    return `Password must be between ${VALIDATION.PASSWORD_MIN_LENGTH} and ${VALIDATION.PASSWORD_MAX_LENGTH} characters`;
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (!isValidName(name)) {
    return `Name must be between ${VALIDATION.NAME_MIN_LENGTH} and ${VALIDATION.NAME_MAX_LENGTH} characters and contain only letters`;
  }
  return null;
};

export const isValidUsername = (username: string): boolean => {
  // Add your username validation logic here
  return (
    username.length >= 3 &&
    username.length <= 30 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
};

export const validateUsername = (username: string): string | null => {
  if (!username.trim()) return "Username is required";
  if (!isValidUsername(username)) {
    return "Username must be 3-30 characters and contain only letters, numbers, and underscores";
  }
  return null;
};
