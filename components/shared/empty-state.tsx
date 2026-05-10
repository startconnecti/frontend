import { ReactNode } from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/40 p-16 text-center bg-muted/5">
      <div className="mb-6 h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground shadow-inner">
        {icon || <FileQuestion className="h-10 w-10" />}
      </div>
      <h3 className="text-2xl font-black text-brand-dark">{title}</h3>
      <p className="mt-3 mb-8 text-muted-foreground font-medium max-w-sm leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="font-bold px-8 rounded-xl">{action.label}</Button>
      )}
    </div>
  );
}
