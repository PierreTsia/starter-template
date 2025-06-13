import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi, expect, it, beforeEach, Mock } from 'vitest';

import { uploadAvatar, updateName } from '../api';
import { useUser } from '../hooks';

// Mock the API
vi.mock('../api', () => ({
  uploadAvatar: vi.fn(),
  updateName: vi.fn(),
}));

// Mock the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </MemoryRouter>
);

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('uploadAvatar', () => {
    it('should upload avatar and update cache on success', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      (uploadAvatar as Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await result.current.uploadAvatar(mockFile);
      });

      // Verify API was called with correct file
      expect(uploadAvatar).toHaveBeenCalledWith(mockFile);

      // Verify cache was updated
      const cachedData = queryClient.getQueryData(['me']);
      expect(cachedData).toEqual(mockResponse);
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockError = new Error('Upload failed');

      (uploadAvatar as Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await expect(result.current.uploadAvatar(mockFile)).rejects.toThrow('Upload failed');
      });

      // Verify API was called
      expect(uploadAvatar).toHaveBeenCalledWith(mockFile);

      // Verify cache was not updated
      const cachedData = queryClient.getQueryData(['me']);
      expect(cachedData).toBeUndefined();
    });
  });

  describe('updateName', () => {
    it('should update name and update cache on success', async () => {
      const mockName = 'New Name';
      const mockResponse = {
        id: '1',
        name: mockName,
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      (updateName as Mock).mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await result.current.updateName(mockName);
      });

      // Verify API was called with correct name
      expect(updateName).toHaveBeenCalledWith(mockName);

      // Verify cache was updated
      const cachedData = queryClient.getQueryData(['me']);
      expect(cachedData).toEqual(mockResponse);
    });

    it('should handle update error', async () => {
      const mockName = 'New Name';
      const mockError = new Error('Update failed');

      (updateName as Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await expect(result.current.updateName(mockName)).rejects.toThrow('Update failed');
      });

      // Verify API was called
      expect(updateName).toHaveBeenCalledWith(mockName);

      // Verify cache was not updated
      const cachedData = queryClient.getQueryData(['me']);
      expect(cachedData).toBeUndefined();
    });

    it('should handle validation error', async () => {
      const mockName = 'Invalid@Name!';
      const mockError = new Error('Invalid name format');

      (updateName as Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useUser(), { wrapper });

      await act(async () => {
        await expect(result.current.updateName(mockName)).rejects.toThrow('Invalid name format');
      });

      // Verify API was called
      expect(updateName).toHaveBeenCalledWith(mockName);

      // Verify cache was not updated
      const cachedData = queryClient.getQueryData(['me']);
      expect(cachedData).toBeUndefined();
    });
  });
});
