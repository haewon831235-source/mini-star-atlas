"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, HeartHandshake, ShoppingBag, User, Footprints, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  const TABS = [
    { href: "/home", label: t("home"), icon: Home },
    { href: "/worldmap", label: t("worldmap"), icon: Map },
    { href: "/running", label: t("running"), icon: Footprints },
    { href: "/compatibility", label: t("compatibility"), icon: HeartHandshake },
    { href: "/shop", label: t("shop"), icon: ShoppingBag },
    { href: "/passport", label: t("passport"), icon: Ticket },
    { href: "/mypage", label: t("my"), icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-line bg-surface/95 backdrop-blur">
      <ul className="flex h-16 items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-accent" : "text-ink-muted hover:text-ink-soft",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
