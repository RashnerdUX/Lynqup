import React fromreact';
import { useAuth } from '@/hooks/useAuth';
import { useForm, loginValidationSchema } from '@/hooks/useForm;
import { Button } from@/components/ui/button';
import { Input } from@/components/ui/input';
import { LoginFormData } from@/types;
import { ROUTES } from '@/constants';
import Link from 'next/link';

interface LoginFormProps [object Object] onSuccess?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, className }) => {
  const [object Object] login, isLoading, error } = useAuth();

  const { values, errors, setValue, handleSubmit } = useForm<LoginFormData>({
    initialValues: {
      email: ,    password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (formValues) => {
      const result = await login(formValues);
      if (result.meta.requestStatus === 'fulfilled') {
        onSuccess?.();
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className={`space-y-6lassName}`}>
      <div>
        <label htmlFor="email className="block text-sm font-medium text-gray-70dark:text-gray-300>
          Email
        </label>
        <Input
          id="email       type="email"
          value={values.email}
          onChange={(e) => setValue('email', e.target.value)}
          error={errors.email}
          placeholder="Enter your email"
          className=mt-1       />
      </div>

      <div>
        <label htmlFor="password className="block text-sm font-medium text-gray-70dark:text-gray-300">
          Password
        </label>
        <Input
          id="password    type="password"
          value={values.password}
          onChange={(e) => setValue('password', e.target.value)}
          error={errors.password}
          placeholder="Enter your password"
          className=mt-1       />
      </div>

[object Object]error && (
        <div className=text-red-60 text-sm bg-red-50dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type=submit" className="w-full" disabled={isLoading}>
        {isLoading ?Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center">
        <p className=text-sm text-gray-60dark:text-gray-40>        Dont have an account?{' }        <Link href={ROUTES.SIGNUP} className="text-blue-600over:text-blue-50dark:text-blue-400>
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}; 