import { describe, expect, it, beforeEach, vi } from 'vitest';

import { uploadAvatar, updateName } from '../api';

// Create hoisted mocks
const mocks = vi.hoisted(() => ({
  apiFetch: vi.fn(),
}));

// Mock the apiFetch function
vi.mock('@/api/client', () => ({
  apiFetch: mocks.apiFetch,
}));

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadAvatar', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      mocks.apiFetch.mockResolvedValueOnce({ data: mockResponse });

      const result = await uploadAvatar(mockFile);

      // Verify FormData was created correctly
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/avatar', {
        method: 'POST',
        body: expect.any(FormData),
      });

      // Verify the FormData contains the file
      const formData = (mocks.apiFetch.mock.calls[0][1] as { body: FormData }).body;
      expect(formData.get('file')).toStrictEqual(mockFile);

      // Verify response is returned correctly
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockError = new Error('Upload failed');
      mocks.apiFetch.mockRejectedValueOnce(mockError);

      await expect(uploadAvatar(mockFile)).rejects.toThrow('Upload failed');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/avatar', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });

    it('should handle invalid file types', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockError = new Error('Invalid file type');
      mocks.apiFetch.mockRejectedValueOnce(mockError);

      await expect(uploadAvatar(mockFile)).rejects.toThrow('Invalid file type');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/avatar', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });

    it('should handle file size limit', async () => {
      // Create a file larger than 5MB
      const mockFile = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      const mockError = new Error('File too large');
      mocks.apiFetch.mockRejectedValueOnce(mockError);

      await expect(uploadAvatar(mockFile)).rejects.toThrow('File too large');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/avatar', {
        method: 'POST',
        body: expect.any(FormData),
      });
    });
  });

  describe('updateName', () => {
    it('should call apiFetch with correct parameters', async () => {
      const mockName = 'New Name';
      const mockResponse = {
        id: '1',
        name: mockName,
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      mocks.apiFetch.mockResolvedValueOnce({ data: mockResponse });

      const result = await updateName(mockName);

      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: mockName }),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const mockName = 'New Name';
      const mockError = new Error('Update failed');
      mocks.apiFetch.mockRejectedValueOnce(mockError);

      await expect(updateName(mockName)).rejects.toThrow('Update failed');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: mockName }),
      });
    });

    it('should handle validation errors', async () => {
      const mockName = 'Invalid@Name!';
      const mockError = new Error('Invalid name format');
      mocks.apiFetch.mockRejectedValueOnce(mockError);

      await expect(updateName(mockName)).rejects.toThrow('Invalid name format');
      expect(mocks.apiFetch).toHaveBeenCalledWith('/api/v1/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: mockName }),
      });
    });
  });
});
