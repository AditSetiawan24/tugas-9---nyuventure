'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Heart, Map as MapIcon, Ticket, X, Star } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';


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

const OTM_API_KEY = process.env.NEXT_PUBLIC_OTM_API_KEY || '';

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface POI {
  xid: string;
  name: string;
  rate: number;
  osm: string;
  wikidata: string;
  kinds: string;
  point: { lon: number; lat: number };
}

export default function MapNearYou() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [places, setPlaces] = useState<POI[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<POI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [nearbyFoods, setNearbyFoods] = useState<POI[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);


  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser Anda');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchPlaces(latitude, longitude);
      },
      (err) => {
        console.error(err);
        const fallback: [number, number] = [-7.4245, 109.2302];
        setUserLocation(fallback);
        fetchPlaces(fallback[0], fallback[1]);
        setError('Akses lokasi ditolak. Menampilkan area Banyumas.');
      }
    );
  }, []);

  const fetchPlaces = async (lat: number, lon: number) => {
    try {
      const radius = 10000;
      const kinds = 'interesting_places,tourist_facilities';
      
      const res = await fetch(
        `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&rate=2&format=json&apikey=${OTM_API_KEY}`
      );
      
      if (!res.ok) throw new Error('Gagal mengambil data wisata');
      
      const data = await res.json();
      const validPlaces = data.filter((p: POI) => p.name && p.name.trim() !== '').slice(0, 50);
      setPlaces(validPlaces);
    } catch (err) {
      console.error("Fetch error, using fallback data:", err);
      setPlaces([
        { xid: '1', name: 'Curug Bayan', rate: 4.6, osm: '', wikidata: '', kinds: 'waterfalls,natural', point: { lat: lat + 0.01, lon: lon + 0.01 } },
        { xid: '2', name: 'Baturraden', rate: 4.8, osm: '', wikidata: '', kinds: 'tourist_attraction', point: { lat: lat + 0.02, lon: lon - 0.01 } },
        { xid: '3', name: 'Telaga Sunyi', rate: 4.7, osm: '', wikidata: '', kinds: 'lakes,natural', point: { lat: lat - 0.01, lon: lon + 0.02 } },
      ]);
      setError('Gagal menghubungi server peta. Karena batas akses API yang terbatas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPlace) {
      setPlaceDetails(null);
      setNearbyFoods([]);
      return;
    }

    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        let detailData = null;
        const detailRes = await fetch(`https://api.opentripmap.com/0.1/en/places/xid/${selectedPlace.xid}?apikey=${OTM_API_KEY}`);
        if (detailRes.ok) {
          detailData = await detailRes.json();
        }

        if (detailData && !detailData.preview?.source) {
          try {
            const wikiRes = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(selectedPlace.name)}`);
            if (wikiRes.ok) {
              const wikiData = await wikiRes.json();
              
              if (wikiData.thumbnail?.source) {
                detailData.preview = { source: wikiData.thumbnail.source };
              } else if (wikiData.originalimage?.source) {
                detailData.preview = { source: wikiData.originalimage.source };
              }
              
              if (!detailData.wikipedia_extracts?.text && wikiData.extract) {
                detailData.wikipedia_extracts = { text: wikiData.extract };
              }
            }
          } catch (e) {
            console.warn("Wikipedia API fallback failed", e);
          }
        }
        
        setPlaceDetails(detailData);

        const foodRes = await fetch(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=2000&lon=${selectedPlace.point.lon}&lat=${selectedPlace.point.lat}&kinds=foods&rate=2&format=json&apikey=${OTM_API_KEY}`
        );
        if (foodRes.ok) {
          const foodData = await foodRes.json();
          const validFoods = foodData.filter((p: POI) => p.name && p.name.trim() !== '').slice(0, 3);
          setNearbyFoods(validFoods);
        }
      } catch (err) {
        console.error("Failed to fetch details", err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedPlace]);

  const addToWishlist = async () => {
    if (!selectedPlace) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Silakan login terlebih dahulu');
        return;
      }

      const { error } = await supabase.from('wishlists').insert({
        user_id: user.id,
        place_id: selectedPlace.xid,
        place_name: selectedPlace.name,
        latitude: selectedPlace.point.lat,
        longitude: selectedPlace.point.lon,
      });

      if (error) throw error;
      alert('Berhasil ditambahkan ke Wishlist!');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan ke wishlist (Pastikan tabel wishlists sudah dibuat)');
    }
  };

  if (loading && !userLocation) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Mencari lokasi Anda...</p>
      </div>
    );
  }

  const getRating = (name: string) => {
    const base = 4.0;
    const add = (name.length % 10) / 10;
    return (base + add).toFixed(1);
  };

  const getFallbackImage = (kinds: string, xid: string) => {
    if (kinds.includes('beaches') || kinds.includes('sea')) {
      return 'https://img.freepik.com/free-photo/beautiful-tropical-beach-sea-ocean-with-white-cloud-blue-sky-copyspace_74190-8663.jpg';
    }
    if (kinds.includes('waterfalls')) {
      return 'https://img.freepik.com/free-photo/beautiful-view-waterfall-jungle_23-2148154145.jpg';
    }
    if (kinds.includes('mountains') || kinds.includes('nature_reserves')) {
      return 'https://img.freepik.com/free-photo/beautiful-landscape-green-mountains_23-2148227653.jpg';
    }
    if (kinds.includes('historic') || kinds.includes('monuments') || kinds.includes('temples') || kinds.includes('architecture')) {
      return 'https://img.freepik.com/free-photo/beautiful-architecture-building-exterior-with-nature-landscape_74190-6169.jpg';
    }
    if (kinds.includes('foods') || kinds.includes('restaurants') || kinds.includes('cafes')) {
      return 'https://img.freepik.com/free-photo/flat-lay-table-full-delicious-food-composition_23-2149141361.jpg';
    }
    
    const genericImages = [
      'https://img.freepik.com/free-photo/vertical-shot-beautiful-green-rice-terraces-with-mist-sunrise-indonesia_181624-11885.jpg',
      'https://t4.ftcdn.net/jpg/02/55/17/43/360_F_255174366_ojDuATz84e5h7lIlxh2moUJa9Kpd5wKk.jpg',
      'https://img.freepik.com/free-photo/amazing-shot-bridge-middle-forest-with-mountains-background_181624-17366.jpg',
      'https://img.freepik.com/free-photo/majestic-view-beautiful-forest-river-with-wooden-bridge-breathtaking-mountains_181624-12349.jpg'
    ];
    
    const index = (xid.length || 0) % genericImages.length;
    return genericImages[index];
  };

  return (
    <div className="w-full h-full relative">
      {error && (
        <div className="absolute top-16 left-4 right-4 z-[400] bg-orange-100 border border-orange-300 text-orange-800 px-4 py-2 rounded-lg shadow-md text-sm">
          {error}
        </div>
      )}

      {userLocation && (
        <MapContainer 
          center={userLocation} 
          zoom={13} 
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <ChangeView center={userLocation} zoom={13} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Lokasi Anda Saat Ini</Popup>
          </Marker>

          {places.map((place) => (
            <Marker 
              key={place.xid} 
              position={[place.point.lat, place.point.lon]}
              eventHandlers={{
                click: () => setSelectedPlace(place),
              }}
            />
          ))}
        </MapContainer>
      )}

      {selectedPlace && (
        <div className="absolute bottom-0 inset-x-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] bg-white rounded-t-3xl md:rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl z-[500] transition-transform duration-300 transform translate-y-0 p-5 pb-[76px] md:pb-5 flex flex-col max-h-[85vh]">
          
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3 md:hidden shrink-0" />
          
          <button 
            onClick={() => setSelectedPlace(null)}
            className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex-1 overflow-y-auto hide-scrollbar relative">
            <div className="flex items-start justify-between pr-8 mb-1">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">{selectedPlace.name}</h2>
            </div>
            
            <div className="flex items-center text-amber-500 text-sm mb-3">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span className="font-semibold">{getRating(selectedPlace.name)}</span>
              <span className="text-gray-400 ml-1">/ 5.0</span>
            </div>

            <div className="w-full h-32 bg-gray-200 rounded-xl mb-3 overflow-hidden relative">
              <img 
                src={placeDetails?.preview?.source || getFallbackImage(selectedPlace.kinds, selectedPlace.xid)} 
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-medium">
                Wisata
              </div>
            </div>

            {loadingDetails ? (
              <div className="animate-pulse space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {placeDetails?.wikipedia_extracts?.text ? (
                    placeDetails.wikipedia_extracts.text
                  ) : (
                    `Kategori: ${selectedPlace.kinds.split(',').join(', ').replace(/_/g, ' ')}. Tempat yang indah untuk dikunjungi di dekat lokasi Anda. Temukan pengalaman tak terlupakan di sini.`
                  )}
                </p>
                
                {nearbyFoods.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center">
                      <MapIcon className="w-4 h-4 mr-1 text-brand" /> Tempat Makan Terdekat
                    </h3>
                    <div className="space-y-2">
                      {nearbyFoods.map(food => (
                        <div key={food.xid} className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 truncate pr-2">{food.name}</span>
                          <div className="flex items-center text-amber-500 text-xs">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            <span>{getRating(food.name)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
            <button 
              onClick={addToWishlist}
              className="flex items-center justify-center w-12 h-12 shrink-0 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition"
              title="Tambahkan ke Wishlist"
            >
              <Heart className="w-6 h-6 text-red-500" />
            </button>
            <Link 
              href={`/mvp/pembayaran/${selectedPlace.xid}?name=${encodeURIComponent(selectedPlace.name)}&lat=${selectedPlace.point.lat}&lon=${selectedPlace.point.lon}`}
              className="flex-1 flex items-center justify-center h-12 bg-brand text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Tiket
            </Link>
            <Link 
              href={`/mvp/rute/${selectedPlace.xid}?lat=${selectedPlace.point.lat}&lon=${selectedPlace.point.lon}&name=${encodeURIComponent(selectedPlace.name)}`}
              className="flex-1 flex items-center justify-center h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Rute
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
