/**
 * IncomeList.tsx — แสดงรายการ income ทั้งหมด
 * Props: ไม่มี (ดึง data จาก zustand store)
 * Features: drag-and-drop reorder, แสดง monthly equivalent, ปุ่ม edit/delete, empty state
 */
'use client';

import { useState } from 'react';
import { Pencil, Trash2, TrendingUp, Plus, Calendar, Repeat, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBudgetStore } from '@/lib/store';
import { toMonthlyIncome, formatCurrency } from '@/lib/calculations';
import AddIncomeModal from './AddIncomeModal';
import EmptyState from '@/components/shared/EmptyState';
import { useTranslation, TranslationKey } from '@/lib/i18n';
import type { IncomeSource } from '@/lib/types';
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
function SortableIncomeItem({
  income,
  currency,
  onEdit,
  onDelete,
  t,
}: {
  income: IncomeSource;
  currency: string;
  onEdit: () => void;
  onDelete: () => void;
  t: (key: TranslationKey) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: income.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const monthly = toMonthlyIncome(income);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl border border-border bg-card/50 transition-all duration-200 hover:bg-card hover:shadow-md hover:shadow-emerald-500/5 ${
        isDragging ? 'opacity-50 ring-2 ring-emerald-500 shadow-xl' : ''
      }`}
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 gradient-income" />

      <div className="flex items-center p-4 pl-3">
        {/* Grip Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="mr-2 p-1.5 cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{income.label}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Repeat className="w-3 h-3" />
              {t(`freq_${income.frequency}` as TranslationKey)}
            </span>
            {income.frequency === 'daily' && income.daysPerMonth && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {income.daysPerMonth} วัน/เดือน
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-emerald-400">
              {formatCurrency(income.amount, currency)}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /{t(`freq_${income.frequency}` as TranslationKey)}
              </span>
            </p>
            {income.frequency !== 'monthly' && (
              <p className="text-xs text-muted-foreground">
                ≈ {formatCurrency(monthly, currency)}/{t('freq_monthly')}
              </p>
            )}
          </div>

          {/* Actions */}
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
    </div>
  );
}

export default function IncomeList() {
  const { currency, incomes, removeIncome, reorderIncomes } = useBudgetStore();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging at least 8px to start, allows clicking on buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = incomes.findIndex((inc) => inc.id === active.id);
      const newIndex = incomes.findIndex((inc) => inc.id === over.id);
      reorderIncomes(oldIndex, newIndex);
    }
  };

  /** เปิด modal โหมดแก้ไข */
  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  /** เปิด modal โหมดเพิ่มใหม่ */
  const handleAdd = () => {
    setEditingIncome(null);
    setModalOpen(true);
  };

  if (incomes.length === 0) {
    return (
      <div className="animate-fade-in">
        <EmptyState
          icon={TrendingUp}
          title={t('no_income')}
          description={t('no_income_desc')}
          actionLabel={t('add_income_btn')}
          onAction={handleAdd}
          iconColor="text-emerald-400"
        />
        <AddIncomeModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          editingIncome={editingIncome}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header + Add button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          ทั้งหมด {incomes.length} รายการ
        </p>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          {t('add_income_btn')}
        </Button>
      </div>

      {/* Income items with Drag-and-Drop context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={incomes.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {incomes.map((income) => (
              <SortableIncomeItem
                key={income.id}
                income={income}
                currency={currency}
                onEdit={() => handleEdit(income)}
                onDelete={() => removeIncome(income.id)}
                t={t}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddIncomeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingIncome={editingIncome}
      />
    </div>
  );
}
