import { z } from 'zod';

import { UserSchema, LoginSchema, RegisterSchema } from '@/api/mockApi';
import { loginSchema, registerSchema } from '@/lib/validations/auth';

export type User = z.infer<typeof UserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterDto = Omit<RegisterFormData, 'confirmPassword'>;
