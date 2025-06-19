import type { FilePermissionLevel } from '@/constants/enum';

export interface PermissionOption {
  label: string;
  value: FilePermissionLevel;
  icon: string;
  description: string;
  color: string;
}

export interface PermissionSelectorProps {
  modelValue?: FilePermissionLevel | FilePermissionLevel[];
  mode?: 'single' | 'multiple' | 'cascade';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal' | 'grid';
  showDescription?: boolean;
}
