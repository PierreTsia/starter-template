import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMe } from '@/api/resources/auth/hooks';
import { useUser } from '@/api/resources/users/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/hooks/useTranslation';

const profileSchema = z.object({
  displayName: z.string().min(2, 'validation.nameTooShort'),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type ProfileFormData = z.infer<typeof profileSchema>;

const UploadNewAvatar = ({
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

export const UserProfile = () => {
  const { t, formatDate } = useTranslation();
  const { data: me } = useMe();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: me?.name || '',
    },
  });

  const { isDirty, isSubmitting } = form.formState;

  const onSubmit = (data: ProfileFormData) => {
    // TODO: Wire up API call here
    toast.success(`${t('settings.user.displayName')}: ${data.displayName}`);
  };

  const initials = me?.name
    ?.split(' ')
    .map((name) => name[0])
    .join('');

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative group">
          <Avatar className="size-16">
            <AvatarImage src={me?.avatarUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <button
            data-testid="edit-avatar"
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsUploadOpen(true)}
          >
            <Pencil className="size-6 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-tight">{me?.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{me?.email}</p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            {t('profile.memberSince')}: {formatDate(me?.createdAt)}
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.user.displayName')}</FormLabel>
                <FormControl>
                  <Input type="text" placeholder={me?.name || 'John Doe'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>{t('settings.user.email')}</FormLabel>
            <FormControl>
              <Input type="email" value={me?.email || ''} disabled />
            </FormControl>
          </FormItem>

          <div className="flex justify-end h-10">
            {isDirty && (
              <Button disabled={isSubmitting} type="submit" className="mt-2">
                {t('common.save')}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <UploadNewAvatar open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  );
};
