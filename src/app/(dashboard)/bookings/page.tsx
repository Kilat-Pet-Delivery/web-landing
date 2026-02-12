'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { formatMYR, formatDate, getStatusColor, getStatusLabel } from '@/lib/format';
import type { PaginatedResponse } from '@/types/api';
import type { Booking } from '@/types/booking';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get<PaginatedResponse<Booking>>(`/api/v1/bookings?page=${page}&limit=10`)
      .then(({ data }) => {
        setBookings(data.data || []);
        setTotalPages(data.pagination?.total_pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your pet deliveries</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/bookings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">No bookings yet</p>
              <p className="mt-1">Create your first booking to get started</p>
              <Button className="mt-4" asChild>
                <Link href="/bookings/new">Create Booking</Link>
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
                      <p className="font-medium">#{booking.booking_number}</p>
                      <Badge className={getStatusColor(booking.status)} variant="secondary">
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium">{booking.pet_spec?.name} ({booking.pet_spec?.pet_type})</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.pickup_address?.line1} → {booking.dropoff_address?.line1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatMYR(booking.estimated_price_cents)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(booking.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
