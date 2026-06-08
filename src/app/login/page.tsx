"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user-provider";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) return setError(error);
    router.replace("/home");
  };

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center gradient-galaxy px-6">
      <Starfield count={40} />
      <div className="relative z-10 mb-10 text-center">
        <div className="mb-4 text-5xl">🌌</div>
        <h1 className="text-xl font-extrabold text-ink text-glow">MINI STAR ATLAS</h1>
        <p className="mt-2 text-sm text-ink-soft">다시 만나 반가워요, 여행자님</p>
      </div>
      <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-4">
        <Input label="이메일" type="email" placeholder="star@atlas.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="비밀번호" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        <Button size="lg" type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <Link href="/signup" className="text-center text-sm text-ink-soft">
          아직 계정이 없으신가요? <span className="font-semibold text-accent">회원가입</span>
        </Link>
      </form>
    </main>
  );
}
