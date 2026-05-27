/**
 * EmptyState.tsx — Reusable empty state display
 * Props: icon, title, description, actionLabel, onAction
 * ใช้เมื่อรายการว่าง (income, expense, blocks, etc.)
 */
'use client';

import { Button } from '@/components/ui/button';
import { Plus, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconColor?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  iconColor = 'text-muted-foreground',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 mb-4">
        <Icon className={`w-8 h-8 opacity-50 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
