/**
 * WeeklyGrid.tsx — แสดงตาราง 7 วัน (จ–อา)
 * Props: ไม่มี (ดึง data จาก zustand store)
 * Features: highlight วันนี้, คลิก block เพื่อแก้ไข, คลิกวันเพื่อดู detail
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/lib/store';
import { DAYS_OF_WEEK } from '@/lib/constants';
import { getBlocksForDay, getDayLabel, getDayShort, getTodayDayOfWeek, parseTime } from '@/lib/timeUtils';
import TimeBlockCard from './TimeBlockCard';
import AddBlockModal from './AddBlockModal';
import { useTranslation } from '@/lib/i18n';
import type { TimeBlock, DayOfWeek } from '@/lib/types';

export default function WeeklyGrid() {
  const { blocks, wakeTime, sleepTime, removeBlock } = useBudgetStore();
  const today = getTodayDayOfWeek();
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [preSelectedDay, setPreSelectedDay] = useState<DayOfWeek | undefined>();

  const handleEdit = (block: TimeBlock) => {
    setEditingBlock(block);
    setPreSelectedDay(undefined);
    setModalOpen(true);
  };

  const handleAddForDay = (day: DayOfWeek) => {
    setEditingBlock(null);
    setPreSelectedDay(day);
    setModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Desktop: grid 7 คอลัมน์ */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const dayBlocks = getBlocksForDay(blocks, day);
          const isToday = day === today;

          const sleepBlock: TimeBlock = {
            id: `system-sleep-${day}`,
            label: t('cat_sleep'),
            category: 'sleep',
            startTime: sleepTime,
            endTime: wakeTime,
            days: [day],
          };
          
          const allBlocks = [...dayBlocks, sleepBlock].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

          return (
            <div
              key={day}
              className={`rounded-xl border p-2 min-h-[200px] transition-all duration-200 ${
                isToday
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-card/30'
              }`}
            >
              {/* Day header */}
              <Link
                href={`/schedule/day/${day}`}
                className="block text-center mb-2 group"
              >
                <p className={`text-[10px] font-medium ${
                  isToday ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {getDayShort(day, t)}
                </p>
                <p className={`text-xs font-semibold group-hover:text-primary transition-colors ${
                  isToday ? 'text-primary' : ''
                }`}>
                  {getDayLabel(day, t)}
                </p>
                {isToday && (
                  <div className="w-5 h-0.5 rounded-full bg-primary mx-auto mt-1" />
                )}
              </Link>

              {/* Blocks */}
              <div className="space-y-1.5">
                {allBlocks.map((block) => (
                  <TimeBlockCard
                    key={block.id}
                    block={block}
                    compact
                    onEdit={block.id.startsWith('system-sleep') ? undefined : handleEdit}
                  />
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => handleAddForDay(day)}
                className="w-full mt-1.5 py-1 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 text-xs"
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile: list view จัดตามวัน */}
      <div className="md:hidden space-y-4">
        {DAYS_OF_WEEK.map((day) => {
          const dayBlocks = getBlocksForDay(blocks, day);
          const isToday = day === today;

          const sleepBlock: TimeBlock = {
            id: `system-sleep-${day}`,
            label: t('cat_sleep'),
            category: 'sleep',
            startTime: sleepTime,
            endTime: wakeTime,
            days: [day],
          };
          
          const allBlocks = [...dayBlocks, sleepBlock].sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));

          return (
            <div
              key={day}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isToday
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border bg-card/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/schedule/day/${day}`}
                  className="flex items-center gap-2 group"
                >
                  <span className={`text-sm font-semibold group-hover:text-primary transition-colors ${
                    isToday ? 'text-primary' : ''
                  }`}>
                    {getDayLabel(day, t)}
                  </span>
                  {isToday && (
                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {t('today')}
                    </span>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleAddForDay(day)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {allBlocks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">
                  {t('no_activities')}
                </p>
              ) : (
                <div className="space-y-2">
                  {allBlocks.map((block) => (
                    <TimeBlockCard
                      key={block.id}
                      block={block}
                      onEdit={block.id.startsWith('system-sleep') ? undefined : handleEdit}
                      onDelete={block.id.startsWith('system-sleep') ? undefined : removeBlock}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddBlockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingBlock={editingBlock}
        preSelectedDay={preSelectedDay}
      />
    </div>
  );
}
