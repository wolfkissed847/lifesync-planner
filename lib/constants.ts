/**
 * constants.ts — ค่าเริ่มต้น (default config) สำหรับ Life Planner
 * ใช้เป็นข้อมูลตัวอย่างเมื่อเปิดแอปครั้งแรก
 * สามารถแก้ไข/ลบ/เพิ่มได้อิสระผ่าน UI
 */

import { IncomeSource, ExpenseCategory, TimeBlock, BlockCategory, DayOfWeek } from './types';

// ═══════════════════════════════════════
//  BUDGET DEFAULTS
// ═══════════════════════════════════════

/** รายได้เริ่มต้น — ตัวอย่างสำหรับผู้ใช้ใหม่ */
export const DEFAULT_INCOMES: IncomeSource[] = [
  {
    id: 'income-1',
    label: 'รายได้รอบเช้า',
    amount: 170,
    frequency: 'daily',
    daysPerMonth: 30,
  },
  {
    id: 'income-2',
    label: 'รายได้รอบเย็น',
    amount: 250,
    frequency: 'daily',
    daysPerMonth: 30,
  },
];

/** รายจ่ายเริ่มต้น — ตัวอย่างสำหรับผู้ใช้ใหม่ */
export const DEFAULT_EXPENSES: ExpenseCategory[] = [
  {
    id: 'expense-1',
    label: 'ค่าเช่าห้อง',
    icon: 'home',
    amount: 3500,
    frequency: 'monthly',
    isFixed: true,
  },
  {
    id: 'expense-2',
    label: 'ค่าน้ำไฟ',
    icon: 'zap',
    amount: 500,
    frequency: 'monthly',
    isFixed: true,
  },
  {
    id: 'expense-3',
    label: 'อาหาร',
    icon: 'utensils',
    amount: 150,
    frequency: 'daily',
    isFixed: false,
  },
  {
    id: 'expense-4',
    label: 'อื่นๆ',
    icon: 'ellipsis',
    amount: 500,
    frequency: 'monthly',
    isFixed: false,
  },
];

/** สกุลเงินเริ่มต้น */
export const DEFAULT_CURRENCY = '฿';

/** รายการสกุลเงินที่รองรับ */
export const AVAILABLE_CURRENCIES = [
  { symbol: '฿', label: 'บาท (THB)' },
  { symbol: '$', label: 'ดอลลาร์ (USD)' },
  { symbol: '€', label: 'ยูโร (EUR)' },
  { symbol: '¥', label: 'เยน (JPY)' },
  { symbol: '£', label: 'ปอนด์ (GBP)' },
];

/** รายการ icon ที่ใช้ได้สำหรับ expense categories */
export const AVAILABLE_ICONS = [
  { name: 'home', label: 'บ้าน' },
  { name: 'zap', label: 'ไฟฟ้า' },
  { name: 'utensils', label: 'อาหาร' },
  { name: 'car', label: 'รถยนต์' },
  { name: 'bus', label: 'ขนส่ง' },
  { name: 'phone', label: 'โทรศัพท์' },
  { name: 'wifi', label: 'อินเทอร์เน็ต' },
  { name: 'shopping-bag', label: 'ช้อปปิ้ง' },
  { name: 'heart-pulse', label: 'สุขภาพ' },
  { name: 'graduation-cap', label: 'การศึกษา' },
  { name: 'gamepad-2', label: 'บันเทิง' },
  { name: 'shirt', label: 'เสื้อผ้า' },
  { name: 'coffee', label: 'เครื่องดื่ม' },
  { name: 'piggy-bank', label: 'ออมเงิน' },
  { name: 'credit-card', label: 'บัตรเครดิต' },
  { name: 'baby', label: 'เด็ก' },
  { name: 'dog', label: 'สัตว์เลี้ยง' },
  { name: 'dumbbell', label: 'ออกกำลังกาย' },
  { name: 'plane', label: 'ท่องเที่ยว' },
  { name: 'droplet', label: 'ค่าน้ำ' },
  { name: 'shopping-cart', label: 'ของชำ' },
  { name: 'tv', label: 'สตรีมมิ่ง' },
  { name: 'fuel', label: 'ค่าน้ำมัน' },
  { name: 'pill', label: 'ยา/รักษาโรค' },
  { name: 'sparkles', label: 'ความงาม' },
  { name: 'wrench', label: 'ซ่อมแซม' },
  { name: 'trending-up', label: 'ลงทุน' },
  { name: 'gift', label: 'ของขวัญ' },
  { name: 'music', label: 'ดนตรี' },
  { name: 'book', label: 'หนังสือ' },
  { name: 'laptop', label: 'ไอที' },
  { name: 'file-text', label: 'บิล/ภาษี' },
  { name: 'shield', label: 'ประกัน' },
  { name: 'trees', label: 'ต้นไม้/สวน' },
  { name: 'package', label: 'พัสดุ' },
  { name: 'film', label: 'ภาพยนตร์' },
  { name: 'washing-machine', label: 'เครื่องซักผ้า' },
  { name: 'ellipsis', label: 'อื่นๆ' },
];

// ═══════════════════════════════════════
//  SCHEDULE DEFAULTS
// ═══════════════════════════════════════

/** เวลาตื่นเริ่มต้น */
export const DEFAULT_WAKE_TIME = '07:30';

/** เวลานอนเริ่มต้น */
export const DEFAULT_SLEEP_TIME = '23:00';

/** วันในสัปดาห์ทั้งหมด */
export const DAYS_OF_WEEK: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** ทุกวัน (shortcut) */
export const ALL_DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/** สีของแต่ละ category */
export const CATEGORY_COLORS: Record<BlockCategory, { bg: string; text: string; border: string; hex: string }> = {
  work: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hex: '#3b82f6',
  },
  exercise: {
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    hex: '#ec4899',
  },
  meal: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    hex: '#f59e0b',
  },
  rest: {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hex: '#8b5cf6',
  },
  free: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    hex: '#22c55e',
  },
  sleep: {
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    hex: '#9ca3af',
  },
};

/** Block categories ที่ใช้ได้ */
export const AVAILABLE_CATEGORIES: { value: BlockCategory; label: string }[] = [
  { value: 'work', label: 'ทำงาน' },
  { value: 'exercise', label: 'ออกกำลังกาย' },
  { value: 'meal', label: 'มื้ออาหาร' },
  { value: 'rest', label: 'พักผ่อน' },
  { value: 'free', label: 'เวลาว่าง' },
  { value: 'sleep', label: 'นอน' },
];

/** Time blocks เริ่มต้น — ตัวอย่างสำหรับผู้ใช้ใหม่ */
export const DEFAULT_BLOCKS: TimeBlock[] = [
  {
    id: 'block-1',
    label: 'ส่งอาหารรอบเช้า',
    startTime: '08:00',
    endTime: '11:00',
    category: 'work',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    id: 'block-2',
    label: 'ส่งอาหารรอบเย็น',
    startTime: '17:00',
    endTime: '21:30',
    category: 'work',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    id: 'block-3',
    label: 'Bodyweight',
    startTime: '11:30',
    endTime: '12:30',
    category: 'exercise',
    days: ['mon', 'tue', 'thu', 'fri', 'sun'],
  },
  {
    id: 'block-4',
    label: 'กินข้าวกลางวัน',
    startTime: '12:30',
    endTime: '13:30',
    category: 'meal',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    id: 'block-5',
    label: 'พักผ่อน / งีบ',
    startTime: '13:30',
    endTime: '15:00',
    category: 'rest',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
  {
    id: 'block-6',
    label: 'เวลาว่าง / อ่านหนังสือ',
    startTime: '15:00',
    endTime: '17:00',
    category: 'free',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  },
];
