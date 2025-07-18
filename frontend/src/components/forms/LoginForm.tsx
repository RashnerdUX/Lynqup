import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useForm, loginValidationSchema } from "@/hooks/useForm";
import Button from "@/components/button";
import Input from "@/components/input";
import { LoginFormData } from "@/types";
import { ROUTES } from "@/constants";
import Link from "next/link";

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className,
}) => {
  const { login, isLoading, error } = useAuth();

  const { values, errors, setValue, handleSubmit } = useForm<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (formValues) => {
      const result = await login(formValues);
      if (result) {
        onSuccess?.();
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className || ""}`}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue("email", e.target.value)
          }
          // @ts-expect-error error prop may not exist on Input, ignore if not supported
          error={errors.email}
          placeholder="Enter your email"
          className="mt-1"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={values.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue("password", e.target.value)
          }
          // @ts-expect-error error prop may not exist on Input, ignore if not supported
          error={errors.password}
          placeholder="Enter your password"
          className="mt-1"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};
