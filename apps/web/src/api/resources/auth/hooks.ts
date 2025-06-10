import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authApi } from '@/api/resources/auth/api';
import type { LoginFormData, RegisterDto } from '@/types/auth';

const ONE_HOUR = 1000 * 60 * 60;
const FIVE_MINUTES = 1000 * 60 * 5;

const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const REFRESH_TOKEN_KEY = 'refreshToken';

export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),

    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  });

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      if (data?.accessToken && data?.refreshToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      navigate(from, { replace: true });
      toast.success('Logged in successfully');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (_data, variables) => {
      // After successful registration, redirect to email confirmation page with email param
      navigate(`/email-confirmation?email=${encodeURIComponent(variables.email)}`, {
        replace: true,
      });
    },
  });

  const confirmEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.confirmEmail(token),
    onSuccess: () => {
      toast.success('Email confirmed successfully');
      navigate('/confirm-email/success', { replace: true });
    },
    onError: (e) => {
      console.log(e);
      navigate('/confirm-email/error', {
        replace: true,
        state: { error: e },
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('If an account exists with this email, you will receive a password reset link');
      navigate('/forgot-password/success', { replace: true });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successful');
      navigate('/login', { replace: true });
    },
  });

  const resendConfirmationMutation = useMutation({
    mutationFn: (email: string) => authApi.resendConfirmation(email),
    onSuccess: (_data, variables) => {
      navigate(`/email-confirmation?email=${encodeURIComponent(variables)}&resend=true`, {
        replace: true,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    },
  });

  const resetError = () => {
    loginMutation.reset();
    registerMutation.reset();
    confirmEmailMutation.reset();
    forgotPasswordMutation.reset();
    resetPasswordMutation.reset();
    resendConfirmationMutation.reset();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    confirmEmail: confirmEmailMutation.mutate,
    resendConfirmation: resendConfirmationMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      confirmEmailMutation.isPending ||
      resendConfirmationMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error ||
      registerMutation.error ||
      confirmEmailMutation.error ||
      resendConfirmationMutation.error ||
      forgotPasswordMutation.error ||
      resetPasswordMutation.error ||
      logoutMutation.error,
    resetError,
  };
};
