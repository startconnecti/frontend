import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-b last:border-0">
      <div className="space-y-1">
        <h3 className="font-bold text-lg">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="md:col-span-2 space-y-4">
        {children}
      </div>
    </div>
  );
}
