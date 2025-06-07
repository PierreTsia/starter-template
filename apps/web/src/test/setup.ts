import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();
  mockLocalStorage.clear.mockReset();
  mockLocalStorage.key.mockReset();
  (global.fetch as ReturnType<typeof vi.fn>).mockReset();
});
