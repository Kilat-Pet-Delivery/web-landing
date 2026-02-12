'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Star, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { PetShop } from '@/types/petshop';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/maps/location-picker'), { ssr: false });

export default function PetShopDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [shop, setShop] = useState<PetShop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ApiResponse<PetShop>>(`/api/v1/petshops/${id}`)
      .then(({ data }) => setShop(data.data))
      .catch(() => router.push('/pet-shops'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!shop) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{shop.name}</h1>
          <Badge variant="secondary" className="capitalize">{shop.category.replace('_', ' ')}</Badge>
        </div>
      </div>

      {/* Map */}
      <div className="h-64 overflow-hidden rounded-lg border">
        <LocationPicker lat={shop.latitude} lng={shop.longitude} onSelect={() => {}} />
      </div>

      {/* Info */}
      <Card>
        <CardHeader><CardTitle>Shop Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-lg font-semibold">{shop.rating.toFixed(1)} / 5.0</span>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{shop.address}</span>
          </div>
          {shop.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{shop.phone}</span>
            </div>
          )}
          {shop.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{shop.email}</span>
            </div>
          )}
          {shop.opening_hours && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{shop.opening_hours}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      {shop.services && shop.services.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {shop.services.map((service) => (
                <Badge key={service} variant="secondary">{service}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {shop.description && (
        <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{shop.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
