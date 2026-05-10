'use client';

import { useForm } from 'react-hook-form';
import { setFormErrors } from '@/lib/api/query-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForgotPasswordRequestMutation } from '../hooks/use-forgot-password-request-mutation';
import { AuthAlert } from './auth-alert';

const requestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface ForgotPasswordRequestFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordRequestForm({ onSuccess }: ForgotPasswordRequestFormProps) {
  const requestMutation = useForgotPasswordRequestMutation();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    try {
      await requestMutation.mutateAsync(values);
      onSuccess(values.email);
    } catch (err) {
      setFormErrors(err, form.setError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter the email address associated with your account and we'll send you a 6-digit code to reset your password.
        </p>
      </div>

      {requestMutation.isError && (
        <AuthAlert 
          type="error"
          title="Request failed"
          message={requestMutation.error?.message || 'Something went wrong. Please try again.'}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-bold shadow-lg shadow-primary/10 mt-2" 
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              'Send Reset Code'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
