'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backButton?: ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  children?: ReactNode;
}

export function AdminPageHeader({ title, description, backButton, action, children }: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-4 flex-1">
        {backButton}
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
        {action && (
          action.href ? (
            <Link href={action.href}>
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={action.onClick}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              {action.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
