/**
 * DailyTimeline.tsx — Timeline แนวตั้งสำหรับวันที่ระบุ
 * Props: day (DayOfWeek)
 * แสดง blocks จาก wakeTime ถึง sleepTime พร้อม gaps
 * คลิก block เพื่อแก้ไข
 */
'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/lib/store';
import { getBlocksForDay, parseTime } from '@/lib/timeUtils';
import { CATEGORY_COLORS } from '@/lib/constants';
import TimeBlockCard from './TimeBlockCard';
import AddBlockModal from './AddBlockModal';
import { useTranslation } from '@/lib/i18n';
import type { TimeBlock, DayOfWeek } from '@/lib/types';

interface DailyTimelineProps {
  day: DayOfWeek;
}

export default function DailyTimeline({ day }: DailyTimelineProps) {
  const { blocks, wakeTime, sleepTime, removeBlock } = useBudgetStore();
  const dayBlocks = getBlocksForDay(blocks, day);
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

  const handleEdit = (block: TimeBlock) => {
    setEditingBlock(block);
    setModalOpen(true);
  };

  const wakeMinutes = parseTime(wakeTime);
  const sleepMinutes = parseTime(sleepTime);
  const totalMinutes = sleepMinutes - wakeMinutes;

  // สร้าง time markers ทุก 1 ชั่วโมง
  const timeMarkers: string[] = [];
  for (let m = Math.ceil(wakeMinutes / 60) * 60; m <= sleepMinutes; m += 60) {
    const h = Math.floor(m / 60);
    timeMarkers.push(`${h.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="animate-fade-in">
      {/* Timeline container */}
      <div className="relative" style={{ minHeight: `${Math.max(totalMinutes * 0.8, 400)}px` }}>
        {/* Time markers (background lines) */}
        {timeMarkers.map((marker) => {
          const markerMinutes = parseTime(marker);
          const topPercent = ((markerMinutes - wakeMinutes) / totalMinutes) * 100;
          return (
            <div
              key={marker}
              className="absolute left-0 right-0 flex items-center gap-2"
              style={{ top: `${topPercent}%` }}
            >
              <span className="text-[10px] text-muted-foreground w-12 text-right shrink-0">
                {marker}
              </span>
              <div className="flex-1 border-t border-dashed border-border/50" />
            </div>
          );
        })}

        {/* Time blocks */}
        <div className="ml-16 relative">
          {dayBlocks.map((block, index) => {
            const startMin = parseTime(block.startTime);
            const endMin = parseTime(block.endTime);
            const topPercent = ((startMin - wakeMinutes) / totalMinutes) * 100;
            const heightPercent = ((endMin - startMin) / totalMinutes) * 100;
            const colors = CATEGORY_COLORS[block.category];

            return (
              <div
                key={block.id}
                className="absolute left-0 right-0 pr-2 animate-slide-up"
                style={{
                  top: `${topPercent}%`,
                  height: `${heightPercent}%`,
                  minHeight: '40px',
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                <div
                  className={`h-full rounded-xl border p-3 cursor-pointer transition-all duration-200 hover:shadow-md group ${colors.bg} ${colors.border}`}
                  onClick={() => handleEdit(block)}
                >
                  <div className="flex items-start justify-between h-full">
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${colors.text} truncate`}>
                        {block.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {block.startTime} – {block.endTime}
                      </p>
                      {block.note && (
                        <p className="text-[10px] text-muted-foreground mt-1 truncate opacity-70">
                          {block.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
                    >
                      <span className="text-xs">✕</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state for gaps */}
          {dayBlocks.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground text-sm">
              {t('no_activities')}
            </div>
          )}
        </div>
      </div>

      <AddBlockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingBlock={editingBlock}
        preSelectedDay={day}
      />
    </div>
  );
}
