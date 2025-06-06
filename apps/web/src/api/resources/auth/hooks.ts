import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { authApi } from '@/api/resources/auth/api';
import { env } from '@/lib/env';
import type { LoginFormData, RegisterDto } from '@/types/auth';

const ONE_HOUR = 1000 * 60 * 60;
const FIVE_MINUTES = 1000 * 60 * 5;

const AUTH_TOKEN_KEY = env.VITE_AUTH_TOKEN_KEY;
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
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data) => {
      if (data?.accessToken && data?.refreshToken) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      navigate(from, { replace: true });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      queryClient.removeQueries({ queryKey: ['me'] });
      navigate('/login', { replace: true });
    },
  });

  const resetError = () => {
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || registerMutation.error || logoutMutation.error,
    resetError,
  };
};
