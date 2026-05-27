/**
 * CategoryBadge.tsx — Badge แสดง BlockCategory พร้อมสี
 * Props: category, size
 * ใช้สีจาก CATEGORY_COLORS constant
 */
'use client';

import { cn } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/constants';
import { getCategoryLabel } from '@/lib/timeUtils';
import type { BlockCategory } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface CategoryBadgeProps {
  category: BlockCategory;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const { t } = useTranslation();
  const colors = CATEGORY_COLORS[category];
  const label = getCategoryLabel(category, t);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: colors.hex }}
      />
      {label}
    </span>
  );
}
