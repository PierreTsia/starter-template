import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AppLogo = () => {
  return (
    <Link to="/" className="text-lg font-semibold tracking-tight flex items-center gap-2">
      <Home className="w-5 h-5" />
      StarterKit
    </Link>
  );
};
