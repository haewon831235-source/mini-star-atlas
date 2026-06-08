import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

const STYLES: Record<Rarity, string> = {
  N: "bg-rarity-n/20 text-rarity-n",
  R: "bg-rarity-r/20 text-rarity-r",
  SR: "bg-rarity-sr/20 text-rarity-sr",
  SSR: "bg-rarity-ssr/20 text-rarity-ssr",
  UR: "gradient-ur text-night",
};

export function RarityTag({ rarity, className }: { rarity: Rarity; className?: string }) {
  return <Badge className={cn(STYLES[rarity], className)}>{rarity}</Badge>;
}
