import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestApp } from '@/test-utils';

// Mock the useMe hook to simulate user data
const mockUseMe = vi.fn();
const mockUseAuth = vi.fn();
const mockUploadAvatar = vi.fn();

vi.mock('@/api/resources/auth/hooks', () => ({
  useMe: () => mockUseMe(),
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/api/resources/users/hooks', () => ({
  useUser: () => ({
    uploadAvatar: mockUploadAvatar,
    isUploading: false,
  }),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    mockUseMe.mockReset();
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date().toISOString(),
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      isLoading: false,
    });
    mockUseAuth.mockReset();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
    });
    mockUploadAvatar.mockReset();
  });

  const renderComponent = () => {
    return render(<TestApp initialEntries={['/settings']} />);
  };

  it('renders the settings page with user profile information', () => {
    renderComponent();

    // Check if the page title and description are rendered
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Manage your account information and preferences')).toBeInTheDocument();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('has disabled email input and no save button initially', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeDisabled();

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });

  it('shows save button only after name is changed', () => {
    renderComponent();

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('renders the app settings section with language and theme options', () => {
    renderComponent();

    expect(screen.getByText('App Settings')).toBeInTheDocument();
    expect(screen.getByText('Customize your application experience')).toBeInTheDocument();

    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred language')).toBeInTheDocument();
    const languageSwitchers = screen.getAllByTestId('language-switcher');
    expect(languageSwitchers[0]).toHaveTextContent('English');

    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred theme')).toBeInTheDocument();
    const themeSelect = screen.getByTestId('theme-select');
    expect(themeSelect).toBeInTheDocument();
    expect(themeSelect).toHaveTextContent('Light');
  });

  describe('Avatar', () => {
    it('displays the current avatar and opens upload dialog', async () => {
      renderComponent();

      // Check avatar is displayed
      const avatar = screen.getByTestId('user-avatar');
      const editAvatar = screen.getByTestId('edit-avatar');
      expect(avatar).toBeInTheDocument();

      // Click the avatar to open dialog (the edit button is a hover overlay)
      fireEvent.click(editAvatar);

      // Check dialog is open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Upload New Avatar')).toBeInTheDocument();
    });

    it('handles file selection and upload', async () => {
      renderComponent();

      // Check avatar is displayed
      const editAvatar = screen.getByTestId('edit-avatar');

      // Click the avatar to open dialog (the edit button is a hover overlay)
      fireEvent.click(editAvatar);

      // Select file
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByTestId('avatar-input');
      fireEvent.change(input, { target: { files: [file] } });

      // Click upload button
      const uploadButton = screen.getByRole('button', { name: /upload avatar/i });
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(mockUploadAvatar).toHaveBeenCalledWith(file);
      });
    });

    it('not allow upload file larger than 5MB', async () => {
      renderComponent();

      // Check avatar is displayed
      const editAvatar = screen.getByTestId('edit-avatar');

      // Click the avatar to open dialog (the edit button is a hover overlay)
      fireEvent.click(editAvatar);

      // Select file
      const file = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByTestId('avatar-input');
      fireEvent.change(input, { target: { files: [file] } });

      // Click upload button
      const uploadButton = screen.getByRole('button', { name: /upload avatar/i });
      fireEvent.click(uploadButton);

      // Try to upload file that's too large
      expect(uploadButton).toBeDisabled();
      expect(mockUploadAvatar).not.toHaveBeenCalled();
    });
  });
});
