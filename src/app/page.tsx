'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  ArrowRight,
  Sparkles,
  Globe,
  Code2,
  Box,
  Palette,
  Download,
  Zap,
  Users,
  BarChart3,
  Clock,
  Shield,
} from 'lucide-react'
import { BrandLogo, brandNames } from '@/components/landing/BrandLogos'

/* ===== Animated Counter Hook ===== */
function useCounter(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!startCounting) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, startCounting])

  return count
}

/* Brand names imported from BrandLogos component */

export default function Home() {
  const { isSignedIn } = useAuth()
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-section-reveal')
            entry.target.classList.remove('opacity-0')

            // Trigger counter animation for stats section
            if (entry.target.getAttribute('data-stats')) {
              setStatsVisible(true)
            }
          }
        })
      },
      { threshold: 0.15 }
    )

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) sectionsRef.current[index] = el
  }

  const usersCount = useCounter(12847, 2000, statsVisible)
  const sitesCount = useCounter(48392, 2500, statsVisible)
  const uptimeCount = useCounter(99, 1500, statsVisible)
  const responseCount = useCounter(143, 1800, statsVisible)

  return (
    <div className="snap-container">
      {/* ===== HERO SECTION ===== */}
      <section className="snap-section obsidian-bg gold-veins flex flex-col">
        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-obsidian/60 backdrop-blur-2xl border-b border-gold/[0.08]">
          <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-gold font-semibold tracking-[0.08em] text-sm"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Élan<span className="text-foreground/90">Noire</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              <a href="#platform" className="mono-text text-[11px] text-gold-muted hover:text-gold transition-colors">
                Platform
              </a>
              <a href="#philosophy" className="mono-text text-[11px] text-gold-muted hover:text-gold transition-colors">
                Philosophy
              </a>
              <a href="#protocol" className="mono-text text-[11px] text-gold-muted hover:text-gold transition-colors">
                Protocol
              </a>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <Link
                  href="/builder"
                  className="btn-gold-fill px-5 py-2 text-[11px] mono-text tracking-wider"
                >
                  Go to Builder
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="mono-text text-[11px] text-gold-muted hover:text-gold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-gold-fill px-5 py-2 text-[11px] mono-text tracking-wider"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex items-center relative z-10">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-4xl">
              <h1 className="text-[clamp(1.8rem,3.5vw,3.5rem)] leading-[1.15] tracking-tight text-foreground/90 font-light">
                Intelligent experiences meet
              </h1>
              <h1
                className="text-[clamp(2.2rem,4.5vw,5rem)] leading-[1.05] tracking-tight italic text-gold-gradient"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Autonomous
                <br />
                precision.
              </h1>

              <p className="mt-10 mono-text text-[11px] leading-relaxed text-gold-muted max-w-lg tracking-wider">
                SYSTEM STATUS: ONLINE. ÉlanNoire integrates hyper-scaling
                conversational intelligence into web creation. No human
                intervention required.
              </p>

              <Link
                href="/builder"
                className="btn-gold-fill group inline-flex items-center gap-3 mt-10 px-8 py-4"
              >
                <span className="mono-text text-[12px] tracking-widest">
                  Request System Audit
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trusted by strip */}
        <div className="relative z-10 border-t border-gold/[0.06] pb-6">
          <div className="py-5">
            <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted/40 mb-5 text-center">
              TRUSTED BY INDUSTRY LEADERS
            </p>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...brandNames, ...brandNames].map((brand, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 mx-10 flex-shrink-0"
                >
                  <BrandLogo name={brand} className="w-5 h-5 text-gold/40" />
                  <span className="mono-text text-[13px] tracking-[0.12em] text-gold-muted/40 whitespace-nowrap">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF / STATS SECTION ===== */}
      <section className="snap-section obsidian-bg gold-veins flex items-center relative">
        <div
          ref={addRef(0)}
          data-stats="true"
          className="opacity-0 max-w-7xl mx-auto px-8 w-full py-20"
        >
          <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted mb-6 text-center">
            [ METRICS ]
          </p>
          <h2
            className="text-[clamp(2rem,4vw,4.5rem)] leading-[1.1] tracking-tight italic text-gold-gradient text-center max-w-3xl mx-auto mb-20"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Numbers don&apos;t lie.
            <br />
            Neither do we.
          </h2>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              value={usersCount.toLocaleString()}
              suffix="+"
              label="ACTIVE USERS"
              sublabel="across 40+ countries"
            />
            <StatCard
              icon={<Globe className="w-5 h-5" />}
              value={sitesCount.toLocaleString()}
              suffix=""
              label="SITES GENERATED"
              sublabel="and counting"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              value={responseCount.toString()}
              suffix="ms"
              label="AVG RESPONSE"
              sublabel="generation latency"
            />
            <StatCard
              icon={<Shield className="w-5 h-5" />}
              value={uptimeCount.toString()}
              suffix=".9%"
              label="UPTIME"
              sublabel="enterprise-grade reliability"
            />
          </div>

          {/* Testimonial / quote */}
          <div className="mt-20 max-w-2xl mx-auto text-center">
            <div className="gold-border-glow bg-obsidian-light/30 p-8">
              <p
                className="text-lg text-foreground/70 italic leading-relaxed"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                &ldquo;ÉlanNoire reduced our landing page development time from 2 weeks
                to 15 minutes. The AI understands design intent at a level
                I&apos;ve never seen before.&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <span className="text-[10px] text-gold font-bold">AK</span>
                </div>
                <div className="text-left">
                  <p className="text-[11px] text-foreground/60 font-medium">
                    Alex Keller
                  </p>
                  <p className="mono-text text-[9px] text-gold-muted/40 tracking-wider">
                    CTO, NEXTERA DIGITAL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ===== PLATFORM SECTION ===== */}
      <section id="platform" className="snap-section obsidian-bg gold-veins flex items-center relative">
        <div
          ref={addRef(1)}
          className="opacity-0 max-w-7xl mx-auto px-8 w-full py-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted mb-6">
                [ PLATFORM ]
              </p>
              <h2
                className="text-[clamp(2rem,4vw,4rem)] leading-[1.1] tracking-tight italic text-gold-gradient"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Build websites
                <br />
                with pure intent.
              </h2>
              <p className="mt-6 mono-text text-[11px] leading-[2] text-gold-muted/80 max-w-md tracking-wider">
                DESCRIBE YOUR VISION. OUR AI TRANSLATES INTENT INTO
                PRODUCTION-READY CODE. REAL-TIME PREVIEW. INSTANT EXPORT.
                ZERO FRICTION.
              </p>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2 mt-8">
                {['Claude AI', 'React 19', 'Three.js', 'Tailwind CSS', 'TypeScript'].map((tech) => (
                  <span
                    key={tech}
                    className="mono-text text-[8px] tracking-wider px-3 py-1.5 border border-gold/[0.1] text-gold-muted/50 hover:text-gold/60 hover:border-gold/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Builder preview card */}
            <div className="gold-border-glow bg-obsidian-light/80 backdrop-blur-sm p-1 transition-all duration-500">
              <div className="border-b border-gold/[0.08] px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold/30" />
                  <div className="w-2 h-2 rounded-full bg-gold/20" />
                  <div className="w-2 h-2 rounded-full bg-gold/10" />
                </div>
                <span className="mono-text text-[9px] text-gold-muted/50 ml-4">
                  elannoire.site/builder
                </span>
              </div>
              <div className="flex h-[280px]">
                <div className="w-2/5 border-r border-gold/[0.06] p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-gold/60" />
                    <span className="mono-text text-[9px] text-gold-muted/60">ÉLANNOIRE AI</span>
                  </div>
                  <div className="bg-gold/[0.03] border border-gold/[0.08] p-3 text-[10px] text-foreground/50 font-mono leading-relaxed">
                    &quot;Create a luxury brand landing page with obsidian texture
                    and gold accents&quot;
                  </div>
                  <div className="bg-gold/[0.06] border border-gold/[0.12] p-3 text-[10px] text-gold/70 font-mono">
                    &#x2588;&#x2588;&#x2588; Generating... 87%
                  </div>
                  <div className="mt-auto bg-obsidian border border-gold/[0.08] p-2.5 text-[10px] text-gold-muted/40 font-mono flex items-center justify-between">
                    <span>Describe your vision...</span>
                    <div className="w-5 h-5 bg-gold/10 flex items-center justify-center">
                      <ArrowRight className="w-2.5 h-2.5 text-gold/60" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-obsidian via-obsidian-light to-obsidian flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-8 h-8 text-gold/20 mx-auto animate-float" />
                    <p className="mono-text text-[8px] text-gold-muted/30 mt-2 tracking-widest">
                      LIVE PREVIEW
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ===== PHILOSOPHY SECTION ===== */}
      <section id="philosophy" className="snap-section obsidian-bg gold-veins flex items-center relative">
        <div
          ref={addRef(2)}
          className="opacity-0 max-w-7xl mx-auto px-8 w-full py-20"
        >
          <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted mb-10 text-center">
            [ PHILOSOPHY ]
          </p>
          <h2
            className="text-[clamp(2rem,4vw,4.5rem)] leading-[1.1] tracking-tight italic text-gold-gradient text-center max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Every pixel, an act of
            <br />
            deliberate intelligence.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              label="AI GENERATION"
              title="Prompt to production"
              description="Natural language in, professional website out. No templates. Pure generation."
            />
            <FeatureCard
              icon={<Globe className="w-5 h-5" />}
              label="LIVE PREVIEW"
              title="Real-time rendering"
              description="Watch your site materialize as AI writes every line. Instant visual feedback."
            />
            <FeatureCard
              icon={<Code2 className="w-5 h-5" />}
              label="CODE EDITOR"
              title="Full control"
              description="Monaco-powered editor. Inspect, modify, perfect. Your code, your rules."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Box className="w-5 h-5" />}
              label="3D CAPABLE"
              title="Three.js integrated"
              description="3D scenes, particle effects, immersive experiences. Just describe it."
            />
            <FeatureCard
              icon={<Palette className="w-5 h-5" />}
              label="DESIGN SYSTEM"
              title="Professional output"
              description="Responsive, accessible, modern. Every site meets production standards."
            />
            <FeatureCard
              icon={<Download className="w-5 h-5" />}
              label="INSTANT EXPORT"
              title="One-click deploy"
              description="Download your site. Deploy anywhere. No vendor lock-in."
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      {/* ===== PROTOCOL / CTA SECTION ===== */}
      <section id="protocol" className="snap-section obsidian-bg gold-veins flex items-center relative">
        <div
          ref={addRef(3)}
          className="opacity-0 max-w-7xl mx-auto px-8 w-full py-20"
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="mono-text text-[10px] tracking-[0.3em] text-gold-muted mb-10">
              [ PROTOCOL ]
            </p>

            <h2
              className="text-[clamp(2rem,4vw,4.5rem)] leading-[1.1] tracking-tight italic text-gold-gradient"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Initialize your
              <br />
              first deployment.
            </h2>

            <p className="mt-8 mono-text text-[11px] leading-[2] text-gold-muted/70 max-w-md mx-auto tracking-wider">
              NO CREDIT CARD. NO SETUP. NO FRICTION.
              <br />
              ENTER THE BUILDER. DESCRIBE. DEPLOY.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                href="/builder"
                className="btn-gold-fill group inline-flex items-center gap-3 px-10 py-4 animate-pulse-glow"
              >
                <Zap className="w-4 h-4" />
                <span className="mono-text text-[12px] tracking-widest">
                  LAUNCH BUILDER
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Status indicators */}
            <div className="flex items-center justify-center gap-8 mt-16">
              <StatusItem label="SYSTEM" value="ONLINE" active />
              <StatusItem label="LATENCY" value="<100MS" />
              <StatusItem label="MODELS" value="CLAUDE 4" />
              <StatusItem label="UPTIME" value="99.9%" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <span className="mono-text text-[9px] tracking-[0.2em] text-gold-muted/40">
              ÉLANNOIRE
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="mono-text text-[9px] tracking-wider text-gold-muted/30 hover:text-gold-muted/60 transition-colors">
                TERMS
              </a>
              <a href="#" className="mono-text text-[9px] tracking-wider text-gold-muted/30 hover:text-gold-muted/60 transition-colors">
                PRIVACY
              </a>
              <a href="#" className="mono-text text-[9px] tracking-wider text-gold-muted/30 hover:text-gold-muted/60 transition-colors">
                CONTACT
              </a>
            </div>
            <span className="mono-text text-[9px] tracking-wider text-gold-muted/30">
              &copy; 2026 ALL RIGHTS RESERVED
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ===== COMPONENTS ===== */

function StatCard({
  icon,
  value,
  suffix,
  label,
  sublabel,
}: {
  icon: React.ReactNode
  value: string
  suffix: string
  label: string
  sublabel: string
}) {
  return (
    <div className="gold-border-glow bg-obsidian-light/30 p-6 text-center transition-all duration-500 hover:bg-obsidian-light/50">
      <div className="text-gold/30 flex justify-center mb-4">
        {icon}
      </div>
      <p className="text-[clamp(2rem,3vw,3rem)] font-light text-foreground/90 tracking-tight">
        {value}
        <span className="text-gold/70 text-[clamp(1rem,1.5vw,1.5rem)]">{suffix}</span>
      </p>
      <p className="mono-text text-[9px] tracking-[0.2em] text-gold/50 mt-2">
        {label}
      </p>
      <p className="text-[10px] text-gold-muted/30 mt-1 font-mono">
        {sublabel}
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  label,
  title,
  description,
}: {
  icon: React.ReactNode
  label: string
  title: string
  description: string
}) {
  return (
    <div className="group gold-border-glow bg-obsidian-light/50 p-6 transition-all duration-500 hover:bg-obsidian-light/80">
      <div className="text-gold/40 group-hover:text-gold/70 transition-colors mb-4">
        {icon}
      </div>
      <p className="mono-text text-[9px] tracking-[0.2em] text-gold-muted/50 mb-2">
        {label}
      </p>
      <h3
        className="text-lg text-foreground/80 mb-2 italic"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        {title}
      </h3>
      <p className="text-[11px] text-gold-muted/60 leading-relaxed font-mono">
        {description}
      </p>
    </div>
  )
}

function StatusItem({
  label,
  value,
  active,
}: {
  label: string
  value: string
  active?: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          active ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-gold/30'
        }`}
      />
      <div className="text-left">
        <p className="mono-text text-[8px] tracking-[0.2em] text-gold-muted/40">
          {label}
        </p>
        <p className="mono-text text-[10px] tracking-wider text-gold/70">
          {value}
        </p>
      </div>
    </div>
  )
}
