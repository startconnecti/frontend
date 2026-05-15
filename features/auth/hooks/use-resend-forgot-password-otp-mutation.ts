'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth-service';
import { ResendOtpByEmailRequest } from '../types';
import { toast } from 'sonner';

export function useResendForgotPasswordOtpMutation() {
  return useMutation({
    mutationFn: (request: ResendOtpByEmailRequest) => authService.resendForgotPasswordOtp(request),
    onSuccess: (data) => {
      toast.success(data.message || 'Reset code resent', {
        description: 'Please check your email for the new reset code.',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to resend code', {
        description: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
}
