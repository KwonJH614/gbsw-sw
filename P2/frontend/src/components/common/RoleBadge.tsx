import type { Role } from '../../types/auth.types';

const ROLE_MAP: Record<Role, { label: string; className: string }> = {
  STUDENT: { label: '수강생', className: 'bg-bg text-text-secondary' },
  INSTRUCTOR: { label: '강사', className: 'bg-primary/10 text-primary' },
  ADMIN: { label: '관리자', className: 'bg-error/10 text-error' },
};

interface RoleBadgeProps {
  role: Role;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const info = ROLE_MAP[role] ?? { label: role, className: 'bg-bg text-text-secondary' };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.className}`}>
      {info.label}
    </span>
  );
}
