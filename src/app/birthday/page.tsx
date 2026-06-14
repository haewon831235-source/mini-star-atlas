"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/starfield";
import { TopBar } from "@/components/top-bar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getZodiacByBirthday } from "@/lib/zodiac";

export default function BirthdayPage() {
  const router = useRouter();
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");

  const preview = birthday ? getZodiacByBirthday(birthday) : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return setError("생년월일을 입력해 주세요.");
    sessionStorage.setItem("pending_birthday", birthday);
    router.push("/reveal/zodiac");
  };

  return (
    <main className="relative min-h-[100dvh] gradient-galaxy">
      <Starfield count={40} />
      <TopBar title="생년월일 입력" back />
      <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-6 px-6 py-10">
        <p className="text-sm text-ink-soft">생년월일로 당신의 수호 별자리를 찾아드릴게요.</p>
        <Input
          label="생년월일"
          name="birthday"
          type="date"
          value={birthday}
          onChange={(e) => { setBirthday(e.target.value); setError(""); }}
          error={error}
        />
        {preview && (
          <div className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
            🔮 당신의 별자리는 <b>{preview.name_ko} {preview.symbol}</b> 입니다!
          </div>
        )}
        <Button size="lg" type="submit" className="mt-2 w-full">
          내 별자리 확인하기 ✨
        </Button>
      </form>
    </main>
  );
}
