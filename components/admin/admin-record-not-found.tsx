'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminRecordNotFoundProps {
  title?: string;
  description?: string;
  backHref: string;
}

export function AdminRecordNotFound({
  title = 'Record not found',
  description = 'The record you are looking for does not exist.',
  backHref,
}: AdminRecordNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Link href={backHref}>
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </Link>
    </div>
  );
}
