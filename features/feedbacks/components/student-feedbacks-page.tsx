'use client';

import { useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PageContainer, SectionHeader, ListState } from '@/components/shared';
import { useStudentFeedbacksQuery } from '../hooks/use-student-feedbacks-query';
import { ReviewList } from './review-list';
import { Pagination } from '@/components/shared/pagination';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteFeedbackMutation } from '../hooks/use-delete-feedback-mutation';
import { EditFeedbackModal } from './edit-feedback-modal';
import { Feedback } from '../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function StudentFeedbacksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const page = searchParams.get('page') || '1';
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useStudentFeedbacksQuery({
    page: Number(page),
    limit,
    studentId: user?.id,
  });

  const feedbacks = data?.items || [];
  const total = data?.meta?.pagination?.total || 0;

  const [feedbackToEdit, setFeedbackToEdit] = useState<Feedback | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);

  const { mutate: deleteFeedback, isPending: isDeleting } = useDeleteFeedbackMutation();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleConfirmDelete = () => {
    if (feedbackToDelete) {
      deleteFeedback(feedbackToDelete.feedbackId, {
        onSuccess: () => {
          setFeedbackToDelete(null);
        },
      });
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="My Feedbacks"
        description="Review the feedback you've provided for your tutors."
      />

      <ListState
        isLoading={isLoading}
        error={error as Error}
        isEmpty={feedbacks.length === 0}
        emptyTitle="No feedbacks yet"
        emptyDescription="You haven't submitted any feedbacks for your sessions yet."
        onRetry={() => refetch()}
      >
        <ReviewList
          reviews={feedbacks}
          showParticipant={false}
          onEdit={setFeedbackToEdit}
          onDelete={setFeedbackToDelete}
        />

        <Pagination
          currentPage={Number(page)}
          totalPages={Math.ceil(total / limit)}
          onPageChange={handlePageChange}
        />
      </ListState>

      <EditFeedbackModal
        isOpen={!!feedbackToEdit}
        onClose={() => setFeedbackToEdit(null)}
        feedback={feedbackToEdit}
      />

      <AlertDialog open={!!feedbackToDelete} onOpenChange={(open) => !open && setFeedbackToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}
