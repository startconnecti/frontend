'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { mockConversations, mockMessages } from '@/lib/admin/mock-data';

export default function ConversationDetailPage({ params }: { params: { id: string } }) {
  const conversation = mockConversations.find(c => c.id === params.id);
  const messages = mockMessages.filter(m => m.conversationId === params.id);
  const [adminNote, setAdminNote] = useState('');

  if (!conversation) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/conversations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conversation {conversation.id}</h1>
          <p className="text-sm text-muted-foreground">
            {conversation.participants.map(p => p.name).join(' & ')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Messages</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map(msg => (
                <div key={msg.id} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">{msg.senderName}</span>
                    <span className="text-xs text-muted-foreground">{msg.senderRole}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{msg.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{conversation.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="font-medium">{new Date(conversation.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Activity</p>
                <p className="font-medium">{new Date(conversation.lastActivityAt).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          {/* Admin Actions */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Admin Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full text-sm">
                Close Conversation
              </Button>
              <Button variant="outline" className="w-full text-sm">
                Archive
              </Button>
              <Button variant="outline" className="w-full text-sm">
                Mark as Reviewed
              </Button>
            </div>
          </Card>

          {/* Admin Note */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Admin Note</h2>
            <Textarea
              placeholder="Add internal notes about this conversation..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={4}
            />
            <Button className="w-full mt-2" size="sm">
              Save Note
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
