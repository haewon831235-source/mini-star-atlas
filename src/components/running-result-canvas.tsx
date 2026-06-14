"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Coord { lat: number; lon: number }

interface Props {
  route: Coord[];
  distance: number;
  duration: number;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPace(seconds: number, km: number): string {
  if (!km || !seconds) return "--'--\"";
  const spk = seconds / km;
  const m = Math.floor(spk / 60);
  const s = Math.round(spk % 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

export function RunningResultCanvas({ route, distance, duration }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || route.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // 배경 — galaxy 테마
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#161b3d");
    bg.addColorStop(0.6, "#0d1028");
    bg.addColorStop(1, "#050816");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 별 뿌리기
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // GPS 좌표 → 캔버스 픽셀 변환
    const lats = route.map((p) => p.lat);
    const lons = route.map((p) => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    const PAD = 60;
    const rangeX = maxLon - minLon || 0.001;
    const rangeY = maxLat - minLat || 0.001;

    const toX = (lon: number) => PAD + ((lon - minLon) / rangeX) * (W - PAD * 2);
    const toY = (lat: number) => H - PAD - ((lat - minLat) / rangeY) * (H - PAD * 2);

    const pixels = route.map((p) => ({ x: toX(p.lon), y: toY(p.lat) }));

    // 경로 라인 (보조)
    ctx.beginPath();
    ctx.strokeStyle = "rgba(167, 139, 250, 0.25)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    pixels.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // 곰돌이 이미지를 경로 위에 일정 간격으로 찍기
    const bear = new Image();
    bear.src = "/polar-bear.jpeg";
    bear.onload = () => {
      const SIZE = 28;
      // 점 간격: 총 픽셀 거리 기준으로 균등 배치
      let accumulated = 0;
      const STEP = 36; // 픽셀 간격

      for (let i = 1; i < pixels.length; i++) {
        const dx = pixels[i].x - pixels[i - 1].x;
        const dy = pixels[i].y - pixels[i - 1].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        accumulated += dist;

        if (accumulated >= STEP) {
          accumulated = 0;
          // 원형 클리핑으로 곰돌이 동그랗게
          ctx.save();
          ctx.beginPath();
          ctx.arc(pixels[i].x, pixels[i].y, SIZE / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(bear, pixels[i].x - SIZE / 2, pixels[i].y - SIZE / 2, SIZE, SIZE);
          ctx.restore();
        }
      }

      // 시작점 — 별 마커
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🏁", pixels[0].x, pixels[0].y);

      // 끝점 — 트로피 마커
      const last = pixels[pixels.length - 1];
      ctx.fillText("⭐", last.x, last.y);

      // 하단 스탯 바
      ctx.fillStyle = "rgba(13,16,40,0.85)";
      ctx.fillRect(0, H - 52, W, 52);

      ctx.fillStyle = "#e8c76a";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${distance.toFixed(2)} km`, 16, H - 28);

      ctx.fillStyle = "#a6abc9";
      ctx.font = "12px sans-serif";
      ctx.fillText(`시간 ${formatDuration(duration)}  페이스 ${formatPace(duration, distance)}/km`, 16, H - 12);

      ctx.fillStyle = "#f5f6ff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Polaris Atelier Korea", W - 12, H - 18);
    };
  }, [route, distance, duration]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = `running-${Date.now()}.png`;
    a.click();
  };

  if (route.length < 2) return null;

  return (
    <div className="mx-6 mt-6">
      <h2 className="mb-3 font-semibold text-ink">러닝 결과 지도</h2>
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-full rounded-2xl border border-line"
      />
      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={handleDownload}
      >
        <Download size={14} className="mr-2" /> 이미지 저장
      </Button>
    </div>
  );
}
