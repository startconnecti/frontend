'use client';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Settings2 } from 'lucide-react';
import { useAdminSystemConfigsQuery } from '../hooks/use-admin-system-configs';
import { groupConfigsByCategory, categoryLabel } from '../utils/config-helpers';
import { ConfigRow } from './config-row';
import type { SystemConfigCategory } from '../types';

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ConfigsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center justify-between py-4 border-b border-border/40 last:border-0">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ConfigsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card className="p-10 flex flex-col items-center justify-center text-center space-y-4 border-rose-100 bg-rose-50">
      <AlertCircle className="h-10 w-10 text-rose-500" />
      <div className="space-y-1">
        <h3 className="font-bold text-rose-900">Failed to load system settings</h3>
        <p className="text-sm text-rose-700">{message}</p>
      </div>
      <Button
        variant="outline"
        onClick={onRetry}
        className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-100 bg-white"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </Card>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function ConfigsEmpty() {
  return (
    <Card className="p-16 flex flex-col items-center justify-center text-center border-dashed">
      <div className="h-16 w-16 rounded-full bg-muted/10 flex items-center justify-center mb-4">
        <Settings2 className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-bold text-foreground">No settings found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        The backend hasn't registered any system configurations yet.
      </p>
    </Card>
  );
}

// ─── Category section ─────────────────────────────────────────────────────────

function CategorySection({ category, children }: { category: SystemConfigCategory; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 bg-muted/5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {categoryLabel(category)}
        </h3>
      </div>
      <div className="px-6">
        {children}
      </div>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SystemConfigsPage() {
  const { data, isLoading, isError, error, refetch } = useAdminSystemConfigsQuery();

  const grouped = data ? groupConfigsByCategory(data.items) : null;
  const isEmpty = grouped !== null && grouped.size === 0;

  return (
    <>
      <AdminPageHeader
        title="System Settings"
        description="View and update platform-wide configuration values. Changes take effect immediately."
      />

      <div className="space-y-6">
        {isLoading && <ConfigsSkeleton />}

        {isError && (
          <ConfigsError
            message={error?.message ?? 'An unexpected error occurred.'}
            onRetry={() => refetch()}
          />
        )}

        {isEmpty && <ConfigsEmpty />}

        {grouped && !isEmpty && (
          Array.from(grouped.entries()).map(([category, configs]) => (
            <CategorySection key={category} category={category}>
              {configs.map((config) => (
                <ConfigRow key={config.key} config={config} />
              ))}
            </CategorySection>
          ))
        )}
      </div>
    </>
  );
}
