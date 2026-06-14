"use client";

import { useEffect, useRef } from "react";

interface Props {
  center: { lat: number; lon: number } | null;
  route: Array<{ lat: number; lon: number }>;
}

export function RunningMap({ center, route }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const polylineRef = useRef<import("leaflet").Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon paths broken by bundlers
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const initial = center ?? { lat: 37.5665, lon: 126.978 }; // 서울 기본값
      const map = L.map(containerRef.current!).setView([initial.lat, initial.lon], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;

      if (center) {
        markerRef.current = L.marker([center.lat, center.lon]).addTo(map);
      }
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      polylineRef.current = null;
    };
  }, []);

  // 위치 업데이트
  useEffect(() => {
    if (!mapRef.current || !center) return;

    (async () => {
      const L = await import("leaflet");
      const { lat, lon } = center;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      } else {
        markerRef.current = L.marker([lat, lon]).addTo(mapRef.current!);
      }

      mapRef.current!.setView([lat, lon], 16);

      // 경로 그리기
      if (route.length > 1) {
        const latlngs = route.map((p) => [p.lat, p.lon] as [number, number]);
        if (polylineRef.current) {
          polylineRef.current.setLatLngs(latlngs);
        } else {
          polylineRef.current = L.polyline(latlngs, {
            color: "#a78bfa",
            weight: 4,
            opacity: 0.8,
          }).addTo(mapRef.current!);
        }
      }
    })();
  }, [center, route]);

  return (
    <div
      ref={containerRef}
      className="h-64 w-full rounded-2xl overflow-hidden border border-line"
      style={{ zIndex: 0 }}
    />
  );
}
