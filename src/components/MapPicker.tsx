"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";

type Props = {
  lat: number;
  lon: number;
  zoom?: number;
  onChange?: (lat: number, lon: number) => void;
  height?: number;
  readOnly?: boolean;
};

const MARKER_SVG = `
<svg viewBox="0 0 32 44" width="32" height="44" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 0C7.2 0 0 7.2 0 16c0 11.4 16 28 16 28s16-16.6 16-28C32 7.2 24.8 0 16 0z" fill="#0d9488" stroke="white" stroke-width="2"/>
  <circle cx="16" cy="16" r="6" fill="white"/>
</svg>`;

export function MapPicker({
  lat,
  lon,
  zoom = 11,
  onChange,
  height = 280,
  readOnly = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: !readOnly,
        dragging: !readOnly,
        doubleClickZoom: !readOnly,
      }).setView([lat, lon], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "fj-marker",
        html: MARKER_SVG,
        iconSize: [32, 44],
        iconAnchor: [16, 44],
      });

      const marker = L.marker([lat, lon], {
        icon,
        draggable: !readOnly,
      }).addTo(map);

      if (!readOnly) {
        marker.on("dragend", () => {
          const p = marker.getLatLng();
          onChangeRef.current?.(p.lat, p.lng);
        });
        map.on("click", (e: Leaflet.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          onChangeRef.current?.(e.latlng.lat, e.latlng.lng);
        });
      }

      mapRef.current = map;
      markerRef.current = marker;

      // Leaflet needs invalidateSize when its container resizes (e.g., parent shows after a collapse)
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(containerRef.current);

      // Settle initial size after one tick
      window.setTimeout(() => map.invalidateSize(), 100);
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // mount-only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    const cur = marker.getLatLng();
    if (Math.abs(cur.lat - lat) < 1e-6 && Math.abs(cur.lng - lon) < 1e-6)
      return;
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon]);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Map"
      className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 z-0"
      style={{ height }}
    />
  );
}
