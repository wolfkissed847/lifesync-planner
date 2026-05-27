/**
 * ConfirmDialog.tsx — Reusable confirmation dialog
 * Props: open, onOpenChange, title, description, confirmLabel, onConfirm, variant
 * ใช้สำหรับ action ที่ต้องการยืนยัน เช่น ลบข้อมูล, รีเซ็ต
 */
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = 'destructive',
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const finalConfirmLabel = confirmLabel || t('save');
  const finalCancelLabel = cancelLabel || t('cancel');
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-white/10">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${variant === 'destructive' ? 'text-destructive' : ''}`}>
            {variant === 'destructive' && <AlertTriangle className="w-5 h-5" />}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {finalCancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            className="gap-2"
          >
            {finalConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
