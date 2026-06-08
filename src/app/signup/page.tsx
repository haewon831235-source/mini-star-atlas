"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { TopBar } from "@/components/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user-provider";
import { getZodiacByBirthday } from "@/lib/zodiac";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useUser();
  const [form, setForm] = useState({ email: "", password: "", nickname: "", birthday: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const er: Record<string, string> = {};
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) er.email = "올바른 이메일을 입력해 주세요.";
    if (form.password.length < 6) er.password = "비밀번호는 6자 이상이어야 해요.";
    if (form.nickname.trim().length < 2) er.nickname = "닉네임은 2자 이상이어야 해요.";
    if (!form.birthday) er.birthday = "생년월일을 입력해 주세요.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(form);
    setLoading(false);
    if (error) return setErrors({ email: error });
    router.push("/reveal/zodiac");
  };

  const preview = form.birthday ? getZodiacByBirthday(form.birthday) : null;

  return (
    <main className="relative min-h-[100dvh] gradient-galaxy">
      <Starfield count={30} />
      <TopBar title="회원가입" back />
      <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-4 px-6 py-6">
        <p className="text-sm text-ink-soft">별빛 여정을 시작할 정보를 입력해 주세요.</p>
        <Input label="이메일" name="email" type="email" placeholder="star@atlas.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Input label="비밀번호" name="password" type="password" placeholder="6자 이상" value={form.password} onChange={set("password")} error={errors.password} />
        <Input label="닉네임" name="nickname" placeholder="여행자 이름" value={form.nickname} onChange={set("nickname")} error={errors.nickname} />
        <Input label="생년월일" name="birthday" type="date" value={form.birthday} onChange={set("birthday")} error={errors.birthday} />

        {preview && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            🔮 당신의 별자리는 <b>{preview.name_ko} {preview.symbol}</b> 입니다!
          </div>
        )}

        <Button size="lg" type="submit" disabled={loading} className="mt-2 w-full">
          {loading ? "별을 찾는 중..." : "가입하고 별자리 받기"}
        </Button>
        <Link href="/login" className="text-center text-sm text-ink-soft">
          이미 계정이 있으신가요? <span className="font-semibold text-accent">로그인</span>
        </Link>
      </form>
    </main>
  );
}
