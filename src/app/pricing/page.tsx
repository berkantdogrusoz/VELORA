'use client'

import Link from 'next/link'
import { ArrowRight, Check, Zap, Crown, Building2, ArrowLeft } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { toast } from 'sonner'

const plans = [
  {
    name: 'Starter',
    price: 5,
    credits: 50,
    perCredit: '0.10',
    icon: Zap,
    features: [
      '50 AI generations',
      'All templates',
      'HTML export',
      'Live preview',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 15,
    credits: 200,
    perCredit: '0.075',
    icon: Crown,
    features: [
      '200 AI generations',
      'All templates',
      'HTML export',
      'Live preview',
      '3D site support',
      'Priority generation',
    ],
    popular: true,
  },
  {
    name: 'Business',
    price: 40,
    credits: 600,
    perCredit: '0.067',
    icon: Building2,
    features: [
      '600 AI generations',
      'All templates',
      'HTML export',
      'Live preview',
      '3D site support',
      'Priority generation',
      'Extended context',
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (planName: string) => {
    if (!isSignedIn) {
      window.location.href = '/sign-in'
      return
    }

    setLoading(planName)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName.toLowerCase() }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Checkout failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen obsidian-bg gold-veins">
      {/* Nav */}
      <nav className="border-b border-gold/[0.08] bg-obsidian/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-gold font-semibold tracking-[0.08em] text-sm"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Élan<span className="text-foreground/90">Noire</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gold-muted/50 hover:text-gold/70 text-xs mono-text transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <Link
              href="/builder"
              className="btn-gold-fill px-4 py-2 text-[11px] mono-text tracking-wider"
            >
              Builder
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-8 pt-20 pb-12 text-center">
        <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted/50 mb-4">
          [ PRICING ]
        </p>
        <h1
          className="text-[clamp(2rem,4vw,4rem)] leading-[1.1] tracking-tight italic text-gold-gradient"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Pay only for what
          <br />
          you create.
        </h1>
        <p className="mt-6 mono-text text-[11px] text-gold-muted/60 tracking-wider max-w-md mx-auto leading-relaxed">
          NO SUBSCRIPTIONS. BUY CREDITS, USE THEM ANYTIME.
          <br />
          EACH AI GENERATION COSTS 1 CREDIT.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative gold-border-glow bg-obsidian-light/50 p-6 flex flex-col transition-all duration-500 hover:bg-obsidian-light/80 ${
                  plan.popular ? 'ring-1 ring-gold/30 scale-[1.02]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="mono-text text-[9px] tracking-widest bg-gold text-obsidian px-4 py-1 font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-gold/50" />
                  <p className="mono-text text-[10px] tracking-[0.2em] text-gold-muted/60">
                    {plan.name.toUpperCase()}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-light text-foreground/90">
                    ${plan.price}
                  </span>
                  <span className="text-gold-muted/40 text-sm ml-2">
                    / {plan.credits} credits
                  </span>
                </div>

                <p className="text-[10px] text-gold-muted/40 mono-text mb-6">
                  ${plan.perCredit} per generation
                </p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-gold/50 shrink-0" />
                      <span className="text-[12px] text-foreground/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.name)}
                  disabled={loading === plan.name}
                  className={`w-full py-3 text-[11px] mono-text tracking-widest flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'btn-gold-fill'
                      : 'border border-gold/[0.2] text-gold/70 hover:bg-gold/[0.08] hover:text-gold'
                  } disabled:opacity-50`}
                >
                  {loading === plan.name ? (
                    'Processing...'
                  ) : (
                    <>
                      BUY CREDITS
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2
            className="text-xl text-gold-gradient italic text-center mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Frequently asked
          </h2>
          <div className="space-y-4">
            <FaqItem
              q="What is a credit?"
              a="Each credit allows you to generate or modify one website. Credits never expire."
            />
            <FaqItem
              q="Do I get free credits?"
              a="Yes! Every new account gets 3 free credits to try out the platform."
            />
            <FaqItem
              q="Can I get a refund?"
              a="Unused credits can be refunded within 30 days of purchase."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="gold-border-glow bg-obsidian-light/30 p-5">
      <p className="text-sm text-foreground/80 font-medium mb-2">{q}</p>
      <p className="text-[12px] text-gold-muted/50 leading-relaxed">{a}</p>
    </div>
  )
}
