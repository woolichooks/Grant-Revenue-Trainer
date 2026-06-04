import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PillProps {
  children: ReactNode;
  bg?: string;
  color?: string;
  icon?: LucideIcon;
  iconColor?: string;
  style?: CSSProperties;
}

export function Pill({
  children,
  bg = 'var(--ww-navy-050)',
  color = 'var(--ww-navy)',
  icon: Icon,
  iconColor,
  style,
}: PillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: bg,
        color,
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        padding: '6px 12px',
        borderRadius: 999,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={2.4} color={iconColor || color} />}
      {children}
    </span>
  );
}
