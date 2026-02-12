import Link from 'next/link';
import { ArrowRight, Shield, Zap, MapPin, Heart, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-green-600">Kilat Pet Delivery</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm text-green-700">
              <Zap className="h-4 w-4" />
              Malaysia&apos;s #1 Pet Transport Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Safe & Fast Delivery for Your{' '}
              <span className="text-green-600">Furry Friends</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Book a trusted runner to transport your pets anywhere in Malaysia.
              Real-time GPS tracking, climate-controlled vehicles, and professional care from pickup to delivery.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/register">
                  Book a Delivery <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="h-4 w-4 text-green-500" />
                <span>10,000+ Deliveries</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                <span>5,000+ Happy Pets</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50/50 to-white" />
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Kilat Pet?</h2>
            <p className="mt-4 text-lg text-gray-600">Everything your pet needs for a safe journey</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Safety First',
                desc: 'All runners are verified and trained. Climate-controlled vehicles with secure pet crates ensure maximum comfort.',
              },
              {
                icon: MapPin,
                title: 'Real-Time Tracking',
                desc: 'Track your pet\'s journey live on a map. Get instant updates on pickup, transit, and delivery status.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                desc: 'Nearby runners are matched instantly. Most pickups happen within 15 minutes of booking.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border bg-gray-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                  <feature.icon className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t bg-green-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">3 simple steps to transport your pet</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Book a Delivery', desc: 'Enter pickup & dropoff locations, add your pet details, and choose a time.' },
              { step: '2', title: 'Runner Picks Up', desc: 'A nearby verified runner accepts and heads to your pickup location with a secure pet crate.' },
              { step: '3', title: 'Track & Receive', desc: 'Track the journey live on a map. Your pet arrives safely at the destination.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Pay per delivery — no subscriptions, no hidden fees</p>
          </div>
          <div className="mx-auto mt-16 max-w-md rounded-2xl border-2 border-green-200 bg-white p-8 text-center shadow-lg">
            <p className="text-sm font-medium text-green-600">Starting from</p>
            <p className="mt-2 text-5xl font-bold text-gray-900">RM 15</p>
            <p className="mt-2 text-gray-600">per delivery</p>
            <ul className="mt-8 space-y-3 text-left text-sm">
              {[
                'GPS tracked delivery',
                'Climate-controlled vehicle',
                'Secured pet crate',
                'Real-time status updates',
                'Insurance coverage',
                'Customer support',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <span className="text-xs text-green-600">✓</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="mt-8 w-full bg-green-600 hover:bg-green-700" asChild>
              <Link href="/register">Start Booking</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to transport your pet safely?
          </h2>
          <p className="mt-4 text-lg text-green-100">
            Join thousands of pet owners who trust Kilat Pet Delivery.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <span className="font-bold text-white">Kilat Pet Delivery</span>
            </div>
            <p className="text-sm">&copy; 2026 Kilat Pet Delivery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
