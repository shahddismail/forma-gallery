import { useState, useEffect, useRef } from 'react'

type Screen = 'gallery' | 'detail' | 'submit' | 'saved'

interface Artwork {
  id: number
  title: string
  artist: string
  year: number
  medium: string
  dimensions: string
  category: string
  description: string
  price: string
  imgId: string
  imgW: number
  imgH: number
  span?: 'tall' | 'wide'
  customImgUrl?: string
  isUserSubmitted?: boolean
}

const ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: 'Chromatic Drift',
    artist: 'Mara Solano',
    year: 2024,
    medium: 'Digital Oil',
    dimensions: '4800 × 3200 px',
    category: 'Abstract',
    description: 'A study in chromatic tension — opposing hues pulled across an infinite gradient field, dissolving into one another at the threshold of perception. Solano explores how color itself can carry emotional weight independent of form or narrative.',
    price: '$1,800',
    imgId: '1547410518-bac44f7a9f5c',
    imgW: 800, imgH: 560,
    span: 'tall',
  },
  {
    id: 2,
    title: 'Aureate Spiral',
    artist: 'Lior Kessler',
    year: 2024,
    medium: 'Generative 3D',
    dimensions: '7680 × 4320 px',
    category: 'Generative',
    description: 'A single mathematical function rendered across 72 hours of computation — the spiral unwinding through golden ratios, each loop distinct, the whole deeply unified. A meditation on emergence and patience.',
    price: '$3,200',
    imgId: '1785622576497-434cddec9a8f',
    imgW: 800, imgH: 450,
  },
  {
    id: 3,
    title: 'Feminine Reverie',
    artist: 'Fons Heijnsbroek',
    year: 2023,
    medium: 'Mixed Media Digital',
    dimensions: '6350 × 5000 px',
    category: 'Figurative',
    description: 'A portrait dissolved into myth — the figure exists at the border between representation and dissolution. Heijnsbroek layers translucent washes of pigment-like texture over a skeletal digital structure, creating depth that reads as oil paint but exhales code.',
    price: '$2,400',
    imgId: '1706189797798-30d44496b274',
    imgW: 800, imgH: 600,
  },
  {
    id: 4,
    title: 'Abyssal Field',
    artist: 'Martin Martz',
    year: 2024,
    medium: 'Digital Acrylic',
    dimensions: '6000 × 4000 px',
    category: 'Abstract',
    description: 'Stark reds and whites suspended against pure black — a color field painting that owes as much to Rothko as to the render engine. The forms feel muscular, political, urgent.',
    price: '$2,100',
    imgId: '1689005046915-b043ea4c7981',
    imgW: 800, imgH: 550,
    span: 'wide',
  },
  {
    id: 5,
    title: 'Nebula Blush',
    artist: 'Tremayne B.',
    year: 2023,
    medium: 'Photomanipulation',
    dimensions: '4000 × 6000 px',
    category: 'Surreal',
    description: 'Soft pink atmosphere rendered at astronomical scale — the intimacy of a breath, the scale of a stellar nursery. Tremayne collapses distance to reveal how tenderness and vastness share the same form.',
    price: '$1,500',
    imgId: '1655083974309-286e27ec8c9f',
    imgW: 600, imgH: 800,
    span: 'tall',
  },
  {
    id: 6,
    title: 'Tidal Memory',
    artist: 'Logan Voss',
    year: 2024,
    medium: 'Algorithmic',
    dimensions: '4320 × 7680 px',
    category: 'Generative',
    description: 'Wave functions turned sedimentary record — each stratum a different pass of the algorithm, the whole readable as geology, as music notation, as a lifetime.',
    price: '$2,750',
    imgId: '1772056384562-c02d38f3c612',
    imgW: 600, imgH: 900,
  },
  {
    id: 7,
    title: 'Signal Noise',
    artist: 'Ilgmyzin Studio',
    year: 2023,
    medium: 'Digital Collage',
    dimensions: '3840 × 2160 px',
    category: 'Conceptual',
    description: 'Information overload given a visual body — the pattern is both the subject and the medium. Perception fails at scale; beauty emerges from the failure.',
    price: '$980',
    imgId: '1660585266731-8cb1b1162d70',
    imgW: 800, imgH: 450,
  },
  {
    id: 8,
    title: 'Polychrome Study IV',
    artist: 'Margarita Shtyfura',
    year: 2024,
    medium: 'Digital Oil',
    dimensions: '3000 × 3000 px',
    category: 'Abstract',
    description: 'The fourth in a series exploring primary hue relationships at the limit of saturation. Where red meets blue meets yellow, a secondary world assembles — not discovered, constructed.',
    price: '$1,650',
    imgId: '1691786835298-a49aa3113cab',
    imgW: 800, imgH: 800,
  },
]

const CATEGORIES = ['All', 'Abstract', 'Generative', 'Figurative', 'Surreal', 'Conceptual']

function formatIndex(n: number) {
  return String(n).padStart(2, '0')
}

function artworkImgSrc(artwork: Artwork, w: number, h: number) {
  if (artwork.customImgUrl) return artwork.customImgUrl
  return `https://images.unsplash.com/photo-${artwork.imgId}?w=${w}&h=${h}&fit=crop&auto=format`
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ screen, onNav, savedCount, totalArtworks }: { screen: Screen; onNav: (s: Screen) => void; savedCount: number; totalArtworks: number }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,10,10,0.88)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 2.5rem',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Wordmark */}
        <button
          onClick={() => onNav('gallery')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#f0ede8',
              letterSpacing: '0.01em',
            }}
          >
            Forma
          </span>
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#c9a96e',
            }}
          >
            Gallery
          </span>
        </button>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <button
            onClick={() => onNav('gallery')}
            className={`nav-link${screen === 'gallery' ? ' active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: screen === 'gallery' ? '#f0ede8' : 'rgba(240,237,232,0.5)',
              padding: 0,
              transition: 'color 0.25s',
            }}
          >
            Collection
          </button>
          <button
            onClick={() => onNav('submit')}
            className={`nav-link${screen === 'submit' ? ' active' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: screen === 'submit' ? '#f0ede8' : 'rgba(240,237,232,0.5)',
              padding: 0,
              transition: 'color 0.25s',
            }}
          >
            Submit
          </button>
        </nav>

        {/* Right: saved + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => onNav('saved')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: screen === 'saved' ? '#c9a96e' : 'rgba(240,237,232,0.5)',
              transition: 'color 0.25s',
            }}
            onMouseEnter={e => { if (screen !== 'saved') e.currentTarget.style.color = '#f0ede8' }}
            onMouseLeave={e => { if (screen !== 'saved') e.currentTarget.style.color = 'rgba(240,237,232,0.5)' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill={screen === 'saved' ? '#c9a96e' : 'none'} style={{ transition: 'fill 0.25s' }}>
              <path d="M7.5 13L2.5 8.5A3.5 3.5 0 017.2 3.04L7.5 3.3l.3-.26a3.5 3.5 0 014.7 5.16L7.5 13z" stroke={screen === 'saved' ? '#c9a96e' : 'currentColor'} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Saved
            </span>
            {savedCount > 0 && (
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.05em',
                background: '#c9a96e',
                color: '#0a0a0a',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontWeight: 600,
                lineHeight: 1.6,
              }}>
                {savedCount}
              </span>
            )}
          </button>
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: 'rgba(240,237,232,0.25)',
            }}
          >
            {totalArtworks} works
          </span>
        </div>
      </div>
    </header>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function GalleryScreen({ artworks = [], onSelect }: { artworks?: Artwork[]; onSelect: (a: Artwork) => void }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const filtered = activeCategory === 'All'
    ? artworks
    : artworks.filter(a => a.category === activeCategory)

  return (
    <div className="page-enter" style={{ paddingTop: 64, minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Header section */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '4rem 2.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'flex-end',
          gap: '2rem',
        }}
      >
        <div>
          <p
            className="stat-label"
            style={{ marginBottom: '0.75rem' }}
          >
            Current Exhibition
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 500,
              color: '#f0ede8',
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            Digital Frontiers
            <br />
            <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>2024</em>
          </h1>
        </div>
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(240,237,232,0.5)',
            maxWidth: 340,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          A curated selection of works from artists pushing the boundaries of digital medium — from algorithmic abstraction to hyperreal figuration.
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '0 2.5rem 1.5rem',
          display: 'flex',
          gap: '0.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="gallery-grid"
        style={{
          maxWidth: 1440,
          margin: '0 auto 0',
          padding: '2px',
        }}
      >
        {filtered.map((artwork, i) => (
          <div
            key={artwork.id}
            className={`artwork-card${artwork.span === 'tall' ? ' gallery-cell--tall' : artwork.span === 'wide' ? ' gallery-cell--wide' : ''}`}
            onClick={() => onSelect(artwork)}
            onMouseEnter={() => setHoveredId(artwork.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={artworkImgSrc(artwork, artwork.imgW, artwork.imgH)}
              alt={`${artwork.title} by ${artwork.artist}`}
              draggable={false}
            />
            <div className="artwork-card-overlay" />
            <span className="artwork-index">{formatIndex(i + 1)}</span>

            {/* Info panel slides up on hover */}
            <div className="artwork-card-info">
              <p
                className="category-pill"
                style={{ marginBottom: '0.6rem', display: 'inline-flex' }}
              >
                {artwork.category}
              </p>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#f0ede8',
                  margin: '0 0 0.25rem',
                  lineHeight: 1.25,
                }}
              >
                {artwork.title}
              </h3>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'rgba(240,237,232,0.6)',
                  margin: '0 0 0.75rem',
                }}
              >
                {artwork.artist} · {artwork.year}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '0.7rem',
                    color: 'rgba(240,237,232,0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  {artwork.medium}
                </span>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#c9a96e',
                  }}
                >
                  {artwork.price}
                </span>
              </div>
            </div>

            {artwork.isUserSubmitted && (
              <span style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background: '#c9a96e',
                color: '#0a0a0a',
                padding: '0.25rem 0.6rem',
                fontWeight: 600,
                borderRadius: '1px',
              }}>
                New
              </span>
            )}
            <div className="artwork-card-border" />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '2.5rem 2.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span className="stat-label">© 2024 Forma Gallery</span>
        <span className="stat-label">All rights reserved · Digital works</span>
      </div>
    </div>
  )
}

// ─── Inquire Modal ─────────────────────────────────────────────────────────────
function InquireModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        animation: 'pageEnter 0.3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '100%', maxWidth: 520,
          padding: '2.5rem',
        }}
      >
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 52, height: 52,
              border: '1px solid rgba(201,169,110,0.4)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                <path d="M1.5 7.5L7.5 13.5L18.5 1.5" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.5rem', color: '#f0ede8', margin: '0 0 0.75rem' }}>
              Inquiry Sent
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: 'rgba(240,237,232,0.55)', margin: '0 0 2rem', lineHeight: 1.7 }}>
              We've received your inquiry for <em style={{ color: '#c9a96e' }}>{artwork.title}</em>. Our team will be in touch within 2 business days.
            </p>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <p className="stat-label" style={{ marginBottom: '0.4rem' }}>Inquire to Purchase</p>
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.4rem', color: '#f0ede8', margin: 0 }}>
                  {artwork.title}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: '#c9a96e', margin: '0.2rem 0 0' }}>
                  {artwork.artist} · {artwork.price}
                </p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.4)', padding: '0.25rem', lineHeight: 1 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px' }}>
                <div>
                  <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div>
                  <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Email *</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="stat-label" style={{ display: 'block', marginBottom: '0.4rem' }}>Message</label>
                <textarea
                  className="form-input form-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any questions or context about your interest..."
                  style={{ minHeight: 100 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                <button type="submit" className="btn-primary">Send Inquiry →</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Detail ───────────────────────────────────────────────────────────────────
function DetailScreen({ artwork, artworks, onBack, onSelectArtwork, savedIds, onToggleSave }: { artwork: Artwork; artworks: Artwork[]; onBack: () => void; onSelectArtwork: (a: Artwork) => void; savedIds: Set<number>; onToggleSave: (id: number) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [showInquire, setShowInquire] = useState(false)
  const saved = savedIds.has(artwork.id)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [artwork.id])

  const siblings = artworks.filter(a => a.id !== artwork.id).slice(0, 3)

  return (
    <div className="page-enter" style={{ paddingTop: 64, minHeight: '100vh', background: '#0a0a0a' }}>
      {showInquire && <InquireModal artwork={artwork} onClose={() => setShowInquire(false)} />}

      {/* Back button */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '2rem 2.5rem 0' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(240,237,232,0.45)', padding: 0,
            display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.45)')}
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M5 1L1 5M1 5L5 9M1 5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Collection
        </button>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '3rem 2.5rem',
        display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start',
      }}>
        {/* Image */}
        <div>
          <div className="detail-image-wrap" style={{ background: '#141414', lineHeight: 0, border: '1px solid rgba(255,255,255,0.06)' }}>
            <img
              src={artworkImgSrc(artwork, 1200, 800)}
              alt={`${artwork.title} by ${artwork.artist}`}
              onLoad={() => setImgLoaded(true)}
              style={{ width: '100%', height: 'auto', display: 'block', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="stat-label">{artwork.medium}</span>
            <span className="stat-label">{artwork.dimensions}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 96 }}>
          <span className="category-pill" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>{artwork.category}</span>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 500, color: '#f0ede8', margin: '0 0 0.5rem', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            {artwork.title}
          </h1>
          <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontSize: '1rem', color: '#c9a96e', margin: '0 0 2rem' }}>
            {artwork.artist}, {artwork.year}
          </p>
          <hr className="rule" style={{ marginBottom: '2rem' }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', lineHeight: 1.8, color: 'rgba(240,237,232,0.72)', margin: '0 0 2.5rem' }}>
            {artwork.description}
          </p>
          <div style={{ marginBottom: '2.5rem' }}>
            {[
              { label: 'Medium', value: artwork.medium },
              { label: 'Dimensions', value: artwork.dimensions },
              { label: 'Year', value: String(artwork.year) },
              { label: 'Category', value: artwork.category },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="stat-label" style={{ paddingTop: '0.15rem' }}>{label}</span>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: '#f0ede8' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Price & CTAs */}
          <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="stat-label">Asking Price</span>
              <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.75rem', fontWeight: 600, color: '#c9a96e' }}>
                {artwork.price}
              </span>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
              onClick={() => setShowInquire(true)}
            >
              Inquire to Purchase
            </button>
          </div>

          <button
            className="btn-ghost"
            style={{
              width: '100%',
              background: saved ? 'rgba(201,169,110,0.1)' : 'transparent',
              borderColor: saved ? 'rgba(201,169,110,0.5)' : 'rgba(240,237,232,0.2)',
              color: saved ? '#c9a96e' : '#f0ede8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'all 0.3s ease',
            }}
            onClick={() => onToggleSave(artwork.id)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill={saved ? '#c9a96e' : 'none'}>
              <path d="M7 12.25L1.75 7.583A3.5 3.5 0 016.7 2.24L7 2.53l.3-.29a3.5 3.5 0 014.95 4.95L7 12.25z" stroke={saved ? '#c9a96e' : 'currentColor'} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {saved ? 'Saved to Collection' : 'Save to Collection'}
          </button>
        </div>
      </div>

      {/* More works */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '3rem 2.5rem 4rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="stat-label" style={{ marginBottom: '2rem' }}>More from the Collection</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {siblings.map((s) => (
            <div
              key={s.id}
              className="artwork-card"
              style={{ height: 240, cursor: 'pointer' }}
              onClick={() => onSelectArtwork(s)}
            >
              <img src={artworkImgSrc(s, 600, 400)} alt={`${s.title} by ${s.artist}`} />
              <div className="artwork-card-overlay" />
              <div className="artwork-card-info">
                <h4 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1rem', fontWeight: 500, color: '#f0ede8', margin: '0 0 0.2rem' }}>{s.title}</h4>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(240,237,232,0.55)', margin: 0 }}>{s.artist}</p>
              </div>
              <div className="artwork-card-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Submit ────────────────────────────────────────────────────────────────────
function SubmitScreen({ onAddArtwork }: { onAddArtwork: (a: Artwork) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    artistName: '',
    email: '',
    title: '',
    year: '',
    medium: '',
    dimensions: '',
    category: '',
    description: '',
    price: '',
    website: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleFile(file: File) {
    setUploadedFile(file)
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  function handleDropZoneClick() {
    fileInputRef.current?.click()
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function clearFile() {
    setUploadedFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newArtwork: Artwork = {
      id: Date.now(),
      title: form.title || 'Untitled',
      artist: form.artistName || 'Unknown Artist',
      year: parseInt(form.year) || new Date().getFullYear(),
      medium: form.medium || 'Digital',
      dimensions: form.dimensions || 'Unknown',
      category: form.category || 'Abstract',
      description: form.description || '',
      price: form.price || 'NFS',
      imgId: '',
      imgW: 800,
      imgH: 600,
      customImgUrl: previewUrl || undefined,
      isUserSubmitted: true,
    }
    onAddArtwork(newArtwork)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="page-enter"
        style={{
          paddingTop: 64,
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div
            style={{
              width: 64,
              height: 64,
              border: '1px solid rgba(201,169,110,0.4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
            }}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
              <path d="M2 9L9 16L22 2" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '2.25rem',
              fontWeight: 500,
              color: '#f0ede8',
              margin: '0 0 1rem',
            }}
          >
            Submission Received
          </h2>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.95rem',
              color: 'rgba(240,237,232,0.55)',
              lineHeight: 1.75,
              margin: '0 0 2.5rem',
            }}
          >
            Thank you, {form.artistName || 'Artist'}. Your work <em style={{ color: '#c9a96e' }}>{form.title}</em> has been added to the gallery — you can find it in the collection now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-ghost" onClick={() => setSubmitted(false)}>
              Submit Another Work
            </button>
          </div>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(240,237,232,0.3)', marginTop: '1.5rem' }}>
            Your work is live in the Collection — look for the gold <strong style={{ color: '#c9a96e' }}>New</strong> badge.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ paddingTop: 64, minHeight: '100vh', background: '#0a0a0a' }}>
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          padding: '4rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: '6rem',
          alignItems: 'start',
        }}
      >
        {/* Left: intro */}
        <div style={{ position: 'sticky', top: 96 }}>
          <p className="stat-label" style={{ marginBottom: '1rem' }}>Open Call</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2rem, 3vw, 2.75rem)',
              fontWeight: 500,
              color: '#f0ede8',
              margin: '0 0 1.5rem',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
          >
            Submit Your
            <br />
            <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>Work</em>
          </h1>
          <hr className="rule" style={{ marginBottom: '1.5rem' }} />
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              lineHeight: 1.8,
              color: 'rgba(240,237,232,0.55)',
              margin: '0 0 2rem',
            }}
          >
            Forma Gallery accepts submissions year-round from emerging and established digital artists. All media accepted — from generative code to digital painting, AI-assisted or entirely manual.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              ['Submission Window', 'Year-round'],
              ['Response Time', '5–7 business days'],
              ['Commission', '30% on sale'],
              ['Exclusivity', 'Non-exclusive'],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  paddingBottom: '0.75rem',
                }}
              >
                <span className="stat-label">{label}</span>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.8rem',
                    color: '#f0ede8',
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Artist Name *
              </label>
              <input
                className="form-input"
                name="artistName"
                value={form.artistName}
                onChange={handleChange}
                placeholder="Full name or pseudonym"
                required
              />
            </div>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email *
              </label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Artwork Title *
              </label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title of the work"
                required
              />
            </div>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Year Created *
              </label>
              <input
                className="form-input"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g. 2024"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', marginBottom: '1px' }}>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Medium *
              </label>
              <input
                className="form-input"
                name="medium"
                value={form.medium}
                onChange={handleChange}
                placeholder="e.g. Digital Oil"
                required
              />
            </div>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Dimensions (px)
              </label>
              <input
                className="form-input"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder="e.g. 4800 × 3200"
              />
            </div>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Category *
              </label>
              <select
                className="form-input"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select category</option>
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c} style={{ background: '#141414' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Artist Statement / Work Description *
            </label>
            <textarea
              className="form-input form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us about this work — the intent, process, context. 100–400 words recommended."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', marginTop: '1px' }}>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Asking Price (USD)
              </label>
              <input
                className="form-input"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. $2,400 or NFS"
              />
            </div>
            <div>
              <label className="stat-label" style={{ display: 'block', marginBottom: '0.5rem', marginTop: '1.25rem' }}>
                Portfolio Website
              </label>
              <input
                className="form-input"
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>

          {/* File upload zone */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.psd,.tiff,.tif"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />

          {uploadedFile ? (
            <div style={{ marginTop: '2rem', border: '1px solid rgba(201,169,110,0.35)', background: 'rgba(201,169,110,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem' }}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: 80, height: 80, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, flexShrink: 0,
                    background: 'rgba(201,169,110,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M5 23L5 8a2 2 0 012-2h14a2 2 0 012 2v15" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round"/>
                      <path d="M2 23h24" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: '#f0ede8', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {uploadedFile.name}
                  </p>
                  <p className="stat-label">
                    {uploadedFile.type || 'Unknown type'} · {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={handleDropZoneClick}
                    className="btn-ghost"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={clearFile}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.4)', padding: '0.5rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f0ede8')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.4)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke="#c9a96e" strokeWidth="1"/>
                  <path d="M6 5.5v3M6 3.5v.5" stroke="#c9a96e" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <span className="stat-label" style={{ color: 'rgba(201,169,110,0.7)' }}>File ready for submission</span>
              </div>
            </div>
          ) : (
            <div
              onClick={handleDropZoneClick}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                marginTop: '2rem',
                border: `1px dashed ${dragOver ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.25)'}`,
                background: dragOver ? 'rgba(201,169,110,0.08)' : 'rgba(201,169,110,0.03)',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.25s, background 0.25s',
              }}
              onMouseEnter={e => {
                if (!dragOver) {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)'
                  e.currentTarget.style.background = 'rgba(201,169,110,0.06)'
                }
              }}
              onMouseLeave={e => {
                if (!dragOver) {
                  e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)'
                  e.currentTarget.style.background = 'rgba(201,169,110,0.03)'
                }
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 1rem', display: 'block' }}>
                <path d="M10.667 21.333A5.333 5.333 0 0112 10.706 8 8 0 0127.2 14.4a4 4 0 01-1.2 7.733" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22.667L16 18.667M16 18.667L12 22.667M16 18.667V29.333" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', color: dragOver ? '#c9a96e' : 'rgba(240,237,232,0.5)', margin: '0 0 0.25rem', transition: 'color 0.2s' }}>
                {dragOver ? 'Release to upload' : 'Drop your artwork file here, or click to browse'}
              </p>
              <p className="stat-label">PNG, TIFF, PSD, or any image · Max 100 MB</p>
            </div>
          )}

          {/* Submit */}
          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(240,237,232,0.35)',
                margin: 0,
                maxWidth: 300,
                lineHeight: 1.6,
              }}
            >
              By submitting you agree to our Artist Agreement. You retain full copyright of your work.
            </p>
            <button type="submit" className="btn-primary">
              Submit Work →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Saved Collection Screen ───────────────────────────────────────────────────
function SavedScreen({ savedIds, artworks, onSelect, onToggleSave }: { savedIds: Set<number>; artworks: Artwork[]; onSelect: (a: Artwork) => void; onToggleSave: (id: number) => void }) {
  const saved = artworks.filter(a => savedIds.has(a.id))

  return (
    <div className="page-enter" style={{ paddingTop: 64, minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '4rem 2.5rem 2rem' }}>
        <p className="stat-label" style={{ marginBottom: '0.75rem' }}>Your Saved Works</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            color: '#f0ede8',
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}>
            My Collection
            {saved.length > 0 && (
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '1rem',
                fontWeight: 400,
                color: '#c9a96e',
                marginLeft: '1rem',
                letterSpacing: '0.05em',
              }}>
                ({saved.length})
              </span>
            )}
          </h1>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0' }} />

      {saved.length === 0 ? (
        <div style={{
          maxWidth: 1440, margin: '0 auto', padding: '8rem 2.5rem',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 21L4.5 14A5 5 0 0111.3 6.44L12 7.07l.7-.63A5 5 0 0119.5 14L12 21z" stroke="rgba(240,237,232,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.75rem', color: '#f0ede8', margin: '0 0 0.75rem', fontWeight: 500 }}>
            Nothing saved yet
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'rgba(240,237,232,0.45)', lineHeight: 1.7, margin: 0, maxWidth: 360 }}>
            Browse the collection and click "Save to Collection" on any artwork to curate your personal selection here.
          </p>
        </div>
      ) : (
        <>
          {/* Saved grid */}
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '2px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
              {saved.map((artwork, i) => (
                <div key={artwork.id} style={{ position: 'relative', background: '#141414' }}>
                  {/* Card */}
                  <div
                    className="artwork-card"
                    style={{ height: 340, cursor: 'pointer' }}
                    onClick={() => onSelect(artwork)}
                  >
                    <img
                      src={artworkImgSrc(artwork, 700, 500)}
                      alt={`${artwork.title} by ${artwork.artist}`}
                    />
                    <div className="artwork-card-overlay" />
                    <span className="artwork-index">{formatIndex(i + 1)}</span>
                    <div className="artwork-card-info">
                      <p className="category-pill" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>{artwork.category}</p>
                      <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.15rem', fontWeight: 500, color: '#f0ede8', margin: '0 0 0.2rem', lineHeight: 1.25 }}>
                        {artwork.title}
                      </h3>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(240,237,232,0.6)', margin: 0 }}>
                        {artwork.artist} · {artwork.year}
                      </p>
                    </div>
                    <div className="artwork-card-border" />
                  </div>

                  {/* Remove button — always visible on saved screen */}
                  <button
                    onClick={() => onToggleSave(artwork.id)}
                    title="Remove from collection"
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      zIndex: 10,
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(201,169,110,0.35)',
                      borderRadius: '50%',
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#c9a96e',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,169,110,0.2)'
                      e.currentTarget.style.borderColor = '#c9a96e'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
                      e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 10.5L1.5 6.5A2.828 2.828 0 015.7 2.27L6 2.55l.3-.28a2.828 2.828 0 014.2 3.83L6 10.5z" fill="#c9a96e"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <div style={{
            maxWidth: 1440, margin: '0 auto',
            padding: '2rem 2.5rem 4rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: '2px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p className="stat-label" style={{ marginBottom: '0.25rem' }}>Collection Value</p>
              <p style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#c9a96e',
                margin: 0,
              }}>
                {(() => {
                  const total = saved.reduce((sum, a) => {
                    const num = parseFloat(a.price.replace(/[$,]/g, ''))
                    return sum + (isNaN(num) ? 0 : num)
                  }, 0)
                  return `$${total.toLocaleString()}`
                })()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4rem' }}>
              {[
                { label: 'Works Saved', value: String(saved.length) },
                { label: 'Artists', value: String(new Set(saved.map(a => a.artist)).size) },
                { label: 'Categories', value: String(new Set(saved.map(a => a.category)).size) },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'right' }}>
                  <p className="stat-label" style={{ marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.5rem', fontWeight: 500, color: '#f0ede8', margin: 0 }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('gallery')
  const [selected, setSelected] = useState<Artwork | null>(null)
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [artworks, setArtworks] = useState<Artwork[]>(ARTWORKS)

  function handleAddArtwork(a: Artwork) {
    setArtworks(prev => [a, ...prev])
  }

  function handleToggleSave(id: number) {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelect(a: Artwork) {
    setSelected(a)
    setScreen('detail')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function handleBack() {
    setSelected(null)
    setScreen('gallery')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  function handleNav(s: Screen) {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Nav screen={screen} onNav={handleNav} savedCount={savedIds.size} totalArtworks={artworks.length} />
      {screen === 'gallery' && <GalleryScreen artworks={artworks} onSelect={handleSelect} />}
      {screen === 'detail' && selected && (
        <DetailScreen
          artwork={selected}
          artworks={artworks}
          onBack={handleBack}
          onSelectArtwork={handleSelect}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />
      )}
      {screen === 'submit' && <SubmitScreen onAddArtwork={handleAddArtwork} />}
      {screen === 'saved' && (
        <SavedScreen
          savedIds={savedIds}
          artworks={artworks}
          onSelect={handleSelect}
          onToggleSave={handleToggleSave}
        />
      )}
    </div>
  )
}
