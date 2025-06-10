import { isApiError } from './errors';
import { authApi } from './resources/auth/api';

import { getCurrentLocale } from '@/i18n/languageDetector';

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
const REFRESH_TOKEN_KEY = 'refreshToken';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshComplete = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const accessToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const locale = getCurrentLocale();

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  };
  const customHeaders = options?.headers
    ? Object.fromEntries(Object.entries(options.headers).map(([k, v]) => [k, String(v)]))
    : {};
  const headers: Record<string, string> = { ...baseHeaders, ...customHeaders };

  // Only add access token if it's not a logout request and we have a token
  if (accessToken && !endpoint.includes('/auth/logout')) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Skip token refresh for logout and refresh endpoints to prevent infinite recursion
    if (
      res.status === 401 &&
      refreshToken &&
      !isRefreshing &&
      !endpoint.includes('/auth/logout') &&
      !endpoint.includes('/auth/refresh')
    ) {
      isRefreshing = true;

      try {
        const newAccessToken = await authApi.refreshToken();
        // Retry the original request with the new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        const retryRes = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!retryRes.ok) {
          throw new Error('Failed to retry request after token refresh');
        }

        isRefreshing = false;
        onRefreshComplete(newAccessToken);
        return retryRes.json();
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        console.error(e);
        throw new Error('Unknown error');
      }

      // If we have a proper API error structure, throw it as is
      if (isApiError(errorData)) {
        throw errorData;
      }

      // Otherwise, format the error message
      let errorMsg = 'Unknown error';
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorMsg = errorData.errors.join('\n');
      } else if (errorData.message) {
        errorMsg = errorData.message;
      }
      throw new Error(errorMsg);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
}
