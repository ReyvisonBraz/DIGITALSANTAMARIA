'use client';

import ChatTimeline from '@/components/ChatTimeline';
import type { ChatTimelineAdapter } from '@/components/ChatTimeline';
import {
  listenToReportMessages,
  createReportMessage,
  markReportReadByCitizen,
  markReportReadByStaff,
} from '@/services/reports.service';
import { isReportClosed } from '@/lib/constants/protocols';
import type { Report, ReportMessageAuthorRole } from '@/types';

interface ReportTimelineProps {
  report: Report;
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
      listenToReportMessages(id, (msgs) =>
        onChange(msgs.map((m) => ({ id: m.id, authorName: m.authorName, authorRole: m.authorRole, message: m.message, createdAt: m.createdAt }))),
        onError,
      ),
    createMessage: (input) =>
      createReportMessage({
        reportId: input.entityId,
        authorId: input.authorId,
        authorName: input.authorName,
        authorRole: (input.authorRole || role) as ReportMessageAuthorRole,
        message: input.message,
      }),
    markAsRead: role === 'staff' ? markReportReadByStaff : markReportReadByCitizen,
  };
}

export default function ReportTimeline({
  report,
  compact = false,
  allowCitizenReply = false,
  currentUserId = '',
  currentUserName = '',
  currentUserRole = 'citizen',
  autoScroll = true,
}: ReportTimelineProps) {
  const isClosed = isReportClosed(report.status);
  const isStaff = currentUserRole === 'admin' || currentUserRole === 'clerk';
  const adapter = buildAdapter(isStaff ? 'staff' : 'citizen');

  const canReply = isStaff
    ? !isClosed
    : allowCitizenReply && currentUserId === report.reporterId && !isClosed;

  const shouldMarkRead = isStaff
    ? !!report.conversation?.unreadByStaff
    : !!allowCitizenReply && currentUserId === report.reporterId && !!report.conversation?.unreadByCitizen;

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
      currentUserRole={isStaff ? 'staff' : 'citizen'}
      shouldMarkRead={shouldMarkRead}
      title="Conversa do relato"
      conversationAriaLabel="Conversa do relato"
      replyPlaceholder="Escreva uma nova informação ou resposta sobre este relato"
      compact={compact}
      autoScroll={autoScroll}
    />
  );
}
