import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'settings.auth.password.validation.required'),
    newPassword: z.string().min(8, 'settings.auth.password.validation.minLength'),
    confirmPassword: z.string().min(1, 'settings.auth.password.validation.confirmRequired'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'settings.auth.password.validation.mismatch',
    path: ['confirmPassword'],
  });

type PasswordUpdateFormData = z.infer<typeof passwordUpdateSchema>;

export const AuthSettings = () => {
  const { t } = useTranslation();
  const form = useForm<PasswordUpdateFormData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { isDirty, isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: PasswordUpdateFormData) => {
    // TODO: Implement password update
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.auth.password.current')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.auth.password.new')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('settings.auth.password.confirm')}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end h-10">
            {isDirty && (
              <Button disabled={isSubmitting || !isValid} type="submit" className="mt-2">
                {t('settings.auth.password.update')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
