import "./AIStudio.css";

function AIStudio() {
  return (
    <section className="ai-section">
      <div className="ai-left">
        <p className="ai-tag">NEW TECHNOLOGY</p>

        <h2>
          Your face, <br />
          reimagined.
        </h2>

        <p className="ai-desc">
          Our AI shade-matching engine analyzes skin
          tones to find your perfect match instantly.
          No guessing — just precision.
        </p>

        <div className="ai-card">
          <span>01</span>
          <div>
            <h4>Tone Scan</h4>
            <p>Instant skin-tone identification</p>
          </div>
        </div>

        <div className="ai-card">
          <span>02</span>
          <div>
            <h4>Live Overlay</h4>
            <p>Realtime product visualization</p>
          </div>
        </div>

        <div className="ai-card">
          <span>03</span>
          <div>
            <h4>Saved Looks</h4>
            <p>Curated by your undertone</p>
          </div>
        </div>
      </div>

      <div className="ai-right">
        <img
          src="https://images.unsplash.com/photo-1517841905240-472988babdf9"
          alt="AI Face"
        />

        <div className="accuracy-box">
          <h3>99.4%</h3>
          <p>Match Accuracy</p>
        </div>
      </div>
    </section>
  );
}

export default AIStudio;