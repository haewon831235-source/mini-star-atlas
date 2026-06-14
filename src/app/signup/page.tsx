"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { TopBar } from "@/components/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user-provider";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useUser();
  const [form, setForm] = useState({ email: "", password: "", nickname: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const er: Record<string, string> = {};
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) er.email = "올바른 이메일을 입력해 주세요.";
    if (form.password.length < 6) er.password = "비밀번호는 6자 이상이어야 해요.";
    if (form.nickname.trim().length < 2) er.nickname = "닉네임은 2자 이상이어야 해요.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const birthday = sessionStorage.getItem("pending_birthday") ?? "";
    if (!birthday) {
      router.replace("/birthday");
      return;
    }

    setLoading(true);
    const { error } = await signUp({ ...form, birthday });
    setLoading(false);
    if (error) return setErrors({ email: error });

    sessionStorage.removeItem("pending_birthday");
    router.push("/reveal/character");
  };

  return (
    <main className="relative min-h-[100dvh] gradient-galaxy">
      <Starfield count={30} />
      <TopBar title="회원가입" back />
      <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-4 px-6 py-6">
        <p className="text-sm text-ink-soft">별빛 여정을 시작할 정보를 입력해 주세요.</p>
        <Input label="이메일" name="email" type="email" placeholder="star@atlas.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Input label="비밀번호" name="password" type="password" placeholder="6자 이상" value={form.password} onChange={set("password")} error={errors.password} />
        <Input label="닉네임" name="nickname" placeholder="여행자 이름" value={form.nickname} onChange={set("nickname")} error={errors.nickname} />
        <Button size="lg" type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "별을 찾는 중..." : "가입하고 캐릭터 받기"}
        </Button>
        <Link href="/login" className="text-center text-sm text-ink-soft">
          이미 계정이 있으신가요? <span className="font-semibold text-accent">로그인</span>
        </Link>
      </form>
    </main>
  );
}
