import "./Products.css";

function Products() {
  const products = [
    {
      id: 1,
      name: "Lumiére Foundation",
      price: "$42",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    },
    {
      id: 2,
      name: "Rose Balm",
      price: "$28",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    },
    {
      id: 3,
      name: "Glow Palette",
      price: "$36",
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    },
  ];

  return (
    <section className="products">
      <div className="product-top">
        <p>FEATURED COLLECTION</p>
        <h2>Modern essentials.</h2>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} />

            <div className="product-info">
              <h3>{item.name}</h3>
              <p>{item.price}</p>
            </div>

            <button>Add to Bag</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;