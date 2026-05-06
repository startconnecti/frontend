'use client';

import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface AdminTableActionsProps {
  resourceId: string;
  basePath: string;
  onDelete: (id: string) => void;
  hideEdit?: boolean;
}

export function AdminTableActions({ resourceId, basePath, onDelete, hideEdit = false }: AdminTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`${basePath}/${resourceId}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Detail
          </Link>
        </DropdownMenuItem>
        {!hideEdit && (
          <DropdownMenuItem asChild>
            <Link href={`${basePath}/${resourceId}/edit`} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => onDelete(resourceId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
