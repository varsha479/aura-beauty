import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <img
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
          alt="beauty"
        />
      </div>

      <div className="hero-right">
        <p className="edition">EDITION • SUMMER RITUAL</p>

        <h1>
          The Alchemy <br />
          of Light
        </h1>

        <p className="hero-text">
          Discover the Lumiére Foundation. A breathable,
          weightless formula that mimics natural luminosity.
        </p>

        <div className="hero-buttons">
          <button className="dark-btn">
            Explore Collection
          </button>

          <button className="light-btn">
            Try Virtually
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;