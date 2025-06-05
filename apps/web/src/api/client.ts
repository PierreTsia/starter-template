const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include', // Enable sending cookies
  });
  if (!res.ok) {
    let errorMsg = 'Unknown error';
    try {
      const error = await res.json();
      if (error.errors && Array.isArray(error.errors)) {
        // Join all error messages with a line break or comma
        errorMsg = error.errors.join('\n');
      } else if (error.message) {
        errorMsg = error.message;
      }
    } catch (e) {
      console.error(e);
      // If response is not JSON or parsing fails, keep default errorMsg
    }
    throw new Error(errorMsg);
  }
  return res.json();
}
