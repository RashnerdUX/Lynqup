import { useState, useCallback } from "react";

interface FormErrors {
  [key: string]: string | null;
}

interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema?: Partial<
    Record<keyof T, (value: unknown, values?: T) => string | null>
  >;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationSchema = {},
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as string]) {
        setErrors((prev) => ({ ...prev, [name]: null }));
      }
    },
    [errors]
  );

  const setError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    // Validate each field
    Object.keys(values).forEach((key) => {
      const value = values[key];
      const validator = validationSchema[key as keyof T];
      if (validator) {
        const error = validator(value, values);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }
      const isValid = validate();
      if (!isValid) {
        return;
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    validate,
    handleSubmit,
    reset,
    resetErrors,
  };
};

// Example validation functions (replace with your own or import from validations)
export const validateEmail = (value: unknown) => {
  if (!value || typeof value !== "string") return "Email is required";
  // Add more email validation logic here
  return null;
};
export const validatePassword = (value: unknown) => {
  if (!value || typeof value !== "string") return "Password is required";
  // Add more password validation logic here
  return null;
};
export const validateUsername = (value: unknown) => {
  if (!value || typeof value !== "string") return "Username is required";
  return null;
};
export const validateRequired = (value: unknown) => {
  if (!value || typeof value !== "string") return "This field is required";
  return null;
};

export const loginValidationSchema = {
  email: validateEmail,
  password: validatePassword,
};

export const signupValidationSchema = {
  username: validateUsername,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: (value: unknown, values?: Record<string, unknown>) => {
    if (!value || typeof value !== "string")
      return "Please confirm your password";
    if (values && value !== values.password) return "Passwords do not match";
    return null;
  },
};

export const profileValidationSchema = {
  name: validateUsername,
  email: validateEmail,
};
