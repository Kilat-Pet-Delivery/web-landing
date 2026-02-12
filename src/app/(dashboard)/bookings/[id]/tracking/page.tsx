'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { getStatusColor, getStatusLabel } from '@/lib/format';
import { WebSocketManager } from '@/lib/websocket';
import type { ApiResponse } from '@/types/api';
import type { Booking } from '@/types/booking';
import type { TrackingUpdate } from '@/types/tracking';
import dynamic from 'next/dynamic';

const TrackingMap = dynamic(() => import('@/components/maps/tracking-map'), { ssr: false });

export default function TrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState<TrackingUpdate | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocketManager | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Booking>>(`/api/v1/bookings/${id}`)
      .then(({ data }) => setBooking(data.data))
      .catch(() => router.push('/bookings'))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    if (!booking) return;

    const ws = new WebSocketManager();
    wsRef.current = ws;

    ws.connect(
      booking.id,
      (update) => {
        setPosition(update);
        setConnected(true);
      },
      () => setConnected(false)
    );

    return () => {
      ws.disconnect();
    };
  }, [booking]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Live Tracking</h1>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(booking.status)} variant="secondary">
                {getStatusLabel(booking.status)}
              </Badge>
              {connected ? (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Wifi className="h-3 w-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <WifiOff className="h-3 w-3" /> Connecting...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[500px] overflow-hidden rounded-lg border">
        <TrackingMap
          pickup={booking.pickup_address}
          dropoff={booking.dropoff_address}
          currentPosition={position}
        />
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pet</p>
            <p className="font-medium">{booking.pet_spec?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Speed</p>
            <p className="font-medium">{position ? `${position.speed_kmh.toFixed(1)} km/h` : '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Last Update</p>
            <p className="font-medium">
              {position ? new Date(position.timestamp).toLocaleTimeString() : '—'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
