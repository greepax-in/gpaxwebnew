import HomeHeroServer from "./HomeHero.server";
import { getHomepageWhatsAppLink } from "@/lib/whatsapp/links";

export default function HomeHero() {
  return (
    <HomeHeroServer>
      <div className="hero-primary-cta hero-primary-cta--abovefold">
        <a
          href={getHomepageWhatsAppLink("Homepage hero")}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-cta"
          data-cta="primary-whatsapp"
          aria-label="Talk to GreenPax on WhatsApp"
        >
          Talk to GreenPax on WhatsApp
        </a>
      </div>
    </HomeHeroServer>
  );
}
