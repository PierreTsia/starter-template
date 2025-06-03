import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { mockApi } from './mockApi';

const ONE_HOUR = 1000 * 60 * 60;
const FIVE_MINUTES = 1000 * 60 * 5;

export const useLogin = () => {
  return useMutation({
    mutationFn: mockApi.auth.login,
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
    mutationFn: mockApi.auth.register,
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
    queryFn: () => mockApi.auth.me(token!),
    enabled: !!token,
    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  });
};
