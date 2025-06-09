import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMe } from '@/api/resources/auth/hooks';
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

const profileSchema = z.object({
  displayName: z.string().min(2, 'validation.nameTooShort'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfile = () => {
  const { t, formatDate } = useTranslation();
  const { data: me } = useMe();

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
        <Avatar className="size-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
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
    </div>
  );
};
