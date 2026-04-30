import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
}

export default function Map({ center, zoom = 10, markers = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    markers.forEach((marker) => {
      L.marker([marker.lat, marker.lng])
        .addTo(map)
        .bindPopup(marker.title);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [center, zoom, markers]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-2xl overflow-hidden"
      aria-label="Zemljevid destinacij"
    />
  );
}
