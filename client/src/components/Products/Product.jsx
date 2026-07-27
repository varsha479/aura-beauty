import "./Products.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { catalogItems } from "../../data/catalog";

function Products() {
  const { addToCart, formatMoney } = useCart();
  const products = catalogItems.slice(0, 3);

  return (
    <section className="products">
      <div className="product-top">
        <p>FEATURED COLLECTION</p>
        <h2>Modern essentials.</h2>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <article className="product-card" key={item.slug}>
            <Link to={`/product/${item.slug}`} className="product-card-image-link">
              <img src={item.image} alt={item.name} />
            </Link>

            <div className="product-info">
              <h3>
                <Link to={`/product/${item.slug}`}>{item.name}</Link>
              </h3>
              <p>{formatMoney(item.priceValue)}</p>
            </div>

            <button type="button" onClick={() => addToCart(item)}>
              Add to Bag
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;