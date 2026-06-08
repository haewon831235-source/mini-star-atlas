"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Character } from "@/types";

/** 캐릭터 아바타.
 *  image_url 이미지를 우선 렌더하고, 파일이 없거나 로드 실패하면
 *  테마색 그라데이션 + 이니셜 플레이스홀더로 자동 폴백한다. */
export function CharacterAvatar({
  character,
  size = 96,
  className,
  showRing = true,
}: {
  character: Pick<Character, "name" | "theme_color" | "image_url">;
  size?: number;
  className?: string;
  showRing?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const useImage = Boolean(character.image_url) && !failed;

  if (useImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={character.image_url}
        alt={character.name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={cn(
          "rounded-full object-cover",
          showRing && "ring-2 ring-white/20",
          className,
        )}
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 ${size * 0.3}px ${character.theme_color}66`,
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full font-extrabold text-night",
        showRing && "ring-2 ring-white/20",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `radial-gradient(120% 120% at 30% 20%, #ffffff55, ${character.theme_color} 45%, #0D1028 120%)`,
        boxShadow: `0 0 ${size * 0.3}px ${character.theme_color}66`,
      }}
    >
      <span className="text-[#0D1028] drop-shadow">{character.name.charAt(0)}</span>
    </div>
  );
}
