import { apiFetch } from '@/api/client';
import type { User } from '@/types/auth';

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiFetch<{ data: User }>('/api/v1/users/avatar', {
    method: 'POST',
    body: formData,
  });

  return data;
};
