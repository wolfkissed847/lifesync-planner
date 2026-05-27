/**
 * calculations.ts — Pure functions สำหรับคำนวณ budget
 * ทุกฟังก์ชันเป็น pure function ไม่มี side effect
 * ใช้ Intl.NumberFormat สำหรับ format ตัวเลขทุกจุด
 */

import { IncomeSource, ExpenseCategory } from './types';

/**
 * แปลงรายได้เป็นรายเดือน
 * - daily: amount × daysPerMonth (default 30)
 * - weekly: amount × 4.33
 * - monthly: amount × 1
 */
export function toMonthlyIncome(income: IncomeSource): number {
  switch (income.frequency) {
    case 'daily':
      return income.amount * (income.daysPerMonth ?? 30);
    case 'weekly':
      return income.amount * 4.33;
    case 'monthly':
      return income.amount;
    default:
      return 0;
  }
}

/**
 * แปลงรายจ่ายเป็นรายเดือน
 * - daily: amount × 30
 * - monthly: amount × 1
 */
export function toMonthlyExpense(expense: ExpenseCategory): number {
  switch (expense.frequency) {
    case 'daily':
      return expense.amount * 30;
    case 'monthly':
      return expense.amount;
    default:
      return 0;
  }
}

/** คำนวณรายได้รวมต่อเดือน */
export function getTotalMonthlyIncome(incomes: IncomeSource[]): number {
  return incomes.reduce((sum, income) => sum + toMonthlyIncome(income), 0);
}

/** คำนวณรายจ่ายรวมต่อเดือน */
export function getTotalMonthlyExpense(expenses: ExpenseCategory[]): number {
  return expenses.reduce((sum, expense) => sum + toMonthlyExpense(expense), 0);
}

/** คำนวณเงินคงเหลือต่อเดือน (รายได้ - รายจ่าย) */
export function getRemaining(
  incomes: IncomeSource[],
  expenses: ExpenseCategory[]
): number {
  return getTotalMonthlyIncome(incomes) - getTotalMonthlyExpense(expenses);
}

/**
 * Format ตัวเลขเป็นสกุลเงินด้วย Intl.NumberFormat
 * @param amount - จำนวนเงิน
 * @param currency - สัญลักษณ์สกุลเงิน เช่น "฿"
 * @returns string เช่น "฿12,600"
 */
export function formatCurrency(amount: number, currency: string): string {
  const formatted = new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';
  return `${sign}${currency}${formatted}`;
}

/**
 * Format ตัวเลขธรรมดา (ไม่มีสัญลักษณ์สกุลเงิน)
 * @param value - ตัวเลข
 * @returns string เช่น "12,600"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * คำนวณเปอร์เซ็นต์ของแต่ละหมวดรายจ่ายเทียบกับรายจ่ายรวม
 * @returns array ของ { label, amount, percentage, icon, isFixed }
 */
export function getExpenseBreakdown(expenses: ExpenseCategory[]) {
  const total = getTotalMonthlyExpense(expenses);
  if (total === 0) return [];

  return expenses.map((expense) => {
    const monthly = toMonthlyExpense(expense);
    return {
      id: expense.id,
      label: expense.label,
      icon: expense.icon,
      amount: monthly,
      percentage: (monthly / total) * 100,
      isFixed: expense.isFixed,
    };
  });
}

/**
 * คำนวณเปอร์เซ็นต์ของแต่ละแหล่งรายได้เทียบกับรายได้รวม
 * @returns array ของ { label, amount, percentage }
 */
export function getIncomeBreakdown(incomes: IncomeSource[]) {
  const total = getTotalMonthlyIncome(incomes);
  if (total === 0) return [];

  return incomes.map((income) => {
    const monthly = toMonthlyIncome(income);
    return {
      id: income.id,
      label: income.label,
      amount: monthly,
      percentage: (monthly / total) * 100,
    };
  });
}
