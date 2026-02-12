'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { formatMYR } from '@/lib/format';
import type { ApiResponse } from '@/types/api';
import type { Booking, Address, PetSpec } from '@/types/booking';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/maps/location-picker'), { ssr: false });

const petTypes = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'];

export default function NewBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [pet, setPet] = useState<PetSpec>({
    pet_type: 'dog',
    name: '',
    weight_kg: 0,
    breed: '',
    special_needs: '',
  });

  const [pickup, setPickup] = useState<Address>({
    line1: '',
    city: '',
    state: 'Kuala Lumpur',
    country: 'Malaysia',
    latitude: 3.139,
    longitude: 101.6869,
  });

  const [dropoff, setDropoff] = useState<Address>({
    line1: '',
    city: '',
    state: 'Kuala Lumpur',
    country: 'Malaysia',
    latitude: 3.15,
    longitude: 101.71,
  });

  const [notes, setNotes] = useState('');

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post<ApiResponse<Booking>>('/api/v1/bookings', {
        pet_spec: pet,
        pickup_address: pickup,
        dropoff_address: dropoff,
        notes: notes || undefined,
      });
      router.push(`/bookings/${data.data.id}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }

  const steps = ['Pet Details', 'Pickup Location', 'Dropoff Location', 'Review'];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Booking</h1>
        <p className="text-muted-foreground">Book a pet delivery in 4 simple steps</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`hidden text-sm sm:block ${i <= step ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-4 bg-gray-300 sm:w-8" />}
          </div>
        ))}
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      {/* Step 0: Pet Details */}
      {step === 0 && (
        <Card>
          <CardHeader><CardTitle>Pet Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pet Name</Label>
              <Input value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} placeholder="Buddy" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pet Type</Label>
                <Select value={pet.pet_type} onValueChange={(v) => setPet({ ...pet, pet_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {petTypes.map((t) => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" min="0" step="0.1" value={pet.weight_kg || ''} onChange={(e) => setPet({ ...pet, weight_kg: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Breed (optional)</Label>
              <Input value={pet.breed || ''} onChange={(e) => setPet({ ...pet, breed: e.target.value })} placeholder="Golden Retriever" />
            </div>
            <div className="space-y-2">
              <Label>Special Needs (optional)</Label>
              <Textarea value={pet.special_needs || ''} onChange={(e) => setPet({ ...pet, special_needs: e.target.value })} placeholder="Any medical conditions or special care instructions" />
            </div>
            <Button className="w-full" onClick={() => setStep(1)} disabled={!pet.name || !pet.weight_kg}>
              Next: Pickup Location
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Pickup */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Pickup Location</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={pickup.line1} onChange={(e) => setPickup({ ...pickup, line1: e.target.value })} placeholder="123 Jalan Bukit Bintang" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={pickup.city} onChange={(e) => setPickup({ ...pickup, city: e.target.value })} placeholder="Kuala Lumpur" required />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={pickup.state} onChange={(e) => setPickup({ ...pickup, state: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tap map to set pickup pin</Label>
              <div className="h-64 overflow-hidden rounded-lg border">
                <LocationPicker
                  lat={pickup.latitude}
                  lng={pickup.longitude}
                  onSelect={(lat, lng) => setPickup({ ...pickup, latitude: lat, longitude: lng })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates: {pickup.latitude.toFixed(4)}, {pickup.longitude.toFixed(4)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(2)} disabled={!pickup.line1 || !pickup.city}>
                Next: Dropoff
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Dropoff */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Dropoff Location</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={dropoff.line1} onChange={(e) => setDropoff({ ...dropoff, line1: e.target.value })} placeholder="456 Jalan Ampang" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={dropoff.city} onChange={(e) => setDropoff({ ...dropoff, city: e.target.value })} placeholder="Kuala Lumpur" required />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={dropoff.state} onChange={(e) => setDropoff({ ...dropoff, state: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tap map to set dropoff pin</Label>
              <div className="h-64 overflow-hidden rounded-lg border">
                <LocationPicker
                  lat={dropoff.latitude}
                  lng={dropoff.longitude}
                  onSelect={(lat, lng) => setDropoff({ ...dropoff, latitude: lat, longitude: lng })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Coordinates: {dropoff.latitude.toFixed(4)}, {dropoff.longitude.toFixed(4)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)} disabled={!dropoff.line1 || !dropoff.city}>
                Next: Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Review Booking</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-semibold">Pet</h3>
              <p className="text-sm">{pet.name} — {pet.pet_type}, {pet.weight_kg} kg</p>
              {pet.breed && <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>}
              {pet.special_needs && <p className="text-sm text-muted-foreground">Special needs: {pet.special_needs}</p>}
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-semibold">Pickup</h3>
              <p className="text-sm">{pickup.line1}, {pickup.city}, {pickup.state}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-semibold">Dropoff</h3>
              <p className="text-sm">{dropoff.line1}, {dropoff.city}, {dropoff.state}</p>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional instructions for the runner" />
            </div>
            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">Estimated Price</p>
              <p className="text-2xl font-bold text-green-800">{formatMYR(2500)}</p>
              <p className="text-xs text-green-600">Final price calculated after runner accepts</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Confirm Booking'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
