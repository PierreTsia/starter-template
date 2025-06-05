import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from './authApi';

const ONE_HOUR = 1000 * 60 * 60;
const FIVE_MINUTES = 1000 * 60 * 5;

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast.success('Successfully logged in!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast.success('Successfully registered!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
    },
  });
};

export const useMe = () => {
  const token = localStorage.getItem('token');
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    enabled: !!token,
    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  });
};
