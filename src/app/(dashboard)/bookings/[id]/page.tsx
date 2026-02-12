'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, CreditCard, Navigation, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { formatMYR, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/format';
import type { ApiResponse } from '@/types/api';
import type { Booking } from '@/types/booking';

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<Booking>>(`/api/v1/bookings/${id}`)
      .then(({ data }) => setBooking(data.data))
      .catch(() => router.push('/bookings'))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function handleConfirmDelivery() {
    setActionLoading(true);
    try {
      const { data } = await api.post<ApiResponse<Booking>>(`/api/v1/bookings/${id}/confirm`);
      setBooking(data.data);
    } catch { /* ignore */ }
    setActionLoading(false);
  }

  async function handleCancel() {
    setActionLoading(true);
    try {
      const { data } = await api.post<ApiResponse<Booking>>(`/api/v1/bookings/${id}/cancel`, {
        reason: cancelReason || undefined,
      });
      setBooking(data.data);
      setCancelOpen(false);
    } catch { /* ignore */ }
    setActionLoading(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!booking) return null;

  const canTrack = ['accepted', 'picked_up', 'in_transit'].includes(booking.status);
  const canPay = booking.status === 'requested';
  const canConfirm = booking.status === 'delivered';
  const canCancel = ['requested', 'accepted'].includes(booking.status);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Booking #{booking.booking_number}</h1>
          <Badge className={getStatusColor(booking.status)} variant="secondary">
            {getStatusLabel(booking.status)}
          </Badge>
        </div>
      </div>

      {/* Pet Info */}
      <Card>
        <CardHeader><CardTitle>Pet Details</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{booking.pet_spec?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium capitalize">{booking.pet_spec?.pet_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-medium">{booking.pet_spec?.weight_kg} kg</span>
          </div>
          {booking.pet_spec?.breed && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Breed</span>
              <span className="font-medium">{booking.pet_spec.breed}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader><CardTitle>Route</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-sm text-muted-foreground">{booking.pickup_address?.line1}, {booking.pickup_address?.city}</p>
            </div>
          </div>
          <div className="ml-1.5 h-6 border-l-2 border-dashed border-gray-300" />
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-medium">Dropoff</p>
              <p className="text-sm text-muted-foreground">{booking.dropoff_address?.line1}, {booking.dropoff_address?.city}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <span className="text-lg font-medium">Price</span>
          <span className="text-2xl font-bold text-green-600">
            {formatMYR(booking.final_price_cents || booking.estimated_price_cents)}
          </span>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{formatDateTime(booking.created_at)}</span>
          </div>
          {booking.picked_up_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Picked Up</span>
              <span>{formatDateTime(booking.picked_up_at)}</span>
            </div>
          )}
          {booking.delivered_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivered</span>
              <span>{formatDateTime(booking.delivered_at)}</span>
            </div>
          )}
          {booking.cancelled_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cancelled</span>
              <span>{formatDateTime(booking.cancelled_at)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canTrack && (
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/bookings/${booking.id}/tracking`}>
              <Navigation className="mr-2 h-4 w-4" />
              Track Delivery
            </Link>
          </Button>
        )}
        {canPay && (
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href={`/bookings/${booking.id}/payment`}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Link>
          </Button>
        )}
        {canConfirm && (
          <Button onClick={handleConfirmDelivery} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
            <MapPin className="mr-2 h-4 w-4" />
            {actionLoading ? 'Confirming...' : 'Confirm Delivery'}
          </Button>
        )}
        {canCancel && (
          <Button variant="destructive" onClick={() => setCancelOpen(true)}>
            <X className="mr-2 h-4 w-4" />
            Cancel Booking
          </Button>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep Booking</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
              {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
