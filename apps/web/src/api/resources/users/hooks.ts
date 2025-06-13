import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { uploadAvatar, updateName } from './api';

import { useTranslation } from '@/i18n/hooks/useTranslation';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data);
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: updateName,
    onSuccess: (data, name) => {
      queryClient.setQueryData(['me'], data);
      toast.success(`${t('settings.user.displayName')}: ${name}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploading: uploadAvatarMutation.isPending,
    updateName: updateNameMutation.mutateAsync,
    isUpdatingName: updateNameMutation.isPending,
  };
};
