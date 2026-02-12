'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Package, MapPin, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth-store';
import api from '@/lib/api';
import { formatMYR, formatRelativeTime, getStatusColor, getStatusLabel } from '@/lib/format';
import type { PaginatedResponse } from '@/types/api';
import type { Booking } from '@/types/booking';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PaginatedResponse<Booking>>('/api/v1/bookings?page=1&limit=5')
      .then(({ data }) => setBookings(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeBookings = bookings.filter((b) =>
    ['requested', 'accepted', 'picked_up', 'in_transit'].includes(b.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.full_name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Manage your pet deliveries</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/bookings/new">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">New Booking</p>
                <p className="text-sm text-muted-foreground">Book a delivery</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/nearby-runners">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Find Runners</p>
                <p className="text-sm text-muted-foreground">Nearby runners</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/pet-shops">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Store className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold">Pet Shops</p>
                <p className="text-sm text-muted-foreground">Browse nearby</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Bookings</p>
            <p className="mt-1 text-3xl font-bold">{bookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-1 text-3xl font-bold text-green-600">{activeBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bookings">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No bookings yet</p>
              <Button className="mt-4" asChild>
                <Link href="/bookings/new">Create Your First Booking</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{booking.pet_spec?.name || 'Pet'}</p>
                      <Badge className={getStatusColor(booking.status)} variant="secondary">
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {booking.pickup_address?.city} → {booking.dropoff_address?.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatMYR(booking.estimated_price_cents)}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(booking.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
