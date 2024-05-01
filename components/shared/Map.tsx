"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map as LMap, icon } from "leaflet";
import worldCountries from "@/lib/getCountries";
import { useEffect, useRef } from "react";

const ICON = icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131261/isolated/preview/b2e48580147ca0ed3f970f30bf8bb009-karten-standortmarkierung.png",
  iconSize: [50, 50],
});

const defaultLatLang = [52.505, -0.09] as [number, number];

export default function Map({ locationValue }: { locationValue: string }) {
  const mapRef = useRef<LMap>(null);
  const map = mapRef.current;
  const zoom = 8;

  const { countryByValue } = worldCountries;
  const latLang = countryByValue(locationValue)?.latLang || defaultLatLang;

  useEffect(() => {
    if (map) {
      map.setView(latLang, zoom);
    }
  }, [latLang, map]);

  return (
    <MapContainer
      ref={mapRef}
      scrollWheelZoom={false}
      className="h-[50vh] rounded-lg relative z-0"
      center={latLang}
      zoom={zoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={latLang} icon={ICON} />
    </MapContainer>
  );
}
