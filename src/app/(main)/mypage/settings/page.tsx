"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, KeyRound, ExternalLink } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Starfield } from "@/components/starfield";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/store/settings-provider";
import { useToast } from "@/store/toast-provider";

export default function SettingsPage() {
  const { apiKey, hasKey, setApiKey, clearApiKey } = useSettings();
  const toast = useToast();
  const [value, setValue] = useState(apiKey ?? "");
  const [show, setShow] = useState(false);

  const masked = apiKey ? `${apiKey.slice(0, 6)}••••••••${apiKey.slice(-4)}` : "";

  const save = () => {
    const v = value.trim();
    if (!v.startsWith("sk-")) {
      return toast("OpenAI 키는 보통 sk- 로 시작해요. 다시 확인해 주세요.");
    }
    setApiKey(v);
    toast("API 키가 저장됐어요 ✨");
  };

  const remove = () => {
    clearApiKey();
    setValue("");
    toast("API 키를 삭제했어요.");
  };

  return (
    <main className="relative min-h-[100dvh]">
      <Starfield count={20} />
      <TopBar title="설정" back />
      <div className="relative z-10 space-y-5 px-4 py-5">
        {/* 상태 */}
        <Card className="flex items-center gap-3 p-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${hasKey ? "bg-success/20 text-success" : "bg-elevated text-ink-muted"}`}>
            {hasKey ? <CheckCircle2 size={22} /> : <KeyRound size={22} />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink">OpenAI API 연결</p>
            <p className="text-xs text-ink-muted">{hasKey ? `연결됨 · ${masked}` : "미설정 (AI 기능 비활성)"}</p>
          </div>
        </Card>

        {/* 입력 */}
        <Card className="space-y-3 p-4">
          <p className="text-sm font-bold text-ink">OpenAI API 키</p>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              placeholder="sk-..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label={show ? "숨기기" : "보기"}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={save}>저장</Button>
            {hasKey && (
              <Button variant="outline" onClick={remove}>삭제</Button>
            )}
          </div>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent"
          >
            OpenAI에서 키 발급받기 <ExternalLink size={12} />
          </a>
        </Card>

        {/* 안내 */}
        <Card className="space-y-2 p-4 text-xs leading-relaxed text-ink-muted">
          <p>🔒 입력하신 키는 <b className="text-ink-soft">이 브라우저에만</b> 저장되며 서버로 전송되지 않습니다 (BYOK).</p>
          <p>✨ 키를 등록하면 <b className="text-ink-soft">오늘의 운세 AI 풀이</b>, <b className="text-ink-soft">궁합 AI 코멘트</b> 기능이 활성화됩니다.</p>
          <p>💰 사용량만큼 본인 OpenAI 계정에 과금됩니다 (gpt-4o-mini, 매우 저렴).</p>
        </Card>
      </div>
    </main>
  );
}
