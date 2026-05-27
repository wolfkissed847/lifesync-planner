/**
 * schedule/day/[day]/page.tsx — Daily Detail View
 * Dynamic route: [day] = mon | tue | wed | thu | fri | sat | sun
 * แสดง: StatsBar + DailyTimeline + block list
 */
'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DailyTimeline from '@/components/schedule/DailyTimeline';
import StatsBar from '@/components/schedule/StatsBar';
import AddBlockModal from '@/components/schedule/AddBlockModal';
import { getDayLabel, getTodayDayOfWeek } from '@/lib/timeUtils';
import { DAYS_OF_WEEK } from '@/lib/constants';
import type { DayOfWeek } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ day: string }>;
}

export default function DayDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const day = resolvedParams.day as DayOfWeek;
  const today = getTodayDayOfWeek();
  const isToday = day === today;
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);

  // Navigation ไปวันก่อนหน้า/ถัดไป
  const currentIndex = DAYS_OF_WEEK.indexOf(day);
  const prevDay = DAYS_OF_WEEK[(currentIndex - 1 + 7) % 7];
  const nextDay = DAYS_OF_WEEK[(currentIndex + 1) % 7];

  return (
    <div className="space-y-6">
      {/* Header + navigation */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href={`/schedule/day/${prevDay}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              {t('day')} {getDayLabel(day, t)}
              {isToday && (
                <span className="ml-2 text-sm font-normal text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {t('today')}
                </span>
              )}
            </h1>
            <Link href="/schedule" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('back_to_week')}
            </Link>
          </div>
          <Link href={`/schedule/day/${nextDay}`}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('add_block')}
        </Button>
      </div>

      {/* Stats bar */}
      <StatsBar day={day} />

      {/* Daily timeline */}
      <div className="rounded-2xl border border-border bg-card/50 p-6">
        <DailyTimeline day={day} />
      </div>

      <AddBlockModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        preSelectedDay={day}
      />
    </div>
  );
}
