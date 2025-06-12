import { apiFetch } from '@/api/client';
import { User } from '@/types/auth';

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append('file', file, file.name);

  const response = await apiFetch<{ data: User }>('/api/v1/users/avatar', {
    method: 'POST',
    body: formData,
    headers: {},
  });

  return response.data;
};
