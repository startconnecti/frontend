'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, LayoutDashboard, History } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { PageContainer } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackForm } from './feedback-form';
import { useCreateFeedbackMutation } from '../hooks/use-create-feedback-mutation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function CreateFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const [isSuccess, setIsSuccess] = useState(false);
  const mutation = useCreateFeedbackMutation();

  const handleFeedbackSubmit = (values: { rating: number; comment?: string }) => {
    mutation.mutate({
      sessionId,
      ...values,
    }, {
      onSuccess: () => setIsSuccess(true),
    });
  };

  if (isSuccess) {
    return (
      <PageContainer className="py-20 flex items-center justify-center">
        <Card className="max-w-md w-full border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
          <CardContent className="p-12 text-center space-y-8">
            <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black" style={{ color: '#2C1208' }}>Thank You!</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Your feedback helps our tutors improve and assists other students in finding the right match.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <Button asChild className="h-12 rounded-2xl font-bold gap-2">
                <Link href={`${ROUTES.STUDENT.SESSIONS}/${sessionId}`}>
                  <History className="h-4 w-4" />
                  Back to Session Detail
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 rounded-2xl font-bold gap-2">
                <Link href={ROUTES.STUDENT.DASHBOARD}>
                  <LayoutDashboard className="h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <h2 className="text-2xl font-black" style={{ color: '#2C1208' }}>Submit Session Feedback</h2>
          <p className="text-sm text-muted-foreground font-medium italic">Feedback is available after completed sessions.</p>
        </div>
      </div>

      <Card className="border-border/60 shadow-xl bg-white rounded-3xl overflow-hidden">
        <div className="p-6 bg-muted/10 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Session Reference</p>
              <p className="text-sm font-bold">{sessionId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Subject</p>
              <p className="text-sm font-bold">Physics • Session #1</p>
            </div>
          </div>
        </div>
        <CardContent className="p-8">
          <FeedbackForm 
            onSubmit={handleFeedbackSubmit} 
            isSubmitting={mutation.isPending} 
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
