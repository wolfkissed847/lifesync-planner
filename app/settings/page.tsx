/**
 * settings/page.tsx — หน้าตั้งค่า Life Planner
 * Features:
 *   - เปลี่ยน currency symbol
 *   - ตั้ง wakeTime / sleepTime
 *   - Export JSON (download file)
 *   - Import JSON (file upload)
 *   - Reset ข้อมูลทั้งหมด (with confirmation)
 */
'use client';

import { useState, useRef } from 'react';
import {
  Settings,
  RotateCcw,
  AlertTriangle,
  Coins,
  Clock,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useBudgetStore } from '@/lib/store';
import { AVAILABLE_CURRENCIES } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';
import { parseTime } from '@/lib/timeUtils';

export default function SettingsPage() {
  const {
    language, setLanguage,
    currency, setCurrency,
    wakeTime, sleepTime, setWakeTime, setSleepTime,
    resetAll,
  } = useBudgetStore();
  const { t } = useTranslation();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const wakeMins = parseTime(wakeTime || '00:00');
  const sleepMins = parseTime(sleepTime || '00:00');
  const awakeDuration = (sleepMins - wakeMins + 1440) % 1440 / 60;
  const sleepDuration = (wakeMins - sleepMins + 1440) % 1440 / 60;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('settings_title')}</h1>
        <p className="text-muted-foreground mt-1">{t('settings_desc')}</p>
      </div>

      <div className="space-y-6">
        {/* ─── Language Section ─── */}
        <div className="rounded-2xl border border-border bg-card/50 p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{t('language')}</h2>
              <p className="text-sm text-muted-foreground">{t('language_desc')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={language === 'th' ? 'default' : 'outline'}
              onClick={() => setLanguage('th')}
            >
              ไทย
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              onClick={() => setLanguage('en')}
            >
              English
            </Button>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* ─── Currency Section ─── */}
        <div className="rounded-2xl border border-border bg-card/50 p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{t('currency_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('currency_desc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {AVAILABLE_CURRENCIES.map((cur) => (
              <button
                key={cur.symbol}
                onClick={() => setCurrency(cur.symbol)}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all duration-200 ${currency === cur.symbol
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border bg-background/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                <span className="text-2xl font-bold">{cur.symbol}</span>
                <span className="text-xs">{cur.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* ─── Schedule Time Section ─── */}
        <div className="rounded-2xl border border-border bg-card/50 p-6 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">{t('schedule_time')}</h2>
              <p className="text-sm text-muted-foreground">{t('schedule_time_desc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="wake-time">{t('wake_time')}</Label>
                <span className="text-xs text-amber-500 font-medium">
                  {t('awake')}: {awakeDuration.toFixed(1)} {t('hrs')}
                </span>
              </div>
              <Input
                id="wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sleep-time">{t('sleep_time')}</Label>
                <span className="text-xs text-indigo-400 font-medium">
                  {t('sleep')}: {sleepDuration.toFixed(1)} {t('hrs')}
                </span>
              </div>
              <Input
                id="sleep-time"
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* ─── Reset Section ─── */}
        <div className="rounded-2xl border border-destructive/20 bg-card/50 p-6 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold text-destructive">{t('danger_zone')}</h2>
              <p className="text-sm text-muted-foreground">{t('reset_desc')}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setResetDialogOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t('reset_all')}
          </Button>
        </div>
      </div>

      {/* Reset Confirmation */}
      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title={t('confirm_reset')}
        description={t('confirm_reset_desc')}
        confirmLabel={t('reset_now')}
        cancelLabel={t('cancel')}
        onConfirm={resetAll}
        variant="destructive"
      />
    </div>
  );
}
