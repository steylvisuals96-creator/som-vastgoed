"use client";

import { useEffect, useRef } from "react";
import type { Property } from "@/sanity/queries";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletMarker = any;

// ── Limburg municipality coordinates lookup ───────────────────────────────────
const CITY_COORDS: Record<string, [number, number]> = {
  // Hasselt & deelgemeenten
  "hasselt": [50.9307, 5.3378],
  "kuringen": [50.9500, 5.3167],
  "stokrooie": [50.9167, 5.2833],
  "kermt": [50.9500, 5.2833],
  "wimmertingen": [50.9333, 5.2667],
  "spalbeek": [50.9500, 5.2667],
  "runkst": [50.9167, 5.3000],
  "sint-lambrechts-herk": [50.9333, 5.3667],
  // Genk
  "genk": [50.9651, 5.4988],
  "winterslag": [50.9667, 5.5000],
  "waterschei": [50.9833, 5.5167],
  // Overige grote steden
  "tongeren": [50.7819, 5.4639],
  "sint-truiden": [50.8167, 5.1833],
  "sint truiden": [50.8167, 5.1833],
  "maaseik": [51.0969, 5.7908],
  "lommel": [51.2283, 5.3139],
  "bilzen": [50.8772, 5.5167],
  "diepenbeek": [50.9000, 5.4167],
  "beringen": [51.0500, 5.2333],
  "heusden-zolder": [51.0333, 5.3167],
  "heusden": [51.0333, 5.3167],
  "zolder": [51.0167, 5.3000],
  "herk-de-stad": [50.9500, 5.1667],
  "lummen": [50.9833, 5.2000],
  "alken": [50.8667, 5.3000],
  "wellen": [50.8333, 5.3500],
  "borgloon": [50.8000, 5.3500],
  "nieuwerkerken": [50.8833, 5.2000],
  "gingelom": [50.7667, 5.1333],
  "léau": [50.7833, 5.0333],
  "zoutleeuw": [50.8000, 5.0500],
  "landen": [50.7500, 5.0667],
  "riemst": [50.8167, 5.5833],
  "maasmechelen": [50.9833, 5.7000],
  "lanaken": [50.8833, 5.6500],
  "dilsen-stokkem": [51.0333, 5.7167],
  "peer": [51.1333, 5.4500],
  "houthalen-helchteren": [51.0333, 5.3833],
  "houthalen": [51.0333, 5.3833],
  "helchteren": [51.0500, 5.4167],
  "bocholt": [51.1667, 5.5833],
  "neerpelt": [51.2333, 5.4333],
  "overpelt": [51.2167, 5.4167],
  "hamont-achel": [51.2500, 5.5500],
  "leopoldsburg": [51.1167, 5.2667],
  "ham": [51.0833, 5.1667],
  "tessenderlo": [51.0667, 5.0833],
  "diest": [51.0000, 5.0500],
  "aarschot": [50.9833, 4.8333],
  "tienen": [50.8000, 4.9333],
  "brussel": [50.8503, 4.3517],
  "leuven": [50.8798, 4.7005],
  "antwerpen": [51.2194, 4.4025],
  "gent": [51.0543, 3.7174],
};

function getCoords(location: string): [number, number] | null {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  // direct match
  if (CITY_COORDS[lower]) return CITY_COORDS[lower];
  // partial match
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (lower.includes(key) || key.includes(lower)) return coords;
  }
  return null;
}

// ── Small jitter so stacked pins don't overlap perfectly ─────────────────────
function jitter(val: number, amount = 0.003): number {
  return val + (Math.random() - 0.5) * amount;
}

const Y = "#facb04";
const B = "#111111";

interface Props {
  properties: Property[];
  onSelect: (p: Property) => void;
  hoveredId?: string | null;
}

export default function PropertyMap({ properties, onSelect, hoveredId }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import — Leaflet needs window
    import("leaflet").then((L) => {
      // Fix default icon paths (broken by webpack)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [50.93, 5.34],
        zoom: 10,
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom SVG pin icon factory
      function makeIcon(status: string) {
        const isKoop = status.toLowerCase().includes("koop");
        const isHuur = status.toLowerCase().includes("huur");
        const bg = isKoop ? Y : isHuur ? "#3b82f6" : "#6b7280";
        const icon = isKoop
          ? `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`
          : `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
          <ellipse cx="18" cy="41" rx="8" ry="3" fill="rgba(0,0,0,0.18)"/>
          <path d="M18 0C10.27 0 4 6.27 4 14c0 10.5 14 28 14 28S32 24.5 32 14C32 6.27 25.73 0 18 0z" fill="${bg}" stroke="white" stroke-width="1.5"/>
          <svg x="9" y="6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${bg === Y ? B : "white"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
        </svg>`;

        return L.divIcon({
          html: svg,
          className: "",
          iconSize: [36, 44],
          iconAnchor: [18, 44],
          popupAnchor: [0, -46],
        });
      }

      // Place markers
      properties.forEach((p) => {
        const coords = getCoords(p.location);
        if (!coords) return;
        const [lat, lng] = [jitter(coords[0]), jitter(coords[1])];

        const marker = L.marker([lat, lng], { icon: makeIcon(p.status) });

        const popupHtml = `
          <div style="width:220px;font-family:DM Sans,sans-serif;cursor:pointer" data-id="${p._id}">
            ${p.imageUrl ? `<img src="${p.imageUrl}" style="width:100%;height:110px;object-fit:cover;border-radius:8px 8px 0 0;display:block" alt="${p.title}"/>` : ""}
            <div style="padding:10px 12px">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;background:${p.status.toLowerCase().includes("koop") ? Y : "#3b82f6"};color:${p.status.toLowerCase().includes("koop") ? B : "white"}">${p.status}</span>
                <span style="font-size:10px;color:#888">${p.type}</span>
              </div>
              <p style="font-size:13px;font-weight:500;margin:0 0 2px;color:#111;line-height:1.3">${p.title}</p>
              <p style="font-size:11px;color:#888;margin:0 0 6px">${p.location}</p>
              <p style="font-size:14px;font-weight:700;color:#111;margin:0 0 8px">${p.price}</p>
              <div style="display:flex;gap:12px;font-size:11px;color:#888">
                <span>${p.beds} slpk</span>
                <span>${p.area} m²</span>
              </div>
            </div>
          </div>`;

        const popup = L.popup({ maxWidth: 240, minWidth: 220, className: "som-popup" })
          .setContent(popupHtml);

        marker.bindPopup(popup);
        marker.on("popupopen", () => {
          setTimeout(() => {
            const el = document.querySelector(`[data-id="${p._id}"]`);
            el?.addEventListener("click", () => onSelect(p));
          }, 50);
        });
        marker.addTo(map);
        markersRef.current[p._id] = marker;
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open popup on hover from sidebar
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    // Close all popups first
    mapInstanceRef.current.closePopup();
    if (hoveredId && markersRef.current[hoveredId]) {
      const marker = markersRef.current[hoveredId];
      marker.openPopup();
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.4 });
    }
  }, [hoveredId]);

  return (
    <>
      <style>{`
        .som-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border: none;
        }
        .som-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1;
        }
        .som-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "600px", position: "relative" }} />
    </>
  );
}
