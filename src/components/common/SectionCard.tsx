import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ icon, title, subtitle, action, children, className = '' }: Props) {
  return (
    <div className={`glass-card p-6 sm:p-8 animate-slide-up ${className}`}>
      <SectionHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        action={action}
      />
      {children}
    </div>
  );
}