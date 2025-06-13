import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const error = params.get('error');
    const provider = params.get('provider');

    if (error) {
      // Optionally show a toast or error UI
      toast.error(decodeURIComponent(error));
      navigate('/login');
      return;
    }

    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (provider) localStorage.setItem('provider', provider);

      // Clean up the URL (optional)
      window.history.replaceState({}, document.title, '/');

      // Redirect to dashboard or home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Authenticating with Google...</h2>
      <p>Please wait, you will be redirected shortly.</p>
    </div>
  );
};
