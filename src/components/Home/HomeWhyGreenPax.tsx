// FILE: src/components/Home/HomeWhyGreenPax.tsx

export default function HomeWhyGreenPax() {
  const reasons = [
    {
      title: "Manufacturing-first",
      detail: "Direct manufacturing with Pan-India dispatch",
    },
    {
      title: "Quality and compliance",
      detail: "Food-safe inks and adhesives with batch-wise QC",
    },
    {
      title: "Print-ready",
      detail: "Custom printing, die-cuts, handles, and windowing options",
    },
    {
      title: "Reliable lead times",
      detail: "MOQ scheduling with clear dispatch windows for repeat orders",
    },
  ];

  return (
    <section className="section section-why" id="why-greenpax">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Why GreenPax</p>
          <h2>Manufacturing partnership, not a marketplace</h2>
          <p className="section-lede">
            Trust-first collaboration for MOQ-based packaging, with clear
            production planning and consistent dispatches.
          </p>
        </div>
        <ul className="why-list">
          {reasons.map((reason) => (
            <li key={reason.title} className="card">
              <span className="why-title">{reason.title}</span>
              <span className="why-detail">{reason.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
