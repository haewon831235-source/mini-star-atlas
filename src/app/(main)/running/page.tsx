"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Pause, Square, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/store/user-provider";
import { cn } from "@/lib/utils";
import { RunningResultCanvas } from "@/components/running-result-canvas";

const RunningMap = dynamic(
  () => import("@/components/running-map").then((m) => m.RunningMap),
  { ssr: false, loading: () => <div className="h-64 w-full rounded-2xl bg-elevated border border-line flex items-center justify-center text-xs text-ink-muted">지도 로딩 중...</div> }
);

interface Coord { lat: number; lon: number }

interface RunRecord {
  id: string;
  date: string;
  distance: number;
  duration: number;
  pace: number;
  starPoints: number;
}

const STORAGE_KEY = "msa.running.history";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number): string {
  if (!isFinite(secondsPerKm) || secondsPerKm <= 0) return `--'--"`;
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

function loadHistory(): RunRecord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}

function saveHistory(records: RunRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RunningPage() {
  const { addStar, earnBadge } = useUser();
  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [history, setHistory] = useState<RunRecord[]>([]);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsReady, setGpsReady] = useState(false);
  const [currentPos, setCurrentPos] = useState<Coord | null>(null);
  const [route, setRoute] = useState<Coord[]>([]);
  const [lastRoute, setLastRoute] = useState<Coord[]>([]);
  const [lastDistance, setLastDistance] = useState(0);
  const [lastDuration, setLastDuration] = useState(0);

  const lastPos = useRef<Coord | null>(null);
  const watchId = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distanceRef = useRef(0);

  useEffect(() => {
    setHistory(loadHistory());
    if (!navigator.geolocation) {
      setGpsError("이 기기에서는 GPS를 지원하지 않습니다.");
    } else {
      // 페이지 진입 시 현재 위치 미리 가져오기
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentPos({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setGpsReady(true);
        },
        () => setGpsReady(true),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const stopGps = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    lastPos.current = null;
  }, []);

  const startGps = useCallback(() => {
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coord: Coord = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCurrentPos(coord);
        setRoute((prev) => [...prev, coord]);

        if (lastPos.current) {
          const d = haversine(lastPos.current.lat, lastPos.current.lon, coord.lat, coord.lon);
          if (d > 0.005) {
            distanceRef.current += d;
            setDistance(distanceRef.current);
          }
        }
        lastPos.current = coord;
      },
      (err) => setGpsError(`GPS 오류: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 },
    );
  }, []);

  const handleStart = () => {
    setRoute([]);
    distanceRef.current = 0;
    setDistance(0);
    setDuration(0);
    setStatus("running");
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    startGps();
  };

  const handlePause = () => {
    setStatus("paused");
    stopTimer();
    stopGps();
  };

  const handleResume = () => {
    setStatus("running");
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    startGps();
  };

  const handleStop = () => {
    stopTimer();
    stopGps();

    const starPoints = Math.floor(distanceRef.current * 10);
    const pace = duration > 0 && distanceRef.current > 0 ? duration / distanceRef.current : 0;

    const record: RunRecord = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("ko-KR"),
      distance: Math.round(distanceRef.current * 100) / 100,
      duration,
      pace,
      starPoints,
    };

    const updated = [record, ...loadHistory()].slice(0, 20);
    saveHistory(updated);
    setHistory(updated);

    if (starPoints > 0) addStar(starPoints);
    earnBadge("ac-first-run");

    setLastRoute(route);
    setLastDistance(Math.round(distanceRef.current * 100) / 100);
    setLastDuration(duration);

    setStatus("idle");
    setRoute([]);
  };

  const pace = duration > 0 && distance > 0 ? duration / distance : 0;

  return (
    <div className="flex min-h-[100dvh] flex-col gradient-galaxy pb-24 pt-4">
      <div className="px-6 py-4">
        <h1 className="text-xl font-extrabold text-ink text-glow">러닝</h1>
        <p className="text-sm text-ink-muted">별빛 아래 달려요 ✨</p>
      </div>

      {/* 지도 */}
      <div className="mx-6 mb-4">
        <RunningMap center={currentPos} route={route} />
      </div>

      {/* 실시간 스탯 */}
      <div className="mx-6 rounded-2xl border border-line bg-elevated px-6 py-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-extrabold text-ink">{distance.toFixed(2)}</p>
            <p className="mt-1 text-xs text-ink-muted">km</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink">{formatDuration(duration)}</p>
            <p className="mt-1 text-xs text-ink-muted">시간</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-ink">{formatPace(pace)}</p>
            <p className="mt-1 text-xs text-ink-muted">페이스</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <MapPin size={14} className={cn(status === "running" ? "text-accent" : "text-ink-muted")} />
          <span className="text-xs text-ink-muted">
            {status === "running" ? "GPS 추적 중" : status === "paused" ? "일시정지" : "GPS 대기"}
          </span>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="mx-6 mt-4 flex items-center gap-3">
        {status === "idle" && (
          <Button size="lg" className="w-full" onClick={handleStart} disabled={!gpsReady || !!gpsError}>
            <Play size={20} className="mr-2" /> 러닝 시작
          </Button>
        )}
        {status === "running" && (
          <>
            <Button variant="outline" size="lg" className="flex-1" onClick={handlePause}>
              <Pause size={20} className="mr-2" /> 일시정지
            </Button>
            <Button size="lg" className="flex-1 bg-destructive hover:bg-destructive/90" onClick={handleStop}>
              <Square size={20} className="mr-2" /> 종료
            </Button>
          </>
        )}
        {status === "paused" && (
          <>
            <Button size="lg" className="flex-1" onClick={handleResume}>
              <Play size={20} className="mr-2" /> 재개
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={handleStop}>
              <Square size={20} className="mr-2" /> 종료
            </Button>
          </>
        )}
      </div>

      {gpsError && (
        <p className="mx-6 mt-3 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">{gpsError}</p>
      )}
      {status !== "idle" && (
        <p className="mt-3 text-center text-xs text-ink-muted">⭐ 1km 달릴 때마다 10 Star Point 획득</p>
      )}

      {/* 러닝 결과 지도 */}
      <RunningResultCanvas route={lastRoute} distance={lastDistance} duration={lastDuration} />

      {/* 러닝 기록 */}
      {history.length > 0 && (
        <div className="mx-6 mt-8">
          <h2 className="mb-3 font-semibold text-ink">러닝 기록</h2>
          <ul className="space-y-2">
            {history.map((r) => (
              <li key={r.id} className="rounded-xl border border-line bg-elevated px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">{r.distance} km</p>
                    <p className="text-xs text-ink-muted">
                      {r.date} · {formatDuration(r.duration)} · {formatPace(r.pace)}/km
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                    <Trophy size={14} /> +{r.starPoints}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
