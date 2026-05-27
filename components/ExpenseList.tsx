/**
 * ExpenseList.tsx — แสดงรายการ expense ทั้งหมด
 * Props: ไม่มี (ดึง data จาก zustand store)
 * Features: drag-and-drop reorder, tabs (ทั้งหมด/Fixed/Variable), slider ปรับ amount, badge, edit/delete
 */
'use client';

import { useState } from 'react';
import { Pencil, Trash2, Receipt, Plus, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBudgetStore } from '@/lib/store';
import { toMonthlyExpense, getTotalMonthlyExpense, formatCurrency } from '@/lib/calculations';
import { getIconComponent } from '@/lib/icons';
import AddExpenseModal from './AddExpenseModal';
import EmptyState from '@/components/shared/EmptyState';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import type { ExpenseCategory } from '@/lib/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/** Component ย่อยสำหรับแต่ละรายการที่สามารถลากได้ */
function SortableExpenseItem({
  expense,
  totalMonthly,
  currency,
  onEdit,
  onDelete,
  onSliderChange,
  t,
}: {
  expense: ExpenseCategory;
  totalMonthly: number;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
  onSliderChange: (value: number | readonly number[]) => void;
  t: (key: TranslationKey) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: expense.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const IconComp = getIconComponent(expense.icon);
  const monthly = toMonthlyExpense(expense);
  const percentage = totalMonthly > 0 ? (monthly / totalMonthly) * 100 : 0;
  const sliderMax = expense.frequency === 'daily' ? 1000 : 30000;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card/50 transition-all duration-200 hover:bg-card hover:shadow-md hover:shadow-rose-500/5 ${
        isDragging ? 'opacity-50 ring-2 ring-rose-500 shadow-xl' : ''
      }`}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 gradient-expense" />

      <div className="p-4 pl-3 flex">
        {/* Grip Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mr-2 mt-2 p-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="space-y-3 flex-1 min-w-0">
          {/* Top row: icon, name, badge, amount, actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-rose-500/10 shrink-0">
                <IconComp className="w-4.5 h-4.5 text-rose-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{expense.label}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[10px] shrink-0 ${
                      expense.isFixed
                        ? 'border-blue-500/30 text-blue-400'
                        : 'border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {expense.isFixed ? t('fixed') : t('variable')}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(`freq_${expense.frequency}` as TranslationKey)}
                  {expense.frequency === 'daily' &&
                    ` • ≈ ${formatCurrency(monthly, currency)}/${t('freq_monthly')}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-bold text-rose-400">
                {formatCurrency(expense.amount, currency)}
              </p>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={onEdit}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slider ปรับ amount real-time */}
          <div className="flex items-center gap-4">
            <Slider
              value={[expense.amount]}
              onValueChange={onSliderChange}
              max={sliderMax}
              min={0}
              step={expense.frequency === 'daily' ? 10 : 100}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 text-right">
              {percentage.toFixed(0)}%
            </span>
          </div>

          {/* Progress bar สัดส่วน */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-expense transition-all duration-300"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseList() {
  const { currency, expenses, removeExpense, updateExpense, reorderExpenses } = useBudgetStore();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'fixed' | 'variable'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseCategory | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Find original indices in the main `expenses` array to preserve accurate reordering
      const oldIndex = expenses.findIndex((exp) => exp.id === active.id);
      const newIndex = expenses.findIndex((exp) => exp.id === over.id);
      reorderExpenses(oldIndex, newIndex);
    }
  };

  /** Filter expenses ตาม tab ที่เลือก */
  const filteredExpenses = expenses.filter((exp) => {
    if (filter === 'fixed') return exp.isFixed;
    if (filter === 'variable') return !exp.isFixed;
    return true;
  });

  const totalMonthly = getTotalMonthlyExpense(expenses);

  const handleEdit = (expense: ExpenseCategory) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  /** ปรับ amount ผ่าน slider */
  const handleSliderChange = (id: string, value: number | readonly number[]) => {
    const amount = typeof value === 'number' ? value : value[0];
    updateExpense(id, { amount });
  };

  if (expenses.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={Receipt}
          title={t('no_expense')}
          description={t('no_expense_desc')}
          actionLabel={t('add_expense_btn')}
          onAction={handleAdd}
          iconColor="text-rose-400"
        />
        <AddExpenseModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          editingExpense={editingExpense}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header + Add button */}
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'fixed' | 'variable')}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all" className="text-xs">{t('all' as TranslationKey) || 'All'}</TabsTrigger>
            <TabsTrigger value="fixed" className="text-xs">{t('fixed')}</TabsTrigger>
            <TabsTrigger value="variable" className="text-xs">{t('variable')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          {t('add_expense_btn')}
        </Button>
      </div>

      {/* Expense items with Drag-and-Drop context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredExpenses.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <SortableExpenseItem
                key={expense.id}
                expense={expense}
                totalMonthly={totalMonthly}
                currency={currency}
                onEdit={() => handleEdit(expense)}
                onDelete={() => removeExpense(expense.id)}
                onSliderChange={(v) => handleSliderChange(expense.id, v)}
                t={t}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddExpenseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingExpense={editingExpense}
      />
    </div>
  );
}
