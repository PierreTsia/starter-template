import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PageProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  withPadding?: boolean;
}

export function Page({ children, className, containerClassName, withPadding = true }: PageProps) {
  return (
    <section className={cn('w-full', withPadding && 'py-32', className)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>{children}</div>
    </section>
  );
}
