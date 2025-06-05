import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from '@/api/resources/auth/api';

const ONE_HOUR = 1000 * 60 * 60;
const FIVE_MINUTES = 1000 * 60 * 5;

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
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
    onSuccess: () => {
      toast.success('Successfully registered!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    staleTime: FIVE_MINUTES,
    gcTime: ONE_HOUR,
  });
};
