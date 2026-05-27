/**
 * types.ts — TypeScript types สำหรับ Life Planner App
 * รวม 2 ระบบ: Budget + Schedule
 * ออกแบบให้ reusable ไม่ผูกกับอาชีพใดอาชีพหนึ่ง
 */

// ═══════════════════════════════════════
//  BUDGET TYPES
// ═══════════════════════════════════════

/** แหล่งรายได้ — สามารถกำหนด frequency ได้ทั้ง daily/weekly/monthly */
export type IncomeSource = {
  id: string;
  label: string;         // ชื่อรายได้ เช่น "รายได้รอบเช้า"
  amount: number;        // จำนวนเงินต่อครั้ง
  frequency: 'daily' | 'weekly' | 'monthly';
  daysPerMonth?: number; // จำนวนวันต่อเดือน (ใช้เมื่อ frequency = 'daily')
};

/** หมวดรายจ่าย — แยก fixed (ค่าใช้จ่ายคงที่) vs variable (ผันแปร) */
export type ExpenseCategory = {
  id: string;
  label: string;         // ชื่อหมวด เช่น "ค่าเช่าห้อง"
  icon: string;          // ชื่อ lucide icon เช่น "home", "utensils"
  amount: number;        // จำนวนเงิน
  frequency: 'daily' | 'monthly';
  isFixed: boolean;      // true = ค่าใช้จ่ายคงที่, false = ค่าใช้จ่ายผันแปร
};

/** Configuration ของ Budget */
export type BudgetConfig = {
  currency: string;      // สัญลักษณ์สกุลเงิน: "฿", "$", "€", "¥", "£"
  incomes: IncomeSource[];
  expenses: ExpenseCategory[];
};

// ═══════════════════════════════════════
//  SCHEDULE TYPES
// ═══════════════════════════════════════

/** ประเภทของ time block */
export type BlockCategory =
  | 'work'
  | 'exercise'
  | 'meal'
  | 'rest'
  | 'free'
  | 'sleep';

/** วันในสัปดาห์ */
export type DayOfWeek =
  | 'mon' | 'tue' | 'wed'
  | 'thu' | 'fri' | 'sat' | 'sun';

/** Time Block — แต่ละ block ในตารางเวลา */
export type TimeBlock = {
  id: string;
  label: string;         // ชื่อ block เช่น "ส่งอาหารรอบเช้า"
  startTime: string;     // เวลาเริ่ม "08:00"
  endTime: string;       // เวลาสิ้นสุด "11:00"
  category: BlockCategory;
  note?: string;         // โน้ตเพิ่มเติม (optional)
  days: DayOfWeek[];     // วันที่ block นี้มีผล
};

/** Configuration ของ Schedule */
export type ScheduleConfig = {
  wakeTime: string;      // เวลาตื่น "07:30"
  sleepTime: string;     // เวลานอน "23:00"
  blocks: TimeBlock[];
};

// ═══════════════════════════════════════
//  UNIFIED CONFIG
// ═══════════════════════════════════════

/** Configuration รวมทั้ง 2 ระบบ — สำหรับ export/import */
export type LifePlannerConfig = {
  language?: 'th' | 'en';
  budget: BudgetConfig;
  schedule: ScheduleConfig;
};
