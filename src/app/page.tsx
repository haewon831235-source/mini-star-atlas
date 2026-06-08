"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { useUser } from "@/store/user-provider";

export default function SplashPage() {
  const router = useRouter();
  const { profile, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      router.replace(profile ? "/home" : "/onboarding");
    }, 1600);
    return () => clearTimeout(t);
  }, [loading, profile, router]);

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center gradient-galaxy">
      <Starfield count={60} />
      <div className="relative z-10 flex flex-col items-center" style={{ animation: "rise 0.6s ease both" }}>
        <div className="mb-6 text-6xl" style={{ animation: "float 6s ease-in-out infinite" }}>
          🌌
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink text-glow">MINI STAR ATLAS</h1>
        <p className="mt-2 text-sm text-ink-soft">별빛이 당신의 이야기를 기다립니다</p>
        <div className="mt-10 h-1.5 w-1.5 animate-ping rounded-full bg-accent" />
      </div>
      <p className="absolute bottom-6 z-10 text-xs text-ink-muted">v0.1.0</p>
    </main>
  );
}
