/**
 * constants.ts — ค่าเริ่มต้น (default config) สำหรับ Budget Planner
 * ใช้เป็นข้อมูลตัวอย่างเมื่อเปิดแอปครั้งแรก
 * สามารถแก้ไข/ลบ/เพิ่มได้อิสระผ่าน UI
 */

import { IncomeSource, ExpenseCategory } from './types';

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
  { name: 'ellipsis', label: 'อื่นๆ' },
];
