/**
 * budget/expenses/page.tsx — หน้าจัดการรายจ่าย
 * แสดง: ExpenseList + สรุป total monthly expense
 */
'use client';

import { Receipt } from 'lucide-react';
import ExpenseList from '@/components/ExpenseList';
import { useBudgetStore } from '@/lib/store';
import { getTotalMonthlyExpense, formatCurrency } from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export default function ExpensesPage() {
  const { currency, expenses } = useBudgetStore();
  const { t } = useTranslation();
  const totalMonthly = getTotalMonthlyExpense(expenses);
  const fixedCount = expenses.filter((e) => e.isFixed).length;
  const variableCount = expenses.filter((e) => !e.isFixed).length;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('expense')}</h1>
        <p className="text-muted-foreground mt-1">{t('manage_expenses')}</p>
      </div>

      {/* Total expense summary */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 animate-slide-up">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-expense" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-rose-500/10">
              <Receipt className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('total_expense_month')}</p>
              <p className="text-3xl font-bold text-rose-400">
                {formatCurrency(totalMonthly, currency)}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="text-center px-4 py-2 rounded-xl bg-blue-500/10">
              <p className="text-blue-400 font-semibold">{fixedCount}</p>
              <p className="text-xs text-muted-foreground">{t('fixed')}</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-amber-500/10">
              <p className="text-amber-400 font-semibold">{variableCount}</p>
              <p className="text-xs text-muted-foreground">{t('variable')}</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 gradient-expense opacity-[0.05] rounded-full blur-3xl" />
      </div>

      {/* Expense list */}
      <ExpenseList />
    </div>
  );
}
