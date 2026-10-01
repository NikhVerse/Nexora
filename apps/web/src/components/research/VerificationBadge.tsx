import React from 'react';
import { ShieldCheck, AlertTriangle, MinusCircle, HelpCircle } from 'lucide-react';

type Status = 'verified' | 'conflicting' | 'partial' | 'weak' | 'unverified';

export const VerificationBadge: React.FC<{ status: Status; size?: 'sm' | 'md' }> = ({
  status, size = 'sm',
}) => {
  const cfg: Record<Status, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
    verified:   { label: 'Verified',    icon: <ShieldCheck  className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />, bg: 'var(--badge-verified-bg)',   text: 'var(--badge-verified-text)' },
    conflicting:{ label: 'Conflicting', icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />, bg: 'var(--badge-conflict-bg)',   text: 'var(--badge-conflict-text)' },
    partial:    { label: 'Partial',     icon: <MinusCircle  className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />, bg: 'var(--badge-partial-bg)',    text: 'var(--badge-partial-text)' },
    weak:       { label: 'Weak',        icon: <HelpCircle   className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />, bg: 'var(--badge-weak-bg)',       text: 'var(--badge-weak-text)' },
    unverified: { label: 'Unverified',  icon: <HelpCircle   className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />, bg: 'var(--badge-unverified-bg)', text: 'var(--badge-unverified-text)' },
  };
  const { label, icon, bg, text } = cfg[status] ?? cfg.unverified;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${pad}`}
      style={{ background: bg, color: text }}
    >
      {icon}{label}
    </span>
  );
};
