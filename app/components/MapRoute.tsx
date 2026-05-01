'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RoutingMachine({ userLocation, destLocation }: { userLocation: L.LatLngExpression, destLocation: L.LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation as L.LatLngTuple),
        L.latLng(destLocation as L.LatLngTuple)
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: true,
      collapsible: true,
      createMarker: function(i: number, wp: any, nWps: number) {
        if (i === 0) {
          return L.marker(wp.latLng, { icon: userIcon }).bindPopup('Lokasi Anda');
        } else if (i === nWps - 1) {
          return L.marker(wp.latLng, { icon: destIcon }).bindPopup('Tujuan Anda');
        }
        return L.marker(wp.latLng);
      }
    } as any);

    routingControl.on('routingerror', function(e) {
      console.warn('Routing error caught', e);
    });

    routingControl.addTo(map);

    return () => {
      try {
        if (map && map.removeControl) {
          routingControl.getPlan().setWaypoints([]);
          map.removeControl(routingControl);
        }
      } catch (err) {
        console.warn('Leaflet cleanup error ignored', err);
      }
    };
  }, [map, userLocation, destLocation]);

  return null;
}

export default function MapRoute({ destLat, destLon, placeName }: { destLat?: number, destLon?: number, placeName: string }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser Anda');
      setUserLocation([-7.4245, 109.2302]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.error(err);
        setError('Gagal mengambil lokasi Anda. Menampilkan rute simulasi dari alun-alun Purwokerto.');
        setUserLocation([-7.4245, 109.2302]);
      }
    );
  }, []);

  const targetLocation: [number, number] = (destLat && destLon) ? [destLat, destLon] : [-7.3144, 109.2300];

  if (!userLocation) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Menyiapkan Rute...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-16 left-4 right-4 z-[400] bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg shadow-md text-sm">
          {error}
        </div>
      )}

      <MapContainer 
        center={userLocation} 
        zoom={13} 
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine userLocation={userLocation} destLocation={targetLocation} />
      </MapContainer>
    </div>
  );
}
