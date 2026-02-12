'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import { formatMYR } from '@/lib/format';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiResponse } from '@/types/api';
import type { Booking } from '@/types/booking';
import type { Payment } from '@/types/payment';

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [bookingRes, paymentRes] = await Promise.allSettled([
          api.get<ApiResponse<Booking>>(`/api/v1/bookings/${id}`),
          api.get<ApiResponse<Payment>>(`/api/v1/payments/booking/${id}`),
        ]);
        if (bookingRes.status === 'fulfilled') setBooking(bookingRes.value.data.data);
        if (paymentRes.status === 'fulfilled') setPayment(paymentRes.value.data.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handlePay() {
    if (!booking || !user) return;
    setPaying(true);
    setError('');
    try {
      const { data } = await api.post<ApiResponse<Payment>>('/api/v1/payments/initiate', {
        booking_id: booking.id,
        amount_cents: booking.estimated_price_cents,
        currency: booking.currency || 'MYR',
        customer_email: user.email,
      });
      setPayment(data.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Payment failed');
    }
    setPaying(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!booking) return null;

  const isPaid = payment?.escrow_status === 'held' || payment?.escrow_status === 'released';

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Payment</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pet</span>
            <span className="font-medium">{booking.pet_spec?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route</span>
            <span className="font-medium text-right text-sm">
              {booking.pickup_address?.city} → {booking.dropoff_address?.city}
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-green-600">
              {formatMYR(booking.estimated_price_cents)}
            </span>
          </div>
        </CardContent>
      </Card>

      {isPaid ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex flex-col items-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-xl font-bold text-green-800">Payment Successful</h2>
            <p className="mt-2 text-sm text-green-600">
              Your payment of {formatMYR(payment!.amount_cents)} has been held in escrow.
            </p>
            <Button className="mt-6" onClick={() => router.push(`/bookings/${booking.id}`)}>
              View Booking
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Pay Now</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            <p className="text-sm text-muted-foreground">
              Payment will be held in secure escrow until delivery is confirmed.
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={handlePay}
              disabled={paying}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {paying ? 'Processing...' : `Pay ${formatMYR(booking.estimated_price_cents)}`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
