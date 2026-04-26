import React from 'react';
import { TicketStatus } from '@/types/tour';

const STATUS_CONFIG: Record<TicketStatus, { label: string; classes: string }> = {
  available: { label: 'Na voljo', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
  limited: { label: 'Zadnji kosi', classes: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  'sold-out': { label: 'Razprodano', classes: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export const TourStatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
};
