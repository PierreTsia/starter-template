import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const resendConfirmationSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
});

type ResendConfirmationFormData = z.infer<typeof resendConfirmationSchema>;

interface ResendConfirmationEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export const ResendConfirmationEmailDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: ResendConfirmationEmailDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<ResendConfirmationFormData>({
    resolver: zodResolver(resendConfirmationSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = (data: ResendConfirmationFormData) => {
    onSubmit(data.email);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('auth.confirmEmail.resend.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isLoading}
            >
              {form.formState.isSubmitting || isLoading
                ? t('common.loading')
                : t('auth.confirmEmail.resend.submit')}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
