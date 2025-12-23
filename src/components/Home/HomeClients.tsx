// FILE: src/components/Home/HomeClients.tsx

import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";

export default function HomeClients() {
  const proofPoints = [
    "Built for retail brands, QSR outlets, and pharmacy networks",
    "A fit for e-commerce sellers and boutique retailers",
  ];

  return (
    <section className="section section-clients" id="clients">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Credibility</p>
          <h2>Trusted by growing Indian brands</h2>
          <p className="section-lede">
            Credibility built through recurring bulk orders and consistent
            dispatches.
          </p>
        </div>
        <div className="client-panel">
          <ul className="client-list">
            {proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="client-callout card">
            <p className="client-callout-title">Want to see sample work?</p>
            <p className="client-callout-text">
              Request recent print proofs, dispatch photos, and finish options
              on WhatsApp.
            </p>
            <a
              href={getHomepageWhatsAppLink("Client samples request")}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-cta"
            >
              Request samples on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
