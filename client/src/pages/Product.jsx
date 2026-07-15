import { Link, useParams } from "react-router-dom"
import { catalogItems, routeDescriptions } from "../data/catalog"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { useCart } from "../context/CartContext"

export default function Product() {
  const { slug } = useParams()
  const product = catalogItems.find((item) => item.slug === slug)
  const { addToCart } = useCart()

  useRouteMetadata({
    title: product ? `AURA | ${product.name}` : "AURA | Product",
    description: routeDescriptions.product,
  })

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

  const relatedItems = catalogItems.filter((item) => item.slug !== product.slug).slice(0, 3)

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
          <p className="product-price">{product.price}</p>

          <div className="product-actions">
            <button className="nav-bag" type="button" onClick={() => addToCart(product)}>
              Add to bag
            </button>
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
            <Link className="related-card" key={item.slug} to={`/product/${item.slug}`}>
              <img src={item.image} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}