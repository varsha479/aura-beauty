import { Link } from "react-router-dom"
import { useState } from "react"
import { catalogItems, collectionFilters, routeDescriptions } from "../data/catalog"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { useCart } from "../context/CartContext"

export default function Collections() {
  const [activeFilter, setActiveFilter] = useState("All")
  const { addToCart, formatMoney } = useCart()

  useRouteMetadata({
    title: "AURA | Collections",
    description: routeDescriptions.collections,
  })

  const visibleItems =
    activeFilter === "All"
      ? catalogItems
      : catalogItems.filter((item) => item.category === activeFilter)

  return (
    <section className="page-shell collections-page">
      <header className="collections-hero">
        <div>
          <p className="eyebrow">The Archive</p>
          <h1 className="section-title">
            All <span>Collections</span>
          </h1>
        </div>
        <p className="soft-copy collections-intro">
          A curated index of every ritual, from sheer skin tints to mineral
          pigments. Filter by category to find your signature.
        </p>
      </header>

      <div className="collections-filters" aria-label="Collection filters">
        {collectionFilters.map((filter, index) => (
          <button
            key={filter}
            className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="collections-grid">
        {visibleItems.map((item) => (
          <article className="collection-card" key={item.slug}>
            <Link className="collection-card-mediaLink" to={`/product/${item.slug}`}>
              <div className="collection-card-media">
                <img src={item.image} alt={item.name} />
                <span className="collection-badge">{item.category}</span>
              </div>
            </Link>

            <div className="collection-card-copy">
              <Link className="collection-card-titleLink" to={`/product/${item.slug}`}>
                <h2>{item.name}</h2>
              </Link>
              <p>{item.description}</p>
              <div className="collection-card-meta">
                <span>{formatMoney(item.priceValue)}</span>
                <span>{item.accent}</span>
              </div>
            </div>

            <div className="collection-card-actions">
              <button className="add-to-bag-button" type="button" onClick={() => addToCart(item)}>
                Add to bag
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}