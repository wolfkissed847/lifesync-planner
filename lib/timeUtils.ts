/**
 * timeUtils.ts — Utility functions สำหรับจัดการเวลา
 * ใช้ 24h format ทั้งหมด, ทุกฟังก์ชันเป็น pure function
 */

import { TimeBlock, BlockCategory, DayOfWeek } from './types';
import type { TranslationKey } from './i18n';

/**
 * แปลง time string "HH:MM" เป็นจำนวนนาทีตั้งแต่เที่ยงคืน
 * @param timeStr - เช่น "08:30"
 * @returns จำนวนนาที เช่น 510
 */
export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * แปลงจำนวนนาทีกลับเป็น time string "HH:MM"
 * @param minutes - จำนวนนาทีตั้งแต่เที่ยงคืน
 * @returns เช่น "08:30"
 */
export function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Format ช่วงเวลา "08:00 – 11:00"
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} – ${endTime}`;
}

/**
 * คำนวณระยะเวลาของ block เป็นชั่วโมง (ทศนิยม)
 * @returns เช่น 3.0 (สำหรับ 08:00–11:00)
 */
export function getBlockDuration(block: TimeBlock): number {
  const start = parseTime(block.startTime);
  const end = parseTime(block.endTime);
  if (end < start) {
    return (end + 1440 - start) / 60;
  }
  return (end - start) / 60;
}

/**
 * ตรวจสอบว่า 2 blocks ซ้อนทับเวลากันหรือไม่
 * @returns true ถ้ามี conflict
 */
export function hasTimeConflict(blockA: TimeBlock, blockB: TimeBlock): boolean {
  const startA = parseTime(blockA.startTime);
  const endA = parseTime(blockA.endTime);
  const startB = parseTime(blockB.startTime);
  const endB = parseTime(blockB.endTime);

  // ตรวจสอบว่ามีวันที่ซ้อนทับกัน
  const sharedDays = blockA.days.filter((day) => blockB.days.includes(day));
  if (sharedDays.length === 0) return false;

  // ตรวจสอบเวลาซ้อนทับ
  return startA < endB && startB < endA;
}

/**
 * กรอง blocks สำหรับวันที่ระบุ
 */
export function getBlocksForDay(blocks: TimeBlock[], day: DayOfWeek): TimeBlock[] {
  return blocks
    .filter((block) => block.days.includes(day))
    .sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
}

/**
 * คำนวณ stats รวมชั่วโมงต่อ category ในวันที่ระบุ
 * @returns object { work: 6.5, exercise: 1, ... }
 */
export function getDayStats(
  blocks: TimeBlock[],
  day: DayOfWeek
): Record<BlockCategory, number> {
  const dayBlocks = getBlocksForDay(blocks, day);
  const stats: Record<BlockCategory, number> = {
    work: 0,
    exercise: 0,
    meal: 0,
    rest: 0,
    free: 0,
    sleep: 0,
  };

  dayBlocks.forEach((block) => {
    stats[block.category] += getBlockDuration(block);
  });

  return stats;
}

/**
 * หาวันในสัปดาห์ของวันนี้
 * @returns DayOfWeek string
 */
export function getTodayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday, ...
  const dayMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return dayMap[jsDay];
}

/**
 * คำนวณเวลาว่างที่เหลือในวัน (ชั่วโมง)
 * = (sleepTime - wakeTime) - totalBlockHours
 */
export function getFreeTimeRemaining(
  blocks: TimeBlock[],
  day: DayOfWeek,
  wakeTime: string,
  sleepTime: string
): number {
  const dayBlocks = getBlocksForDay(blocks, day);
  const wakeMins = parseTime(wakeTime);
  const sleepMins = parseTime(sleepTime);
  const totalAwake = (sleepMins - wakeMins + 1440) % 1440 / 60;
  const totalBlocked = dayBlocks.reduce((sum, b) => sum + getBlockDuration(b), 0);
  return Math.max(0, totalAwake - totalBlocked);
}

/**
 * ตรวจสอบ conflict กับ blocks ที่มีอยู่ (ไม่นับ block ตัวเอง)
 * @returns array ของ conflicting blocks
 */
export function findConflicts(
  newBlock: TimeBlock,
  existingBlocks: TimeBlock[]
): TimeBlock[] {
  return existingBlocks.filter(
    (existing) => existing.id !== newBlock.id && hasTimeConflict(newBlock, existing)
  );
}

/** แปลง DayOfWeek ผ่าน translation */
export function getDayLabel(day: DayOfWeek, t: (key: TranslationKey) => string): string {
  return t(`day_${day}` as TranslationKey);
}

/** แปลง DayOfWeek เป็นตัวย่อ 1 ตัวผ่าน translation */
export function getDayShort(day: DayOfWeek, t: (key: TranslationKey) => string): string {
  return t(`day_short_${day}` as TranslationKey);
}

/** แปลง BlockCategory ผ่าน translation */
export function getCategoryLabel(category: BlockCategory, t: (key: TranslationKey) => string): string {
  return t(`cat_${category}` as TranslationKey);
}

/**
 * หา TimeBlock ที่กำลังดำเนินการอยู่ ณ เวลาปัจจุบัน
 * @returns { block, progressPercent } หรือ null ถ้าไม่มี block ที่ตรง
 */
export function getCurrentActivity(
  blocks: TimeBlock[],
  day: DayOfWeek
): { block: TimeBlock; progressPercent: number } | null {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const dayBlocks = getBlocksForDay(blocks, day);

  for (const block of dayBlocks) {
    const start = parseTime(block.startTime);
    const end = parseTime(block.endTime);
    if (nowMins >= start && nowMins < end) {
      const elapsed = nowMins - start;
      const total = end - start;
      return {
        block,
        progressPercent: Math.min(100, (elapsed / total) * 100),
      };
    }
  }

  return null;
}
