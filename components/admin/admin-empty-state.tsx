'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import Link from 'next/link';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: AdminEmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actionLabel && actionHref && (
        <EmptyContent>
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}
