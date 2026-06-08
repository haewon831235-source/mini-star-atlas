"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  back = false,
  right,
  className,
}: {
  title?: string;
  back?: boolean;
  right?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-line/60 bg-night/80 px-3 backdrop-blur",
        className,
      )}
    >
      {back && (
        <button
          onClick={() => router.back()}
          aria-label="뒤로"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-elevated"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {title && <h1 className="flex-1 truncate text-base font-bold text-ink">{title}</h1>}
      {!title && <div className="flex-1" />}
      {right}
    </header>
  );
}
