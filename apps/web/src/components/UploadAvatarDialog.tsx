import { useState } from 'react';
import { toast } from 'sonner';

import { useMe } from '@/api/resources/auth/hooks';
import { useUser } from '@/api/resources/users/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const UploadAvatarDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { uploadAvatar, isUploading } = useUser();
  const { refetch: refetchMe } = useMe();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (5MB)
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error(t('profile.avatar.upload.error.tooLarge'));
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadAvatar(file);
      toast.success(t('profile.avatar.upload.success'));
      await refetchMe(); // Refetch user data to update avatar
      onOpenChange(false); // Close modal only on success
    } catch (error) {
      console.error(error);
      toast.error(t('profile.avatar.upload.error.failed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('profile.avatar.upload.title')}</DialogTitle>
          <DialogDescription>{t('profile.avatar.upload.description')}</DialogDescription>
        </DialogHeader>
        <div className="py-4 w-full">
          <div className="grid w-full items-center gap-4">
            {preview && (
              <div className="flex justify-center">
                <Avatar className="size-32" data-testid="user-avatar">
                  <AvatarImage src={preview} />
                  <AvatarFallback>{t('profile.avatar.upload.preview')}</AvatarFallback>
                </Avatar>
              </div>
            )}
            <Input
              id="avatar"
              type="file"
              data-testid="avatar-input"
              accept="image/jpeg,image/png,image/gif"
              className="cursor-pointer w-full"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-sm text-muted-foreground w-full">
              {t('profile.avatar.upload.supportedFormats')}
            </p>
            <p className="text-sm text-muted-foreground w-full">
              {t('profile.avatar.upload.maxSize')}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
            {isUploading ? t('profile.avatar.upload.uploading') : t('profile.avatar.upload.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
