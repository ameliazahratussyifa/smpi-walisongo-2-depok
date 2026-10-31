'use client';

import { useEffect, useRef } from 'react';

export default function CampusMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapRef.current) return;
      if (mapInstance.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapRef.current) return;

      const lat = -6.42588;
      const lng = 106.84073;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([lat, lng], 16);

      mapInstance.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          'Leaflet | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Icon marker
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      marker
        .bindPopup(
          `
        <div style="font-family: inherit; font-size: 0.85rem; padding: 4px; max-width: 260px;">
          <strong style="color: #0369a1; font-size: 0.95rem; display:block; margin-bottom: 4px; line-height: 1.3;">Kampus Utama SMP Islam Walisongo 2</strong>
          <span style="color: #475569; display:block; line-height: 1.4; margin-bottom: 8px;">Komplek Pendidikan Terpadu Jl. Cepit Raya, Kp. Sawah RT 05/02, Jatimulya, Cilodong, Kota Depok</span>
          <a href="https://www.google.com/maps/search/?api=1&query=SMP+Islam+Walisongo+2+Cilodong+Depok" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 700; text-decoration: underline;">Buka di Google Maps ➔</a>
        </div>
      `
        )
        .openPopup();

      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 400);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <section id="lokasi" className="campus-location-section">
      <div className="container" style={{ maxWidth: '1240px' }}>
        {/* Header Lokasi Kampus */}
        <div style={{ marginBottom: '1.75rem' }}>
          <span className="campus-tag-badge">LOKASI KAMPUS</span>
          <h2 className="campus-section-title">Temukan Kampus SMP Islam Walisongo 2 Depok</h2>
          <p className="campus-section-desc">
            Seluruh lokasi aktif ditampilkan dalam satu peta. Klik marker untuk melihat alamat.
          </p>
        </div>

        {/* Info Card Kampus Utama */}
        <div className="campus-info-card">
          <h3 className="campus-info-card-title">Kampus Utama</h3>
          <p className="campus-info-card-address">
            Komplek Pendidikan Terpadu Jl. Cepit Raya, Kp. Sawah RT. 005 / RW. 002, Kelurahan Jatimulya, Kecamatan Cilodong, Kota Depok, Jawa Barat 16413.
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=SMP+Islam+Walisongo+2+Cilodong+Depok"
            target="_blank"
            rel="noopener noreferrer"
            className="campus-maps-link"
          >
            Google Maps ➔
          </a>
        </div>

        {/* Container Peta Leaflet + OpenStreetMap */}
        <div className="campus-map-wrapper">
          <div ref={mapRef} id="campusMap" style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>
    </section>
  );
}
