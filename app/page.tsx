/**
 * page.tsx — Dashboard หน้าแรก (Life Planner)
 * แสดง overview ทั้ง 2 ระบบ: Budget + Schedule
 * Features:
 *   - Quick Actions (ปุ่มลัดเพิ่มข้อมูลจากหน้าแรก)
 *   - Month Pacing (ความคืบหน้าของเดือน)
 *   - Mini Pie Chart (กราฟวงกลมจิ๋วสำหรับสัดส่วนรายจ่าย)
 *   - Current Activity (กิจกรรมที่กำลังทำอยู่ตอนนี้)
 * Layout: 2 คอลัมน์ (desktop), 1 คอลัมน์ (mobile)
 */
'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  CalendarClock,
  Plus,
  Calendar,
  Activity,
  Timer,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/lib/store';
import {
  getTotalMonthlyIncome,
  getTotalMonthlyExpense,
  getRemaining,
  formatCurrency,
  getExpenseBreakdown,
  getIncomeBreakdown,
} from '@/lib/calculations';
import {
  getTodayDayOfWeek,
  getBlocksForDay,
  getDayLabel,
  getFreeTimeRemaining,
  getDayStats,
  getCategoryLabel,
  getCurrentActivity,
  formatTimeRange,
} from '@/lib/timeUtils';
import { CATEGORY_COLORS, AVAILABLE_CATEGORIES } from '@/lib/constants';
import TimeBlockCard from '@/components/schedule/TimeBlockCard';
import AddIncomeModal from '@/components/AddIncomeModal';
import AddExpenseModal from '@/components/AddExpenseModal';
import AddBlockModal from '@/components/schedule/AddBlockModal';
import Link from 'next/link';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/** สี palette สำหรับ mini pie chart */
const PIE_COLORS = [
  '#f43f5e', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#64748b', '#a855f7',
];

export default function DashboardPage() {
  const { currency, incomes, expenses, blocks, wakeTime, sleepTime } = useBudgetStore();
  const { t } = useTranslation();

  // Modal states
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  // Real-time clock for current activity
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Budget data
  const totalIncome = getTotalMonthlyIncome(incomes);
  const totalExpense = getTotalMonthlyExpense(expenses);
  const remaining = getRemaining(incomes, expenses);
  const isPositive = remaining >= 0;
  const topExpenses = getExpenseBreakdown(expenses).sort((a, b) => b.amount - a.amount).slice(0, 3);
  const topIncomes = getIncomeBreakdown(incomes).sort((a, b) => b.amount - a.amount).slice(0, 3);
  const allExpenseBreakdown = getExpenseBreakdown(expenses).sort((a, b) => b.amount - a.amount);

  // Month pacing data
  const todayDate = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - todayDate;
  const monthProgress = (todayDate / daysInMonth) * 100;
  const dailyBudgetRemaining = daysRemaining > 0 ? remaining / daysRemaining : remaining;

  // Mini pie chart data
  const pieData = allExpenseBreakdown.map((exp) => ({
    name: exp.label,
    value: exp.amount,
  }));

  // Schedule data
  const today = getTodayDayOfWeek();
  const todayBlocks = getBlocksForDay(blocks, today);
  const freeTime = getFreeTimeRemaining(blocks, today, wakeTime, sleepTime);
  const stats = getDayStats(blocks, today);

  // Current activity (real-time)
  const currentActivity = getCurrentActivity(blocks, today);

  return (
    <div className="space-y-8">
      {/* Page header + Quick Actions */}
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('dashboard_title')}</h1>
            <p className="text-muted-foreground mt-1">{t('dashboard_desc')}</p>
          </div>

          {/* ─── Quick Actions ─── */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500/50 transition-all duration-200"
              onClick={() => setIncomeModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('income')}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/50 transition-all duration-200"
              onClick={() => setExpenseModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('expense')}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/50 transition-all duration-200"
              onClick={() => setBlockModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('add_block')}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ═══ LEFT COLUMN: Budget ═══ */}
        <div className="space-y-4">
          <Link href="/budget" className="flex items-center gap-2 group">
            <Wallet className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              {t('monthly_budget')}
            </h2>
          </Link>

          {/* Budget summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Income */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 animate-slide-up">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-income" />
              <p className="text-xs text-muted-foreground mb-1">{t('income')}</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCurrency(totalIncome, currency)}
              </p>
              <TrendingUp className="absolute bottom-2 right-2 w-8 h-8 text-emerald-500/10" />
            </div>

            {/* Expense */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}>
              <div className="absolute top-0 left-0 right-0 h-1 gradient-expense" />
              <p className="text-xs text-muted-foreground mb-1">{t('expense')}</p>
              <p className="text-xl font-bold text-rose-400">
                {formatCurrency(totalExpense, currency)}
              </p>
              <TrendingDown className="absolute bottom-2 right-2 w-8 h-8 text-rose-500/10" />
            </div>

            {/* Remaining */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
              <div className={`absolute top-0 left-0 right-0 h-1 ${isPositive ? 'gradient-remaining' : 'gradient-remaining-negative'}`} />
              <p className="text-xs text-muted-foreground mb-1">{t('remaining')}</p>
              <p className={`text-xl font-bold ${isPositive ? 'text-blue-400' : 'text-amber-400'}`}>
                {formatCurrency(remaining, currency)}
              </p>
              <Wallet className={`absolute bottom-2 right-2 w-8 h-8 ${isPositive ? 'text-blue-500/10' : 'text-amber-500/10'}`} />
            </div>
          </div>

          {/* ─── Month Pacing ─── */}
          <div className="rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold text-muted-foreground">{t('month_pacing')}</h3>
            </div>

            {/* Progress bar */}
            <div className="relative h-2.5 rounded-full bg-muted overflow-hidden mb-3">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${monthProgress}%`,
                  background: 'linear-gradient(90deg, hsl(217 91% 60%), hsl(263 70% 50%))',
                }}
              />
              {/* Pulsing dot at current position */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg shadow-primary/30 ring-2 ring-primary/50"
                style={{ left: `calc(${monthProgress}% - 6px)` }}
              >
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30" />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {t('day_of_month')} <span className="font-bold text-foreground">{todayDate}</span> / {daysInMonth}
                </span>
                <span className="text-muted-foreground">
                  {t('days_remaining')} <span className="font-bold text-amber-400">{daysRemaining}</span> {t('days_unit')}
                </span>
              </div>
              {remaining > 0 && daysRemaining > 0 && (
                <span className="text-muted-foreground">
                  {t('daily_budget')}: <span className="font-bold text-blue-400">{formatCurrency(dailyBudgetRemaining, currency)}</span>
                </span>
              )}
            </div>
          </div>

          {/* ─── Top Expenses + Mini Pie Chart ─── */}
          {topExpenses.length > 0 && (
            <div className="rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-semibold text-muted-foreground">
                  {t('expense_ratio')}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                {/* Mini Pie Chart */}
                <div className="w-[90px] h-[90px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={40}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top 3 legend */}
                <div className="flex-1 space-y-2">
                  {topExpenses.map((exp, i) => (
                    <div key={exp.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: PIE_COLORS[allExpenseBreakdown.findIndex(e => e.id === exp.id) % PIE_COLORS.length] }}
                        />
                        <span className="text-sm truncate">{exp.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-rose-400">
                          {formatCurrency(exp.amount, currency)}
                        </span>
                        <span className="text-[10px] text-muted-foreground w-10 text-right">
                          {exp.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top incomes */}
          {topIncomes.length > 0 && (
            <div className="rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '175ms', animationFillMode: 'backwards' }}>
              <h3 className="text-xs font-semibold text-muted-foreground mb-3">
                {t('top_incomes')}
              </h3>
              <div className="space-y-2.5">
                {topIncomes.map((inc, i) => (
                  <div key={inc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground w-5">
                        {i + 1}.
                      </span>
                      <span className="text-sm">{inc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-400">
                        {formatCurrency(inc.amount, currency)}
                      </span>
                      <span className="text-[10px] text-muted-foreground w-10 text-right">
                        {inc.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT COLUMN: Schedule ═══ */}
        <div className="space-y-4">
          <Link href="/schedule" className="flex items-center gap-2 group">
            <CalendarClock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
              {t('today_schedule')} — {getDayLabel(today, t)}
            </h2>
          </Link>

          {/* ─── Current Activity Card ─── */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4 animate-slide-up" style={{ animationDelay: '180ms', animationFillMode: 'backwards' }}>
            {currentActivity ? (() => {
              const colors = CATEGORY_COLORS[currentActivity.block.category];
              return (
                <>
                  {/* Glowing top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: colors.hex }} />
                  <div className="absolute top-0 left-0 right-0 h-8 opacity-10 rounded-t-xl" style={{ background: `linear-gradient(to bottom, ${colors.hex}, transparent)` }} />

                  <div className="relative flex items-start gap-3">
                    {/* Activity icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${colors.bg} shrink-0`}>
                      <Activity className={`w-5 h-5 ${colors.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{t('current_activity')}</p>
                        {/* Live indicator */}
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: colors.hex }} />
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: colors.hex }} />
                        </span>
                      </div>
                      <p className="font-bold text-lg mt-0.5 truncate">{currentActivity.block.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeRange(currentActivity.block.startTime, currentActivity.block.endTime)}
                        {' • '}
                        {getCategoryLabel(currentActivity.block.category, t)}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                          <span>{t('progress')}</span>
                          <span className="font-medium" style={{ color: colors.hex }}>
                            {currentActivity.progressPercent.toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${currentActivity.progressPercent}%`,
                              background: `linear-gradient(90deg, ${colors.hex}80, ${colors.hex})`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })() : (
              <>
                {/* Free time state */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-xl" />
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 shrink-0">
                    <Timer className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('current_activity')}</p>
                    <p className="font-bold text-emerald-400">{t('current_free_time')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('current_free_desc')}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Free time + stats */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">{t('free_time')}</p>
              <p className="text-xl font-bold text-emerald-400">{freeTime.toFixed(1)} {t('hrs')}</p>
              <Clock className="absolute bottom-2 right-2 w-8 h-8 text-emerald-500/5" />
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">{t('today_activities')}</p>
              <p className="text-xl font-bold">{todayBlocks.length} <span className="text-sm font-normal text-muted-foreground">{t('blocks')}</span></p>
            </div>
          </div>

          {/* Category stats chips */}
          {Object.entries(stats).some(([, v]) => v > 0) && (
            <div className="flex flex-wrap gap-1.5 animate-fade-in">
              {AVAILABLE_CATEGORIES.filter((cat) => stats[cat.value] > 0).map((cat) => {
                const colors = CATEGORY_COLORS[cat.value];
                return (
                  <span
                    key={cat.value}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium ${colors.bg} ${colors.text}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.hex }} />
                    {getCategoryLabel(cat.value, t)} {stats[cat.value].toFixed(1)}{t('hrs')}
                  </span>
                );
              })}
            </div>
          )}

          {/* Today's blocks */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}>
            {todayBlocks.length === 0 ? (
              <div className="rounded-xl border border-border bg-card/30 p-8 text-center">
                <CalendarClock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('no_activities')}</p>
              </div>
            ) : (
              todayBlocks.map((block, i) => (
                <div
                  key={block.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${300 + i * 50}ms`, animationFillMode: 'backwards' }}
                >
                  <TimeBlockCard block={block} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Modals ─── */}
      <AddIncomeModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
      />
      <AddExpenseModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
      />
      <AddBlockModal
        open={blockModalOpen}
        onOpenChange={setBlockModalOpen}
      />
    </div>
  );
}
