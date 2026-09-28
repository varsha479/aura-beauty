import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { catalogItems, collectionFilters, routeDescriptions } from "../data/catalog"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { useCart } from "../context/CartContext"
import { getMakeupProducts, normalizeMakeupProduct } from "../services/api"

const PRODUCTS_PER_PAGE = 24
const PRODUCTS_CACHE_KEY = "aura-makeup-products-inr-v2"

export default function Collections() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("featured")
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState(catalogItems)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToCart, formatMoney } = useCart()

  useRouteMetadata({
    title: "AURA | Collections",
    description: routeDescriptions.collections,
  })

  useEffect(() => {
    let mounted = true
    const cachedProducts = sessionStorage.getItem(PRODUCTS_CACHE_KEY)
    if (cachedProducts) {
      try {
        const parsedProducts = JSON.parse(cachedProducts)
        if (Array.isArray(parsedProducts) && parsedProducts.length) {
          setProducts(parsedProducts)
          setLoading(false)
          return () => {
            mounted = false
          }
        }
      } catch {
        sessionStorage.removeItem(PRODUCTS_CACHE_KEY)
      }
    }

    getMakeupProducts()
      .then(({ data }) => {
        if (!mounted) return
        const normalizedProducts = Array.isArray(data) ? data.map(normalizeMakeupProduct).filter(Boolean) : []
        if (normalizedProducts.length) {
          sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(normalizedProducts))
          setProducts(normalizedProducts)
        }
      })
      .catch(() => {
        if (mounted) setError("The live archive is unavailable, so the studio collection is shown instead.")
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const visibleItems = useMemo(() => {
    const filtered = products.filter((item) => {
      const matchesCategory = activeFilter === "All" || item.category === activeFilter
      const searchText = `${item.name} ${item.brand || ""} ${item.productType || ""}`.toLowerCase()
      return matchesCategory && searchText.includes(search.toLowerCase())
    })

    return [...filtered].sort((left, right) => {
      if (sort === "price-low") return left.priceValue - right.priceValue
      if (sort === "price-high") return right.priceValue - left.priceValue
      if (sort === "rating") return (right.rating || 0) - (left.rating || 0)
      return 0
    })
  }, [activeFilter, products, search, sort])

  const filters = collectionFilters
  const pageCount = Math.max(1, Math.ceil(visibleItems.length / PRODUCTS_PER_PAGE))
  const pageItems = visibleItems.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)

  const removeUnavailableProduct = (slug) => {
    setProducts((currentProducts) => currentProducts.filter((item) => item.slug !== slug))
  }

  useEffect(() => {
    setPage(1)
  }, [activeFilter, search, sort])

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
          The live Makeup API archive, organized by ritual, brand, and finish.
          Filter the index to find your signature.
        </p>
      </header>

      <div className="collections-filters" aria-label="Collection filters">
        {filters.map((filter) => (
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

      <div className="collections-toolbar">
        <label className="collection-search">
          <span>Search archive</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or brand" />
        </label>
        <label className="collection-sort">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </label>
        <span className="collection-count">{loading ? "Loading archive..." : `${visibleItems.length} products`}</span>
      </div>

      {error && <p className="collections-status" role="status">{error}</p>}

      <div className="collections-grid">
        {pageItems.map((item) => (
          <article className="collection-card" key={item.slug}>
            <Link className="collection-card-mediaLink" to={`/product/${item.slug}`}>
              <div className="collection-card-media">
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" onError={() => removeUnavailableProduct(item.slug)} />
                <span className="collection-badge">{item.category}</span>
              </div>
            </Link>

            <div className="collection-card-copy">
              <Link className="collection-card-titleLink" to={`/product/${item.slug}`}>
                <h2>{item.name}</h2>
              </Link>
              <div className="collection-card-meta">
                <span>{item.brand}</span>
                <span>{item.priceValue ? formatMoney(item.priceValue) : item.price}</span>
              </div>
            </div>

            <div className="collection-card-actions">
              <button className="add-to-bag-button" type="button" onClick={() => addToCart(item)}>
                Add to bag
              </button>
              {item.tryOnType && <Link className="try-on-link" to={`/studio?product_type=${item.tryOnType}`}>Try on</Link>}
            </div>
          </article>
        ))}
      </div>

      {pageItems.length === 0 && <p className="collections-empty">No products match this search.</p>}

      {pageCount > 1 && (
        <nav className="collections-pagination" aria-label="Product pages">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            Previous
          </button>
          <label>
            Page
            <input
              type="number"
              min="1"
              max={pageCount}
              value={page}
              onChange={(event) => setPage(Math.min(pageCount, Math.max(1, Number(event.target.value) || 1)))}
              aria-label="Current product page"
            />
            <span>of {pageCount}</span>
          </label>
          <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount}>
            Next
          </button>
        </nav>
      )}
    </section>
  )
}