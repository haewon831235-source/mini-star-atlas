import { cn } from "@/lib/utils";

export function EmptyState({
  icon = "✨",
  title,
  description,
  action,
  className,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-8 py-16 text-center", className)}>
      <div className="mb-3 text-4xl opacity-80">{icon}</div>
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** 카드/리스트 로딩용 스켈레톤 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-elevated/70", className)} />;
}
