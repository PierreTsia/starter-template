import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  centered?: boolean;
}

export function PageTitle({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  centered = false,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        'mb-14 grid gap-5',
        centered ? 'text-center' : 'md:grid-cols-2 md:text-left',
        className
      )}
    >
      <h1 className={cn('text-5xl font-semibold', titleClassName)}>{title}</h1>
      {description && (
        <p className={cn('text-muted-foreground', descriptionClassName)}>{description}</p>
      )}
    </div>
  );
}
