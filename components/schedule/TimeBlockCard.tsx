/**
 * TimeBlockCard.tsx — Card แสดง time block เดี่ยว
 * Props: block, onEdit, onDelete, compact
 * แสดง: เวลา, label, category badge, note
 * มีปุ่ม edit/delete แสดงเมื่อ hover
 */
'use client';

import { Pencil, Trash2, Clock, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { CATEGORY_COLORS } from '@/lib/constants';
import { formatTimeRange, getBlockDuration } from '@/lib/timeUtils';
import { useTranslation } from '@/lib/i18n';
import type { TimeBlock } from '@/lib/types';

interface TimeBlockCardProps {
  block: TimeBlock;
  onEdit?: (block: TimeBlock) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function TimeBlockCard({
  block,
  onEdit,
  onDelete,
  compact = false,
}: TimeBlockCardProps) {
  const { t } = useTranslation();
  const colors = CATEGORY_COLORS[block.category];
  const duration = getBlockDuration(block);

  if (compact) {
    return (
      <div
        className={`group relative rounded-lg border p-2 transition-all duration-200 ${onEdit ? 'hover:shadow-sm cursor-pointer' : ''} ${colors.bg} ${colors.border}`}
        onClick={() => onEdit?.(block)}
      >
        <p className={`text-xs font-medium ${colors.text} truncate`}>{block.label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {block.startTime}–{block.endTime}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-card/50 p-4 transition-all duration-200 hover:bg-card hover:shadow-md ${colors.border}`}
    >
      {/* Accent bar ด้านซ้าย */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: colors.hex }}
      />

      <div className="pl-3 space-y-2">
        {/* Header: label + badge + actions */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium truncate">{block.label}</h3>
              <CategoryBadge category={block.category} size="sm" />
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeRange(block.startTime, block.endTime)}
              </span>
              <span className={`font-medium ${colors.text}`}>
                {duration.toFixed(1)} {t('hrs')}
              </span>
            </div>
          </div>

          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(block)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(block.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Note */}
        {block.note && (
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/30 rounded-lg px-2.5 py-1.5">
            <StickyNote className="w-3 h-3 mt-0.5 shrink-0" />
            {block.note}
          </p>
        )}
      </div>
    </div>
  );
}
