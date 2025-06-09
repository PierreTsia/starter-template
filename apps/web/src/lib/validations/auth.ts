import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'validation.passwordTooShort')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'validation.passwordRequirements'
  );

export const loginSchema = z.object({
  email: z.string().email('validation.invalidEmail'),
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'validation.nameTooShort'),
    email: z.string().email('validation.invalidEmail'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordsDontMatch',
    path: ['confirmPassword'],
  });
