/**
 * StatsBar.tsx — แสดงสรุปชั่วโมงต่อ category ในวันที่ระบุ
 * Props: day (DayOfWeek)
 * ดึงข้อมูลจาก zustand store
 */
'use client';

import { useBudgetStore } from '@/lib/store';
import { getDayStats, parseTime } from '@/lib/timeUtils';
import { CATEGORY_COLORS, AVAILABLE_CATEGORIES } from '@/lib/constants';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import type { DayOfWeek } from '@/lib/types';

interface StatsBarProps {
  day: DayOfWeek;
}

export default function StatsBar({ day }: StatsBarProps) {
  const { blocks, wakeTime, sleepTime } = useBudgetStore();
  const { t } = useTranslation();
  const stats = getDayStats(blocks, day);

  const wakeMins = parseTime(wakeTime || '00:00');
  const sleepMins = parseTime(sleepTime || '00:00');
  stats['sleep'] = (wakeMins - sleepMins + 1440) % 1440 / 60;

  // กรองเฉพาะ category ที่มีชั่วโมง > 0
  const activeStats = AVAILABLE_CATEGORIES.filter(
    (cat) => stats[cat.value] > 0
  );

  if (activeStats.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-in">
      {activeStats.map((cat) => {
        const colors = CATEGORY_COLORS[cat.value];
        const hours = stats[cat.value];
        return (
          <div
            key={cat.value}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: colors.hex }}
            />
            {t(`cat_${cat.value}` as TranslationKey) || cat.label} {hours.toFixed(1)} {t('hrs')}
          </div>
        );
      })}
    </div>
  );
}
