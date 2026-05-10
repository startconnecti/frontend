import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Error', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-rose-100 rounded-3xl bg-rose-50/30">
      <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-6 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-black text-rose-900 mb-2">{title}</h3>
      <p className="text-rose-800/80 font-medium max-w-sm mb-8">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2 font-bold px-8 rounded-xl border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
