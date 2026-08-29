'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

/*
 * Editorial Homepage v2 — FIND-style scroll choreography with RAMEDIC brand.
 * Keeps ALL existing data sources: /api/v1/settings, /api/v1/services,
 * /api/v1/departments, /api/v1/projects. Falls back to defaults when the
 * API is unreachable so the page NEVER renders empty.
 */

interface SiteSettings {
  heroTitle: string
  heroSubtitle: string
  statsProjects: string
  statsClients: string
  statsExperience: string
  statsSupport: string
  logoUrl?: string | null
  flyer1Url?: string | null
  flyer2Url?: string | null
  flyer3Url?: string | null
  flyer4Url?: string | null
}

interface Service {
  id: string
  name: string
  slug: string
  description: string
  startingPrice: string | null
}

interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
}

interface Project {
  id: string
  title: string
  slug: string
  imageUrl: string | null
}

const DEFAULT_HERO_BG = '/ed/hero-bg.jpg'

// Service panel palette shades (progressive depth)
const PANEL_SHADES = ['ed-sp1', 'ed-sp2', 'ed-sp3', 'ed-sp4', 'ed-sp5', 'ed-sp6', 'ed-sp7']

// Background word for each panel (fallback, from service name)
const bgWord = (name: string) => name.split(' ')[0].toUpperCase()

export default function HomepageEditorial() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const heroBgRef = useRef<HTMLDivElement>(null)
  const wmWordRef = useRef<HTMLDivElement>(null)
  const wmTagRef = useRef<HTMLDivElement>(null)
  const wmCapRef = useRef<HTMLDivElement>(null)
  const flyerRefs = useRef<(HTMLDivElement | null)[]>([])
  const wmSecRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const parallaxImgsRef = useRef<HTMLImageElement[]>([])
  const revealRootRef = useRef<HTMLDivElement>(null)

  /* ---------- Data fetching (all with graceful fallbacks) ---------- */
  useEffect(() => {
    const fetchJSON = async (url: string) => {
      try {
        const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
        const data = await res.json()
        return data?.success ? data.data : null
      } catch {
        return null
      }
    }
    ;(async () => {
      const [s, sv, d, p] = await Promise.all([
        fetchJSON('/api/v1/settings'),
        fetchJSON('/api/v1/services'),
        fetchJSON('/api/v1/departments'),
        fetchJSON('/api/v1/projects'),
      ])
      if (s) setSettings(s)
      if (sv) setServices(sv.slice(0, 5))
      if (d) setDepartments(d.slice(0, 6))
      if (p) setProjects(p.slice(0, 6))
    })()
  }, [])

  /* ---------- Scroll effects (single rAF loop) ---------- */
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

    // Smooth wheel scroll (Lenis-style; touch unaffected)
    let target = window.scrollY
    let current = window.scrollY
    let animating = false
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight

    const onWheel = (e: WheelEvent) => {
      if (reduce || e.ctrlKey) return
      e.preventDefault()
      target = clamp(target + e.deltaY, 0, maxScroll())
      if (!animating) { animating = true; requestAnimationFrame(tick) }
    }
    const onScrollResync = () => {
      if (Math.abs(window.scrollY - current) > 1.5) target = current = window.scrollY
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScrollResync, { passive: true })

    const tick = () => {
      current += (target - current) * 0.085
      if (Math.abs(target - current) < 0.4) { current = target; animating = false }
      window.scrollTo(0, current)
      if (animating) requestAnimationFrame(tick)
    }

    // Anchor links → smooth
    const root = revealRootRef.current
    const anchorHandler = (e: Event) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const el = document.querySelector(a.getAttribute('href') || '')
      if (!el) return
      e.preventDefault()
      const y = clamp(el.getBoundingClientRect().top + window.scrollY, 0, maxScroll())
      if (reduce) { window.scrollTo(0, y); return }
      target = y
      if (!animating) { animating = true; requestAnimationFrame(tick) }
    }
    root?.addEventListener('click', anchorHandler)

    // Reveal on scroll
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    root?.querySelectorAll('.ed-rv').forEach((el) => io.observe(el))

    // Marquee: duplicate track for seamless loop
    const mq = root?.querySelector('.ed-mq-track')
    if (mq) mq.innerHTML += mq.innerHTML

    const frame = () => {
      const y = window.scrollY
      const vh = window.innerHeight

      navRef.current?.classList.toggle('scrolled', y > 40)

      // Hero parallax
      const heroBg = heroBgRef.current
      if (heroBg && y < vh * 1.2) {
        heroBg.style.transform = `translateY(${y * 0.35}px) scale(${1 + (y / vh) * 0.06})`
      }

      // Wordmark pin progress
      const wmSec = wmSecRef.current
      const wmWord = wmWordRef.current
      const wmTag = wmTagRef.current
      const wmCap = wmCapRef.current
      if (wmSec && wmWord && wmTag && wmCap) {
        const wr = wmSec.getBoundingClientRect()
        const total = wr.height - vh
        const p = clamp(-wr.top / total, 0, 1)
        if (p > 0 && p < 1) {
          const scale = 0.72 + p * 0.34
          wmWord.style.transform = `scale(${scale})`
          wmWord.style.letterSpacing = `${(0.06 - p * 0.05).toFixed(3)}em`
          wmWord.style.opacity = String(clamp(p * 2.2, 0, 1))
          const tagP = clamp((p - 0.45) * 2.6, 0, 1)
          wmTag.style.opacity = String(tagP)
          wmTag.style.transform = `translateY(${(1 - tagP) * 18}px)`
          wmCap.style.opacity = String(clamp((p - 0.7) * 3, 0, 1))
        } else if (p >= 1) {
          wmWord.style.transform = 'scale(1.06)'
          wmWord.style.opacity = '1'
          wmTag.style.opacity = '1'
          wmTag.style.transform = 'none'
          wmCap.style.opacity = '1'
        }

        // Flyer rotation: 4 flyers cycle across the pin progress (p 0.12 → 0.95)
        const flyers = flyerRefs.current.filter(Boolean) as HTMLDivElement[]
        const n = flyers.length
        if (n > 0) {
          const seg = 0.95 - 0.12
          flyers.forEach((el, i) => {
            const start = 0.12 + (seg * i) / n
            const end = start + seg / n
            // fade in at start of its window, out at end (except first fades from p=0.05, last holds till end)
            let vis = 0
            let ty = 40
            if (p >= start && p < end) {
              const local = (p - start) / (end - start)
              vis = clamp(local * 4, 0, 1) * clamp((1 - local) * 4, 0, 1)
              ty = (1 - clamp(local * 4, 0, 1)) * 40 + (1 - clamp((1 - local) * 4, 0, 1)) * -40
              vis = Math.min(1, vis === 0 ? 1 : vis) // hold full visibility mid-window
              if (local > 0.2 && local < 0.8) vis = 1
              ty = local < 0.5 ? (0.5 - local) * 2 * 40 : -(local - 0.5) * 2 * 40
            } else if (i === 0 && p < start) {
              vis = clamp(p / 0.08, 0, 1) * (0) // not yet
              vis = 0
            } else if (i === n - 1 && p >= end) {
              vis = 1; ty = 0
            }
            el.style.opacity = String(vis)
            el.style.transform = `translateY(${ty}px) scale(${0.92 + vis * 0.08})`
            el.style.pointerEvents = vis > 0.5 ? 'auto' : 'none'
          })
        }
      }

      // Stacking panels
      panelsRef.current.forEach((panel, i) => {
        const r = panel.getBoundingClientRect()
        if (r.top <= 0 && r.bottom > vh) {
          const next = panelsRef.current[i + 1]
          if (next) {
            const nr = next.getBoundingClientRect()
            const cover = clamp(1 - nr.top / vh, 0, 1)
            if (cover > 0) {
              panel.style.transform = `scale(${1 - cover * 0.08}) translateY(${cover * -4}%)`
              panel.style.filter = `brightness(${1 - cover * 0.35})`
              panel.style.borderRadius = `${cover * 24}px`
            } else {
              panel.style.transform = ''
              panel.style.filter = ''
              panel.style.borderRadius = ''
            }
          }
        } else if (r.top > 0) {
          panel.style.transform = ''
          panel.style.filter = ''
          panel.style.borderRadius = ''
        }
      })

      // Department photo parallax
      parallaxImgsRef.current.forEach((img) => {
        const r = img.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) return
        const c = (r.top + r.height / 2 - vh / 2) / vh
        img.style.transform = `translateY(${c * -6}%)`
      })

      raf = requestAnimationFrame(frame)
    }
    let raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScrollResync)
      root?.removeEventListener('click', anchorHandler)
      io.disconnect()
    }
  }, [])

  // Collect panel + parallax refs after render
  useEffect(() => {
    panelsRef.current = Array.from(document.querySelectorAll<HTMLElement>('.ed-panel')) as HTMLDivElement[]
    parallaxImgsRef.current = Array.from(document.querySelectorAll<HTMLImageElement>('[data-ed-parallax]'))
  }, [services, departments])

  const title = settings?.heroTitle || 'Innovative Tech Solutions for Your Business'
  const subtitle =
    settings?.heroSubtitle ||
    'RAMEDIC Consultancy and Creative LTD delivers cutting-edge software development, hardware & IT solutions, creative services, and research to help your business thrive.'
  const statsProjects = settings?.statsProjects || '50+'
  const statsClients = settings?.statsClients || '30+'
  const statsExperience = settings?.statsExperience || '5+'

  // Hero title: italicize a key word like the demo
  const titleWords = title.split(' ')
  const emIndex = titleWords.findIndex((w) => /solution|grow|move|innovative/i.test(w))
  const titleJSX = (
    <>
      {emIndex > 0 ? titleWords.slice(0, emIndex).join(' ') + ' ' : ''}
      <em>{emIndex >= 0 ? titleWords[emIndex] : titleWords[0]}</em>
      {emIndex >= 0 ? ' ' + titleWords.slice(emIndex + 1).join(' ') : titleWords.slice(1).join(' ')}
    </>
  )

  const panelServices = services.length
    ? services.slice(0, 7)
    : [
        { id: 'f1', name: 'Software Development', slug: 'software-development', description: 'Custom web platforms, mobile apps and internal tools — engineered to production standard, not prototype standard.', startingPrice: null },
        { id: 'f2', name: 'Hardware & IT', slug: 'hardware-it', description: 'Workstations, networks, POS systems — and the on-call support that keeps them running day after day.', startingPrice: null },
        { id: 'f3', name: 'Creative Services', slug: 'creative-services', description: 'Brand identity, print and packaging — kraft paper bags, nylon, the works. Design people remember.', startingPrice: null },
        { id: 'f4', name: 'Research & Data', slug: 'research', description: 'Marketing research, advanced analytics and academic-grade studies that turn questions into decisions.', startingPrice: null },
        { id: 'f5', name: 'AI & Automation', slug: 'ai-automation', description: 'Chatbots, workflow automation and AI integrations that give small teams the leverage of big ones.', startingPrice: null },
        { id: 'f6', name: 'Academic Research', slug: 'academic-research', description: 'Academic writing, data collection & analysis, and full research support from proposal to defense.', startingPrice: null },
        { id: 'f7', name: 'Kraft Paper Bags', slug: 'kraft-paper-bags', description: 'Custom-designed kraft paper bags for weddings, funerals, parties, food deliveries, engagements, and more.', startingPrice: 'From GHS 4.00' },
      ]

  return (
    <div ref={revealRootRef} className="ed-root">
      {/* ---------- EDITORIAL NAV (replaces header visual on homepage only) ---------- */}
      <nav ref={navRef} className="ed-nav" style={{ background: 'transparent' }}>
        <Link href="/" className="ed-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings?.logoUrl || '/logo.png'} alt="RAMEDIC Consultancy and Creative LTD" />
          RAMEDIC
        </Link>
        <div className="ed-links">
          <Link href="/services">Services</Link>
          <Link href="/departments">Departments</Link>
          <Link href="/portfolio">Work</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Link href="/contact" className="ed-cta">
          Get a Quote
        </Link>
      </nav>

      {/* ---------- HERO ---------- */}
      <section className="ed-hero" id="ed-top">
        <div
          ref={heroBgRef}
          className="ed-hero-bg"
          style={{
            backgroundImage:
              'url("/ed/hero.jpg"), linear-gradient(135deg, var(--ed-blue-deep), var(--ed-blue))',
          }}
        />
        <div className="ed-hero-veil" />
        <div className="ed-hero-inner">
          <div className="ed-eyebrow">Koforidua · Ghana · Since {statsExperience.replace('+', '')}</div>
          <h1 className="ed-rv">{titleJSX}</h1>
          <div className="ed-hero-foot">
            <p className="ed-rv">{subtitle}</p>
            <div style={{ width: '100%' }}>
              <div className="ed-hero-ctas ed-rv">
                <Link href="/contact" className="ed-btn ed-btn-primary">
                  Get a Free Quote
                </Link>
                <Link href="/portfolio" className="ed-btn ed-btn-ghost">
                  View Our Work →
                </Link>
              </div>
              <div className="ed-scroll-hint ed-rv" style={{ marginTop: 30 }}>
                <span className="dot" />
                SCROLL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- WORDMARK PIN ---------- */}
      <section className="ed-wm-section" ref={wmSecRef}>
        <div className="ed-wm-sticky">
          <div
            ref={wmWordRef}
            className="ed-wm-word"
            style={{ backgroundImage: "url('/ed/hero.jpg'), linear-gradient(160deg, #7ea4e8, #2c62c9)" }}
          >
            RAMEDIC
          </div>
          <div ref={wmTagRef} className="ed-wm-tag">
            Tech · Innovate · Grow
          </div>
          <div ref={wmCapRef} className="ed-wm-caption">
            RAMEDIC Consultancy &amp; Creative Ltd — Koforidua, Eastern Region
          </div>

          {/* Admin-uploaded company flyers — rotate with scroll */}
          {[
            settings?.flyer1Url,
            settings?.flyer2Url,
            settings?.flyer3Url,
            settings?.flyer4Url,
          ]
            .filter((u): u is string => !!u)
            .map((url, i) => (
              <div
                key={url}
                ref={(el) => { flyerRefs.current[i] = el }}
                className="ed-flyer"
                style={{ opacity: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`RAMEDIC flyer ${i + 1}`} />
              </div>
            ))}
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="ed-marquee" aria-hidden="true">
        <div className="ed-mq-track">
          {panelServices.map((s, i) => (
            <span key={i} className="ed-mq-item">
              {s.name}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- STATEMENT ---------- */}
      <section className="ed-statement">
        <div className="ed-shell">
          <div className="ed-sec-label">Who we are</div>
          <h2 className="ed-rv">
            Don&apos;t just run a business. <em>Build a system.</em>
          </h2>
          <p className="ed-rv">
            Five years, {statsProjects} projects, one obsession: engineering that outlives the hype. From the shop
            floor to the cloud, we design, build and maintain the technology your business actually runs on.
          </p>
        </div>
      </section>

      {/* ---------- STACKING SERVICES ---------- */}
      <div className="ed-stack" id="ed-services">
        {panelServices.map((s, i) => (
          <div
            key={s.id}
            className={`ed-panel ${PANEL_SHADES[i % PANEL_SHADES.length]}`}
            ref={(el) => { if (el) panelsRef.current[i] = el as HTMLDivElement }}
          >
            <div className="ed-bg-word">{bgWord(s.name)}</div>
            <div className="ed-num">{String(i + 1).padStart(2, '0')} — {String(panelServices.length).padStart(2, '0')}</div>
            <div className="ed-word">{s.name}</div>
            <div className="ed-desc">{s.description}</div>
            <Link href={`/services/${s.slug}`} className="ed-panel-cta">
              Explore {s.name.split(' ')[0]} <span>→</span>
            </Link>
            <div className="ed-meta">
              <span>Delivery</span>
              <span>Support</span>
              <span>Maintenance</span>
            </div>
          </div>
        ))}
      </div>

{/* ---------- DEPARTMENTS ---------- */}
      <section className="ed-depts" id="ed-work">
        <div className="ed-shell">
          <div className="ed-sec-head">
            <div className="ed-sec-label" style={{ marginBottom: 0 }}>Departments</div>
            <h2 className="ed-rv">
              Three crafts.
              <br />
              <em>One</em> team.
            </h2>
          </div>
          <div className="ed-dept-grid">
            {departments.length ? (
              departments.slice(0, 3).map((d) => (
                <Link href={`/departments/${d.slug}`} key={d.id} className="ed-dept-card ed-rv">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.imageUrl || '/ed/hero.jpg'} alt={d.name} data-ed-parallax />
                  <div className="ed-veil" />
                  <div className="ed-tag">Department</div>
                  <div className="ed-info">
                    <h3>{d.name}</h3>
                    <p>{d.description || 'Explore what this department builds and delivers.'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="ed-dept-empty">Our departments are being prepared — check back shortly.</div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="ed-process">
        <div className="ed-shell">
          <div className="ed-sec-head">
            <div className="ed-sec-label" style={{ marginBottom: 0 }}>Process</div>
            <h2 className="ed-rv">How we work</h2>
          </div>
          <div className="ed-proc-grid">
            {[
              ['01', 'Discovery', 'We listen first. Your goals, constraints and customers define the brief.'],
              ['02', 'Strategy', 'A concrete plan with scope, timeline and cost — before a line of code.'],
              ['03', 'Build', 'Working software in increments you can see, test and steer.'],
              ['04', 'Support', 'Launch is the midpoint. We maintain, measure and improve.'],
            ].map(([n, t, d]) => (
              <div key={n} className="ed-proc-cell ed-rv">
                <div className="n">{n}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- QUOTE ---------- */}
      <section className="ed-quote">
        <blockquote className="ed-rv">
          &ldquo;Tech. Innovate. Grow — it&apos;s not a slogan, it&apos;s the order we do things in.&rdquo;
        </blockquote>
        <div className="ed-who ed-rv">RAMEDIC Consultancy &amp; Creative Ltd</div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="ed-cta" id="ed-contact">
        <h2 className="ed-rv">
          Ready to build
          <br />
          <em>something real?</em>
        </h2>
        <div className="ed-row ed-rv">
          <Link href="/contact" className="ed-btn ed-btn-primary">
            Start Your Project
          </Link>
          <a href="https://wa.me/233537400179" className="ed-btn ed-btn-ghost">
            WhatsApp Us
          </a>
        </div>
        <div className="ed-micro ed-rv">
          Free consultation · Response within 24 hours · {statsClients} businesses trust RAMEDIC
        </div>
      </section>
    </div>
  )
}