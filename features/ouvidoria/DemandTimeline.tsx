'use client';

import { useMemo } from 'react';
import ChatTimeline from '@/components/ChatTimeline';
import type { ChatTimelineAdapter } from '@/components/ChatTimeline';
import {
  listenToDemandMessages,
  createDemandMessage,
  markDemandReadByCitizen,
  markDemandReadByStaff,
} from '@/services/demands.service';
import { isDemandClosed } from '@/lib/constants/protocols';
import type { Demand, DemandMessageAuthorRole } from '@/types';

interface DemandTimelineProps {
  demand: Demand;
  compact?: boolean;
  allowCitizenReply?: boolean;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: string;
  autoScroll?: boolean;
}

function buildAdapter(role: string): ChatTimelineAdapter {
  return {
    listenMessages: (id, onChange, onError) =>
      listenToDemandMessages(id, (msgs) =>
        onChange(msgs.map((m) => ({ id: m.id, authorName: m.authorName, authorRole: m.authorRole, message: m.message, createdAt: m.createdAt }))),
        onError,
      ),
    createMessage: (input) =>
      createDemandMessage({
        demandId: input.entityId,
        authorId: input.authorId,
        authorName: input.authorName,
        authorRole: (input.authorRole || role) as DemandMessageAuthorRole,
        message: input.message,
      }),
    markAsRead: role === 'staff' ? markDemandReadByStaff : markDemandReadByCitizen,
  };
}

export default function DemandTimeline({
  demand,
  compact = false,
  allowCitizenReply = false,
  currentUserId = '',
  currentUserName = '',
  currentUserRole = 'citizen',
  autoScroll = true,
}: DemandTimelineProps) {
  const isClosed = isDemandClosed(demand.status);
  const isStaff = currentUserRole === 'admin' || currentUserRole === 'clerk';
  const adapter = buildAdapter(isStaff ? 'staff' : 'citizen');

  const canReply = isStaff
    ? !isClosed
    : allowCitizenReply && !demand.isAnonymous && currentUserId === demand.authorId && !isClosed;

  const shouldMarkRead = isStaff
    ? !!demand.conversation?.unreadByStaff
    : !!allowCitizenReply && !demand.isAnonymous && currentUserId === demand.authorId && !!demand.conversation?.unreadByCitizen;

  return (
    <ChatTimeline
      entityId={demand.id}
      initialAuthorName={demand.isAnonymous ? 'Cidadão anônimo' : demand.authorName || 'Cidadão'}
      initialMessage={demand.content.text}
      initialCreatedAt={demand.createdAt}
      legacyResponseText={demand.adminAction?.response}
      legacyResponseAuthorName={demand.adminAction?.clerkName}
      adapter={adapter}
      canReply={canReply}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      currentUserRole={isStaff ? 'staff' : 'citizen'}
      shouldMarkRead={shouldMarkRead}
      title="Conversa do protocolo"
      conversationAriaLabel="Conversa do protocolo"
      replyPlaceholder="Escreva uma nova informação ou resposta sobre este protocolo"
      compact={compact}
      autoScroll={autoScroll}
    />
  );
}
