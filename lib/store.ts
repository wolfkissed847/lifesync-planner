/**
 * store.ts — Zustand global state สำหรับ Life Planner
 * ใช้ persist middleware เก็บข้อมูลใน localStorage
 * รวม Budget + Schedule state ในที่เดียว
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';
import { IncomeSource, ExpenseCategory, TimeBlock, LifePlannerConfig } from './types';
import {
  DEFAULT_INCOMES,
  DEFAULT_EXPENSES,
  DEFAULT_CURRENCY,
  DEFAULT_WAKE_TIME,
  DEFAULT_SLEEP_TIME,
  DEFAULT_BLOCKS,
} from './constants';

/** State shape ของ store — รวม Budget + Schedule */
interface LifePlannerState {
  // ─── Settings Data ───
  language: 'th' | 'en';

  // ─── Budget Data ───
  currency: string;
  incomes: IncomeSource[];
  expenses: ExpenseCategory[];

  // ─── Schedule Data ───
  wakeTime: string;
  sleepTime: string;
  blocks: TimeBlock[];

  // ─── Budget Actions ───
  addIncome: (income: IncomeSource) => void;
  updateIncome: (id: string, income: Partial<IncomeSource>) => void;
  removeIncome: (id: string) => void;
  reorderIncomes: (oldIndex: number, newIndex: number) => void;

  addExpense: (expense: ExpenseCategory) => void;
  updateExpense: (id: string, expense: Partial<ExpenseCategory>) => void;
  removeExpense: (id: string) => void;
  reorderExpenses: (oldIndex: number, newIndex: number) => void;

  setCurrency: (currency: string) => void;
  setLanguage: (language: 'th' | 'en') => void;

  // ─── Schedule Actions ───
  addBlock: (block: TimeBlock) => void;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
  removeBlock: (id: string) => void;
  setWakeTime: (time: string) => void;
  setSleepTime: (time: string) => void;

  // ─── Global Actions ───
  resetAll: () => void;
  importConfig: (config: LifePlannerConfig) => void;
  exportConfig: () => LifePlannerConfig;
}

/** สร้าง Zustand store พร้อม localStorage persistence */
export const useBudgetStore = create<LifePlannerState>()(
  persist(
    (set, get) => ({
      // ─── Initial Settings State ───
      language: 'th',

      // ─── Initial Budget State ───
      currency: DEFAULT_CURRENCY,
      incomes: DEFAULT_INCOMES,
      expenses: DEFAULT_EXPENSES,

      // ─── Initial Schedule State ───
      wakeTime: DEFAULT_WAKE_TIME,
      sleepTime: DEFAULT_SLEEP_TIME,
      blocks: DEFAULT_BLOCKS,

      // ═══════════════════════════════
      //  BUDGET ACTIONS
      // ═══════════════════════════════

      /** เพิ่มแหล่งรายได้ใหม่ */
      addIncome: (income) =>
        set((state) => ({
          incomes: [...state.incomes, income],
        })),

      /** อัพเดท income ตาม id (partial update) */
      updateIncome: (id, updates) =>
        set((state) => ({
          incomes: state.incomes.map((inc) =>
            inc.id === id ? { ...inc, ...updates } : inc
          ),
        })),

      /** ลบ income ตาม id */
      removeIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((inc) => inc.id !== id),
        })),

      /** สลับตำแหน่ง income */
      reorderIncomes: (oldIndex, newIndex) =>
        set((state) => ({
          incomes: arrayMove(state.incomes, oldIndex, newIndex),
        })),

      /** เพิ่มหมวดรายจ่ายใหม่ */
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),

      /** อัพเดท expense ตาม id (partial update) */
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === id ? { ...exp, ...updates } : exp
          ),
        })),

      /** ลบ expense ตาม id */
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        })),

      /** สลับตำแหน่ง expense */
      reorderExpenses: (oldIndex, newIndex) =>
        set((state) => ({
          expenses: arrayMove(state.expenses, oldIndex, newIndex),
        })),

      /** เปลี่ยนสัญลักษณ์สกุลเงิน */
      setCurrency: (currency) => set({ currency }),

      /** เปลี่ยนภาษา */
      setLanguage: (language) => set({ language }),

      // ═══════════════════════════════
      //  SCHEDULE ACTIONS
      // ═══════════════════════════════

      /** เพิ่ม time block ใหม่ */
      addBlock: (block) =>
        set((state) => ({
          blocks: [...state.blocks, block],
        })),

      /** อัพเดท block ตาม id (partial update) */
      updateBlock: (id, updates) =>
        set((state) => ({
          blocks: state.blocks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      /** ลบ block ตาม id */
      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== id),
        })),

      /** ตั้งเวลาตื่น */
      setWakeTime: (time) => set({ wakeTime: time }),

      /** ตั้งเวลานอน */
      setSleepTime: (time) => set({ sleepTime: time }),

      // ═══════════════════════════════
      //  GLOBAL ACTIONS
      // ═══════════════════════════════

      /** รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น */
      resetAll: () =>
        set({
          language: 'th',
          currency: DEFAULT_CURRENCY,
          incomes: DEFAULT_INCOMES,
          expenses: DEFAULT_EXPENSES,
          wakeTime: DEFAULT_WAKE_TIME,
          sleepTime: DEFAULT_SLEEP_TIME,
          blocks: DEFAULT_BLOCKS,
        }),

      /** นำเข้าข้อมูลจาก JSON config */
      importConfig: (config) =>
        set({
          language: config.language || 'th',
          currency: config.budget.currency,
          incomes: config.budget.incomes,
          expenses: config.budget.expenses,
          wakeTime: config.schedule.wakeTime,
          sleepTime: config.schedule.sleepTime,
          blocks: config.schedule.blocks,
        }),

      /** ส่งออกข้อมูลปัจจุบันเป็น JSON config */
      exportConfig: () => {
        const state = get();
        return {
          language: state.language,
          budget: {
            currency: state.currency,
            incomes: state.incomes,
            expenses: state.expenses,
          },
          schedule: {
            wakeTime: state.wakeTime,
            sleepTime: state.sleepTime,
            blocks: state.blocks,
          },
        };
      },
    }),
    {
      name: 'life-planner-storage', // key ใน localStorage
    }
  )
);
