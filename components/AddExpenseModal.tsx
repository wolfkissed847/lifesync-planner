/**
 * AddExpenseModal.tsx — Dialog สำหรับเพิ่ม/แก้ไข expense
 * Props:
 *   - open: boolean
 *   - onOpenChange: (open: boolean) => void
 *   - editingExpense?: ExpenseCategory — ถ้ามี = โหมดแก้ไข
 * Logic: form พร้อม icon picker, frequency, isFixed toggle
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
import { Switch } from '@/components/ui/switch';
import { useBudgetStore } from '@/lib/store';
import { AVAILABLE_ICONS } from '@/lib/constants';
import { getIconComponent } from '@/lib/icons';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import type { ExpenseCategory } from '@/lib/types';

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingExpense?: ExpenseCategory | null;
}

export default function AddExpenseModal({
  open,
  onOpenChange,
  editingExpense,
}: AddExpenseModalProps) {
  const { addExpense, updateExpense } = useBudgetStore();
  const { t } = useTranslation();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'monthly'>('monthly');
  const [isFixed, setIsFixed] = useState(true);
  const [icon, setIcon] = useState('ellipsis');

  /** เมื่อเปิด modal ให้ set ค่าเริ่มต้น */
  useEffect(() => {
    if (editingExpense) {
      setLabel(editingExpense.label);
      setAmount(String(editingExpense.amount));
      setFrequency(editingExpense.frequency);
      setIsFixed(editingExpense.isFixed);
      setIcon(editingExpense.icon);
    } else {
      setLabel('');
      setAmount('');
      setFrequency('monthly');
      setIsFixed(true);
      setIcon('ellipsis');
    }
  }, [editingExpense, open]);

  /** Submit handler */
  const handleSubmit = () => {
    if (!label.trim() || !amount || Number(amount) <= 0) return;

    const expenseData: ExpenseCategory = {
      id: editingExpense?.id || `expense-${Date.now()}`,
      label: label.trim(),
      icon,
      amount: Number(amount),
      frequency,
      isFixed,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editingExpense ? t('edit_expense') : t('add_expense_new')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ชื่อรายจ่าย */}
          <div className="space-y-2">
            <Label htmlFor="expense-label">{t('expense_name')}</Label>
            <Input
              id="expense-label"
              placeholder={t('expense_name_ph')}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <Label>{t('icon')}</Label>
            <div className="grid grid-cols-5 gap-2 max-h-[160px] overflow-y-auto p-1">
              {AVAILABLE_ICONS.map((iconItem) => {
                const IconComp = getIconComponent(iconItem.name);
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => setIcon(iconItem.name)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all duration-200 ${
                      icon === iconItem.name
                        ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                    title={iconItem.label}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="truncate w-full text-center text-[10px]">{iconItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* จำนวนเงิน */}
          <div className="space-y-2">
            <Label htmlFor="expense-amount">{t('amount')}</Label>
            <Input
              id="expense-amount"
              type="number"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* ความถี่ */}
          <div className="space-y-2">
            <Label>{t('frequency')}</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'monthly')}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t('freq_daily')}</SelectItem>
                <SelectItem value="monthly">{t('freq_monthly')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fixed / Variable toggle */}
          <div className="flex items-center justify-between rounded-xl bg-background/50 p-3">
            <div>
              <Label htmlFor="expense-fixed" className="text-sm font-medium">
                {t('fixed_expense')}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFixed ? t('fixed_expense_desc') : t('variable_expense_desc')}
              </p>
            </div>
            <Switch
              id="expense-fixed"
              checked={isFixed}
              onCheckedChange={setIsFixed}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!label.trim() || !amount || Number(amount) <= 0}
            className="bg-primary hover:bg-primary/90"
          >
            {editingExpense ? t('save') : t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
