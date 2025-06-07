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
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
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

    // Skip token refresh for logout endpoint
    if (res.status === 401 && refreshToken && !isRefreshing && !endpoint.includes('/auth/logout')) {
      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (!refreshRes.ok) {
          throw new Error('Failed to refresh token');
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await refreshRes.json();
        localStorage.setItem(AUTH_TOKEN_KEY, newAccessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

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
        // Clear tokens on refresh failure
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        throw error;
      }
    }

    if (!res.ok) {
      let errorMsg = 'Unknown error';
      try {
        const error = await res.json();
        if (error.errors && Array.isArray(error.errors)) {
          errorMsg = error.errors.join('\n');
        } else if (error.message) {
          errorMsg = error.message;
        }
      } catch (e) {
        console.error(e);
      }
      throw new Error(errorMsg);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to refresh token') {
      // Clear tokens on refresh failure
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    throw error;
  }
}
