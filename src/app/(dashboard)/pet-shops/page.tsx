'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Store, Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';
import type { ApiResponse } from '@/types/api';
import type { PetShop, PetShopCategory } from '@/types/petshop';

const categories: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'vet', label: 'Veterinary' },
  { value: 'boarding', label: 'Boarding' },
  { value: 'pet_store', label: 'Pet Store' },
];

const categoryColors: Record<string, string> = {
  grooming: 'bg-purple-100 text-purple-700',
  vet: 'bg-blue-100 text-blue-700',
  boarding: 'bg-orange-100 text-orange-700',
  pet_store: 'bg-green-100 text-green-700',
};

export default function PetShopsPage() {
  const [shops, setShops] = useState<PetShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = category
      ? `/api/v1/petshops?category=${category}`
      : '/api/v1/petshops';
    api.get<ApiResponse<PetShop[]>>(url)
      .then(({ data }) => setShops(data.data || []))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pet Shops</h1>
        <p className="text-muted-foreground">Browse pet shops near you</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat.value)}
            className={category === cat.value ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <Store className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No pet shops found</p>
          <p className="text-sm">Try a different category</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <Link key={shop.id} href={`/pet-shops/${shop.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Store className="h-5 w-5 text-green-600" />
                    </div>
                    <Badge className={categoryColors[shop.category] || 'bg-gray-100 text-gray-700'} variant="secondary">
                      {shop.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="mt-4 font-semibold">{shop.name}</h3>
                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {shop.address}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span>{shop.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">• {shop.services?.length || 0} services</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
