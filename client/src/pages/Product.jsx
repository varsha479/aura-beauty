import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { catalogItems, routeDescriptions } from "../data/catalog"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { useCart } from "../context/CartContext"
import { getMakeupProduct, getMakeupProducts, normalizeMakeupProduct } from "../services/api"

export default function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(() => catalogItems.find((item) => item.slug === slug))
  const [loading, setLoading] = useState(slug.startsWith("makeup-"))
  const [relatedItems, setRelatedItems] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug.startsWith("makeup-")) return undefined
    const id = slug.replace("makeup-", "")
    let mounted = true
    getMakeupProduct(id)
      .then(({ data }) => mounted && setProduct(normalizeMakeupProduct(data)))
      .catch(() => mounted && setProduct(null))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [slug])

  useEffect(() => {
    if (!product) return undefined
    const fallbackItems = catalogItems.filter((item) => item.slug !== product.slug).slice(0, 4)
    setRelatedItems(fallbackItems)
    if (!product.productType) return undefined

    let mounted = true
    getMakeupProducts({ product_type: product.productType })
      .then(({ data }) => {
        if (!mounted) return
        const suggestions = Array.isArray(data)
          ? data.map(normalizeMakeupProduct).filter((item) => item && item.slug !== product.slug).slice(0, 4)
          : []
        if (suggestions.length) setRelatedItems(suggestions)
      })
      .catch(() => undefined)
    return () => {
      mounted = false
    }
  }, [product])

  useRouteMetadata({
    title: product ? `AURA | ${product.name}` : "AURA | Product",
    description: routeDescriptions.product,
  })

  if (loading) {
    return <section className="page-shell product-page"><p className="eyebrow">Product</p><h1 className="section-title">Loading the archive.</h1></section>
  }

  if (!product) {
    return (
      <section className="page-shell product-page">
        <p className="eyebrow">Product</p>
        <h1 className="section-title">This piece is no longer in the archive.</h1>
        <Link className="filter-chip active" to="/collections">
          Back to collections
        </Link>
      </section>
    )
  }

  return (
    <section className="page-shell product-page">
      <div className="product-hero">
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-copy">
          <p className="eyebrow">{product.category}</p>
          <h1 className="section-title">{product.name}</h1>
          <p className="soft-copy">{product.accent}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-price">{product.priceValue ? product.price : "Price unavailable"}</p>

          <div className="product-actions">
            <button className="nav-bag" type="button" onClick={() => addToCart(product)}>
              Add to bag
            </button>
            {product.tryOnType && <Link className="nav-account" to={`/studio?product_type=${product.tryOnType}`}>Try on</Link>}
            <Link className="nav-account" to="/collections">
              Continue browsing
            </Link>
          </div>
        </div>
      </div>

      <div className="related-section">
        <p className="eyebrow">Related pieces</p>
        <div className="related-grid">
          {relatedItems.map((item) => (
            <article className="related-card" key={item.slug}>
              <Link className="related-card-link" to={`/product/${item.slug}`} aria-label={`View ${item.name}`}>
                <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.priceValue ? item.price : "Price unavailable"}</p>
                </div>
              </Link>
              <button className="related-card-button" type="button" onClick={() => addToCart(item)}>
                Add to bag
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}