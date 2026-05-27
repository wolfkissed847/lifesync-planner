/**
 * SummaryCards.tsx — แสดง 3 cards สรุปงบประมาณ
 * Props: ไม่มี (ดึง data จาก zustand store)
 * แสดง: รายได้/เดือน, รายจ่าย/เดือน, คงเหลือ/เดือน
 * ใช้ gradient background + animated counter
 */
'use client';

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useBudgetStore } from '@/lib/store';
import {
  getTotalMonthlyIncome,
  getTotalMonthlyExpense,
  getRemaining,
  formatCurrency,
} from '@/lib/calculations';
import { useTranslation } from '@/lib/i18n';

export default function SummaryCards() {
  const { currency, incomes, expenses } = useBudgetStore();
  const { t } = useTranslation();

  const totalIncome = getTotalMonthlyIncome(incomes);
  const totalExpense = getTotalMonthlyExpense(expenses);
  const remaining = getRemaining(incomes, expenses);
  const isPositive = remaining >= 0;

  const cards = [
    {
      id: 'income-card',
      label: `${t('income')} / ${t('freq_monthly')}`,
      amount: totalIncome,
      icon: TrendingUp,
      gradient: 'gradient-income',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'expense-card',
      label: `${t('expense')} / ${t('freq_monthly')}`,
      amount: totalExpense,
      icon: TrendingDown,
      gradient: 'gradient-expense',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
    },
    {
      id: 'remaining-card',
      label: `${t('remaining')} / ${t('freq_monthly')}`,
      amount: remaining,
      icon: Wallet,
      gradient: isPositive ? 'gradient-remaining' : 'gradient-remaining-negative',
      iconBg: isPositive ? 'bg-blue-500/20' : 'bg-amber-500/20',
      iconColor: isPositive ? 'text-blue-400' : 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.id}
          id={card.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5 group">
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${card.gradient}`} />

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-2xl lg:text-3xl font-bold tracking-tight">
                  {formatCurrency(card.amount, currency)}
                </p>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>

            {/* Decorative gradient blob */}
            <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${card.gradient} opacity-[0.07] rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-[0.12]`} />
          </div>
        </div>
      ))}
    </div>
  );
}
