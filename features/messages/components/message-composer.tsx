'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageComposerProps {
  onSend: (content: string) => void;
  isSending: boolean;
}

export function MessageComposer({ onSend, isSending }: MessageComposerProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!content.trim() || isSending) return;
    onSend(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-background border-t border-border/40 flex items-end gap-3">
      <Textarea
        placeholder="Type a message..."
        className="min-h-[44px] max-h-32 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20 resize-none font-medium text-sm"
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button 
        size="icon" 
        className="h-11 w-11 shrink-0 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95"
        onClick={handleSend}
        disabled={!content.trim() || isSending}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
