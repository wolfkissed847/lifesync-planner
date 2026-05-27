/**
 * budget/page.tsx — Budget Overview
 * แสดง: SummaryCards + Stats + BreakdownChart
 */
'use client';

import SummaryCards from '@/components/SummaryCards';
import BreakdownChart from '@/components/BreakdownChart';
import { useBudgetStore } from '@/lib/store';
import {
  getTotalMonthlyIncome,
  getTotalMonthlyExpense,
  formatCurrency,
} from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export default function BudgetOverviewPage() {
  const { currency, incomes, expenses } = useBudgetStore();
  const { t } = useTranslation();
  const totalIncome = getTotalMonthlyIncome(incomes);
  const totalExpense = getTotalMonthlyExpense(expenses);
  const savingRate = totalIncome > 0
    ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('budget_title')}</h1>
        <p className="text-muted-foreground mt-1">{t('budget_desc')}</p>
      </div>

      {/* Summary cards */}
      <SummaryCards />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('income_sources')}</p>
          <p className="text-2xl font-bold">{incomes.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('expense_categories')}</p>
          <p className="text-2xl font-bold">{expenses.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('saving_rate')}</p>
          <p className={`text-2xl font-bold ${Number(savingRate) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {savingRate}%
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('currency')}</p>
          <p className="text-2xl font-bold">{currency}</p>
        </div>
      </div>

      {/* Breakdown Chart */}
      <div className="rounded-2xl border border-border bg-card/50 p-6 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{t('expense_breakdown')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('total_expense_month')} {formatCurrency(totalExpense, currency)}
            </p>
          </div>
        </div>
        <BreakdownChart />
      </div>
    </div>
  );
}
