/**
 * AddBlockModal.tsx — Dialog สำหรับเพิ่ม/แก้ไข Time Block
 * Props:
 *   - open: boolean
 *   - onOpenChange: (open: boolean) => void
 *   - editingBlock?: TimeBlock — ถ้ามี = โหมดแก้ไข
 *   - preSelectedDay?: DayOfWeek — วันที่เลือกไว้ล่วงหน้า
 * Features: conflict detection, multi-select days, category picker
 */
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { useBudgetStore } from '@/lib/store';
import { AVAILABLE_CATEGORIES, CATEGORY_COLORS, DAYS_OF_WEEK } from '@/lib/constants';
import { findConflicts, getDayShort } from '@/lib/timeUtils';
import { useTranslation } from '@/lib/i18n';
import type { TimeBlock, BlockCategory, DayOfWeek } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AddBlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBlock?: TimeBlock | null;
  preSelectedDay?: DayOfWeek;
}

export default function AddBlockModal({
  open,
  onOpenChange,
  editingBlock,
  preSelectedDay,
}: AddBlockModalProps) {
  const { addBlock, updateBlock, removeBlock, blocks } = useBudgetStore();
  const { t } = useTranslation();

  const [label, setLabel] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [category, setCategory] = useState<BlockCategory>('work');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(DAYS_OF_WEEK);
  const [note, setNote] = useState('');
  const [conflicts, setConflicts] = useState<TimeBlock[]>([]);

  /** Reset form เมื่อเปิด modal */
  useEffect(() => {
    if (editingBlock) {
      setLabel(editingBlock.label);
      setStartTime(editingBlock.startTime);
      setEndTime(editingBlock.endTime);
      setCategory(editingBlock.category);
      setSelectedDays(editingBlock.days);
      setNote(editingBlock.note || '');
    } else {
      setLabel('');
      setStartTime('08:00');
      setEndTime('09:00');
      setCategory('work');
      setSelectedDays(preSelectedDay ? [preSelectedDay] : DAYS_OF_WEEK);
      setNote('');
    }
    setConflicts([]);
  }, [editingBlock, open, preSelectedDay]);

  /** ตรวจสอบ conflict เมื่อเวลาหรือวันเปลี่ยน */
  useEffect(() => {
    if (!startTime || !endTime || selectedDays.length === 0) {
      setConflicts([]);
      return;
    }
    const testBlock: TimeBlock = {
      id: editingBlock?.id || 'temp',
      label: label || 'test',
      startTime,
      endTime,
      category,
      days: selectedDays,
    };
    const found = findConflicts(testBlock, blocks);
    setConflicts(found);
  }, [startTime, endTime, selectedDays, blocks, editingBlock, label, category]);

  /** Toggle วันที่เลือก */
  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  /** Submit handler */
  const handleSubmit = () => {
    if (!label.trim() || !startTime || !endTime || selectedDays.length === 0) return;
    if (startTime >= endTime) return;

    const blockData: TimeBlock = {
      id: editingBlock?.id || `block-${Date.now()}`,
      label: label.trim(),
      startTime,
      endTime,
      category,
      days: selectedDays,
      note: note.trim() || undefined,
    };

    if (editingBlock) {
      updateBlock(editingBlock.id, blockData);
    } else {
      addBlock(blockData);
    }

    onOpenChange(false);
  };

  const isValid =
    label.trim() &&
    startTime &&
    endTime &&
    startTime < endTime &&
    selectedDays.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editingBlock ? t('edit_block') : t('add_block_new')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ชื่อ Block */}
          <div className="space-y-2">
            <Label htmlFor="block-label">{t('block_name')}</Label>
            <Input
              id="block-label"
              placeholder={t('block_name_ph')}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* เวลาเริ่ม/สิ้นสุด */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="block-start">{t('start_time')}</Label>
              <Input
                id="block-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="block-end">{t('end_time')}</Label>
              <Input
                id="block-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>
          {startTime && endTime && startTime >= endTime && (
            <p className="text-xs text-destructive">{t('time_error')}</p>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label>{t('category')}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as BlockCategory)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: CATEGORY_COLORS[cat.value].hex }}
                      />
                      {t(`cat_${cat.value}`) || cat.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Days multi-select */}
          <div className="space-y-2">
            <Label>{t('effective_days')}</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200',
                      isSelected
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'text-muted-foreground border-border hover:bg-accent'
                    )}
                  >
                    {getDayShort(day, t)}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setSelectedDays([...DAYS_OF_WEEK])}
                className="text-[10px] text-primary hover:underline"
              >
                {t('select_all')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedDays([])}
                className="text-[10px] text-muted-foreground hover:underline"
              >
                {t('clear')}
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="block-note">{t('note_optional')}</Label>
            <Input
              id="block-note"
              placeholder={t('note_ph')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Conflict warning */}
          {conflicts.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs animate-fade-in">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{t('conflict_warning')}</p>
                {conflicts.map((c) => (
                  <p key={c.id} className="text-muted-foreground mt-0.5">
                    • {c.label} ({c.startTime}–{c.endTime})
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between w-full mt-4">
          {editingBlock ? (
            <Button
              variant="destructive"
              onClick={() => {
                removeBlock(editingBlock.id);
                onOpenChange(false);
              }}
            >
              {t('delete')}
            </Button>
          ) : (
            <div />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="bg-primary hover:bg-primary/90"
            >
              {editingBlock ? t('save') : t('add')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
