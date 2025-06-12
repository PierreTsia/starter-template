import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadAvatar } from './api';

export const useUser = () => {
  const queryClient = useQueryClient();

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      // Update the user data in the cache
      queryClient.setQueryData(['me'], data);
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutate,
  };
};
