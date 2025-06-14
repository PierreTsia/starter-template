import { zodResolver } from '@hookform/resolvers/zod';
import { QueryObserverResult } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUser } from '@/api/resources/users/hooks';
import { UploadAvatarDialog } from '@/components/UploadAvatarDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { User } from '@/types/auth';

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'validation.nameTooShort')
    .max(50, 'validation.nameTooLong')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'validation.nameInvalidFormat'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type Props = { me: User; refetchMe: () => Promise<QueryObserverResult<User, Error>> };

export const UserProfile = ({ me, refetchMe }: Props) => {
  const { t, formatDate } = useTranslation();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { updateName, isUpdatingName } = useUser();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: me?.name || '',
    },
  });

  const { isDirty, isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: ProfileFormData) => {
    await updateName(data.displayName);
    await refetchMe();
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
              <Button
                disabled={isSubmitting || isUpdatingName || !isValid}
                type="submit"
                className="mt-2"
              >
                {t('common.save')}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <UploadAvatarDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
    </div>
  );
};
