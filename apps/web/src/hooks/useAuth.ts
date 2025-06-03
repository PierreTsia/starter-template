import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { mockApi } from '@/api/mockApi';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => mockApi.auth.login(data),
    onSuccess: (data) => {
      // TODO: Store token in secure storage
      localStorage.setItem('token', data.token);
      navigate(from, { replace: true });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => mockApi.auth.register(data),
    onSuccess: (data) => {
      // TODO: Store token in secure storage
      localStorage.setItem('token', data.token);
      navigate(from, { replace: true });
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    queryClient.removeQueries({ queryKey: ['me'] });
    navigate('/login', { replace: true });
  };

  const resetError = () => {
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
    resetError,
  };
};
