import useRouteMetadata from "../hooks/useRouteMetadata"
import { routeDescriptions } from "../data/catalog"

export default function Journal() {
  useRouteMetadata({
    title: "AURA | The Journal",
    description: routeDescriptions.journal,
  })

  return (
    <section className="page-shell journal-page">
      <header className="editorial-hero">
        <p className="eyebrow">Volume 04 · 2026</p>
        <h1 className="section-title">The Journal</h1>
        <p className="soft-copy journal-kicker">
          Essays, interviews, and field notes from the studio. Read slowly.
        </p>
      </header>

      <article className="featured-story">
        <div className="featured-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
            alt="Editorial beauty texture"
          />
        </div>

        <div className="featured-story-copy">
          <p className="eyebrow">Ritual · June · 2026</p>
          <h2>The Slow Morning: Building a Five-Minute Skin Ritual</h2>
          <p>
            On softness, patience, and the quiet luxury of layering nothing more
            than light.
          </p>
          <a href="/journal">Read essay</a>
        </div>
      </article>

      <div className="journal-grid journal-grid--featured">
        <article className="journal-card journal-card--image">
          <img
            src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"
            alt="Color pigments and palette"
          />
          <div>
            <p className="journal-card-label">Science · May · 2026</p>
            <h2>Pigment, Decoded: What Makes a Color Wear Beautifully</h2>
            <p>
              Our lab director on binders, mica, and the geometry of light on skin.
            </p>
          </div>
        </article>

        <article className="journal-card journal-card--image">
          <img
            src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80"
            alt="Brushes in a vase"
          />
          <div>
            <p className="journal-card-label">Craft · May · 2026</p>
            <h2>Why We Hand-Tie Every Brush in Limoges</h2>
            <p>
              A studio visit with the third-generation atelier behind our tools.
            </p>
          </div>
        </article>

        <article className="journal-card journal-card--image">
          <img
            src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80"
            alt="Skin care jar with product"
          />
          <div>
            <p className="journal-card-label">Ingredients · April · 2026</p>
            <h2>The Case for Bakuchiol Over Retinol</h2>
            <p>
              Botanical alternatives - and when tradition is still the answer.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}
