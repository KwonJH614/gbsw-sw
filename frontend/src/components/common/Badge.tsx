const LEVEL_MAP: Record<string, { label: string; className: string }> = {
  BEGINNER: { label: '입문', className: 'bg-success/10 text-success' },
  INTERMEDIATE: { label: '기초', className: 'bg-accent/10 text-accent' },
  ADVANCED: { label: '심화', className: 'bg-error/10 text-error' },
};

interface BadgeProps {
  level: string;
}

export default function Badge({ level }: BadgeProps) {
  const info = LEVEL_MAP[level] ?? { label: level, className: 'bg-bg text-text-secondary' };

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${info.className}`}>
      {info.label}
    </span>
  );
}
