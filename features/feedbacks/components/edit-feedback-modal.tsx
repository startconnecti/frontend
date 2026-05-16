'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useEditFeedbackMutation } from '../hooks/use-edit-feedback-mutation';
import { Loader2, Star } from 'lucide-react';
import { Feedback } from '../types';

interface EditFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: Feedback | null;
}

export function EditFeedbackModal({
  isOpen,
  onClose,
  feedback,
}: EditFeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { mutate: editFeedback, isPending } = useEditFeedbackMutation();

  useEffect(() => {
    if (feedback) {
      setRating(feedback.rating);
      setComment(feedback.comment || '');
    }
  }, [feedback]);

  const handleConfirm = () => {
    if (!feedback) return;
    editFeedback(
      { id: feedback.feedbackId, payload: { rating, comment } },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Feedback</DialogTitle>
          <DialogDescription>
            Update your feedback for this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comment
            </label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike? How can the tutor improve?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-24"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
