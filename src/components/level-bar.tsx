import { Progress } from "@/components/ui/progress";
import { expForLevel } from "@/lib/utils";

export function LevelBar({ level, experience }: { level: number; experience: number }) {
  const need = expForLevel(level);
  const pct = Math.min(100, Math.round((experience / need) * 100));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-bold text-accent">Lv.{level}</span>
        <span className="text-ink-muted">
          {experience} / {need} EXP
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
