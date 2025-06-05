import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { authApi } from '@/api/resources/auth/api';
import type { LoginFormData, RegisterDto } from '@/types/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      navigate(from, { replace: true });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      navigate(from, { replace: true });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('token');
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
