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
  description?: string | null
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  createdAt?: string
}

interface ReviewItem {
  id: string
  clientName: string
  clientCompany?: string | null
  content: string
  rating?: number
  isApproved?: boolean
}

const DEFAULT_HERO_BG = '/ed/hero-bg.jpg'

// Service panel palette shades (progressive depth)
const PANEL_SHADES = ['ed-sp1', 'ed-sp2', 'ed-sp3', 'ed-sp4', 'ed-sp5', 'ed-sp6', 'ed-sp7']

// Background word for each panel (fallback, from service name)
const bgWord = (name: string) => name.split(' ')[0].toUpperCase()

export default function HomepageEditorial() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
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
      const [s, sv, d, p, b, rv] = await Promise.all([
        fetchJSON('/api/v1/settings'),
        fetchJSON('/api/v1/services'),
        fetchJSON('/api/v1/departments'),
        fetchJSON('/api/v1/projects'),
        fetchJSON('/api/v1/blog'),
        fetchJSON('/api/v1/reviews'),
      ])
      if (s) setSettings(s)
      if (sv) setServices(sv.slice(0, 7))
      if (d) setDepartments(d.slice(0, 6))
      if (p) setProjects(p.slice(0, 6))
      if (b) setPosts(b.slice(0, 3))
      if (rv) setReviews(rv.filter((r: { isApproved?: boolean }) => r.isApproved !== false).slice(0, 6))
    })()
  }, [])

  /* ---------- Scroll effects (single rAF loop) ---------- */
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

    const root = revealRootRef.current

    // Reveal on scroll
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    root?.querySelectorAll('.ed-rv').forEach((el) => io.observe(el))

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

        // Flyers: each gets an equal window across the pin; solid crossfade (no half-fades)
        const flyers = flyerRefs.current.filter(Boolean) as HTMLDivElement[]
        const n = flyers.length
        const HAS_FLYERS = n > 0

        // RAMEDIC wordmark: fades in early, fades OUT the instant flyers take over
        const flyerStart = HAS_FLYERS ? 0.1 : 1.1   // with flyers: word only before 0.1
        let wordVis: number
        if (HAS_FLYERS && p >= 0.1) {
          wordVis = 0
        } else {
          wordVis = clamp(p * 2.4, 0, 1)
        }
        const scale = 0.72 + Math.min(p, 0.1) * 3.2
        wmWord.style.transform = `scale(${scale.toFixed(3)})`
        wmWord.style.opacity = String(wordVis.toFixed(3))
        wmTag.style.opacity = wordVis >= 1 && (p < flyerStart) ? '1' : String(wordVis.toFixed(3))
        wmCap.style.opacity = wordVis >= 1 && (p < flyerStart) ? '1' : '0'

        if (HAS_FLYERS) {
          flyers.forEach((el, i) => {
            const start = 0.1 + (0.9 * i) / n
            const end = start + 0.9 / n
            const fadeIn = 0.02, fadeOut = 0.02 // quick crossfade at window edges
            let vis = 0
            let ty = 0
            if (p >= start + fadeIn && p <= end - fadeOut) {
              vis = 1; ty = 0
            } else if (p > start - fadeIn && p < start + fadeIn) {
              vis = (p - (start - fadeIn)) / (2 * fadeIn)
              ty = (1 - vis) * 30
            } else if (p > end - fadeOut && p < end + fadeOut) {
              vis = 1 - (p - (end - fadeOut)) / (2 * fadeIn)
              ty = -(1 - vis) * 30
            } else if (i === n - 1 && p >= end + fadeOut) {
              // last flyer holds until the section ends
              vis = 1; ty = 0
            }
            el.style.opacity = vis.toFixed(3)
            el.style.transform = `translateY(${ty.toFixed(1)}px)`
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/contact" className="ed-cta">
            Get a Quote
          </Link>
          <button
            className="ed-burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div className={`ed-drawer${menuOpen ? ' open' : ''}`}>
        <button className="ed-drawer-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
        <nav className="ed-drawer-links">
          <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/departments" onClick={() => setMenuOpen(false)}>Departments</Link>
          <Link href="/portfolio" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link href="/team" onClick={() => setMenuOpen(false)}>Team</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>
        <Link href="/contact" className="ed-btn ed-btn-primary" onClick={() => setMenuOpen(false)}>
          Get a Free Quote
        </Link>
      </div>
      {menuOpen && <div className="ed-drawer-veil" onClick={() => setMenuOpen(false)} />}

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
          {[0, 1].map((copy) =>
            panelServices.map((s, i) => (
              <span key={`${copy}-${i}`} aria-hidden={copy === 1} className="ed-mq-item">
                {s.name}
              </span>
            ))
          )}
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


      {/* ---------- WORK (PORTFOLIO) ---------- */}
      <section className="ed-work-sec" id="ed-portfolio">
        <div className="ed-shell">
          <div className="ed-sec-head">
            <div className="ed-sec-label" style={{ marginBottom: 0 }}>Selected Work</div>
            <h2 className="ed-rv">
              Proof, not<br /><em>promises.</em>
            </h2>
          </div>
          {projects.length ? (
            <div className="ed-work-grid">
              {projects.slice(0, 3).map((proj) => (
                <Link href="/portfolio" key={proj.id} className="ed-dept-card ed-rv">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={proj.imageUrl || '/ed/hero.jpg'} alt={proj.title} data-ed-parallax />
                  <div className="ed-veil" />
                  <div className="ed-tag">Project</div>
                  <div className="ed-info">
                    <h3>{proj.title}</h3>
                    <p>{proj.description?.slice(0, 90) || 'View the full case study.'}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ed-dept-empty">
              Recent projects are being curated — see the <Link href="/portfolio" style={{ color: 'var(--ed-blue)', fontWeight: 600 }}>full portfolio</Link>.
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/portfolio" className="ed-panel-cta" style={{ margin: '0 auto' }}>
              View full portfolio <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="ed-depts" style={{ paddingTop: 0 }}>
        <div className="ed-shell">
          <div className="ed-sec-head">
            <div className="ed-sec-label" style={{ marginBottom: 0 }}>Testimonials</div>
            <h2 className="ed-rv">
              Trusted by<br />businesses <em>like yours.</em>
            </h2>
          </div>
          {reviews.length ? (
            <div className="ed-testi-grid">
              {reviews.slice(0, 3).map((rv) => (
                <figure key={rv.id} className="ed-testi-card ed-rv">
                  <div className="ed-stars">{"★".repeat(rv.rating || 5)}</div>
                  <blockquote>"{rv.content}"</blockquote>
                  <figcaption>
                    <b>{rv.clientName}</b>
                    {rv.clientCompany ? <span> — {rv.clientCompany}</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="ed-dept-empty">Client reviews coming soon.</div>
          )}
        </div>
      </section>

      {/* ---------- BLOG / INSIGHTS ---------- */}
      <section className="ed-statement" style={{ background: '#eae7df' }}>
        <div className="ed-shell">
          <div className="ed-sec-head">
            <div className="ed-sec-label" style={{ marginBottom: 0 }}>Insights</div>
            <h2 className="ed-rv">
              From the <em>bench.</em>
            </h2>
          </div>
          {posts.length ? (
            <div className="ed-blog-grid">
              {posts.map((b) => (
                <Link href={`/blog/${b.slug}`} key={b.id} className="ed-blog-card ed-rv">
                  {b.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={b.imageUrl} alt={b.title} />
                  ) : (
                    <div className="ed-blog-ph">RAMEDIC</div>
                  )}
                  <div className="ed-blog-body">
                    <h3>{b.title}</h3>
                    <p>{b.excerpt?.slice(0, 110) || 'Read the full article on the blog.'}</p>
                    <span className="ed-panel-cta">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ed-dept-empty">New articles are on the way.</div>
          )}
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