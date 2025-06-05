import { vi } from 'vitest';

export const mockUseMe = vi.fn();
export const mockUseAuth = vi.fn();

vi.mock('@/api/resources/auth/hooks', () => ({
  useAuth: mockUseAuth,
  useMe: () => mockUseMe(),
}));
