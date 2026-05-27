/**
 * budget/income/page.tsx — หน้าจัดการรายได้
 * แสดง: IncomeList + สรุป total monthly income
 */
'use client';

import { TrendingUp } from 'lucide-react';
import IncomeList from '@/components/IncomeList';
import { useBudgetStore } from '@/lib/store';
import { getTotalMonthlyIncome, formatCurrency } from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export default function IncomePage() {
  const { currency, incomes } = useBudgetStore();
  const { t } = useTranslation();
  const totalMonthly = getTotalMonthlyIncome(incomes);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('income')}</h1>
        <p className="text-muted-foreground mt-1">{t('manage_income')}</p>
      </div>

      {/* Total income summary */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 animate-slide-up">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-income" />
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-500/10">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('total_income_month')}</p>
            <p className="text-3xl font-bold text-emerald-400">
              {formatCurrency(totalMonthly, currency)}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 gradient-income opacity-[0.05] rounded-full blur-3xl" />
      </div>

      {/* Income list */}
      <IncomeList />
    </div>
  );
}
