import { cn } from "@/lib/utils";
import type { Zodiac } from "@/types";

const ELEMENT_BG: Record<string, string> = {
  fire: "from-[#FB7185] to-[#E8C76A]",
  earth: "from-[#86C28B] to-[#3f9c6d]",
  air: "from-[#93C5FD] to-[#7B61FF]",
  water: "from-[#7B61FF] to-[#3b82f6]",
};

export function ZodiacIcon({
  zodiac,
  size = 48,
  className,
}: {
  zodiac: Pick<Zodiac, "symbol" | "element">;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br font-bold shadow-inner",
        ELEMENT_BG[zodiac.element] ?? ELEMENT_BG.air,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      <span className="leading-none text-[#0D1028]">{zodiac.symbol}</span>
    </div>
  );
}
