/**
 * schedule/page.tsx — Weekly Schedule View
 * แสดง: StatsBar + WeeklyGrid
 * Overview ตาราง 7 วัน พร้อมสถิติวันนี้
 */
'use client';

import { useState } from 'react';
import { CalendarClock, Plus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WeeklyGrid from '@/components/schedule/WeeklyGrid';
import StatsBar from '@/components/schedule/StatsBar';
import AddBlockModal from '@/components/schedule/AddBlockModal';
import { getTodayDayOfWeek, getDayLabel } from '@/lib/timeUtils';
import { useBudgetStore } from '@/lib/store';
import { getFreeTimeRemaining } from '@/lib/timeUtils';
import { useTranslation } from '@/lib/i18n';

export default function SchedulePage() {
  const today = getTodayDayOfWeek();
  const { blocks, wakeTime, sleepTime } = useBudgetStore();
  const { t } = useTranslation();
  const freeTime = getFreeTimeRemaining(blocks, today, wakeTime, sleepTime);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('schedule_title')}</h1>
          <p className="text-muted-foreground mt-1">{t('schedule_desc')}</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('add_block')}
        </Button>
      </div>

      {/* Today's summary */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 animate-slide-up">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
              <CalendarClock className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('today')} — {getDayLabel(today, t)}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <p className="text-lg font-semibold">
                  {t('free_time')} <span className="text-emerald-400">{freeTime.toFixed(1)} {t('hrs')}</span>
                </p>
                <div className="flex items-center gap-3 text-sm font-medium border-l border-border/50 pl-4">
                  <span className="flex items-center gap-1.5 text-amber-500"><Sun className="w-4 h-4" /> {wakeTime}</span>
                  <span className="flex items-center gap-1.5 text-indigo-400"><Moon className="w-4 h-4" /> {sleepTime}</span>
                </div>
              </div>
            </div>
          </div>
          <StatsBar day={today} />
        </div>
      </div>

      {/* Weekly grid */}
      <WeeklyGrid />

      <AddBlockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
