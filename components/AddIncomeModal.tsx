/**
 * AddIncomeModal.tsx — Dialog สำหรับเพิ่ม/แก้ไข income
 * Props:
 *   - open: boolean — สถานะเปิด/ปิด dialog
 *   - onOpenChange: (open: boolean) => void
 *   - editingIncome?: IncomeSource — ถ้ามี = โหมดแก้ไข, ไม่มี = โหมดเพิ่ม
 * Logic: validate ชื่อไม่ว่าง + amount > 0 ก่อน submit
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
import { useBudgetStore } from '@/lib/store';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import type { IncomeSource } from '@/lib/types';

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIncome?: IncomeSource | null;
}

export default function AddIncomeModal({
  open,
  onOpenChange,
  editingIncome,
}: AddIncomeModalProps) {
  const { addIncome, updateIncome } = useBudgetStore();
  const { t } = useTranslation();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [daysPerMonth, setDaysPerMonth] = useState('30');

  /** เมื่อเปิด modal ให้ set ค่าเริ่มต้นตาม mode (เพิ่ม/แก้ไข) */
  useEffect(() => {
    if (editingIncome) {
      setLabel(editingIncome.label);
      setAmount(String(editingIncome.amount));
      setFrequency(editingIncome.frequency);
      setDaysPerMonth(String(editingIncome.daysPerMonth ?? 30));
    } else {
      setLabel('');
      setAmount('');
      setFrequency('daily');
      setDaysPerMonth('30');
    }
  }, [editingIncome, open]);

  /** Submit handler — validate แล้ว add หรือ update */
  const handleSubmit = () => {
    if (!label.trim() || !amount || Number(amount) <= 0) return;

    const incomeData: IncomeSource = {
      id: editingIncome?.id || `income-${Date.now()}`,
      label: label.trim(),
      amount: Number(amount),
      frequency,
      daysPerMonth: frequency === 'daily' ? Number(daysPerMonth) : undefined,
    };

    if (editingIncome) {
      updateIncome(editingIncome.id, incomeData);
    } else {
      addIncome(incomeData);
    }

    onOpenChange(false);
  };
  
  const frequencies = ['daily', 'weekly', 'monthly'] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editingIncome ? t('edit_income') : t('add_income_new')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* ชื่อรายได้ */}
          <div className="space-y-2">
            <Label htmlFor="income-label">{t('income_name')}</Label>
            <Input
              id="income-label"
              placeholder={t('income_name_ph')}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* จำนวนเงิน */}
          <div className="space-y-2">
            <Label htmlFor="income-amount">{t('amount')}</Label>
            <Input
              id="income-amount"
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
            <Select value={frequency} onValueChange={(v) => setFrequency(v as 'daily' | 'weekly' | 'monthly')}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {t(`freq_${freq}` as TranslationKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* จำนวนวันต่อเดือน (แสดงเฉพาะ daily) */}
          {frequency === 'daily' && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="income-days">{t('days_per_month')}</Label>
              <Input
                id="income-days"
                type="number"
                min="1"
                max="31"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(e.target.value)}
                className="bg-background/50"
              />
            </div>
          )}
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
            {editingIncome ? t('save') : t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
