'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeftIcon, 
  FlagIcon, 
  ArchiveIcon, 
  Trash2Icon, 
  ShieldAlertIcon,
  UserIcon,
  CalendarIcon,
  PaperclipIcon
} from 'lucide-react';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'tutor';
  content: string;
  createdAt: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 't2',
    senderName: 'Prof. Miller',
    senderRole: 'tutor',
    content: 'Hello Alice, I noticed you requested a reschedule for tomorrow.',
    createdAt: '2024-05-12T08:30:00Z'
  },
  {
    id: '2',
    senderId: 's2',
    senderName: 'Alice Wong',
    senderRole: 'student',
    content: 'Yes, Professor. I have an unexpected medical appointment tomorrow afternoon.',
    createdAt: '2024-05-12T08:45:00Z'
  },
  {
    id: '3',
    senderId: 't2',
    senderName: 'Prof. Miller',
    senderRole: 'tutor',
    content: 'I understand. What time would work best for you on Wednesday instead?',
    createdAt: '2024-05-12T09:00:00Z'
  },
  {
    id: '4',
    senderId: 's2',
    senderName: 'Alice Wong',
    senderRole: 'student',
    content: 'Would 2:00 PM work for you? I have also attached my medical note if needed.',
    createdAt: '2024-05-12T09:15:00Z',
    attachments: [
      { name: 'medical_note_2024.pdf', url: '#', size: '1.2 MB' }
    ]
  }
];

export default function ConversationDetailPage() {
  const { id } = useParams();
  const [isFlagged, setIsFlagged] = useState(true);

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href={ADMIN_ROUTES.CONVERSATIONS}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Conversations
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title="Conversation Moderation"
        description={`Monitoring session between student and tutor (ID: ${id})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-[10px]">AW</AvatarFallback>
                  </Avatar>
                  <Avatar className="border-2 border-background h-8 w-8">
                    <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">PM</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-sm">
                  <span className="font-bold">Alice Wong</span> 
                  <span className="mx-2 text-muted-foreground">and</span>
                  <span className="font-bold">Prof. Miller</span>
                </div>
              </div>
              <Badge variant={isFlagged ? 'destructive' : 'outline'} className="gap-1">
                {isFlagged && <ShieldAlertIcon className="h-3 w-3" />}
                {isFlagged ? 'Flagged for Review' : 'Healthy'}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {MOCK_MESSAGES.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${msg.senderRole === 'tutor' ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-bold">{msg.senderName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div 
                      className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                        msg.senderRole === 'tutor' 
                          ? 'bg-muted rounded-tl-none' 
                          : 'bg-primary text-primary-foreground rounded-tr-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.attachments && (
                      <div className="mt-2 flex gap-2">
                        {msg.attachments.map((file) => (
                          <div 
                            key={file.name} 
                            className="flex items-center gap-2 p-2 border rounded-lg bg-card text-xs"
                          >
                            <PaperclipIcon className="h-3 w-3" />
                            <span>{file.name}</span>
                            <span className="text-muted-foreground">({file.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/10 text-center">
              <p className="text-xs text-muted-foreground">
                Administrative View. You are monitoring this conversation. Messages are read-only.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Participants
            </h3>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold leading-none">Alice Wong</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Student</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                  <Link href={`${ADMIN_ROUTES.USERS}/s2`}>View Profile</Link>
                </Button>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">PM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold leading-none">Prof. Miller</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Tutor</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full h-7 text-[10px]" asChild>
                  <Link href={`${ADMIN_ROUTES.TUTORS}/t2`}>View Profile</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-amber-200 bg-amber-50/30">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-900">
              <ShieldAlertIcon className="h-4 w-4" />
              Moderation Actions
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-9 text-amber-700 border-amber-200"
                onClick={() => setIsFlagged(!isFlagged)}
              >
                <FlagIcon className="h-4 w-4" />
                {isFlagged ? 'Clear Flag' : 'Flag Conversation'}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-9">
                <ArchiveIcon className="h-4 w-4" />
                Archive Conversation
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-9 text-destructive border-destructive/20">
                <Trash2Icon className="h-4 w-4" />
                Close & Purge
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 italic">
              * Actions are logged in the admin audit trail.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Linked Booking
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono font-medium">B-9921</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="outline" className="h-5 text-[10px]">Confirmed</Badge>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs underline" asChild>
                <Link href={`${ADMIN_ROUTES.BOOKINGS}/B-9921`}>View Booking Details</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
