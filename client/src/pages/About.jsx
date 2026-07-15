import useRouteMetadata from "../hooks/useRouteMetadata"
import { routeDescriptions } from "../data/catalog"

export default function About() {
  useRouteMetadata({
    title: "AURA | About",
    description: routeDescriptions.about,
  })

  return (
    <section className="page-shell about-page">
      <header className="editorial-hero">
        <p className="eyebrow">Our Story</p>
        <h1 className="section-title">Beauty, in earnest.</h1>
        <p className="soft-copy journal-kicker">
          Aura was founded in 2021 by a dermatologist and a colorist who wanted
          makeup that respected skin as much as it celebrated it.
        </p>
      </header>

      <section className="about-split">
        <div className="about-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"
            alt="Editorial product texture"
          />
        </div>

        <div className="about-copy">
          <h2>
            Clinical precision,
            <span> poetic finish.</span>
          </h2>
          <p>
            We believe the best makeup disappears. Not literally - but into the
            gesture of getting dressed, into the small ritual of looking at
            yourself and feeling entirely present.
          </p>
          <p>
            Every product we ship is the result of two years of formulation,
            hundreds of real-skin trials, and a relentless insistence that beauty
            is a technical specification, not a marketing word.
          </p>
        </div>
      </section>

      <section className="principles-section">
        <p className="eyebrow">What we hold to</p>
        <h2>Four principles, non-negotiable.</h2>

        <div className="principles-grid">
          <article>
            <span>01</span>
            <h3>Formulation</h3>
            <p>Every formula is dermatologist-tested and developed in Grasse, France.</p>
          </article>

          <article>
            <span>02</span>
            <h3>Sourcing</h3>
            <p>Single-origin botanicals, traceable to the field. Always cruelty-free, mostly vegan.</p>
          </article>

          <article>
            <span>03</span>
            <h3>Packaging</h3>
            <p>Refillable glass, FSC paper, plant-based ink. No virgin plastic - ever.</p>
          </article>

          <article>
            <span>04</span>
            <h3>Inclusion</h3>
            <p>Fifty-two foundation shades developed with a global cast of skin.</p>
          </article>
        </div>
      </section>
    </section>
  )
}