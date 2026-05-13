'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  SearchIcon, 
  MessageSquareIcon, 
  MoreVerticalIcon, 
  EyeIcon, 
  ArchiveIcon, 
  Trash2Icon,
  FilterIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/constants/admin-routes';

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'student' | 'tutor';
  }[];
  latestMessage: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: number;
  status: 'active' | 'archived' | 'flagged';
  lastActivityAt: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    participants: [
      { id: 's1', name: 'John Doe', role: 'student' },
      { id: 't1', name: 'Dr. Smith', role: 'tutor' }
    ],
    latestMessage: {
      content: 'Thank you for the session today. It was very helpful!',
      senderId: 's1',
      createdAt: '2024-05-12T10:30:00Z'
    },
    unreadCount: 0,
    status: 'active',
    lastActivityAt: '2024-05-12T10:30:00Z'
  },
  {
    id: '2',
    participants: [
      { id: 's2', name: 'Alice Wong', role: 'student' },
      { id: 't2', name: 'Prof. Miller', role: 'tutor' }
    ],
    latestMessage: {
      content: 'Can we reschedule our session to tomorrow?',
      senderId: 's2',
      createdAt: '2024-05-12T09:15:00Z'
    },
    unreadCount: 2,
    status: 'flagged',
    lastActivityAt: '2024-05-12T09:15:00Z'
  },
  {
    id: '3',
    participants: [
      { id: 's3', name: 'Bob Johnson', role: 'student' },
      { id: 't3', name: 'Sarah Wilson', role: 'tutor' }
    ],
    latestMessage: {
      content: 'I have shared the meeting link in the booking details.',
      senderId: 't3',
      createdAt: '2024-05-11T16:45:00Z'
    },
    unreadCount: 0,
    status: 'active',
    lastActivityAt: '2024-05-11T16:45:00Z'
  },
  {
    id: '4',
    participants: [
      { id: 's4', name: 'Emily Davis', role: 'student' },
      { id: 't4', name: 'Michael Brown', role: 'tutor' }
    ],
    latestMessage: {
      content: 'Payment has been confirmed for the next 5 sessions.',
      senderId: 's4',
      createdAt: '2024-05-10T11:20:00Z'
    },
    unreadCount: 0,
    status: 'archived',
    lastActivityAt: '2024-05-10T11:20:00Z'
  }
];

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <AdminPageHeader
        title="Manage Conversations"
        description="Monitor user interactions and moderate conversations."
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
          <div className="relative w-full sm:max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search participants..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button>
            <Badge variant="outline">{MOCK_CONVERSATIONS.length} Conversations</Badge>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participants</TableHead>
                <TableHead className="hidden md:table-cell">Latest Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CONVERSATIONS.map((conv) => (
                <TableRow key={conv.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="font-bold flex items-center gap-2">
                        {conv.participants[0].name} 
                        <span className="text-muted-foreground text-xs font-normal">and</span>
                        {conv.participants[1].name}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                          {conv.participants[0].role}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                          {conv.participants[1].role}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[300px]">
                    <div className="text-sm truncate">
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 mr-2">
                          {conv.unreadCount}
                        </span>
                      )}
                      <span className={conv.unreadCount > 0 ? 'font-bold' : 'text-muted-foreground'}>
                        {conv.latestMessage.content}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        conv.status === 'flagged' ? 'destructive' : 
                        conv.status === 'archived' ? 'outline' : 'default'
                      }
                      className="capitalize"
                    >
                      {conv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(conv.lastActivityAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`${ADMIN_ROUTES.CONVERSATIONS}/${conv.id}`} className="flex items-center gap-2 cursor-pointer">
                            <EyeIcon className="h-4 w-4" />
                            View Conversation
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-amber-600 focus:text-amber-600">
                          <ArchiveIcon className="h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                          <Trash2Icon className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  );
}
