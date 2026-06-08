"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { Starfield } from "@/components/starfield";
import { useUser } from "@/store/user-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading } = useUser();

  useEffect(() => {
    if (!loading && !profile) router.replace("/onboarding");
  }, [loading, profile, router]);

  if (loading || !profile) {
    return (
      <div className="relative flex min-h-[100dvh] items-center justify-center gradient-galaxy">
        <Starfield count={30} />
        <div className="relative z-10 h-2 w-2 animate-ping rounded-full bg-accent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh]">
      <div className="pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
