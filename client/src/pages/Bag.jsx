import { Link } from "react-router-dom"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { routeDescriptions } from "../data/catalog"
import { useCart } from "../context/CartContext"

export default function Bag() {
  const {
    lineItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    formatMoney,
    clearCart,
  } = useCart()

  useRouteMetadata({
    title: "AURA | Bag",
    description: routeDescriptions.bag,
  })

  return (
    <section className="page-shell bag-page">
      <header className="editorial-hero">
        <p className="eyebrow">Bag</p>
        <h1 className="section-title">Your selected rituals.</h1>
        <p className="soft-copy">The bag is ready when you are.</p>
      </header>

      {lineItems.length === 0 ? (
        <div className="empty-bag">
          <p>No items yet. Add products from collections or any product page.</p>
          <Link className="filter-chip active" to="/collections">
            Back to collections
          </Link>
        </div>
      ) : (
        <div className="bag-layout">
          <div className="bag-items">
            {lineItems.map((item) => (
              <article className="bag-item" key={item.slug}>
                <img src={item.image} alt={item.name} />
                <div className="bag-item-copy">
                  <p className="journal-card-label">{item.category}</p>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <div className="bag-item-controls">
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
                <div className="bag-item-price">
                  <span>{formatMoney(item.lineTotal)}</span>
                  <button type="button" onClick={() => removeFromCart(item.slug)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="bag-summary">
            <h2>Order summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatMoney(shipping)}</strong>
            </div>
            <div className="bag-summary-total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <button type="button" className="nav-bag" onClick={clearCart}>
              Clear bag
            </button>
            <Link className="nav-account" to="/account">
              Checkout / sign in
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}