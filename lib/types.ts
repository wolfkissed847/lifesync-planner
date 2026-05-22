/**
 * types.ts — TypeScript types สำหรับ Budget Planner App
 * ใช้เป็น data model กลางของทั้งแอป
 * ออกแบบให้ reusable ไม่ผูกกับอาชีพใดอาชีพหนึ่ง
 */

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

/** Configuration หลักของ Budget — ประกอบด้วย currency + รายได้ + รายจ่าย */
export type BudgetConfig = {
  currency: string;      // สัญลักษณ์สกุลเงิน: "฿", "$", "€", "¥", "£"
  incomes: IncomeSource[];
  expenses: ExpenseCategory[];
};
