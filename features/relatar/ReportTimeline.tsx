'use client';

import ChatTimeline from '@/components/ChatTimeline';
import type { ChatTimelineAdapter } from '@/components/ChatTimeline';
import {
  listenToReportMessages,
  createReportMessage,
  markReportReadByCitizen,
} from '@/services/reports.service';
import { isReportClosed } from '@/lib/constants/protocols';
import type { Report } from '@/types';

interface ReportTimelineProps {
  report: Report;
  compact?: boolean;
  allowCitizenReply?: boolean;
  currentUserId?: string;
  currentUserName?: string;
  autoScroll?: boolean;
}

const adapter: ChatTimelineAdapter = {
  listenMessages: (id, onChange, onError) =>
    listenToReportMessages(id, (msgs) =>
      onChange(msgs.map((m) => ({ id: m.id, authorName: m.authorName, authorRole: m.authorRole, message: m.message, createdAt: m.createdAt }))),
      onError,
    ),
  createMessage: (input) =>
    createReportMessage({
      reportId: input.entityId,
      authorId: input.authorId,
      authorName: input.authorName,
      authorRole: 'citizen',
      message: input.message,
    }),
  markAsRead: markReportReadByCitizen,
};

export default function ReportTimeline({
  report,
  compact = false,
  allowCitizenReply = false,
  currentUserId = '',
  currentUserName = '',
  autoScroll = true,
}: ReportTimelineProps) {
  const isClosed = isReportClosed(report.status);
  const canReply = allowCitizenReply && currentUserId === report.reporterId && !isClosed;

  const shouldMarkRead =
    !!allowCitizenReply &&
    currentUserId === report.reporterId &&
    !!report.conversation?.unreadByCitizen;

  return (
    <ChatTimeline
      entityId={report.id}
      initialAuthorName={report.reporterName || 'Cidadão'}
      initialMessage={report.description}
      initialCreatedAt={report.createdAt}
      legacyResponseText={report.adminResponse || undefined}
      legacyResponseAuthorName="Prefeitura"
      adapter={adapter}
      canReply={canReply}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      shouldMarkRead={shouldMarkRead}
      title="Conversa do relato"
      conversationAriaLabel="Conversa do relato"
      replyPlaceholder="Escreva uma nova informação ou resposta sobre este relato"
      compact={compact}
      autoScroll={autoScroll}
    />
  );
}
