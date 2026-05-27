/**
 * BreakdownChart.tsx — แสดง chart สรุปสัดส่วนรายจ่าย
 * ใช้ Recharts: PieChart + BarChart toggle
 * Props: ไม่มี (ดึง data จาก zustand store)
 */
'use client';

import { useState } from 'react';
import { PieChart as PieChartIcon, BarChart3, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBudgetStore } from '@/lib/store';
import { getExpenseBreakdown, formatCurrency } from '@/lib/calculations';
import { useTranslation, TranslationKey } from '@/lib/i18n';

/** Color palette สำหรับ chart segments */
const COLORS = [
  'oklch(0.7 0.18 260)',   // purple
  'oklch(0.7 0.18 160)',   // emerald
  'oklch(0.65 0.2 25)',    // rose
  'oklch(0.75 0.15 60)',   // amber
  'oklch(0.7 0.18 310)',   // pink
  'oklch(0.65 0.18 200)',  // cyan
  'oklch(0.7 0.15 100)',   // lime
  'oklch(0.6 0.2 340)',    // magenta
];

function CustomTooltip({ active, payload, currency, t }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { percentage: number } }>; currency: string; t: (key: TranslationKey) => string }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="glass rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="text-sm font-medium text-foreground">{data.name}</p>
      <p className="text-lg font-bold text-primary">
        {formatCurrency(data.value, currency)}
      </p>
      <p className="text-xs text-muted-foreground">
        {data.payload.percentage.toFixed(1)}% {t('of_total_expense')}
      </p>
    </div>
  );
}

export default function BreakdownChart() {
  const { currency, expenses } = useBudgetStore();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const { t } = useTranslation();

  const breakdown = getExpenseBreakdown(expenses);
  breakdown.sort((a, b) => {
    if (sortOrder === 'desc') return b.amount - a.amount;
    return a.amount - b.amount;
  });
  const chartData = breakdown.map((item) => ({
    name: item.label,
    value: item.amount,
    percentage: item.percentage,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <PieChartIcon className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">{t('no_data')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Chart type toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              chartType === 'pie'
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            {t('pie_chart')}
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              chartType === 'bar'
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {t('bar_chart')}
          </button>
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
          <button
            onClick={() => setSortOrder('desc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              sortOrder === 'desc'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={t('sort_desc')}
          >
            <ArrowDownNarrowWide className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('sort_desc')}</span>
          </button>
          <button
            onClick={() => setSortOrder('asc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              sortOrder === 'asc'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={t('sort_asc')}
          >
            <ArrowUpNarrowWide className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('sort_asc')}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
              <Legend
                formatter={(value: string) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 270)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'oklch(0.65 0.01 270)', fontSize: 12 }}
                axisLine={{ stroke: 'oklch(0.28 0.01 270)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'oklch(0.65 0.01 270)', fontSize: 12 }}
                axisLine={{ stroke: 'oklch(0.28 0.01 270)' }}
                tickLine={false}
                tickFormatter={(value: number) => formatCurrency(value, currency)}
              />
              <Tooltip content={<CustomTooltip currency={currency} t={t} />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Progress bars breakdown */}
      <div className="mt-6 space-y-3">
        {breakdown.map((item, index) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatCurrency(item.amount, currency)}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${item.percentage}%`,
                  background: COLORS[index % COLORS.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
