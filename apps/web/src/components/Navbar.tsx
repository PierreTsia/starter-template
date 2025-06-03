import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Navbar = () => (
  <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-background h-[var(--navbar-height)]">
    <div className="flex items-center gap-4">
      <Link to="/" className="text-lg font-semibold tracking-tight">
        MyApp
      </Link>
      <span className="text-muted-foreground">|</span>
      <Link to="/buggy" className="text-sm text-muted-foreground hover:text-foreground">
        Buggy Counter
      </Link>
      <span className="text-muted-foreground">|</span>
      <Link to="/tanstack-demo" className="text-sm text-muted-foreground hover:text-foreground">
        TanStack Demo
      </Link>
    </div>
    <Link to="/settings">
      <Button variant="outline">Settings</Button>
    </Link>
  </nav>
);
