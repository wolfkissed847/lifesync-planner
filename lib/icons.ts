/**
 * utils.ts — Utility สำหรับ Lucide icon dynamic rendering
 * ใช้สำหรับ render icon ตามชื่อที่เก็บใน expense category
 */

import {
  Home,
  Zap,
  Utensils,
  Car,
  Bus,
  Phone,
  Wifi,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Shirt,
  Coffee,
  PiggyBank,
  CreditCard,
  Baby,
  Dog,
  Dumbbell,
  Plane,
  Droplet,
  ShoppingCart,
  Tv,
  Fuel,
  Pill,
  Sparkles,
  Wrench,
  TrendingUp,
  Gift,
  Music,
  Book,
  Laptop,
  FileText,
  Shield,
  Trees,
  Package,
  Film,
  Ellipsis,
  WashingMachine,
  type LucideIcon,
} from 'lucide-react';

/** Map ชื่อ icon string → Lucide component */
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  zap: Zap,
  utensils: Utensils,
  car: Car,
  bus: Bus,
  phone: Phone,
  wifi: Wifi,
  'shopping-bag': ShoppingBag,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'gamepad-2': Gamepad2,
  shirt: Shirt,
  coffee: Coffee,
  'piggy-bank': PiggyBank,
  'credit-card': CreditCard,
  baby: Baby,
  dog: Dog,
  dumbbell: Dumbbell,
  plane: Plane,
  droplet: Droplet,
  'shopping-cart': ShoppingCart,
  tv: Tv,
  fuel: Fuel,
  pill: Pill,
  sparkles: Sparkles,
  wrench: Wrench,
  'trending-up': TrendingUp,
  gift: Gift,
  music: Music,
  book: Book,
  laptop: Laptop,
  'file-text': FileText,
  shield: Shield,
  trees: Trees,
  package: Package,
  film: Film,
  'washing-machine': WashingMachine,
  ellipsis: Ellipsis,
};

/**
 * ดึง Lucide icon component จากชื่อ string
 * ถ้าไม่เจอจะ return Ellipsis เป็น fallback
 */
export function getIconComponent(name: string): LucideIcon {
  return iconMap[name] || Ellipsis;
}
