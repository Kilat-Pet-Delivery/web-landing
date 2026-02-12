'use client';

import { useEffect, useState } from 'react';
import { MapPin, Star, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { Runner } from '@/types/runner';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/maps/location-picker'), { ssr: false });

export default function NearbyRunnersPage() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(3.139);
  const [lng, setLng] = useState(101.6869);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        () => {} // keep default KL coordinates
      );
    }
  }, []);

  async function searchRunners() {
    setLoading(true);
    try {
      const { data } = await api.get<ApiResponse<Runner[]>>(
        `/api/v1/runners/nearby?latitude=${lat}&longitude=${lng}&radius_km=10`
      );
      setRunners(data.data || []);
    } catch {
      setRunners([]);
    }
    setLoading(false);
    setSearched(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nearby Runners</h1>
        <p className="text-muted-foreground">Find available delivery runners near you</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Your Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 overflow-hidden rounded-lg border">
            <LocationPicker lat={lat} lng={lng} onSelect={(la, ln) => { setLat(la); setLng(ln); }} />
          </div>
          <p className="text-xs text-muted-foreground">
            Tap map to adjust your location. Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
          </p>
          <Button onClick={searchRunners} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
            <MapPin className="mr-2 h-4 w-4" />
            {loading ? 'Searching...' : 'Search Nearby Runners'}
          </Button>
        </CardContent>
      </Card>

      {searched && (
        <Card>
          <CardHeader>
            <CardTitle>Available Runners ({runners.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {runners.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Truck className="mx-auto mb-3 h-10 w-10 opacity-50" />
                <p>No runners available nearby</p>
                <p className="text-sm">Try expanding your search radius</p>
              </div>
            ) : (
              <div className="space-y-3">
                {runners.map((runner) => (
                  <div key={runner.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{runner.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {runner.vehicle_type} — {runner.vehicle_model}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          {runner.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {runner.total_trips} trips
                        </span>
                        {runner.air_conditioned && (
                          <Badge variant="secondary" className="text-xs">AC</Badge>
                        )}
                      </div>
                    </div>
                    {runner.distance_km !== undefined && (
                      <div className="text-right">
                        <p className="font-medium text-green-600">{runner.distance_km.toFixed(1)} km</p>
                        <p className="text-xs text-muted-foreground">away</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
